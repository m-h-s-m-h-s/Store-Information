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
   * 
   * PRODUCTION NOTE: In production, store descriptions should be cached/stored
   * to avoid recomputing each time. Implement a caching layer that:
   * - Stores generated descriptions in a database
   * - Serves cached descriptions for subsequent requests
   * - Refreshes descriptions periodically (e.g., when viewed after 30+ days)
   * - Triggers refresh based on view frequency or manual triggers
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
            input: `${this.getSystemPrompt()}\n\n${prompt}\n\nCRITICAL: Write your response as ONE SINGLE PARAGRAPH. No line breaks. No bullet points. No citations. Just one flowing paragraph exactly like you would without web search.`,
          });
          
          // Extract the text content from the response
          let webSearchResponse = '';
          
          // Handle different response formats
          if (typeof responseData === 'string') {
            webSearchResponse = responseData;
          } else if (responseData.output_text) {
            webSearchResponse = responseData.output_text;
          } else if (Array.isArray(responseData)) {
            // Find the message with output_text
            const messageItem = responseData.find((item: any) => 
              item.type === 'message' && item.content?.[0]?.type === 'output_text'
            );
            if (messageItem?.content?.[0]?.text) {
              webSearchResponse = messageItem.content[0].text;
            }
          }
          
          logger.debug('Raw web search response:', webSearchResponse);
          
          // Aggressively clean up the response to match chat completion format
          const cleanedResponse = webSearchResponse
            .replace(/\(\[([^\]]+)\]\([^)]+\)\)/g, '') // Remove markdown links
            .replace(/\[[^\]]+\]\([^)]+\)/g, '') // Remove plain markdown links
            .replace(/\([^)]*\)/g, '') // Remove ALL parenthetical content
            .replace(/\n\n+/g, ' ') // Replace multiple line breaks with space
            .replace(/\n/g, ' ') // Replace single line breaks with space
            .replace(/\s*[•·-]\s*/g, ' ') // Remove bullet points
            .replace(/\s+/g, ' ') // Normalize multiple spaces
            .replace(/\s+\./g, '.') // Fix space before periods
            .replace(/\s+,/g, ',') // Fix space before commas
            .trim();
          
          logger.debug('Cleaned web search response:', cleanedResponse);
          
          const trimmedWebResponse = cleanedResponse;
          
          // If web search also returns nothing or "0", keep it as "0"
          if (trimmedWebResponse === '0' || trimmedWebResponse.length === 0) {
            response = '0';
            logger.warning('Web search found no information about this store');
            logger.debug('Web search also returned no result');
          } else {
            response = cleanedResponse; // Use the cleaned response, not the raw one
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
    return `Provide ONLY 1 PARAGRAPH OF 3-4 SENTENCES of general history about the store at URL: "${storeName}". Focus on factors that will help shoppers understand the context of the store. Do you know anything about their scale or achievements?

IMPORTANT: Keep each sentence SHORT and CONCISE. Aim for 15-20 words per sentence maximum. Never use "I" in responses. 

If uncertain about the store, ONLY return: "0"`;
  }

  /**
   * Gets the system prompt for the AI
   */
  private getSystemPrompt(): string {
    return 'You are an ecommerce expert (DTC, retail, etc.). HERE ARE YOUR RULES: 1) Be factual. 2) NEVER offer advicce on what to do. 3) NEVER report on subjective or reported experiences or reviews/ratings. 4) ONLY give information on eCommerce operations/topics (i.e. NEVER DISCUSS AWS/Infrastructure, other business lines, capital raising, controversies, politics, political affiliations, etc...).';
  }

}
