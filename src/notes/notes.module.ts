import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ConnectionService } from 'src/database/connection.service';
import { DatabaseConfig } from 'src/config/database.config';
import { NotesController } from './notes.controller';
import { ResponseService } from 'src/shared/api-response.service';

@Module({
  providers: [NotesService, ConnectionService, DatabaseConfig, ResponseService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
