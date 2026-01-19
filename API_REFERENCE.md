# Counsy API Reference

Quick reference for using Supabase authentication and database functions.

## Authentication (`services/auth.ts`)

### Sign Up
```typescript
import { signUp } from './services/auth';

const result = await signUp(email, password, username, name);
if (result.success) {
  console.log('User created:', result.user);
} else {
  console.error('Error:', result.message);
}
```

### Sign In
```typescript
import { signIn } from './services/auth';

const result = await signIn(email, password);
if (result.success) {
  console.log('Logged in:', result.user);
}
```

### Sign Out
```typescript
import { signOut } from './services/auth';

await signOut();
```

### Get Current User
```typescript
import { getCurrentUser } from './services/auth';

const user = await getCurrentUser();
```

### Check Username Availability
```typescript
import { checkUsernameAvailability } from './services/auth';

const isAvailable = await checkUsernameAvailability('username');
```

### Update Profile
```typescript
import { updateProfile } from './services/auth';

const result = await updateProfile(userId, {
  name: 'New Name',
  username: 'newusername',
  avatar_url: 'https://...'
});
```

## Auth Context Hook

```typescript
import { useAuth } from './context/AuthContext';

const { user, loading, signOut, refreshUser } = useAuth();

// user: Current user object or null
// loading: Boolean indicating if auth state is loading
// signOut: Function to sign out
// refreshUser: Function to refresh user data
```

## Database Operations (`services/database.ts`)

### Moods

```typescript
import { getMoods, saveMood } from './services/database';

// Get all moods for a user
const moods = await getMoods(userId);

// Save a new mood
await saveMood(userId, {
  mood: 'Happy',
  timestamp: new Date().toISOString(),
  note: 'Feeling great today!',
  aiInsight: 'AI generated insight...'
});
```

### Journals

```typescript
import { getJournals, saveJournal } from './services/database';

// Get all journals for a user
const journals = await getJournals(userId);

// Save a new journal entry
await saveJournal(userId, {
  content: 'Today was amazing...',
  timestamp: new Date().toISOString(),
  tags: ['gratitude', 'reflection'],
  mood: 'Happy',
  isLocked: false,
  aiAnalysis: {
    moodSummary: '...',
    productivityInsight: '...',
    recommendations: ['...']
  }
});
```

### Chat

```typescript
import { getChatHistory, saveChatMessage, clearChatHistory } from './services/database';

// Get chat history
const messages = await getChatHistory(userId);

// Save a message
await saveChatMessage(userId, {
  role: 'user',
  text: 'Hello, counselor!',
  timestamp: new Date().toISOString()
});

// Clear all chat history
await clearChatHistory(userId);
```

### Streaks

```typescript
import { getStreakData, completeFocusSession } from './services/database';

// Get streak data
const streaks = await getStreakData(userId);
console.log(streaks.currentStreak); // Global streak
console.log(streaks.journalStreak); // Journal-specific streak
console.log(streaks.achievements); // Array of achievement IDs

// Complete a focus session (updates focus streak)
await completeFocusSession(userId);
```

## Types

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  joinedDate: string;
}
```

### MoodEntry
```typescript
interface MoodEntry {
  id: string;
  mood: 'Ecstatic' | 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Focused' | 'Sleepy';
  timestamp: string;
  note?: string;
  aiInsight?: string;
}
```

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
  mood: string;
  isLocked: boolean;
  aiAnalysis?: {
    moodSummary: string;
    productivityInsight: string;
    recommendations: string[];
  };
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
```

### StreakData
```typescript
interface StreakData {
  currentStreak: number;
  lastActivityDate: string | null;
  journalStreak: number;
  lastJournalDate: string | null;
  moodStreak: number;
  lastMoodDate: string | null;
  focusStreak: number;
  lastFocusDate: string | null;
  achievements: string[];
}
```

## Error Handling

All database operations can throw errors. Always wrap them in try/catch:

```typescript
try {
  const moods = await getMoods(userId);
  setMoods(moods);
} catch (error) {
  console.error('Failed to load moods:', error);
  // Show error message to user
}
```

## Best Practices

1. **Always check if user exists** before making database calls
2. **Use loading states** while fetching data
3. **Handle errors gracefully** with user-friendly messages
4. **Refresh data after mutations** to keep UI in sync
5. **Use the useAuth hook** to access current user
6. **Don't store sensitive data** in the client

## Example Component Pattern

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMoods, saveMood } from '../services/database';

const MyComponent: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getMoods(user!.id);
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in</div>;

  return <div>{/* Your component */}</div>;
};
```
