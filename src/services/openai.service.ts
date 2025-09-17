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
      
      // Use responses API with web search
      logger.debug('Using responses API with web search');
      
      let response: string;
      try {
        const responseData = await (this.client as any).responses.create({
          model: 'gpt-5', // Use gpt-5 for responses API
          tools: [
            { type: "web_search" },
          ],
          input: `${this.getSystemPrompt()}\n\n${prompt}`,
        });
        
        // Extract the output text from the response
        response = responseData.output_text || '';
        logger.debug('Web search completed successfully');
      } catch (error) {
        // Fallback if responses API fails
        logger.debug('Responses API failed, falling back to chat completions');
        const completion = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });
        response = completion.choices[0]?.message?.content || '';
      }
      
      const trimmedResponse = response.trim();
      
      // If the response is empty or zero, use default message
      const finalResponse = trimmedResponse.length === 0 || trimmedResponse === '0' 
        ? "We're unable to single-out detailed context about this store."
        : trimmedResponse;

      return {
        storeName: request.storeName,
        information: finalResponse,
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
    return `Provide a few SHORT, CONCISE sentences about "${storeName}" to build shopper credibility. Focus on factors that will help shoppers understand the context of their purchase, such as:
- How long they've been in business and their scale (number of stores, countries)
- What they sell
- Size of customer base, market position, or loyal fan base
- Major achievements, awards, or industry leadership
- What they're famous for or their biggest strengths
- Other helpful information (satisfaction ratings, return policies, guarantees)

IMPORTANT: Keep each sentence SHORT and CONCISE. Aim for 15-20 words per sentence maximum.

If uncertain about the store, ONLY return: "0"`;
  }

  /**
   * Gets the system prompt for the AI
   */
  private getSystemPrompt(): string {
    return 'You are an ecommerce expert (DTC, retail, etc.). Never use "I" in responses. Write SHORT, CONCISE sentences. Be casual and simple, like helping a friend. Never mention non-ecommerce business divisions or factors. Be factual with current, accurate information.';
  }

}
