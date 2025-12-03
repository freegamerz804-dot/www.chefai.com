
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, FoodItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRecipeFromIngredients = async (ingredients: string, preferences: string): Promise<Recipe | null> => {
  try {
    const ai = getClient();
    const prompt = `Create a delicious recipe using these ingredients: ${ingredients}. 
    
    CRITICAL INSTRUCTION 1: The user input might be in 'Roman English', 'Roman Urdu', or 'Hinglish'. You MUST accurately interpret colloquial South Asian terms into standard English ingredients (e.g., 'kawa' -> Green Tea or Coffee depending on context, 'aloo' -> Potato, 'doodh' -> Milk, 'cheeni' -> Sugar).

    CRITICAL INSTRUCTION 2: For the Recipe Title and every ingredient listed, you MUST provide the English name followed by its common Roman Urdu/Hindi name in parentheses. 
    Examples: 
    - Ingredient: "1 tsp Turmeric Powder (Haldi)"
    - Ingredient: "2 medium Onions (Pyaaz)"
    - Title: "Spicy Potato Curry (Aloo Curry)"
    
    Preferences: ${preferences}. 
    Return the result strictly as a JSON object with the following schema:
    title (string), description (string), ingredients (array of strings with amounts), instructions (array of strings), cookingTime (string), difficulty (string), calories (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            instructions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            cookingTime: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            calories: { type: Type.STRING }
          },
          required: ["title", "description", "ingredients", "instructions", "cookingTime", "difficulty"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};

export const chatWithChef = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const ai = getClient();
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are Chef AI, a world-renowned culinary expert with a friendly, encouraging personality. You understand 'Roman English', 'Roman Urdu', and 'Hinglish' perfectly. If users type in these dialects (e.g., 'kawa', 'khana', 'banao'), interpret them correctly and respond helpfully in English (or Roman English if requested). Keep answers concise."
      },
      history: history
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I'm having trouble thinking of a response right now, Chef.";
  } catch (error) {
    console.error("Chat error:", error);
    return "My kitchen is a bit chaotic right now. Can you ask that again?";
  }
};

export const analyzeFoodImage = async (base64Image: string, promptText: string = "Identify this dish and suggest a brief recipe idea."): Promise<string> => {
  try {
    const ai = getClient();
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg" 
            }
          },
          {
            text: promptText
          }
        ]
      }
    });

    return response.text || "I couldn't quite make out what that delicious looking thing is.";
  } catch (error) {
    console.error("Vision error:", error);
    return "I'm having trouble seeing the image clearly. Please try again.";
  }
};

export const analyzeImageForCalories = async (base64Image: string): Promise<FoodItem[]> => {
  try {
    const ai = getClient();
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Identify the food items in this image with high accuracy. 
    
    CRITICAL INSTRUCTION: ESTIMATE CALORIES GENEROUSLY AND REALISTICALLY. 
    Most simple estimates undercount. You must account for:
    1. Rich preparation methods (assume restaurant-style with oil, butter, ghee, or heavy sauces unless clearly steamed/raw).
    2. Generous portion sizes (e.g., a full bowl of curry is likely 2-3 servings worth of oil/fat).
    3. Hidden calories in dressings, marinades, and frying.
    
    Example benchmarks: 
    - A standard restaurant Burger + Fries is ~1000-1200 kcal.
    - A plate of Biryani is ~800-1000 kcal.
    - A slice of pizza is ~300-400 kcal.
    
    If the image shows a full meal, the total calories across items should reflect a realistic full meal count (often 700-1200+ kcal).
    
    Break down complex dishes into their main components (e.g., Burger -> Bun, Patty, Cheese, Sauce). 
    
    Return a JSON object with a property 'items' which is an array of objects. 
    Each object must have:
    - 'name' (string, the food name with estimated quantity e.g., 'Chicken Curry (1 cup)')
    - 'calories' (string, e.g. '350 kcal')
    - 'protein' (string, e.g. '25g')
    - 'carbs' (string, e.g. '15g')
    - 'fat' (string, e.g. '20g')`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg"
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  calories: { type: Type.STRING },
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fat: { type: Type.STRING }
                },
                required: ["name", "calories", "protein", "carbs", "fat"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    const data = JSON.parse(text);
    return data.items || [];
  } catch (error) {
    console.error("Calorie analysis error:", error);
    return [];
  }
};
