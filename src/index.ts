#!/usr/bin/env node

import { CLI } from './cli.js';
import { logger } from './utils/logger.js';
import { StoreInfoError, ErrorType } from './types/index.js';

/**
 * Main entry point for the Store Information application
 */
async function main(): Promise<void> {
  try {
    const cli = new CLI();
    await cli.run();
    process.exit(0);
  } catch (error) {
    if (error instanceof StoreInfoError && error.type === ErrorType.CONFIGURATION_ERROR) {
      logger.error(error.message);
      logger.info('Please ensure you have created a .env file with your OpenAI API key.');
      logger.info('You can copy .env.example to .env and add your API key.');
    } else {
      logger.error('Failed to start application', error as Error);
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason as Error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the application
main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
