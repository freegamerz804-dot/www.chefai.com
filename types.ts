
export enum AppView {
  SPLASH = 'SPLASH',
  SIGNIN = 'SIGNIN',
  HOME = 'HOME',
  CHAT = 'CHAT',
  VISION = 'VISION',
  SAVED = 'SAVED'
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  calories?: string;
}

export interface FoodItem {
  name: string;
  calories: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
