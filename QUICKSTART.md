# Quick Start Guide 🚀

Get up and running with Store Information Finder in under 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Your API Key

Create a `.env` file in the root directory:

```bash
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "OPENAI_MODEL=gpt-5-nano" >> .env
```

## 3. Build and Run

```bash
npm run build
npm start
```

## What to Expect

1. You'll see a welcome message and prompt to enter a store name
2. Type any store name (e.g., "Apple Store", "Amazon", "Target")
3. The app will generate 3 factual sentences about the store
4. You can search for multiple stores in one session

## Example Session

```
🏪 Store Information Finder

Get credible information about any store using AI

Enter store name: Starbucks
⠋ Getting store information...
✓ Information retrieved successfully!

📍 Store Information: Starbucks
==================================================
Starbucks Corporation was founded in 1971 and operates over 35,000 
stores across 80 countries as of 2023. The company serves approximately 
100 million customers per week and has been ranked among Fortune's 
"Most Admired Companies" for 20 consecutive years. Starbucks holds 
multiple sustainability certifications including C.A.F.E. Practices 
verification for 99% of their coffee purchases.
==================================================
🕐 Generated: 9/17/2025, 2:45:30 PM

Would you like to search for another store? (Y/n)
```

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

## Troubleshooting

### API Key Not Working?
- Make sure your `.env` file is in the project root
- Verify the API key is valid and has credits

### Build Errors?
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Need Help?
Check the full documentation:
- [README.md](./README.md) - Full project documentation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
