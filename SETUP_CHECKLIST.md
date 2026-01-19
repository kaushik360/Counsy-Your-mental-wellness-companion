# Supabase Setup Checklist

Follow these steps to complete your Supabase integration.

## ✅ Step 1: Create Supabase Project (5 minutes)

- [ ] Go to https://supabase.com and sign up/login
- [ ] Click "New Project"
- [ ] Name: "Counsy" (or your choice)
- [ ] Choose a strong database password (save it!)
- [ ] Select region closest to you
- [ ] Click "Create new project"
- [ ] Wait ~2 minutes for initialization

## ✅ Step 2: Set Up Database (2 minutes)

- [ ] In Supabase dashboard, go to **SQL Editor** (left sidebar)
- [ ] Click "New Query"
- [ ] Open `supabase-setup.sql` file in your project
- [ ] Copy ALL the SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Verify you see "Success. No rows returned"

## ✅ Step 3: Get API Credentials (1 minute)

- [ ] In Supabase dashboard, go to **Settings** → **API**
- [ ] Copy the **Project URL** (looks like: https://xxxxx.supabase.co)
- [ ] Copy the **anon public** key (long string under "Project API keys")
- [ ] Keep these safe - you'll need them next

## ✅ Step 4: Configure Environment Variables (1 minute)

- [ ] Open `counsy/.env` file
- [ ] Replace `your_supabase_project_url` with your Project URL
- [ ] Replace `your_supabase_anon_key` with your anon public key
- [ ] Save the file

Your `.env` should look like:
```env
GROQ_API_KEY=gsk_...
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## ✅ Step 5: Disable Email Confirmation (Development Only)

- [ ] In Supabase dashboard, go to **Authentication** → **Settings**
- [ ] Scroll to "Email Auth" section
- [ ] Toggle OFF "Enable email confirmations"
- [ ] This allows instant signup during development

## ✅ Step 6: Test Authentication (3 minutes)

- [ ] Open terminal in `counsy` folder
- [ ] Run: `npm run dev`
- [ ] Open the app in your browser
- [ ] Click "Get Started" → "Create Account"
- [ ] Fill in the form and create an account
- [ ] You should be redirected to the home page

## ✅ Step 7: Verify in Supabase Dashboard (1 minute)

- [ ] Go to **Authentication** → **Users** in Supabase
- [ ] You should see your new user account
- [ ] Go to **Table Editor** → **profiles**
- [ ] You should see your profile data
- [ ] Go to **Table Editor** → **streaks**
- [ ] You should see an initial streak record

## ✅ Step 8: Test Sign Out and Sign In

- [ ] In your app, sign out
- [ ] Try signing back in with your credentials
- [ ] Verify you can access your account

## 🎉 Setup Complete!

Your authentication is now working with Supabase!

## 📋 Next Steps: Update Your Components

Now you need to update your app components to use Supabase instead of localStorage.

### Priority 1: Core Features
- [ ] Update `pages/Home.tsx` - Mood tracking
- [ ] Update `pages/Journal.tsx` - Journal entries
- [ ] Update `pages/Profile.tsx` - User profile display

### Priority 2: Additional Features
- [ ] Update `pages/Counselor.tsx` - Chat history
- [ ] Update `pages/Streaks.tsx` - Streak data
- [ ] Update `pages/EditProfile.tsx` - Profile editing
- [ ] Update `pages/Focus.tsx` - Focus sessions
- [ ] Update `pages/Insights.tsx` - Analytics

### How to Update Components

See **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** for detailed examples.

Basic pattern:
```typescript
// 1. Import the auth hook
import { useAuth } from '../context/AuthContext';

// 2. Import database functions
import { getMoods, saveMood } from '../services/database';

// 3. Use in component
const { user } = useAuth();
const moods = await getMoods(user.id);
```

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check your `.env` file has both variables
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Error: "Invalid API key"
- Make sure you copied the **anon public** key, not service role
- Check for extra spaces in `.env` file

### Can't create account
- Check browser console (F12) for error messages
- Verify SQL schema was executed successfully
- Make sure email confirmation is disabled

### Data not saving
- Check browser console for errors
- Verify you're passing `user.id` to database functions
- Check Supabase dashboard logs

## 📚 Documentation Reference

- **[README_SUPABASE.md](./README_SUPABASE.md)** - Overview and architecture
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed setup guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Component migration examples
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Quick API reference

## 🎯 Success Criteria

You'll know everything is working when:
- ✅ You can create a new account
- ✅ You can sign in and out
- ✅ User data appears in Supabase dashboard
- ✅ No console errors in browser
- ✅ Components load user-specific data

## 🚀 Ready for Production?

Before going live:
- [ ] Enable email confirmations
- [ ] Set up custom SMTP for emails
- [ ] Configure password reset
- [ ] Review security settings
- [ ] Set up database backups
- [ ] Test on staging environment

---

**Need Help?**
- Check the documentation files
- Review Supabase docs: https://supabase.com/docs
- Check browser console for errors
- Look at Supabase dashboard logs
