
import React, { useState, useRef } from 'react';
import { analyzeImageForCalories } from '../services/geminiService';
import { AppView, FoodItem } from '../types';
import CustomChefHat from './CustomChefHat';
import { logoutUser, getCurrentUserEmail } from '../services/storageService';
import { Menu, Utensils, Soup, EggFried, Sparkles, Target, Upload, X, LogOut } from 'lucide-react';

interface ChatInterfaceProps {
  setView?: (view: AppView) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ setView }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFoodItems([]); // Clear previous results
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImagePreview(base64String); // Set preview image
        const items = await analyzeImageForCalories(base64String);
        setFoodItems(items);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setFoodItems([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-teal-200 to-orange-300 flex flex-col font-sans">
      
      {/* Sidebar Backdrop */}
      <div 
         className={`fixed inset-0 bg-black/5 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Glassmorphism Sidebar */}
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
               <button onClick={() => handleNavigation(AppView.CHAT)} className="text-left text-lg text-teal-800 font-bold hover:text-teal-900 transition-colors py-1 border-l-4 border-teal-600 pl-2">
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
      <div className="flex-1 flex flex-col items-center px-6 pt-4 z-10 pb-24 overflow-y-auto">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center drop-shadow-sm">
          Calorie Tracker
        </h1>

        {/* Upload Button Area */}
        <div className="w-full max-w-xs mb-8">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
          
          {imagePreview ? (
            <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-lg border border-white/40">
              <img src={imagePreview} alt="Uploaded food" className="w-full h-full object-cover" />
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={triggerFileInput}
              disabled={loading}
              className="w-full bg-white/50 border border-slate-400/30 rounded-lg py-3 px-6 text-slate-900 font-semibold shadow-md flex items-center justify-between hover:bg-white/70 transition-colors active:scale-95"
            >
              <span>{loading ? 'Analyzing...' : 'Upload your food'}</span>
              <Target size={20} className="text-slate-700" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="w-full max-w-sm bg-white/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/30 shadow-sm flex flex-col h-[350px]">
          {/* Table Header */}
          <div className="flex border-b border-slate-300/50 bg-white/20 shrink-0">
            <div className="w-2/3 py-3 px-4 text-left text-slate-800 font-bold border-r border-slate-300/50">
              Nutrient / Item
            </div>
            <div className="w-1/3 py-3 px-2 text-center text-slate-800 font-bold">
              Value
            </div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="bg-white/60 overflow-y-auto flex-1 custom-scrollbar">
             {foodItems.length === 0 && !loading ? (
                // Empty Placeholder Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex border-b border-slate-200/50 h-10">
                    <div className="w-2/3 border-r border-slate-200/50"></div>
                    <div className="w-1/3"></div>
                  </div>
                ))
             ) : loading ? (
                // Loading State inside table
                <div className="flex flex-col items-center justify-center h-full gap-4">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                   <p className="text-slate-600 text-sm font-medium">Calculating macros...</p>
                </div>
             ) : (
                // Data Rows
                foodItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Header Row for Food Item */}
                    <div className="flex border-b border-slate-200/50 bg-teal-50/50 min-h-[40px] items-center">
                      <div className="w-full p-2 pl-4 text-left font-bold text-slate-900 text-sm">
                        {item.name}
                      </div>
                    </div>
                    
                    {/* Calories Row */}
                    <div className="flex border-b border-slate-200/50 min-h-[36px] items-center bg-white/40 hover:bg-white/60 transition-colors">
                       <div className="w-2/3 border-r border-slate-200/50 p-2 pl-8 text-left text-sm font-semibold text-slate-800">
                          Calories
                       </div>
                       <div className="w-1/3 p-2 text-center text-sm font-semibold text-slate-800">
                          {item.calories}
                       </div>
                    </div>

                    {/* Detailed Nutrient Rows */}
                    <div className="flex border-b border-slate-200/50 min-h-[30px] items-center hover:bg-white/30 transition-colors">
                      <div className="w-2/3 border-r border-slate-200/50 p-1 pl-8 text-left text-xs font-medium text-slate-700">
                        Protein
                      </div>
                      <div className="w-1/3 p-1 text-center text-xs text-slate-700">
                        {item.protein || '0g'}
                      </div>
                    </div>

                    <div className="flex border-b border-slate-200/50 min-h-[30px] items-center hover:bg-white/30 transition-colors">
                      <div className="w-2/3 border-r border-slate-200/50 p-1 pl-8 text-left text-xs font-medium text-slate-700">
                        Carbohydrates
                      </div>
                      <div className="w-1/3 p-1 text-center text-xs text-slate-700">
                        {item.carbs || '0g'}
                      </div>
                    </div>

                    <div className="flex border-b border-slate-200/50 min-h-[30px] items-center hover:bg-white/30 transition-colors">
                      <div className="w-2/3 border-r border-slate-200/50 p-1 pl-8 text-left text-xs font-medium text-slate-700">
                        Fats
                      </div>
                      <div className="w-1/3 p-1 text-center text-xs text-slate-700">
                        {item.fat || '0g'}
                      </div>
                    </div>
                  </React.Fragment>
                ))
             )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center animate-fade-in">
           <p className="text-white text-xs drop-shadow-md">Creator Shayan</p>
        </div>

      </div>

      {/* Decorative Diamond */}
      <div className="absolute bottom-24 right-6 animate-pulse text-white/60">
        <Sparkles size={24} />
      </div>

    </div>
  );
};

export default ChatInterface;
