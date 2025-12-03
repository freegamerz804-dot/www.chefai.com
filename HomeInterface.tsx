
import React, { useState } from 'react';
import { generateRecipeFromIngredients } from '../services/geminiService';
import { saveUserRecipe, submitAppRating, logoutUser, getCurrentUserEmail } from '../services/storageService';
import { Recipe, AppView } from '../types';
import RecipeCard from './RecipeCard';
import CustomChefHat from './CustomChefHat';
import { Search, Menu, ArrowLeft, Utensils, Soup, EggFried, Sparkles, Star, Bookmark, Check, LogOut } from 'lucide-react';

interface HomeInterfaceProps {
  setView: (view: AppView) => void;
}

const HomeInterface: React.FC<HomeInterfaceProps> = ({ setView }) => {
  const [ingredients, setIngredients] = useState<string>('');
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setGeneratedRecipe(null);
    setIsRecipeSaved(false);
    try {
      // Default preferences if none specified
      const recipe = await generateRecipeFromIngredients(ingredients, "Delicious and home-cooked style");
      setGeneratedRecipe(recipe);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const resetView = () => {
    setGeneratedRecipe(null);
    setIngredients('');
    setIsRecipeSaved(false);
  };

  const handleNavigation = (view: AppView) => {
    setIsMenuOpen(false);
    setView(view);
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    setView(AppView.SIGNIN);
  };

  const handleSaveRecipe = () => {
    if (generatedRecipe && !isRecipeSaved) {
      const success = saveUserRecipe(generatedRecipe);
      if (success) {
        setIsRecipeSaved(true);
      }
    }
  };

  const handleRating = (rate: number) => {
    if (!isRatingSubmitted) {
      setUserRating(rate);
    }
  };

  const handleSubmitRating = () => {
    if (userRating > 0) {
      const success = submitAppRating(userRating);
      if (success) {
        setIsRatingSubmitted(true);
      }
    }
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
               <button onClick={() => handleNavigation(AppView.HOME)} className="text-left text-lg text-teal-800 font-bold hover:text-teal-900 transition-colors py-1 border-l-4 border-teal-600 pl-2">
                 Create recipe
               </button>
               <button onClick={() => handleNavigation(AppView.VISION)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Recipe with ingredients
               </button>
               <button onClick={() => handleNavigation(AppView.CHAT)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Calorie tracker
               </button>
               <button onClick={() => handleNavigation(AppView.SAVED)} className="text-left text-lg text-slate-900 font-medium hover:text-teal-800 transition-colors py-1">
                 Saved Recipes
               </button>
            </nav>
         </div>

         {/* Profile & Logout Section */}
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

  // If we have a recipe or are loading, show the results view
  if (generatedRecipe || loading) {
    return (
      <div className="h-full w-full bg-gradient-to-b from-teal-200 to-orange-300 relative flex flex-col font-sans">
        <Sidebar />
        
        {/* Header for Result View - Glassmorphic */}
        <div className="bg-white/20 backdrop-blur-md border-b border-white/20 p-4 shadow-sm flex items-center justify-between z-30 sticky top-0">
           <div className="flex items-center gap-4">
             <button onClick={resetView} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
               <ArrowLeft size={24} />
             </button>
             <h2 className="font-bold text-lg text-white drop-shadow-sm">Recipe Result</h2>
           </div>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
           >
             <Menu size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white/20 p-8 rounded-full mb-6 backdrop-blur-md animate-pulse">
                  <CustomChefHat size={48} />
                </div>
                <p className="text-white font-bold text-xl drop-shadow-md">Cooking up something special...</p>
             </div>
          ) : (
             <div className="animate-fade-in-up flex flex-col gap-4">
                <RecipeCard recipe={generatedRecipe!} />
                
                <button 
                  onClick={handleSaveRecipe}
                  disabled={isRecipeSaved}
                  className={`w-full backdrop-blur-xl border border-white/40 font-semibold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isRecipeSaved 
                      ? 'bg-teal-500/80 text-white' 
                      : 'bg-white/40 text-slate-900 hover:bg-white/50 active:scale-[0.98]'
                  }`}
                >
                  {isRecipeSaved ? <Check size={20} /> : <Bookmark size={20} className="text-teal-700" />}
                  {isRecipeSaved ? 'Saved' : 'Save Recipe'}
                </button>
             </div>
          )}
        </div>
      </div>
    );
  }

  // Initial Search View (Restored Design)
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

        {/* Empty placeholder to balance the flex justify-between */}
        <div className="w-8"></div>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20 z-10">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight text-center leading-tight drop-shadow-sm">
          What's in your kitchen
        </h1>
        
        <p className="text-white/90 text-sm mb-6 font-medium">Type a food e.g.</p>

        <div className="w-full max-w-sm relative mb-12">
          <div className="relative group shadow-lg rounded-full">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="biryani"
              className="w-full bg-white rounded-full py-3.5 pl-6 pr-12 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
            />
            <button 
              onClick={handleGenerate}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent text-slate-400 hover:text-teal-500 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Interactive Rating Section */}
        <div className="flex flex-col items-center animate-fade-in bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <p className="text-white font-medium text-sm mb-2 drop-shadow-md">
            {isRatingSubmitted ? "Thank you!" : "Please rate this app"}
          </p>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => handleRating(star)}
                disabled={isRatingSubmitted}
                className="transform transition-transform active:scale-110 focus:outline-none"
              >
                <Star 
                  size={24} 
                  className={`drop-shadow-sm transition-colors duration-200 ${
                    star <= userRating 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-white/40 fill-transparent"
                  }`} 
                />
              </button>
            ))}
          </div>
          
          {userRating > 0 && !isRatingSubmitted && (
             <button 
                onClick={handleSubmitRating}
                className="mt-2 bg-white/90 text-teal-800 text-xs font-bold py-1 px-4 rounded-full shadow-md hover:bg-white transition-colors"
             >
                Submit
             </button>
          )}

          <p className="text-white/80 text-xs drop-shadow-md mt-2">creator shayan</p>
        </div>

      </div>

      {/* Decorative Diamond */}
      <div className="absolute bottom-24 right-6 animate-pulse text-white/60">
        <Sparkles size={24} />
      </div>

    </div>
  );
};

export default HomeInterface;
