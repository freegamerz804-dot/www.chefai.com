
import React, { useState } from 'react';
import { Utensils, Soup, EggFried, Eye, EyeOff } from 'lucide-react';
import CustomChefHat from './CustomChefHat';
import { loginUser } from '../services/storageService';

interface SignInScreenProps {
  onSignIn: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Save the user's email to maintain the session and recover data
    loginUser(email);
    
    // Simulate sign in delay (loading)
    setTimeout(() => {
        setIsLoading(false);
        onSignIn();
    }, 2000);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-teal-200 to-orange-300 flex flex-col items-center justify-center px-8">
      {/* Background Ghost Icons - Consistent with Splash */}
      <div className="absolute top-1/4 left-10 opacity-10 blur-sm transform -rotate-12 pointer-events-none">
        <Utensils size={120} color="white" />
      </div>
      <div className="absolute bottom-1/3 right-10 opacity-10 blur-sm transform rotate-45 pointer-events-none">
        <Soup size={100} color="white" />
      </div>
      <div className="absolute top-10 right-20 opacity-10 blur-sm transform rotate-12 pointer-events-none">
        <EggFried size={80} color="white" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 blur-sm transform -rotate-45 pointer-events-none">
        <CustomChefHat size={90} className="opacity-100" strokeWidth={1} />
      </div>

      {/* Bokeh effects */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-overlay pointer-events-none"></div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-fade-in-up">
        
        {/* Logo - No Shadow */}
        <div className="relative mb-4">
          <CustomChefHat 
            size={150}
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-4xl font-bold text-white mb-10 tracking-wide drop-shadow-md">
          Chef AI
        </h1>

        <form onSubmit={handleSignIn} className="w-full flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium ml-1 text-shadow-sm">Enter your Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Yougood @gmail.com" 
              className="w-full bg-white rounded-lg px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-teal-400 shadow-lg placeholder:text-slate-400"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium ml-1 text-shadow-sm">Enter Your Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-white rounded-lg px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-teal-400 shadow-lg placeholder:text-slate-400 tracking-widest pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-white/80 text-center mt-1">
            By signing, you agree the app terms and services
          </p>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform mt-2 uppercase tracking-wide text-sm flex items-center justify-center ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02] active:scale-95'}`}
          >
            {isLoading ? (
               <>
                 <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                 Signing In...
               </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;
