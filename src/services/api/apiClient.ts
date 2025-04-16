import { API_CONFIG } from './config.js';

class ApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.apiKey = API_CONFIG.API_KEY;
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    // Remove any undefined or null values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    const queryParams = new URLSearchParams({
      file_format: 'json',
      key: this.apiKey,
      ...cleanParams,
    }).toString();

    return `${this.baseUrl}/${endpoint}?${queryParams}`;
  }

  public async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, params);
      console.log('Fetching from URL:', url); // Debug log

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();