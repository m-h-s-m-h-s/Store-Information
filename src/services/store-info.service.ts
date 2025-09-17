import { OpenAIService } from './openai.service.js';
import { 
  StoreInfoRequest, 
  StoreInfoResponse, 
  OpenAIConfig 
} from '../types/index.js';
import { validateStoreName } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Main service for getting store information
 */
export class StoreInfoService {
  private openAIService: OpenAIService;

  constructor(config: OpenAIConfig) {
    this.openAIService = new OpenAIService(config);
  }

  /**
   * Gets information about a store
   */
  async getStoreInfo(storeName: string): Promise<StoreInfoResponse> {
    // Validate input
    validateStoreName(storeName);

    // Clean the store name
    const cleanedStoreName = storeName.trim();

    logger.info(`Getting information for: ${cleanedStoreName}`);

    // Create request
    const request: StoreInfoRequest = {
      storeName: cleanedStoreName,
    };

    // Get information from OpenAI
    const response = await this.openAIService.getStoreInformation(request);


    return response;
  }

  /**
   * Formats the store information response for display
   */
  formatResponse(response: StoreInfoResponse): string {
    const header = `\n📍 Store Information: ${response.storeName}\n${'='.repeat(50)}\n`;
    const body = response.information;
    const footer = `\n${'='.repeat(50)}\n🕐 Generated: ${response.timestamp.toLocaleString()}\n`;

    return header + body + footer;
  }
}
