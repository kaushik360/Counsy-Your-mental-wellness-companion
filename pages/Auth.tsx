import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Logo } from '../components/Logo';
import { Mail, Lock, ArrowLeft, User, Check, X, AlertCircle } from 'lucide-react';
import { signUp, signIn, checkUsernameAvailability } from '../services/auth';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form Fields
  const [email, setEmail] = useState(''); // Serves as "identifier" (email or username) in login mode
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  // Validation States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear states when switching modes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setUsernameAvailable(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
  }, [isLogin]);

  // Real-time username availability check (only for registration)
  useEffect(() => {
    if (isLogin || !username || username.length < 3) {
      setUsernameAvailable(null);
      setIsCheckingUser(false);
      return;
    }

    // For now, let's assume all usernames are available to avoid the spinning issue
    setIsCheckingUser(false);
    setUsernameAvailable(true);

    // TODO: Re-enable this once the spinning issue is resolved
    // setIsCheckingUser(true);
    // const timer = setTimeout(async () => {
    //   try {
    //     const available = await checkUsernameAvailability(username);
    //     setUsernameAvailable(available);
    //   } catch (error) {
    //     console.error('Error checking username:', error);
    //     setUsernameAvailable(true);
    //   } finally {
    //     setIsCheckingUser(false);
    //   }
    // }, 500);
    // return () => clearTimeout(timer);
  }, [username, isLogin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Request timed out. Please try again.');
    }, 30000); // 30 second timeout

    try {
      if (isLogin) {
        // Login Logic
        const result = await signIn(email, password);
        clearTimeout(timeoutId);
        
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/home'), 1000);
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        // Registration Logic
        if (!usernameAvailable) {
          clearTimeout(timeoutId);
          setError("Username is not available");
          setIsLoading(false);
          return;
        }

        console.log('Starting signup with:', { email, username, name });
        const result = await signUp(email, password, username, name || username);
        clearTimeout(timeoutId);

        if (result.success) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/home'), 2000);
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative h-full min-h-screen p-8 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Background Blob */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-50 dark:bg-teal-900/20 rounded-br-[100px] pointer-events-none z-0"></div>

        {/* Back Button */}
        <button onClick={() => navigate('/')} className="absolute top-8 left-6 z-20 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
           <ArrowLeft size={20} />
        </button>

        <div className="mt-20 z-10 w-full">
          <div className="mb-4">
            <Logo size={50} showText />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {isLogin ? 'Your journey to peace continues here.' : 'Start your mental wellness journey.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fade-in">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fade-in">
              <Check size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            
            {!isLogin && (
              <>
                 {/* Name Field */}
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-teal-500 transition-colors" size={20} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Username</label>
                       {username && !isCheckingUser && (
                         <span className={`text-xs font-bold ${usernameAvailable ? 'text-teal-500' : 'text-red-500'}`}>
                           {usernameAvailable ? 'Available' : 'Taken'}
                         </span>
                       )}
                    </div>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10 group-focus-within:text-teal-500 transition-colors">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                        placeholder="username"
                        className={`w-full pl-12 pr-10 py-4 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${username && usernameAvailable === false ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        required
                        minLength={3}
                      />
                      {username && (
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                            {isCheckingUser ? (
                              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : usernameAvailable ? (
                              <Check size={18} className="text-teal-500" />
                            ) : (
                              <X size={18} className="text-red-500" />
                            )}
                         </div>
                      )}
                    </div>
                  </div>
              </>
            )}

            {/* Email / Username Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                {isLogin ? "Email Address" : "Email Address"}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-teal-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLogin ? "your@example.com" : "your@example.com"}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-teal-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={(!isLogin && !usernameAvailable) || isLoading}
              className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4 ${
                (!isLogin && !usernameAvailable) || isLoading
                 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                 : 'bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Logging in...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-400 font-medium">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-4 border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-bold rounded-2xl hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
          >
            {isLogin ? 'Create Account' : 'Login Instead'}
          </button>
          
          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;