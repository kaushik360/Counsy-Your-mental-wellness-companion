import { supabase } from './supabase';
import { MoodEntry, JournalEntry, StreakData, ChatMessage, AchievementType } from '../types';

// --- Moods ---
export const getMoods = async (userId: string): Promise<MoodEntry[]> => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching moods:', error);
    return [];
  }

  return data.map(entry => ({
    id: entry.id,
    mood: entry.mood as any,
    timestamp: entry.created_at,
    note: entry.note || undefined,
    aiInsight: entry.ai_insight || undefined,
  }));
};

export const saveMood = async (userId: string, mood: Omit<MoodEntry, 'id'>): Promise<void> => {
  const { error } = await supabase.from('mood_entries').insert({
    user_id: userId,
    mood: mood.mood,
    note: mood.note || null,
    ai_insight: mood.aiInsight || null,
  });

  if (error) {
    console.error('Error saving mood:', error);
    throw error;
  }

  await updateStreak(userId, 'mood');
};

// --- Journals ---
export const getJournals = async (userId: string): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journals:', error);
    return [];
  }

  return data.map(entry => ({
    id: entry.id,
    content: entry.content,
    timestamp: entry.created_at,
    tags: entry.tags || [],
    mood: entry.mood,
    isLocked: entry.is_locked,
    aiAnalysis: entry.ai_analysis || undefined,
  }));
};

export const saveJournal = async (userId: string, entry: Omit<JournalEntry, 'id'>): Promise<void> => {
  const { error } = await supabase.from('journal_entries').insert({
    user_id: userId,
    content: entry.content,
    tags: entry.tags,
    mood: entry.mood,
    is_locked: entry.isLocked,
    ai_analysis: entry.aiAnalysis || null,
  });

  if (error) {
    console.error('Error saving journal:', error);
    throw error;
  }

  await updateStreak(userId, 'journal');
};

// --- Chat ---
export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'model',
    text: msg.text,
    timestamp: msg.created_at,
  }));
};

export const saveChatMessage = async (userId: string, message: Omit<ChatMessage, 'id'>): Promise<void> => {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    role: message.role,
    text: message.text,
  });

  if (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const clearChatHistory = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

// --- Streaks & Achievements ---
export const getStreakData = async (userId: string): Promise<StreakData> => {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // Initialize if not exists
    const newStreak: StreakData = {
      currentStreak: 0,
      lastActivityDate: null,
      journalStreak: 0,
      lastJournalDate: null,
      moodStreak: 0,
      lastMoodDate: null,
      focusStreak: 0,
      lastFocusDate: null,
      achievements: [],
    };
    
    await supabase.from('streaks').insert({
      user_id: userId,
      ...newStreak,
    });
    
    return newStreak;
  }

  return {
    currentStreak: data.current_streak,
    lastActivityDate: data.last_activity_date,
    journalStreak: data.journal_streak,
    lastJournalDate: data.last_journal_date,
    moodStreak: data.mood_streak,
    lastMoodDate: data.last_mood_date,
    focusStreak: data.focus_streak,
    lastFocusDate: data.last_focus_date,
    achievements: data.achievements || [],
  };
};

export const completeFocusSession = async (userId: string): Promise<void> => {
  await updateStreak(userId, 'focus');
};

const calculateNewStreak = (currentStreak: number, lastDateStr: string | null, todayStr: string): number => {
  if (!lastDateStr) return 1;
  
  if (lastDateStr === todayStr) return currentStreak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDateStr === yesterdayStr) {
    return currentStreak + 1;
  } else {
    return 1;
  }
};

const updateStreak = async (userId: string, type: 'journal' | 'mood' | 'focus'): Promise<void> => {
  const data = await getStreakData(userId);
  const todayStr = new Date().toISOString().split('T')[0];

  // Update Global Streak
  data.currentStreak = calculateNewStreak(data.currentStreak, data.lastActivityDate, todayStr);
  data.lastActivityDate = todayStr;

  // Update Specific Streak
  if (type === 'journal') {
    data.journalStreak = calculateNewStreak(data.journalStreak, data.lastJournalDate, todayStr);
    data.lastJournalDate = todayStr;
  } else if (type === 'mood') {
    data.moodStreak = calculateNewStreak(data.moodStreak, data.lastMoodDate, todayStr);
    data.lastMoodDate = todayStr;
  } else if (type === 'focus') {
    data.focusStreak = calculateNewStreak(data.focusStreak, data.lastFocusDate, todayStr);
    data.lastFocusDate = todayStr;
  }

  // Check Achievements
  const newAchievements = new Set(data.achievements);

  if (!newAchievements.has(AchievementType.CALM_STARTER)) {
    newAchievements.add(AchievementType.CALM_STARTER);
  }
  
  if (data.currentStreak >= 7 && !newAchievements.has(AchievementType.MINDFUL_7_DAY)) {
    newAchievements.add(AchievementType.MINDFUL_7_DAY);
  }

  if (data.currentStreak >= 30 && !newAchievements.has(AchievementType.CONSISTENCY_CHAMP)) {
    newAchievements.add(AchievementType.CONSISTENCY_CHAMP);
  }
  
  if (data.focusStreak >= 5 && !newAchievements.has(AchievementType.FOCUS_MASTER)) {
    newAchievements.add(AchievementType.FOCUS_MASTER);
  }

  data.achievements = Array.from(newAchievements);

  // Save to database
  const { error } = await supabase
    .from('streaks')
    .update({
      current_streak: data.currentStreak,
      last_activity_date: data.lastActivityDate,
      journal_streak: data.journalStreak,
      last_journal_date: data.lastJournalDate,
      mood_streak: data.moodStreak,
      last_mood_date: data.lastMoodDate,
      focus_streak: data.focusStreak,
      last_focus_date: data.lastFocusDate,
      achievements: data.achievements,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};
