import type { ApiResponse } from '../types/common';

/**
 * Foundation API client abstraction with simulated response handling
 */
class ApiClient {
  public baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  async get<T>(_endpoint: string): Promise<ApiResponse<T>> {
    // In production, this connects to the HRMS REST API
    return {
      data: {} as T,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async post<T, B = unknown>(_endpoint: string, _data: B): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async put<T, B = unknown>(_endpoint: string, _data: B): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async delete<T>(_endpoint: string): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiClient = new ApiClient();
