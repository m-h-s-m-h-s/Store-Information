import chalk from 'chalk';

/**
 * Simple logger utility with colored output
 */
export const logger = {
  info: (message: string): void => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string): void => {
    console.log(chalk.green('✓'), message);
  },

  error: (message: string, error?: Error): void => {
    console.error(chalk.red('✗'), message);
    if (error && process.env.NODE_ENV === 'development') {
      console.error(chalk.gray(error.stack));
    }
  },

  warning: (message: string): void => {
    console.warn(chalk.yellow('⚠'), message);
  },

  debug: (message: string, data?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray('[DEBUG]'), message);
      if (data) {
        console.log(chalk.gray(JSON.stringify(data, null, 2)));
      }
    }
  },
};
