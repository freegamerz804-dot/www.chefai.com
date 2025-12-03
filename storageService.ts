
import { Recipe } from '../types';

const SESSION_KEY = 'chef_ai_current_user_email';

/**
 * Logs the user in by saving their email to the session storage.
 * This persists the login state across reloads/reopens.
 */
export const loginUser = (email: string): void => {
  if (!email) return;
  localStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
};

/**
 * Checks if a user is currently logged in.
 */
export const isUserLoggedIn = (): boolean => {
  return !!localStorage.getItem(SESSION_KEY);
};

/**
 * Gets the current logged-in user's email.
 */
export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

/**
 * Logs the user out.
 */
export const logoutUser = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Saves a recipe for the current user.
 * Data is stored under a key specific to the user's email.
 */
export const saveUserRecipe = (recipe: Recipe): boolean => {
  try {
    const email = getCurrentUserEmail();
    if (!email) {
      console.warn("Cannot save recipe: No user logged in.");
      return false;
    }

    // Create a unique key for this user's recipes
    const key = `chef_ai_recipes_${email}`;
    
    // Get existing recipes
    const existingData = localStorage.getItem(key);
    const recipes: Recipe[] = existingData ? JSON.parse(existingData) : [];
    
    // Check for duplicates (by title)
    const isDuplicate = recipes.some(r => r.title === recipe.title);
    if (isDuplicate) return true; // Already saved, consider it success

    // Add new recipe
    recipes.push(recipe);
    
    // Save back to storage
    localStorage.setItem(key, JSON.stringify(recipes));
    console.log(`[Storage] Recipe saved for ${email}:`, recipe.title);
    return true;
  } catch (error) {
    console.error("Failed to save recipe", error);
    return false;
  }
};

/**
 * Retrieves all saved recipes for the current user.
 */
export const getUserRecipes = (): Recipe[] => {
  try {
    const email = getCurrentUserEmail();
    if (!email) return [];

    const key = `chef_ai_recipes_${email}`;
    const existingData = localStorage.getItem(key);
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error("Failed to get recipes", error);
    return [];
  }
};

/**
 * Submits an app rating for the current user.
 */
export const submitAppRating = (rating: number): boolean => {
  try {
    const email = getCurrentUserEmail() || 'anonymous';
    const key = `chef_ai_ratings`; // Global ratings table simulation
    
    const existingData = localStorage.getItem(key);
    const ratings = existingData ? JSON.parse(existingData) : [];
    
    ratings.push({
      user: email,
      rating,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(key, JSON.stringify(ratings));
    console.log(`[Storage] Rating submitted by ${email}: ${rating}`);
    return true;
  } catch (error) {
    console.error("Failed to submit rating", error);
    return false;
  }
};
