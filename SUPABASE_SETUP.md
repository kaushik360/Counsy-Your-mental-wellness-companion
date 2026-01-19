# Supabase Setup Guide for Counsy

This guide will help you set up Supabase as the backend for your Counsy app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Counsy (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to initialize (takes ~2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. You should see "Success. No rows returned" message

This creates all necessary tables:
- `profiles` - User profile information
- `mood_entries` - Mood tracking data
- `journal_entries` - Journal entries
- `chat_messages` - AI counselor chat history
- `streaks` - User streaks and achievements

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Environment Variables

1. Open your `.env` file in the `counsy` folder
2. Add your Supabase credentials:

```env
GROQ_API_KEY=your_existing_groq_key

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. Optional: Configure email templates under **Authentication** → **Email Templates**
4. Optional: Disable email confirmation for development:
   - Go to **Authentication** → **Settings**
   - Under "Email Auth", toggle off "Enable email confirmations"
   - This allows instant signup during development

## Step 6: Test Your Setup

1. Start your development server:
```bash
cd counsy
npm run dev
```

2. Navigate to the Auth page
3. Try creating a new account
4. Check your Supabase dashboard:
   - Go to **Authentication** → **Users** to see the new user
   - Go to **Table Editor** → **profiles** to see the profile data

## Security Features Enabled

✅ **Row Level Security (RLS)**: Users can only access their own data
✅ **Secure Authentication**: Passwords are hashed and managed by Supabase
✅ **API Key Protection**: Anon key is safe for client-side use
✅ **Data Isolation**: Each user's data is completely isolated

## Optional: Email Configuration

For production, you'll want to configure email sending:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your email provider (SendGrid, Mailgun, etc.)
3. Enable email confirmations and password reset emails

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding environment variables

### "Invalid API key" error
- Double-check you copied the **anon public** key, not the service role key
- Make sure there are no extra spaces in your `.env` file

### Users can't sign up
- Check if email confirmation is required (disable for development)
- Check the browser console for detailed error messages
- Verify the SQL schema was executed successfully

### Data not showing up
- Check the browser console for errors
- Verify RLS policies are set up correctly
- Make sure the user is authenticated

## Next Steps

- Migrate existing localStorage data to Supabase (if needed)
- Set up email templates for password reset
- Configure social auth providers (Google, GitHub, etc.)
- Set up database backups in production

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
