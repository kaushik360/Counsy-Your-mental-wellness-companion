import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          note: string | null;
          ai_insight: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          note?: string | null;
          ai_insight?: string | null;
          created_at?: string;
        };
        Update: {
          mood?: string;
          note?: string | null;
          ai_insight?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          tags: string[];
          mood: string;
          is_locked: boolean;
          ai_analysis: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          tags?: string[];
          mood: string;
          is_locked?: boolean;
          ai_analysis?: any | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          tags?: string[];
          mood?: string;
          is_locked?: boolean;
          ai_analysis?: any | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          text: string;
          created_at?: string;
        };
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          last_activity_date: string | null;
          journal_streak: number;
          last_journal_date: string | null;
          mood_streak: number;
          last_mood_date: string | null;
          focus_streak: number;
          last_focus_date: string | null;
          achievements: string[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          last_activity_date?: string | null;
          journal_streak?: number;
          last_journal_date?: string | null;
          mood_streak?: number;
          last_mood_date?: string | null;
          focus_streak?: number;
          last_focus_date?: string | null;
          achievements?: string[];
          updated_at?: string;
        };
        Update: {
          current_streak?: number;
          last_activity_date?: string | null;
          journal_streak?: number;
          last_journal_date?: string | null;
          mood_streak?: number;
          last_mood_date?: string | null;
          focus_streak?: number;
          last_focus_date?: string | null;
          achievements?: string[];
          updated_at?: string;
        };
      };
    };
  };
}
