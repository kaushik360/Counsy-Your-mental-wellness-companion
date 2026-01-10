<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

**🚀 Now powered by Groq's free API instead of Google Gemini!**

View your app in AI Studio: https://ai.studio/apps/drive/1qovhTrC1dQ8D7fdA0CDTsmtbp3uR8De1

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Get your free Groq API key:
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up for a free account
   - Generate an API key

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Groq API key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Migration from Gemini to Groq

This app has been migrated from Google's Gemini API to Groq's free API for better accessibility:

- **Free tier**: Groq offers generous free usage limits
- **Fast inference**: Groq provides lightning-fast responses
- **Same functionality**: All AI features work exactly the same
- **Better reliability**: No more API key costs or quota issues

The migration includes:
- Updated AI service (`services/ai.ts`)
- Groq SDK integration
- Environment variable updates
- Backward compatibility with existing data
