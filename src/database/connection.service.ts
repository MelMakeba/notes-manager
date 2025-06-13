/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { DatabaseConfig } from '../config/database.config';

@Injectable()
export class ConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('ConnectionService');
  private pool: Pool;

  private routineTypeMap: Record<string, 'FUNCTION' | 'PROCEDURE'> = {
    create_note: 'PROCEDURE',
    get_all_notes: 'FUNCTION',
    get_note_by_id: 'FUNCTION',
    update_note: 'PROCEDURE',
    delete_note: 'PROCEDURE',
  };

  constructor(private readonly dbConfig: DatabaseConfig) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing database connection pool...');
      this.pool = this.dbConfig.createPool();

      const client = await this.pool.connect();
      client.release();
      this.logger.log('Database connection established successfully');
    } catch (error: unknown) {
      this.logger.error(
        `Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.pool) {
        this.logger.log('Closing database connection pool...');
        await this.pool.end();
        this.logger.log('Database connection pool closed successfully');
      }
    } catch (error) {
      this.logger.error(`Error closing database connection: ${error.message}`);
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      return await this.pool.query(text, params);
    } catch (error) {
      this.logger.error(`Database query error: ${error.message}`);
      this.logger.error(`Query: ${text}`);
      if (params) {
        this.logger.error(`Parameters: ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  async callProcedure(
    routineName: string,
    params: any[] = [],
  ): Promise<QueryResult> {
    try {
      const routineType = this.routineTypeMap[routineName] || 'FUNCTION';
      const paramPlaceholders = params.map((_, i) => `$${i + 1}`).join(', ');

      let query: string;

      if (routineType === 'FUNCTION') {
        query = `SELECT * FROM ${routineName}(${paramPlaceholders})`;
      } else {
        query = `CALL ${routineName}(${paramPlaceholders})`;
      }

      this.logger.debug(`Executing ${routineType}: ${query}`);
      return await this.pool.query(query, params);
    } catch (error) {
      this.logger.error(
        `Error calling ${this.routineTypeMap[routineName] || 'routine'} ${routineName}: ${error.message}`,
      );
      if (params) {
        this.logger.error(`Parameters: ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return false;
    }
  }
}
