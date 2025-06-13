import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseConfig {
  host: string = process.env.DB_HOST || 'localhost';
  port: number = parseInt(process.env.DB_PORT || '5432');
  database: string = process.env.DB_NAME || 'notes_manager';
  username: string = process.env.DB_USER || 'postgres';
  password: string = process.env.DB_PASSWORD || 'Meriken@13';
  ssl: boolean = process.env.NODE_ENV === 'production';
  poolSize: number = 20;
  idleTimeout: number = 30000;
  connectionTimeout: number = 30000;

  createPool(): Pool {
    return new Pool({
      host: this.host,
      port: this.port,
      database: this.database,
      user: this.username,
      password: this.password,
      ssl: this.ssl ? { rejectUnauthorized: false } : false,
      max: this.poolSize,
      idleTimeoutMillis: this.idleTimeout,
      connectionTimeoutMillis: this.connectionTimeout,
    });
  }
}
