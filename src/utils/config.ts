import { config as dotenvConfig } from 'dotenv';
import { OpenAIConfig, ErrorType, StoreInfoError } from '../types/index.js';

// Load environment variables
dotenvConfig();

/**
 * Validates and returns the OpenAI configuration from environment variables
 */
export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new StoreInfoError(
      ErrorType.CONFIGURATION_ERROR,
      'OPENAI_API_KEY is not set in environment variables. Please create a .env file with your API key.'
    );
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL || 'gpt-5-nano',
    timeout: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT, 10) : 30000,
  };
}

/**
 * Validates that a store URL is provided and meets basic requirements
 */
export function validateStoreName(storeName: string): void {
  if (!storeName || storeName.trim().length === 0) {
    throw new StoreInfoError(
      ErrorType.INVALID_INPUT,
      'Store URL cannot be empty'
    );
  }

  if (storeName.length > 200) {
    throw new StoreInfoError(
      ErrorType.INVALID_INPUT,
      'Store URL is too long (maximum 200 characters)'
    );
  }
  
  // Note: In production, you may want to add URL format validation
  // For now, we accept any string as stores may have various URL formats
}
