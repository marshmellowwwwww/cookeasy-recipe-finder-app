
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { useRecipes } from "../hooks/useRecipes";

export default function HomePage() {
  const { filteredRecipes, loading, searchRecipes, filterByTag } = useRecipes();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    setIsSearching(true);
    await searchRecipes(searchTerm);
    setIsSearching(false);
  };

  const handleTagFilter = async (tag: string) => {
    setIsSearching(true);
    await filterByTag(tag);
    setIsSearching(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <SearchBar onSearch={handleSearch} onTagFilter={handleTagFilter} />
      
      {loading || isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onTagClick={handleTagFilter} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No recipes found</h3>
          <p className="text-gray-500">
            Try searching with different ingredients or adding a new recipe
          </p>
        </div>
      )}
    </div>
  );
}
