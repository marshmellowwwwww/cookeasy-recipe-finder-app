
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onTagFilter: (tag: string) => void;
}

export default function SearchBar({ onSearch, onTagFilter }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  
  const commonTags = ["breakfast", "lunch", "dinner", "dessert", "vegan", "vegetarian", "quick"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleTagClick = (tag: string) => {
    setTagFilter(tag);
    onTagFilter(tag);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search recipes by ingredients (e.g., chicken, rice)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            aria-label="Search for recipes"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-cookeasy-primary hover:bg-green-600 text-white"
        >
          Search
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {commonTags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            className={`text-sm ${
              tagFilter === tag
                ? "bg-cookeasy-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </Button>
        ))}
        {tagFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-gray-500"
            onClick={() => {
              setTagFilter("");
              onTagFilter("");
            }}
          >
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  );
}
