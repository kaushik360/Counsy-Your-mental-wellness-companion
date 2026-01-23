import { supabase } from './supabase';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  requiresVerification?: boolean;
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
    console.log('Creating auth user with email confirmation...');
    console.log('Current origin:', window.location.origin);
    
    // Create auth user with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/#/auth?verified=true`,
        data: {
          username,
          name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        }
      }
    });

    console.log('Auth signup result:', { 
      user: authData.user?.id, 
      session: !!authData.session,
      error: authError?.message,
      emailConfirmationSent: authData.user && !authData.session
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, message: 'Email is already registered. Try logging in instead.' };
      }
      if (authError.message.includes('User already registered')) {
        return { success: false, message: 'This email is already registered. Try logging in or use a different email.' };
      }
      throw authError;
    }
    
    if (!authData.user) {
      console.error('No user returned from signup');
      throw new Error('No user returned from signup');
    }

    // If user needs email confirmation (no session means email confirmation required)
    if (!authData.session) {
      console.log('Email confirmation required - email should be sent');
      return { 
        success: true, 
        message: `Verification email sent to ${email}. Please check your inbox and spam folder.`,
        requiresVerification: true 
      };
    }

    console.log('User signed up and confirmed immediately, creating profile...');

    // Create profile directly (user is confirmed)
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username,
      name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      if (profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
        return { success: false, message: 'Username is already taken. Please choose a different username.' };
      }
      
      throw profileError;
    }

    // Initialize streak data
    const { error: streakError } = await supabase.from('streaks').insert({
      user_id: authData.user.id,
    });

    if (streakError) {
      console.error('Streak initialization error:', streakError);
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
        return { 
          success: false, 
          message: 'Please verify your email address first. Check your inbox for the verification link.',
          requiresVerification: true 
        };
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
      
      // If profile doesn't exist, try to create it from metadata
      if (profileError.code === 'PGRST116') {
        console.log('Profile not found, attempting to create from metadata...');
        const metadata = authData.user.user_metadata;
        
        if (metadata?.username && metadata?.name) {
          const { error: createError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username: metadata.username,
            name: metadata.name,
            avatar_url: metadata.avatar_url,
          });
          
          if (createError) {
            console.error('Failed to create profile:', createError);
            return { success: false, message: 'Could not load user profile' };
          }
          
          // Initialize streak data
          await supabase.from('streaks').insert({
            user_id: authData.user.id,
          });
          
          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            username: metadata.username,
            name: metadata.name,
            avatarUrl: metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata.username}`,
            joinedDate: authData.user.created_at,
          };
          
          console.log('Login successful with newly created profile');
          return { success: true, user };
        }
      }
      
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

// Test email functionality
export const testEmailDelivery = async (email: string): Promise<AuthResponse> => {
  try {
    console.log('Testing email delivery for:', email);
    
    // Try to trigger a password reset email as a test
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/auth`
    });

    if (error) {
      console.error('Email test error:', error);
      return { success: false, message: `Email test failed: ${error.message}` };
    }

    return { success: true, message: 'Test email sent! Check your inbox to confirm email delivery is working.' };
  } catch (error: any) {
    console.error('Email test error:', error);
    return { success: false, message: error.message || 'Email test failed' };
  }
};

// Resend email verification
export const resendVerification = async (email: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/auth?verified=true`
      }
    });

    if (error) throw error;

    return { success: true, message: 'Verification email sent! Please check your inbox.' };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return { success: false, message: error.message || 'Failed to resend verification email' };
  }
};

// Handle email verification after user clicks link
export const handleEmailVerification = async (): Promise<AuthResponse> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session?.user) {
      return { success: false, message: 'No active session found' };
    }

    console.log('Email verification - User session:', { userId: session.user.id, metadata: session.user.user_metadata });

    // Check if user already has a profile
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (existingProfile) {
      // Profile already exists, user is verified
      console.log('Profile already exists');
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        username: existingProfile.username,
        name: existingProfile.name,
        avatarUrl: existingProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${existingProfile.username}`,
        joinedDate: session.user.created_at,
      };
      return { success: true, user };
    }

    // Create profile from user metadata
    const metadata = session.user.user_metadata;
    
    if (!metadata?.username || !metadata?.name) {
      console.error('Missing metadata:', metadata);
      return { success: false, message: 'User metadata is incomplete. Please sign up again.' };
    }

    console.log('Creating profile with metadata:', metadata);

    const { error: profileError } = await supabase.from('profiles').insert({
      id: session.user.id,
      username: metadata.username,
      name: metadata.name,
      avatar_url: metadata.avatar_url,
    });

    if (profileError) {
      console.error('Profile creation error after verification:', profileError);
      
      if (profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
        return { success: false, message: 'Username is already taken. Please contact support.' };
      }
      
      throw profileError;
    }

    console.log('Profile created successfully');

    // Initialize streak data
    const { error: streakError } = await supabase.from('streaks').insert({
      user_id: session.user.id,
    });

    if (streakError) {
      console.error('Streak initialization error:', streakError);
    }

    const user: User = {
      id: session.user.id,
      email: session.user.email!,
      username: metadata.username,
      name: metadata.name,
      avatarUrl: metadata.avatar_url,
      joinedDate: session.user.created_at,
    };

    return { success: true, user };
  } catch (error: any) {
    console.error('Email verification error:', error);
    return { success: false, message: error.message || 'Email verification failed' };
  }
};
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
