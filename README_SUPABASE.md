# Counsy with Supabase Integration

Your mental wellness app now uses Supabase for authentication and data storage!

## 🎉 What's New

- ✅ **Real Authentication**: Email/password login with secure password hashing
- ✅ **Cloud Database**: All data stored in PostgreSQL via Supabase
- ✅ **Row Level Security**: Users can only access their own data
- ✅ **Real-time Sync**: Data syncs across devices
- ✅ **Scalable**: Ready for production use
- ✅ **No More localStorage**: Professional backend infrastructure

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete setup guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - How to update components
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Quick API reference
- **[supabase-setup.sql](./supabase-setup.sql)** - Database schema

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-setup.sql`
3. Get your API credentials
4. Add them to `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Authentication
- Navigate to the Auth page
- Create a new account
- Check your Supabase dashboard to see the data

## 🏗️ Architecture

### Services Layer

```
services/
├── supabase.ts      # Supabase client initialization
├── auth.ts          # Authentication functions
├── database.ts      # Database operations (moods, journals, etc.)
└── storage.ts       # Legacy localStorage (can be removed)
```

### Context Providers

```
context/
├── AuthContext.tsx  # Global auth state management
└── ThemeContext.tsx # Theme management
```

### Key Features

1. **AuthContext**: Provides `user`, `loading`, `signOut`, `refreshUser` globally
2. **Protected Routes**: Check `user` before rendering protected pages
3. **Automatic Session Management**: Supabase handles token refresh
4. **Type Safety**: Full TypeScript support with database types

## 🔐 Security Features

- **Password Hashing**: Handled by Supabase Auth
- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Tokens**: Secure session management
- **API Key Protection**: Anon key is safe for client-side use
- **HTTPS Only**: All API calls are encrypted

## 📊 Database Schema

Tables created:
- `profiles` - User profile information
- `mood_entries` - Mood tracking data
- `journal_entries` - Journal entries with AI analysis
- `chat_messages` - Counselor chat history
- `streaks` - User streaks and achievements

All tables have:
- Automatic timestamps
- User-based access control (RLS)
- Proper indexes for performance

## 🔄 Migration Status

### ✅ Completed
- Supabase client setup
- Authentication service
- Database service layer
- Auth context provider
- Auth page updated
- App.tsx updated with AuthProvider

### 📝 To Do (Update Your Components)
- [ ] Update `pages/Home.tsx` to use Supabase
- [ ] Update `pages/Journal.tsx` to use Supabase
- [ ] Update `pages/Counselor.tsx` to use Supabase
- [ ] Update `pages/Streaks.tsx` to use Supabase
- [ ] Update `pages/Profile.tsx` to use Supabase
- [ ] Update `pages/EditProfile.tsx` to use Supabase
- [ ] Update `pages/Insights.tsx` to use Supabase
- [ ] Update `pages/Focus.tsx` to use Supabase

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed instructions.

## 🛠️ Development Workflow

### Using the Auth Hook
```typescript
import { useAuth } from './context/AuthContext';

const MyComponent = () => {
  const { user, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Hello, {user.name}!</div>;
};
```

### Making Database Calls
```typescript
import { getMoods, saveMood } from './services/database';
import { useAuth } from './context/AuthContext';

const { user } = useAuth();

// Fetch data
const moods = await getMoods(user.id);

// Save data
await saveMood(user.id, newMood);
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check your `.env` file has both variables
- Restart the dev server after adding env vars

### "Invalid API key"
- Make sure you copied the **anon public** key
- Don't use the service role key in the client

### Data not showing
- Check browser console for errors
- Verify SQL schema was executed
- Check Supabase dashboard for data

### Authentication not working
- Disable email confirmation in Supabase settings (for development)
- Check Auth logs in Supabase dashboard
- Verify email/password are correct

## 📦 Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

## 🌐 Production Checklist

Before deploying to production:

- [ ] Enable email confirmations
- [ ] Configure custom SMTP for emails
- [ ] Set up password reset flow
- [ ] Add social auth providers (optional)
- [ ] Configure database backups
- [ ] Set up monitoring and alerts
- [ ] Review RLS policies
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Set up staging environment

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Discord](https://discord.supabase.com)

## 🤝 Support

Need help? Check:
1. The documentation files in this directory
2. Supabase documentation
3. Browser console for error messages
4. Supabase dashboard logs

## 📝 License

Same as the main Counsy project.
