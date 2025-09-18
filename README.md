# Store Information Finder 🏪

A modern TypeScript application that provides credible store information using OpenAI's GPT API. The app generates factual, e-commerce-focused content specifically for shoppers, helping build credibility while avoiding non-retail topics like infrastructure, politics, or business controversies.

## Features

- 🤖 **AI-Powered**: Uses OpenAI's GPT-5-mini model with automatic web search fallback for real-time information
- 🌐 **Web Search**: Automatically searches the web when store information isn't available in the model
- 📊 **Shopper-Focused**: Provides factual data relevant only to shoppers making purchase decisions
- 🎯 **Credibility Building**: Generates concise history and scale information to build trust
- 🚫 **E-commerce Only**: Strictly avoids non-retail topics (cloud services, infrastructure, politics, etc.)
- ⚡ **Modern Stack**: Built with TypeScript, ES modules, and modern tooling
- 🛡️ **Error Handling**: Comprehensive error handling with clear user feedback
- 🎨 **Beautiful CLI**: Interactive command-line interface with colored output and status updates
- 📝 **Type Safety**: Full TypeScript support with strict type checking

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Store-Information.git
cd Store-Information
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
API_TIMEOUT=30000
```

4. Build the project:
```bash
npm run build
```

## Usage

### Running the Application

Start the CLI application:
```bash
npm start
```

Or use the development mode with auto-reload:
```bash
npm run dev
```

### Using the CLI

1. When prompted, enter the store's URL
2. The app will query the OpenAI API and return a concise paragraph about the store
3. If information isn't available, it automatically searches the web
4. You can search for multiple stores in one session

### Production Considerations

**Important**: In production environments:
- Store descriptions should be **cached/stored in a database** rather than computed each time
- Implement a caching strategy that:
  - Serves cached descriptions for most requests
  - Refreshes descriptions periodically (e.g., after 30+ days)
  - Triggers refresh based on view frequency or staleness
  - Reduces API costs and improves response times

### Example Output

```
🏪 Store Information Finder

Enter store URL: amazon.com

✓ Information retrieved successfully!

📍 Store Information: amazon.com
==================================================
Founded in 1994, Amazon is one of the world's largest online retailers. Operates e-commerce marketplaces in more than 20 countries and ships to millions worldwide. Sells millions of products across categories like electronics, home, clothing, groceries, and essentials. Serves hundreds of millions of active customers, supported by a vast third-party seller network. Known for fast shipping, vast selection, competitive pricing, and reliable customer support. Offers easy returns for most items and an A-to-z Guarantee for marketplace purchases.
==================================================
```

If a store is not found in the model's knowledge, it automatically searches the web:

```
Enter store URL: smalllocalstore.com

ℹ Store not found in database, searching the web...
✓ Found information via web search!

📍 Store Information: smalllocalstore.com
==================================================
[Web search results about the store will appear here]
==================================================
```

## Project Structure

```
Store-Information/
├── src/
│   ├── types/          # TypeScript type definitions
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   ├── cli.ts          # CLI interface
│   └── index.ts        # Main entry point
├── dist/               # Compiled JavaScript output
├── .env                # Environment variables (create this)
├── .env.example        # Example environment file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── .eslintrc.json      # ESLint configuration
└── README.md           # This file
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with auto-reload
- `npm start` - Run the compiled application
- `npm run lint` - Run ESLint on source files
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (when implemented)

## Configuration

The application can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) | - |
| `OPENAI_MODEL` | The GPT model to use | `gpt-5-mini` (primary), `gpt-5-mini` (web search) |
| `API_TIMEOUT` | API request timeout in milliseconds | `30000` |

## Error Handling

The application handles various error scenarios:

- **Configuration Errors**: Missing API key or invalid configuration
- **API Errors**: Rate limiting, invalid responses, authentication issues
- **Network Errors**: Connection issues, timeouts
- **Input Errors**: Invalid or empty store names

## Development

### Adding New Features

1. Create new types in `src/types/`
2. Implement services in `src/services/`
3. Add utilities in `src/utils/`
4. Update the CLI in `src/cli.ts`

### Code Style

The project uses:
- ESLint for linting
- Prettier for code formatting
- TypeScript strict mode

Run linting and formatting:
```bash
npm run lint
npm run format
```

## API Usage

The application uses the OpenAI Chat Completions API with:
- Model: gpt-5-nano (configurable)
- Temperature: 0.3 (for factual responses)
- Max tokens: 200
- System prompt optimized for factual store information

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and rotate it regularly
- The application validates all user inputs
- API calls are made over HTTPS

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY is not set"**
   - Create a `.env` file with your API key
   - Ensure the file is in the project root

2. **"Cannot find module"**
   - Run `npm install` to install dependencies
   - Run `npm run build` to compile TypeScript

3. **API Errors**
   - Check your API key is valid
   - Verify you have API credits available
   - Check rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.
