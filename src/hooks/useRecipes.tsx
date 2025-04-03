
import { useState, useEffect } from "react";
import { 
  getRecipes,
  searchRecipesByIngredients,
  filterRecipesByTag,
  subscribeToRecipes,
  incrementSearchCount
} from "../services/firebase";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRecipes((updatedRecipes) => {
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const searchRecipes = async (searchTerm: string) => {
    try {
      setLoading(true);
      
      // Increment search count for dashboard
      await incrementSearchCount();
      
      if (!searchTerm.trim()) {
        setFilteredRecipes(recipes);
        return;
      }
      
      // Parse search terms into an array of ingredients
      const ingredients = searchTerm
        .split(",")
        .map(term => term.trim())
        .filter(term => term !== "");
      
      const results = await searchRecipesByIngredients(ingredients);
      setFilteredRecipes(results);
    } catch (err: any) {
      setError(err.message);
      console.error("Error searching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterByTag = async (tag: string) => {
    try {
      setLoading(true);
      
      if (!tag.trim()) {
        setFilteredRecipes(recipes);
        return;
      }
      
      const results = await filterRecipesByTag(tag);
      setFilteredRecipes(results);
    } catch (err: any) {
      setError(err.message);
      console.error("Error filtering recipes by tag:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes,
    filteredRecipes,
    loading,
    error,
    searchRecipes,
    filterByTag
  };
};
