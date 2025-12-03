
import React, { useEffect, useState } from 'react';
import { Utensils, Soup, EggFried } from 'lucide-react';
import CustomChefHat from './CustomChefHat';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const completionTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-teal-200 to-orange-300 flex flex-col items-center justify-center">
      {/* Background Ghost Icons */}
      <div className="absolute top-1/4 left-10 opacity-10 blur-sm transform -rotate-12">
        <Utensils size={120} color="white" />
      </div>
      <div className="absolute bottom-1/3 right-10 opacity-10 blur-sm transform rotate-45">
        <Soup size={100} color="white" />
      </div>
      <div className="absolute top-10 right-20 opacity-10 blur-sm transform rotate-12">
        <EggFried size={80} color="white" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 blur-sm transform -rotate-45">
        <CustomChefHat size={90} className="opacity-100" strokeWidth={1} />
      </div>

      {/* Bokeh effects */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
      <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-yellow-200 opacity-20 rounded-full blur-2xl mix-blend-overlay"></div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        {/* Logo */}
        <div className="relative mb-6">
          {/* Main Logo - No Shadow */}
          <CustomChefHat 
            size={150}
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-5xl font-bold text-white mb-12 tracking-wide drop-shadow-md">
          Chef AI....
        </h1>

        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-orange-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="mt-4 text-xs tracking-widest text-white/90 font-semibold drop-shadow-sm">
          LOADING RECIPES APP...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
