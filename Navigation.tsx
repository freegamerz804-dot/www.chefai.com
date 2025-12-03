
import React from 'react';
import { AppView } from '../types';
import { Utensils, Flame } from 'lucide-react';
import CustomChefHat from './CustomChefHat';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.HOME, icon: CustomChefHat, label: 'Create' },
    { id: AppView.VISION, icon: Utensils, label: 'Ingredients' },
    { id: AppView.CHAT, icon: Flame, label: 'Calories' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/20 backdrop-blur-md border-t border-white/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Check if active
          const isActive = currentView === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-teal-800' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <IconComponent 
                 size={24} 
                 strokeWidth={isActive ? 2 : 1.5} 
                 // Pass explicit stroke color to ensure visibility against glass background
                 stroke={isActive ? "#115e59" : "#475569"} 
                 fill="none"
              />
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-teal-800 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
