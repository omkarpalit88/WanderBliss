// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
// --- FIX: Correcting the import path to be relative from the components directory ---
import { supabase } from '../supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      // The onAuthStateChange listener in App.tsx will handle navigation
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      alert('Check your email for the confirmation link!');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    brightYellow: '#FFD43A',
    sunsetOrange: '#FF5841',
    darkText: '#2D3748',
    lightGrayBg: '#F9FAFB',
  };

  return (
    <div style={{ backgroundColor: colors.lightGrayBg }} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.sunsetOrange }}>
            Welcome to WanderBliss
          </h1>
          <p className="text-gray-600 mt-2">Sign in or create an account to continue.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
                  style={{ '--tw-ring-color': colors.sunsetOrange } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2"
                  style={{ '--tw-ring-color': colors.sunsetOrange } as React.CSSProperties}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex-1 text-white py-3 px-4 rounded-lg font-medium transition-all flex justify-center items-center"
                    style={{ backgroundColor: colors.sunsetOrange }}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                </button>
                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={isLoading}
                    className="w-full flex-1 text-darkText py-3 px-4 rounded-lg font-medium transition-all flex justify-center items-center"
                    style={{ backgroundColor: colors.brightYellow }}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
