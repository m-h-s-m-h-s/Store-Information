# API Documentation

## Overview

The Store Information Finder application provides a programmatic interface for retrieving credible store information using OpenAI's GPT API with automatic web search fallback. The application is designed specifically for shoppers, providing only e-commerce relevant information while excluding non-retail business divisions, infrastructure details, or political content. This document covers the core APIs and services available for developers.

## Core Services

### StoreInfoService

The main service for retrieving store information.

```typescript
import { StoreInfoService } from './services/store-info.service';
import { getOpenAIConfig } from './utils/config';

const config = getOpenAIConfig();
const service = new StoreInfoService(config);
```

#### Methods

##### `getStoreInfo(storeName: string): Promise<StoreInfoResponse>`

Retrieves information about a store.

**Parameters:**
- `storeName` (string): The name of the store to get information about

**Returns:**
- `Promise<StoreInfoResponse>`: Store information response object

**Example:**
```typescript
const response = await service.getStoreInfo('apple.com');
console.log(response.information);
```

##### `formatResponse(response: StoreInfoResponse): string`

Formats the store information response for display.

**Parameters:**
- `response` (StoreInfoResponse): The response object to format

**Returns:**
- `string`: Formatted response string with headers

### OpenAIService

Low-level service for direct OpenAI API interaction.

**Models Used:**
- Primary: `gpt-5-mini` for initial chat completions
- Fallback: `gpt-5-mini` with web search via responses API
- Both models are hardcoded to ensure consistency

```typescript
import { OpenAIService } from './services/openai.service';

const service = new OpenAIService({
  apiKey: 'your-api-key',
  model: 'gpt-5-mini',
  timeout: 30000
});
```

#### Methods

##### `getStoreInformation(request: StoreInfoRequest): Promise<StoreInfoResponse>`

Makes a direct call to the OpenAI API.

**Parameters:**
- `request` (StoreInfoRequest): Request object containing store name

**Returns:**
- `Promise<StoreInfoResponse>`: Response from OpenAI

## Types and Interfaces

### StoreInfoRequest

```typescript
interface StoreInfoRequest {
  storeName: string;
}
```

### StoreInfoResponse

```typescript
interface StoreInfoResponse {
  storeName: string;
  information: string;
}
```

### OpenAIConfig

```typescript
interface OpenAIConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
}
```

### ErrorType

```typescript
enum ErrorType {
  API_ERROR = 'API_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}
```

### StoreInfoError

```typescript
class StoreInfoError extends Error {
  constructor(
    public readonly type: ErrorType,
    message: string,
    public readonly details?: unknown
  );
}
```

## Utility Functions

### Configuration

#### `getOpenAIConfig(): OpenAIConfig`

Retrieves and validates OpenAI configuration from environment variables.

**Throws:**
- `StoreInfoError` with `CONFIGURATION_ERROR` if API key is missing

**Example:**
```typescript
try {
  const config = getOpenAIConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

#### `validateStoreName(storeName: string): void`

Validates store name input.

**Parameters:**
- `storeName` (string): Store name to validate

**Throws:**
- `StoreInfoError` with `INVALID_INPUT` if validation fails

**Validation Rules:**
- Cannot be empty or whitespace only
- Maximum 200 characters

### Logger

The logger utility provides colored console output.

```typescript
import { logger } from './utils/logger';

logger.info('Information message');
logger.success('Success message');
logger.error('Error message', error);
logger.warning('Warning message');
logger.debug('Debug message', { data: 'value' });
```

## Usage Examples

### Basic Usage

```typescript
import { StoreInfoService } from './services/store-info.service';
import { getOpenAIConfig } from './utils/config';

async function getStoreDetails() {
  try {
    const config = getOpenAIConfig();
    const service = new StoreInfoService(config);
    
    const response = await service.getStoreInfo('Amazon');
    console.log(service.formatResponse(response));
    
  } catch (error) {
    if (error instanceof StoreInfoError) {
      switch (error.type) {
        case ErrorType.API_ERROR:
          console.error('API Error:', error.message);
          break;
        case ErrorType.INVALID_INPUT:
          console.error('Invalid input:', error.message);
          break;
        default:
          console.error('Error:', error.message);
      }
    }
  }
}
```

### Advanced Usage with Custom Configuration

```typescript
import { OpenAIService } from './services/openai.service';
import { StoreInfoRequest } from './types';

async function customStoreQuery() {
  const service = new OpenAIService({
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4', // Use a different model
    timeout: 60000  // Longer timeout
  });
  
  const request: StoreInfoRequest = {
    storeName: 'Tesla'
  };
  
  const response = await service.getStoreInformation(request);
  console.log(response.information);
}
```

### Batch Processing

```typescript
async function processMultipleStores() {
  const stores = ['Apple Store', 'Target', 'Walmart'];
  const service = new StoreInfoService(getOpenAIConfig());
  
  const results = await Promise.all(
    stores.map(store => 
      service.getStoreInfo(store).catch(error => ({
        storeName: store,
        error: error.message,
        isError: true
      }))
    )
  );
  
  results.forEach(result => {
    if ('isError' in result) {
      console.error(`Failed for ${result.storeName}: ${result.error}`);
    } else {
      console.log(service.formatResponse(result));
    }
  });
}
```

## Error Handling

The application uses a custom error class `StoreInfoError` with specific error types:

### API_ERROR
Thrown when the OpenAI API returns an error. The `details` property may contain:
- `status`: HTTP status code
- `code`: OpenAI error code

### INVALID_INPUT
Thrown when user input validation fails.

### NETWORK_ERROR
Thrown when network-related issues occur.

### CONFIGURATION_ERROR
Thrown when required configuration is missing or invalid.

## Best Practices

1. **Always handle errors**: Use try-catch blocks and check for `StoreInfoError` type
2. **Validate input**: Use `validateStoreName` before making API calls (expects store URL)
3. **Monitor web search**: Be aware that the API will automatically search the web if initial results are limited
4. **Rate limiting**: Implement appropriate delays between requests to avoid rate limits
5. **Production Caching Strategy** (CRITICAL):
   - Store generated descriptions in a database
   - Serve cached descriptions instead of calling API each time
   - Implement refresh logic (e.g., after 30+ days or based on staleness)
   - Consider view-based refresh triggers
   - This reduces API costs significantly and improves response times
6. **Logging**: Use the provided logger for consistent output

## Testing

When writing tests, you can mock the OpenAI service:

```typescript
jest.mock('./services/openai.service');

const mockResponse: StoreInfoResponse = {
  storeName: 'Test Store',
  information: 'Test information about the store.',
};
```

## Environment Variables

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `OPENAI_API_KEY` | string | Yes | - | Your OpenAI API key |
| `OPENAI_MODEL` | string | No | `gpt-5-mini` | The GPT model to use |
| `API_TIMEOUT` | number | No | `30000` | API timeout in milliseconds |
| `NODE_ENV` | string | No | `production` | Environment (affects debug logging) |
