# Quick Reference Card

## 🚀 Setup (5 minutes)

1. **Create Supabase project**: https://supabase.com
2. **Run SQL**: Copy `supabase-setup.sql` → Supabase SQL Editor → Run
3. **Get credentials**: Settings → API → Copy URL & anon key
4. **Update .env**:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
5. **Test**: `npm run dev` → Create account

## 📚 Documentation Quick Links

| Need | File |
|------|------|
| 🎯 Start | [START_HERE.md](./START_HERE.md) |
| ✅ Setup | [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) |
| 🔄 Migrate | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) |
| 📖 API | [API_REFERENCE.md](./API_REFERENCE.md) |

## 🔑 Essential Code Snippets

### Get Current User
```typescript
import { useAuth } from './context/AuthContext';

const { user, loading } = useAuth();
```

### Fetch Data
```typescript
import { getMoods } from './services/database';

const moods = await getMoods(user.id);
```

### Save Data
```typescript
import { saveMood } from './services/database';

await saveMood(user.id, {
  mood: 'Happy',
  timestamp: new Date().toISOString(),
  note: 'Great day!'
});
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

## 🎯 Component Update Pattern

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMoods, saveMood } from '../services/database';

const MyComponent = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const result = await getMoods(user.id);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  return <div>{/* Your UI */}</div>;
};
```

## 🔧 Available Functions

### Auth (`services/auth.ts`)
```typescript
await signUp(email, password, username, name)
await signIn(email, password)
await signOut()
await getCurrentUser()
await checkUsernameAvailability(username)
await updateProfile(userId, { name, username })
```

### Database (`services/database.ts`)
```typescript
// Moods
await getMoods(userId)
await saveMood(userId, moodData)

// Journals
await getJournals(userId)
await saveJournal(userId, journalData)

// Chat
await getChatHistory(userId)
await saveChatMessage(userId, messageData)
await clearChatHistory(userId)

// Streaks
await getStreakData(userId)
await completeFocusSession(userId)
```

## 📝 Components to Update

- [ ] `pages/Home.tsx`
- [ ] `pages/Journal.tsx`
- [ ] `pages/Counselor.tsx`
- [ ] `pages/Streaks.tsx`
- [ ] `pages/Profile.tsx`
- [ ] `pages/EditProfile.tsx`
- [ ] `pages/Focus.tsx`
- [ ] `pages/Insights.tsx`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Missing env vars | Add to `.env`, restart server |
| Invalid API key | Use **anon public** key |
| Data not showing | Check console, verify auth |
| TypeScript errors | Run `npm run build` |

## 💡 Pro Tips

1. ✅ Always check if `user` exists
2. ✅ Use `try/catch` for async calls
3. ✅ Show loading states
4. ✅ Check Supabase dashboard
5. ✅ Test after each update

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] SQL schema executed
- [ ] Credentials in `.env`
- [ ] Can create account
- [ ] Can sign in/out
- [ ] Data in Supabase dashboard

## 📞 Help

- **Setup**: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
- **Migration**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **API**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Supabase**: https://supabase.com/docs

---

**Start**: [START_HERE.md](./START_HERE.md) 🚀
