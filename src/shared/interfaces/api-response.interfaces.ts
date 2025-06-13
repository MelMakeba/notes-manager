export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | null;
  timestamp: string;
  statusCode: number;
}
