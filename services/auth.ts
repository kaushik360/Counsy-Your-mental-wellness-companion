import { supabase } from './supabase';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  username: string,
  name: string
): Promise<AuthResponse> => {
  console.log('Starting signup process...', { email, username, name });
  
  try {
    console.log('Creating auth user directly...');
    
    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('Auth signup result:', { authData, authError });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, message: 'Email is already registered. Try logging in instead.' };
      }
      throw authError;
    }
    
    if (!authData.user) {
      console.error('No user returned from signup');
      throw new Error('No user returned from signup');
    }

    console.log('Auth user created, creating profile...');

    // Create profile directly (we'll handle duplicates with try/catch)
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username,
      name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      // If it's a duplicate username error, return specific message
      if (profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
        await supabase.auth.signOut(); // Clean up auth user
        return { success: false, message: 'Username is already taken. Please choose a different username.' };
      }
      
      // For other errors, clean up and throw
      await supabase.auth.signOut();
      throw profileError;
    }

    console.log('Profile created, initializing streak data...');

    // Initialize streak data
    const { error: streakError } = await supabase.from('streaks').insert({
      user_id: authData.user.id,
    });

    if (streakError) {
      console.error('Streak initialization error:', streakError);
      // Don't throw here, streak can be created later
    }

    console.log('Signup completed successfully');

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      username,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinedDate: authData.user.created_at,
    };

    return { success: true, user };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, message: error.message || 'Failed to create account' };
  }
};

// Sign in with email and password
export const signIn = async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
  console.log('Starting login process...', { email: emailOrUsername });
  
  try {
    let email = emailOrUsername;
    
    if (!emailOrUsername.includes('@')) {
      console.log('Username provided, requiring email');
      return { success: false, message: 'Please use your email address to login' };
    }

    console.log('Attempting Supabase login...');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Supabase auth result:', { success: !authError, error: authError?.message });

    if (authError) {
      console.error('Auth error:', authError);
      
      if (authError.message.includes('Email not confirmed')) {
        return { success: false, message: 'Please check your email and confirm your account before logging in.' };
      }
      
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Invalid email or password. Please check your credentials.' };
      }
      
      return { success: false, message: authError.message };
    }
    
    if (!authData.user) {
      console.error('No user returned');
      return { success: false, message: 'No user returned from login' };
    }

    console.log('Getting user profile...');

    // Get profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { success: false, message: 'Could not load user profile' };
    }

    console.log('Login successful');

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      joinedDate: authData.user.created_at,
    };

    return { success: true, user };

  } catch (error: any) {
    console.error('Login catch error:', error);
    return { success: false, message: error.message || 'Login failed' };
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Get current session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      joinedDate: session.user.created_at,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Check username availability
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    return !data; // Available if no data found
  } catch (error) {
    return true; // Assume available on error
  }
};

// Update profile
export const updateProfile = async (userId: string, updates: {
  name?: string;
  username?: string;
  avatar_url?: string;
}): Promise<AuthResponse> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;

    // Get updated profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    const user: User = {
      id: userId,
      email: authUser?.email || '',
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      joinedDate: profile.created_at,
    };

    return { success: true, user };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
};
