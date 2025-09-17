/**
 * Core types for the Store Information application
 */

/**
 * Configuration for the OpenAI API client
 */
export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
}

/**
 * Represents a request to get information about a store
 */
export interface StoreInfoRequest {
  storeName: string;
}

/**
 * Represents the response from the store information service
 */
export interface StoreInfoResponse {
  storeName: string;
  information: string;
  isUncertain: boolean;
  timestamp: Date;
}

/**
 * Error types that can occur in the application
 */
export enum ErrorType {
  API_ERROR = 'API_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}

/**
 * Custom error class for application-specific errors
 */
export class StoreInfoError extends Error {
  constructor(
    public readonly type: ErrorType,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'StoreInfoError';
  }
}
