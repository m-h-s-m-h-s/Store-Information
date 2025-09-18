import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { StoreInfoService } from './services/store-info.service.js';
import { getOpenAIConfig } from './utils/config.js';
import { logger } from './utils/logger.js';
import { StoreInfoError, ErrorType } from './types/index.js';

/**
 * CLI interface for the Store Information application
 */
export class CLI {
  private storeInfoService: StoreInfoService;

  constructor() {
    try {
      const config = getOpenAIConfig();
      this.storeInfoService = new StoreInfoService(config);
    } catch (error) {
      if (error instanceof StoreInfoError) {
        throw error;
      }
      throw new StoreInfoError(
        ErrorType.CONFIGURATION_ERROR,
        'Failed to initialize application',
        error
      );
    }
  }

  /**
   * Runs the CLI application
   */
  async run(): Promise<void> {
    console.clear();
    console.log(chalk.bold.blue('\n🏪 Store Information Finder\n'));
    console.log(chalk.gray('Get credible information about any store using AI\n'));

    let continueRunning = true;

    while (continueRunning) {
      try {
        const { storeName } = await inquirer.prompt<{ storeName: string }>([
          {
            type: 'input',
            name: 'storeName',
            message: 'Enter store URL:',
            validate: (input: string) => {
              if (!input.trim()) {
                return 'Please enter a store URL';
              }
              if (input.length > 200) {
                return 'Store URL is too long (max 200 characters)';
              }
              return true;
            },
          },
        ]);

        const spinner = ora('Getting store information...').start();

        try {
          const response = await this.storeInfoService.getStoreInfo(storeName);
          spinner.succeed('Information retrieved successfully!');
          
          const formattedResponse = this.storeInfoService.formatResponse(response);
          console.log(chalk.cyan(formattedResponse));

        } catch (error) {
          spinner.fail('Failed to get store information');
          throw error;
        }

        const { continueChoice } = await inquirer.prompt<{ continueChoice: boolean }>([
          {
            type: 'confirm',
            name: 'continueChoice',
            message: 'Would you like to search for another store?',
            default: true,
          },
        ]);

        continueRunning = continueChoice;

        if (continueRunning) {
          console.log('\n' + chalk.gray('─'.repeat(50)) + '\n');
        }

      } catch (error) {
        this.handleError(error);
        
        const { retry } = await inquirer.prompt<{ retry: boolean }>([
          {
            type: 'confirm',
            name: 'retry',
            message: 'Would you like to try again?',
            default: true,
          },
        ]);

        continueRunning = retry;
      }
    }

    console.log(chalk.green('\n👋 Thank you for using Store Information Finder!\n'));
  }

  /**
   * Handles errors in a user-friendly way
   */
  private handleError(error: unknown): void {
    if (error instanceof StoreInfoError) {
      switch (error.type) {
        case ErrorType.API_ERROR:
          logger.error('API Error: ' + error.message);
          if (error.details && typeof error.details === 'object' && 'status' in error.details) {
            const status = (error.details as { status?: number }).status;
            if (status === 401) {
              logger.error('Invalid API key. Please check your .env file.');
            } else if (status === 429) {
              logger.error('Rate limit exceeded. Please try again later.');
            }
          }
          break;
        case ErrorType.NETWORK_ERROR:
          logger.error('Network Error: Please check your internet connection.');
          break;
        case ErrorType.INVALID_INPUT:
          logger.error('Invalid Input: ' + error.message);
          break;
        case ErrorType.CONFIGURATION_ERROR:
          logger.error('Configuration Error: ' + error.message);
          break;
        default:
          logger.error('Error: ' + error.message);
      }
    } else if (error instanceof Error) {
      logger.error('Unexpected error: ' + error.message);
    } else {
      logger.error('An unknown error occurred');
    }
  }
}
