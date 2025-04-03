
import { useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../hooks/useFavorites";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favoriteRecipes, loading, loadFavoriteRecipes } = useFavorites();

  useEffect(() => {
    loadFavoriteRecipes();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-cookeasy-accent" />
        <h2 className="text-2xl font-bold">Your Favorite Recipes</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No favorites yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Start adding recipes to your favorites by clicking the heart icon on any recipe
          </p>
        </div>
      )}
    </div>
  );
}
