import Groq from "groq-sdk";
import { ChatMessage } from "../types";

// Ensure TypeScript recognizes the injected process.env.API_KEY
declare const process: { env: { API_KEY: string } };

// Lazy initialization helper
let groqInstance: Groq | null = null;

// Helper to check if we are running without an API key
export const isDemoMode = (): boolean => {
  return !process.env.API_KEY;
};

const getGroqClient = (): Groq | null => {
  if (groqInstance) return groqInstance;

  // The API key is injected via vite.config.ts into process.env.API_KEY
  const apiKey = process.env.API_KEY;

  // If no key is found, return null to trigger Mock/Demo Mode
  if (!apiKey) {
    console.warn("Counsy: No API Key found in environment. Running in Demo/Mock mode.");
    return null;
  }

  try {
    // Initialize Groq client
    groqInstance = new Groq({ 
      apiKey,
      dangerouslyAllowBrowser: true // Allow browser usage
    });
    return groqInstance;
  } catch (error) {
    console.error("Failed to initialize Groq Client:", error);
    return null;
  }
};

// --- Helper: Mock Responses (Fallback) ---
const getMockChatResponse = async (userMessage: string, userName: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
      
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return `Hello ${userName}! I'm running in Demo Mode right now (connection issue), but I'm still here to listen. How are you feeling?`;
    } else if (lowerMsg.includes('sad') || lowerMsg.includes('depressed') || lowerMsg.includes('lonely')) {
      return "I'm sorry you're feeling this way. Remember, this feeling is temporary, and you are stronger than you know. (Demo Response)";
    } else if (lowerMsg.includes('anxious') || lowerMsg.includes('stress')) {
      return "Take a deep breath with me. Inhale... Exhale. Focus on this moment. You've got this. (Demo Response)";
    } else if (lowerMsg.includes('thank')) {
      return "You're very welcome! I'm glad I could help.";
    }
    return "I hear you, and I understand. I'm operating in offline mode currently, but I want you to know your feelings are valid. Tell me more?";
};

// --- Chat with Counselor ---
export const getCounselorResponse = async (history: ChatMessage[], userMessage: string, userName: string = 'Friend'): Promise<string> => {
  const groq = getGroqClient();
  
  // MOCK MODE: If no client available
  if (!groq) {
    return getMockChatResponse(userMessage, userName);
  }

  try {
    // REAL AI MODE using Groq
    const systemPrompt = `You are a compassionate, empathetic, and professional student wellness counselor named "Counsy AI".
Your goal is to provide emotional support, stress management tips, and academic motivation.

The user's full name is "${userName}". Address them by their name occasionally to create a personal connection.

Instructions:
- Always identify yourself as "Counsy AI" if asked.
- Keep responses warm, short (under 60 words), and conversational.
- Validate feelings first.
- Offer actionable advice if appropriate.
- Do not diagnose medical conditions.
- Use emojis sparingly but effectively to be friendly.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userMessage }
    ];

    const response = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-8b-instant", // Updated free Groq model
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");

    return content;
  } catch (error) {
    console.error("AI Chat Error (Falling back to Demo Mode):", error);
    // Graceful fallback to mock response if API fails (e.g., 401, Quota, Network)
    return getMockChatResponse(userMessage, userName);
  }
};

// --- Quick Mood Insight ---
export const getMoodInsight = async (mood: string): Promise<string> => {
  const groq = getGroqClient();
  const mockResponse = "Remember to take care of yourself today. (Offline Tip)";
  
  if (!groq) return mockResponse;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a supportive wellness counselor. Give brief, encouraging insights."
        },
        {
          role: "user", 
          content: `The user is feeling "${mood}". Give a 1-sentence supportive insight or micro-tip for a student.`
        }
      ],
      model: "llama-3.1-8b-instant", // Updated free Groq model
      temperature: 0.7,
      max_tokens: 50,
    });

    return response.choices[0]?.message?.content || mockResponse;
  } catch (e) {
    console.error("Mood Insight Error:", e);
    return mockResponse;
  }
};

// --- Journal Analysis ---
export const analyzeJournalEntry = async (text: string) => {
  const groq = getGroqClient();
  
  // Fallback response if no AI available
  const fallbackResponse = {
    moodSummary: "Unable to analyze entry at the moment",
    productivityInsight: "Keep writing to clear your mind.",
    recommendations: ["Try writing regularly to track your emotional patterns."]
  };
  
  if (!groq || !text.trim()) {
    return fallbackResponse;
  }

  try {
    const analysisPrompt = `Analyze this student's journal entry and provide supportive insights:

"${text}"

Please provide:
1. A brief mood summary (1-2 sentences)
2. A productivity/wellness insight (1 sentence)  
3. 2-3 supportive recommendations

Keep the tone encouraging and supportive. Focus on student wellness and mental health.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a compassionate student wellness counselor analyzing journal entries. Provide supportive, encouraging insights that help students understand their emotions and improve their wellbeing."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty analysis response");

    // Parse the AI response into structured format
    const lines = content.split('\n').filter(line => line.trim());
    
    return {
      moodSummary: lines[0] || "Your emotions are valid and important.",
      productivityInsight: lines[1] || "Journaling helps process thoughts and feelings.",
      recommendations: lines.slice(2).length > 0 ? lines.slice(2) : [
        "Continue journaling regularly",
        "Practice self-compassion",
        "Reach out for support when needed"
      ]
    };

  } catch (error) {
    console.error("Journal Analysis Error:", error);
    return fallbackResponse;
  }
};