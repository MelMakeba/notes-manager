/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConnectionService } from '../database/connection.service';
import { Note } from './interfaces/notes.interface';
import { CreateNoteDto } from './dtos/create_notes.dto';
import { UpdateNoteDto } from './dtos/update_notes.dto';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly connectionService: ConnectionService) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    try {
      this.logger.log(`Creating note with title: ${createNoteDto.title}`);

      const result = await this.connectionService.callProcedure('create_note', [
        createNoteDto.title,
        createNoteDto.content,
      ]);

      if (!result || !result.rows || result.rows.length === 0) {
        throw new BadRequestException('Failed to create note');
      }

      const noteId = result.rows[0].p_id;
      return {
        id: noteId,
        title: createNoteDto.title,
        content: createNoteDto.content,
        created_at: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error creating note: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create note: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Note[]> {
    try {
      this.logger.log('Fetching all notes');

      const result =
        await this.connectionService.callProcedure('get_all_notes');

      if (!result || !result.rows) {
        return [];
      }

      return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        created_at: row.created_at,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching all notes: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to fetch notes: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Note> {
    try {
      this.logger.log(`Fetching note with id: ${id}`);

      const result = await this.connectionService.callProcedure(
        'get_note_by_id',
        [id],
      );

      if (!result.rows || result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        content: result.rows[0].content,
        created_at: result.rows[0].created_at,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching note by ID: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch note: ${error.message}`,
      );
    }
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    try {
      this.logger.log(`Updating note with id: ${id}`);

      const existingNote = await this.findOne(id);

      if (!updateNoteDto.title && !updateNoteDto.content) {
        return existingNote;
      }

      const title = updateNoteDto.title || existingNote.title;
      const content = updateNoteDto.content || existingNote.content;

      const result = await this.connectionService.callProcedure('update_note', [
        id,
        title,
        content,
      ]);

      if (
        !result.rows ||
        result.rows.length === 0 ||
        !result.rows[0].p_updated
      ) {
        throw new NotFoundException(
          `Note with ID ${id} not found or could not be updated`,
        );
      }

      return {
        id,
        title,
        content,
        created_at: existingNote.created_at,
      };
    } catch (error) {
      this.logger.error(`Error updating note: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update note: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting note with id: ${id}`);

      const result = await this.connectionService.callProcedure('delete_note', [
        id,
      ]);

      if (
        !result.rows ||
        result.rows.length === 0 ||
        !result.rows[0].p_deleted
      ) {
        throw new NotFoundException(
          `Note with ID ${id} not found or could not be deleted`,
        );
      }

      return true;
    } catch (error) {
      this.logger.error(`Error deleting note: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete note: ${error.message}`,
      );
    }
  }
}
