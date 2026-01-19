# Migration Guide: localStorage to Supabase

This guide explains how to update your components to use Supabase instead of localStorage.

## Key Changes

### 1. Authentication

**Before (localStorage):**
```typescript
import { getUser, loginUser, registerUser } from './services/storage';

const user = getUser();
const result = loginUser(email, password);
```

**After (Supabase):**
```typescript
import { useAuth } from './context/AuthContext';
import { signIn, signUp } from './services/auth';

const { user, loading } = useAuth();
const result = await signIn(email, password);
```

### 2. Data Operations

**Before (localStorage):**
```typescript
import { getMoods, saveMood } from './services/storage';

const moods = getMoods();
saveMood(newMood);
```

**After (Supabase):**
```typescript
import { getMoods, saveMood } from './services/database';
import { useAuth } from './context/AuthContext';

const { user } = useAuth();
const moods = await getMoods(user.id);
await saveMood(user.id, newMood);
```

## Component Update Examples

### Example 1: Home Page

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMoods, saveMood } from '../services/database';
import { MoodEntry } from '../types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoods();
    }
  }, [user]);

  const loadMoods = async () => {
    try {
      const data = await getMoods(user!.id);
      setMoods(data);
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMood = async (mood: Omit<MoodEntry, 'id'>) => {
    try {
      await saveMood(user!.id, mood);
      await loadMoods(); // Refresh
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### Example 2: Profile Page

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/auth';

const Profile: React.FC = () => {
  const { user, refreshUser, signOut } = useAuth();

  const handleUpdateProfile = async (name: string, username: string) => {
    try {
      const result = await updateProfile(user!.id, { name, username });
      if (result.success) {
        await refreshUser(); // Refresh user data
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div>
      <h1>{user?.name}</h1>
      {/* Your component JSX */}
    </div>
  );
};
```

## Components That Need Updates

Here's a checklist of components that need to be migrated:

- [ ] `pages/Home.tsx` - Use `getMoods`, `saveMood` with user.id
- [ ] `pages/Journal.tsx` - Use `getJournals`, `saveJournal` with user.id
- [ ] `pages/Counselor.tsx` - Use `getChatHistory`, `saveChatMessage` with user.id
- [ ] `pages/Streaks.tsx` - Use `getStreakData` with user.id
- [ ] `pages/Profile.tsx` - Use `useAuth` hook
- [ ] `pages/EditProfile.tsx` - Use `updateProfile` from auth service
- [ ] `pages/Insights.tsx` - Use database functions with user.id
- [ ] `pages/Focus.tsx` - Use `completeFocusSession` with user.id

## Important Notes

1. **All database operations are now async** - Use `async/await` or `.then()`
2. **User ID is required** - Pass `user.id` to all database functions
3. **Error handling** - Wrap database calls in try/catch blocks
4. **Loading states** - Show loading indicators while fetching data
5. **Auth state** - Check if user exists before making database calls

## Testing Your Migration

1. Create a new account with Supabase
2. Test each feature:
   - Add a mood entry
   - Create a journal entry
   - Chat with the counselor
   - Check streaks
   - Update profile
3. Sign out and sign back in to verify data persistence
4. Check Supabase dashboard to see data in tables

## Rollback Plan

If you need to rollback to localStorage:
1. Keep the old `storage.ts` file (rename it to `storage.backup.ts`)
2. Revert imports in components
3. Remove Supabase dependencies

## Need Help?

- Check the Supabase documentation: https://supabase.com/docs
- Review the `services/database.ts` file for available functions
- Look at the `services/auth.ts` file for authentication methods
