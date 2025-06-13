/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dtos/create_notes.dto';
import { UpdateNoteDto } from './dtos/update_notes.dto';
import { ResponseService } from 'src/shared/api-response.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new note' })
  @SwaggerApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateNoteDto })
  async create(@Body() createNoteDto: CreateNoteDto) {
    try {
      const note = await this.notesService.create(createNoteDto);
      return this.responseService.success(
        note,
        'Note created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Return all notes',
  })
  async findAll() {
    try {
      const notes = await this.notesService.findAll();
      return this.responseService.success(
        notes,
        'Notes retrieved successfully',
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Return the note with the matching ID',
  })
  @SwaggerApiResponse({ status: 404, description: 'Note not found.' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  async findOne(@Param('id') id: string) {
    try {
      const note = await this.notesService.findOne(id);
      return this.responseService.success(note, 'Note retrieved successfully');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  @SwaggerApiResponse({
    status: 200,
    description: 'The note has been successfully updated',
  })
  @SwaggerApiResponse({ status: 404, description: 'Note not found.' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    try {
      const updatedNote = await this.notesService.update(id, updateNoteDto);
      return this.responseService.success(
        updatedNote,
        'Note updated successfully',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @SwaggerApiResponse({
    status: 200,
    description: 'The note has been successfully deleted',
  })
  @SwaggerApiResponse({ status: 404, description: 'Note not found.' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.notesService.remove(id);
      return this.responseService.success(
        { deleted: true },
        'Note deleted successfully',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
