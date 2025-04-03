
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { useRecipes, SortOption, SortOrder } from "../hooks/useRecipes";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Calendar, Tag } from "lucide-react";

export default function HomePage() {
  const { 
    filteredRecipes, 
    loading, 
    searchRecipes, 
    filterByTag, 
    sortBy, 
    sortOrder,
    setSorting 
  } = useRecipes();
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

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortOption, SortOrder];
    setSorting(field, order);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchBar onSearch={handleSearch} onTagFilter={handleTagFilter} />
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select 
            onValueChange={handleSortChange}
            defaultValue={`${sortBy}-${sortOrder}`}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Newest first
                </span>
              </SelectItem>
              <SelectItem value="createdAt-asc">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Oldest first
                </span>
              </SelectItem>
              <SelectItem value="title-asc">
                <span className="flex items-center gap-2">
                  A to Z
                </span>
              </SelectItem>
              <SelectItem value="title-desc">
                <span className="flex items-center gap-2">
                  Z to A
                </span>
              </SelectItem>
              <SelectItem value="tag-asc">
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  By tag (A-Z)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
