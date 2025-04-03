
import { useState, useEffect } from "react";
import { 
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  subscribeToFavorites,
  incrementFavoriteCount,
  decrementFavoriteCount
} from "../services/firebase";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToFavorites((updatedFavorites) => {
      setFavorites(updatedFavorites);
      setLoading(false);
    });

    loadFavoriteRecipes();

    return () => unsubscribe();
  }, []);

  const loadFavoriteRecipes = async () => {
    try {
      setLoading(true);
      const recipes = await getFavorites();
      setFavoriteRecipes(recipes);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading favorite recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId: string) => {
    try {
      if (favorites.includes(recipeId)) {
        await removeFromFavorites(recipeId);
        await decrementFavoriteCount();
        toast({
          title: "Removed from Favorites",
          description: "Recipe removed from your favorites",
          duration: 3000,
        });
      } else {
        await addToFavorites(recipeId);
        await incrementFavoriteCount();
        toast({
          title: "Added to Favorites",
          description: "Recipe added to your favorites",
          duration: 3000,
        });
      }
      
      // Reload favorite recipes
      await loadFavoriteRecipes();
    } catch (err: any) {
      setError(err.message);
      console.error("Error toggling favorite:", err);
      
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  return {
    favorites,
    favoriteRecipes,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    loadFavoriteRecipes
  };
};
