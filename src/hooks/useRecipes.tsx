
import { useState, useEffect } from "react";
import { 
  getRecipes,
  searchRecipesByIngredients,
  filterRecipesByTag,
  subscribeToRecipes,
  incrementSearchCount,
  updateRecipe,
  deleteRecipe
} from "../services/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

export type SortOption = "createdAt" | "title" | "tag";
export type SortOrder = "asc" | "desc";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToRecipes((updatedRecipes) => {
      const sorted = sortRecipes(updatedRecipes, sortBy, sortOrder);
      setRecipes(sorted);
      setFilteredRecipes(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy, sortOrder]);

  const sortRecipes = (recipesToSort: any[], sortField: SortOption, order: SortOrder) => {
    return [...recipesToSort].sort((a, b) => {
      if (sortField === "tag" && a.tags && b.tags) {
        // Sort by first tag alphabetically
        const tagA = a.tags[0] || "";
        const tagB = b.tags[0] || "";
        return order === "asc" 
          ? tagA.localeCompare(tagB) 
          : tagB.localeCompare(tagA);
      } else if (sortField === "title") {
        return order === "asc" 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else {
        // Default: sort by createdAt (date)
        const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
        return order === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
    });
  };

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
      setFilteredRecipes(sortRecipes(results, sortBy, sortOrder));
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
      setFilteredRecipes(sortRecipes(results, sortBy, sortOrder));
    } catch (err: any) {
      setError(err.message);
      console.error("Error filtering recipes by tag:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRecipeItem = async (
    recipeId: string,
    updates: {
      title?: string;
      ingredients?: string[];
      steps?: string[];
      tags?: string[];
    }
  ) => {
    try {
      setLoading(true);
      await updateRecipe(recipeId, updates);
      
      toast({
        title: "Recipe Updated",
        description: "Your recipe has been updated successfully",
        duration: 3000,
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating recipe:", err);
      
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
        duration: 3000,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipeItem = async (recipeId: string) => {
    try {
      setLoading(true);
      await deleteRecipe(recipeId);
      
      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been deleted successfully",
        duration: 3000,
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting recipe:", err);
      
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
        duration: 3000,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isRecipeOwner = (recipe: any) => {
    return user && recipe.userId === user.uid;
  };

  const setSorting = (option: SortOption, order: SortOrder = "desc") => {
    setSortBy(option);
    setSortOrder(order);
  };

  return {
    recipes,
    filteredRecipes,
    loading,
    error,
    sortBy,
    sortOrder,
    searchRecipes,
    filterByTag,
    updateRecipeItem,
    deleteRecipeItem,
    isRecipeOwner,
    setSorting
  };
};
