# Store Information Finder 🏪

A modern TypeScript application that provides credible store information using OpenAI's GPT API. The app generates factual, data-driven content to help build credibility with prospective customers.

## Features

- 🤖 **AI-Powered**: Uses OpenAI's GPT-5 model with web search to generate real-time store information
- 📊 **Factual Focus**: Provides only verifiable, factual data about stores
- 🎯 **Credibility Building**: Generates 3 concise sentences designed to build customer trust
- ⚡ **Modern Stack**: Built with TypeScript, ES modules, and modern tooling
- 🛡️ **Error Handling**: Comprehensive error handling with clear user feedback
- 🎨 **Beautiful CLI**: Interactive command-line interface with colored output
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

1. When prompted, enter the name of a store
2. The app will query the OpenAI API and return 3 factual sentences about the store
3. If the AI is uncertain about the store, it will clearly indicate this
4. You can search for multiple stores in one session

### Example Output

```
🏪 Store Information Finder

Enter store name: Apple Store

✓ Information retrieved successfully!

📍 Store Information: Apple Store
==================================================
Apple Inc. was founded in 1976 and operates over 500 retail stores 
across 25 countries worldwide. The company has been recognized as the 
world's most valuable brand multiple times and serves millions of 
customers annually. Apple Stores have won numerous awards for retail 
design and customer service excellence, maintaining one of the highest 
sales-per-square-foot metrics in retail.
==================================================
🕐 Generated: 9/17/2025, 2:30:45 PM
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
| `OPENAI_MODEL` | The GPT model to use | `gpt-5-mini` |
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
