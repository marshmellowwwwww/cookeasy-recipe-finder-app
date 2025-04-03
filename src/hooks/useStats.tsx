
import { useState, useEffect } from "react";
import { getSearchCount, getRecipeCount, getFavoriteCount } from "../services/firebase";

export const useStats = () => {
  const [searchCount, setSearchCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const searches = await getSearchCount();
      const recipes = await getRecipeCount();
      const favorites = await getFavoriteCount();
      
      setSearchCount(searches);
      setRecipeCount(recipes);
      setFavoriteCount(favorites);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchCount,
    recipeCount,
    favoriteCount,
    loading,
    error,
    refreshStats: fetchStats
  };
};
