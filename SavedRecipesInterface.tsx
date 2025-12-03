
import React, { useState, useEffect } from 'react';
import { getUserRecipes, logoutUser, getCurrentUserEmail } from '../services/storageService';
import { AppView, Recipe } from '../types';
import RecipeCard from './RecipeCard';
import CustomChefHat from './CustomChefHat';
import { Menu, Utensils, Soup, EggFried, Sparkles, ArrowLeft, Clock, BarChart, LogOut } from 'lucide-react';

interface SavedRecipesInterfaceProps {
  setView?: (view: AppView) => void;
}

const SavedRecipesInterface: React.FC<SavedRecipesInterfaceProps> = ({ setView }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setRecipes(getUserRecipes());
  }, []);

  const handleNavigation = (view: AppView) => {
    if (setView) {
      setIsMenuOpen(false);
      setView(view);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    if (setView) setView(AppView.SIGNIN);
  };

  // Shared Sidebar Component
  const Sidebar = () => (
    <>
      <div 
         className={`fixed inset-0 bg-black/5 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setIsMenuOpen(false)}
      />
      <div 
         className={`fixed top-0 left-0 h-full w-72 bg-white/30 backdrop-blur-2xl border-r border-white/20 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
         <div className="p-8 pt-12 flex flex-col">
            <h2 className="text-3xl font-bold text-slate-800 mb-10 tracking-tight drop-shadow-sm">Features</h2>
            <nav className="flex flex-col space-y-6">
               <button onClick={() => handleNavigation(AppView.HOME)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Create recipe
               </button>
               <button onClick={() => handleNavigation(AppView.VISION)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Recipe with ingredients
               </button>
               <button onClick={() => handleNavigation(AppView.CHAT)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Calorie tracker
               </button>
               <button onClick={() => handleNavigation(AppView.SAVED)} className="text-left text-lg text-teal-800 font-bold hover:text-teal-900 transition-colors py-1 border-l-4 border-teal-600 pl-2">
                 Saved Recipes
               </button>
            </nav>
         </div>

         {/* Profile & Sign Out Section */}
         <div className="p-6 bg-white/20 border-t border-white/20 mt-auto pb-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
                {(getCurrentUserEmail()?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{getCurrentUserEmail()}</p>
                <p className="text-xs text-slate-600">Profile</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 bg-white/40 border border-white/40 text-red-700 font-bold py-2.5 px-4 rounded-xl shadow-sm hover:bg-white/60 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <LogOut size={18} />
              Sign Out
            </button>
         </div>
      </div>
    </>
  );

  // Detail View
  if (selectedRecipe) {
    return (
      <div className="h-full w-full bg-gradient-to-b from-teal-200 to-orange-300 relative flex flex-col font-sans">
        <Sidebar />
        
        {/* Header for Result View - Glassmorphic */}
        <div className="bg-white/20 backdrop-blur-md border-b border-white/20 p-4 shadow-sm flex items-center justify-between z-30 sticky top-0">
           <div className="flex items-center gap-4">
             <button onClick={() => setSelectedRecipe(null)} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
               <ArrowLeft size={24} />
             </button>
             <h2 className="font-bold text-lg text-white drop-shadow-sm">Recipe Details</h2>
           </div>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
           >
             <Menu size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
           <div className="animate-fade-in-up">
              <RecipeCard recipe={selectedRecipe} />
           </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-teal-200 to-orange-300 flex flex-col font-sans">
      
      <Sidebar />

      {/* Background Ghost Icons */}
      <div className="absolute top-20 left-4 opacity-10 blur-[2px] transform -rotate-12 pointer-events-none">
        <Utensils size={100} color="white" />
      </div>
      <div className="absolute bottom-1/3 right-6 opacity-10 blur-[2px] transform rotate-45 pointer-events-none">
        <Soup size={120} color="white" />
      </div>
      <div className="absolute top-1/4 right-10 opacity-10 blur-[1px] transform rotate-12 pointer-events-none">
        <EggFried size={80} color="white" />
      </div>
      <div className="absolute bottom-24 left-10 opacity-10 blur-[2px] transform -rotate-45 pointer-events-none">
        <CustomChefHat size={90} className="opacity-100" />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative flex items-center justify-between px-6 py-6 z-30 mt-2">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors relative"
        >
          <Menu size={28} />
        </button>
        
        <div className="flex items-center gap-2">
           <CustomChefHat size={32} />
           <span className="text-white font-bold text-xl tracking-wide drop-shadow-sm">Chef AI</span>
        </div>

        <div className="w-8"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pt-4 z-10 pb-24 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center drop-shadow-sm">
          Saved Recipes
        </h1>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-white/80 mt-20">
            <div className="bg-white/20 p-6 rounded-full mb-4">
              <Utensils size={40} className="text-white" />
            </div>
            <p className="text-lg font-medium">No recipes saved yet.</p>
            <p className="text-sm mt-2 opacity-80">Generate and save some tasty dishes!</p>
          </div>
        ) : (
          <div className="grid gap-4 animate-fade-in-up">
            {recipes.map((recipe, index) => (
              <button
                key={index}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white/40 backdrop-blur-md border border-white/30 rounded-xl p-4 text-left shadow-sm hover:bg-white/50 hover:shadow-md transition-all active:scale-[0.99] flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{recipe.title}</h3>
                  <div className="flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full text-xs font-semibold text-teal-800 whitespace-nowrap">
                    <Clock size={12} />
                    {recipe.cookingTime}
                  </div>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2 italic">{recipe.description}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs bg-orange-100/80 text-orange-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <BarChart size={12} />
                      {recipe.difficulty}
                   </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Diamond */}
      <div className="absolute bottom-24 right-6 animate-pulse text-white/60">
        <Sparkles size={24} />
      </div>
    </div>
  );
};

export default SavedRecipesInterface;
