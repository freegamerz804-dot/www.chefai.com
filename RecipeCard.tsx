
import React from 'react';
import { Recipe } from '../types';
import { Clock, BarChart, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/40 animate-fade-in transition-all duration-500">
      
      {/* Header Section */}
      <div className="bg-white/30 p-6 border-b border-white/30 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {recipe.title}
        </h2>
        <p className="text-slate-800 italic text-sm font-medium">
          {recipe.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-900 font-semibold">
          <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full shadow-sm">
            <Clock size={16} className="text-orange-700" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full shadow-sm">
            <BarChart size={16} className="text-teal-700" />
            <span>{recipe.difficulty}</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full shadow-sm">
              <Flame size={16} className="text-red-600" />
              <span>{recipe.calories}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Ingredients Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-teal-500 pl-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start text-slate-900 font-medium">
                <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-orange-500 pl-3">
            Instructions
          </h3>
          <ol className="space-y-4">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-4 text-slate-900 font-medium">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/60 text-slate-900 font-bold text-xs flex items-center justify-center mt-0.5 border border-white/40 shadow-sm">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
