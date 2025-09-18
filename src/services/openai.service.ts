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

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout,
    });
  }

  /**
   * Gets store information using the OpenAI API
   */
  async getStoreInformation(request: StoreInfoRequest): Promise<StoreInfoResponse> {
    try {
      logger.debug(`Requesting information for store: ${request.storeName}`);

      const prompt = this.buildPrompt(request.storeName);
      
      // First try normal chat completions
      logger.debug('Trying chat completions first');
      const completion = await this.client.chat.completions.create({
        model: 'gpt-5-nano', // Always use nano for chat completions
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
      
      let response = completion.choices[0]?.message?.content || '';
      const trimmedInitialResponse = response.trim();
      
      // If chat completions returns "0" (uncertain), try web search
      if (trimmedInitialResponse === '0' || trimmedInitialResponse.length === 0) {
        logger.info('Store not found in database, searching the web...');
        logger.debug('Chat completions returned no result, trying web search');
        
        try {
          const responseData = await (this.client as any).responses.create({
            model: 'gpt-5-mini', // Use gpt-5-mini for responses API with web search
            tools: [
              { type: "web_search" },
            ],
            input: `${this.getSystemPrompt()}\n\n${prompt}`,
          });
          
          // Extract the output text from the response
          const webSearchResponse = responseData.output_text || '';
          const trimmedWebResponse = webSearchResponse.trim();
          
          // If web search also returns nothing or "0", keep it as "0"
          if (trimmedWebResponse === '0' || trimmedWebResponse.length === 0) {
            response = '0';
            logger.warning('Web search found no information about this store');
            logger.debug('Web search also returned no result');
          } else {
            response = webSearchResponse;
            logger.success('Found information via web search!');
            logger.debug('Web search found information');
          }
        } catch (error) {
          logger.warning('Web search unavailable, using limited information');
          logger.debug('Web search failed, keeping original response');
          // Keep the original "0" response
        }
      }
      
      const trimmedResponse = response.trim();
      
      // If the response is empty or zero, use default message
      const finalResponse = trimmedResponse.length === 0 || trimmedResponse === '0' 
        ? "We're unable to single-out detailed context about this store."
        : trimmedResponse;

      return {
        storeName: request.storeName,
        information: finalResponse,
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
    return `Provide a small paragraph about "${storeName}" to build shopper credibility. Focus on factors that will help shoppers understand the context of their purchase, such as:
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
