import OpenAI from 'openai';
import { 
  OpenAIConfig, 
  StoreInfoRequest, 
  StoreInfoResponse, 
  ErrorType, 
  StoreInfoError 
} from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Service class for interacting with the OpenAI API
 */
export class OpenAIService {
  private client: OpenAI;
  private model: string;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout,
    });
    this.model = config.model || 'gpt-5-nano';
  }

  /**
   * Gets store information using the OpenAI API
   */
  async getStoreInformation(request: StoreInfoRequest): Promise<StoreInfoResponse> {
    try {
      logger.debug(`Requesting information for store: ${request.storeName}`);

      const prompt = this.buildPrompt(request.storeName);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a retail credibility expert. Always use "We" instead of "I" in responses. Never mention non-retail business divisions. Be concise and factual.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.choices[0]?.message?.content || '';

      return {
        storeName: request.storeName,
        information: response.trim(),
        isUncertain: false,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Error calling OpenAI API', error as Error);
      
      if (error instanceof OpenAI.APIError) {
        throw new StoreInfoError(
          ErrorType.API_ERROR,
          `OpenAI API error: ${error.message}`,
          { status: error.status, code: error.code }
        );
      }
      
      throw new StoreInfoError(
        ErrorType.NETWORK_ERROR,
        'Failed to get store information',
        error
      );
    }
  }

  /**
   * Builds the prompt for the OpenAI API
   */
  private buildPrompt(storeName: string): string {
    return `Provide exactly 3 short sentences about "${storeName}" to build shopper credibility. Focus on:
- How long they've been in business and their scale (number of stores, countries)
- Size of customer base, market position, or loyal fan base
- Major achievements, awards, or industry leadership
- What they're famous for or their biggest strengths
- Trust indicators (satisfaction ratings, return policies, guarantees)

If uncertain about the store, state: "We're uncertain about information for this store" and briefly explain why.`;
  }

}
