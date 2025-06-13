import { Injectable } from '@nestjs/common';
import { ApiResponse } from './interfaces/api-response.interfaces';
@Injectable()
export class ResponseService {
  success<T>(
    data: T,
    message = 'Operation successful',
    statusCode = 200,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      error: null,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }

  error(
    message = 'Operation failed',
    error?: string,
    statusCode = 400,
  ): ApiResponse<null> {
    return {
      success: false,
      message,
      data: null,
      error: error || message,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }
}
