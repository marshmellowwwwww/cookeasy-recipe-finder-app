
import { useState } from "react";
import { Search, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    if (tagFilter === tag) {
      // If clicking the active tag, clear the filter
      setTagFilter("");
      onTagFilter("");
    } else {
      setTagFilter(tag);
      onTagFilter(tag);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const clearTagFilter = () => {
    setTagFilter("");
    onTagFilter("");
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
            className="pl-10 w-full pr-10"
            aria-label="Search for recipes"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-cookeasy-primary hover:bg-green-600 text-white"
        >
          Search
        </Button>
      </form>
      
      <div>
        <div className="flex items-center mb-2 text-sm text-gray-500">
          <Tag className="h-4 w-4 mr-1" /> Filter by tag:
        </div>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <Badge
              key={tag}
              variant={tagFilter === tag ? "default" : "outline"}
              className={`text-sm cursor-pointer ${
                tagFilter === tag
                  ? "bg-cookeasy-primary hover:bg-green-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {tagFilter === tag && (
                <X className="h-3 w-3 ml-1 text-white" />
              )}
            </Badge>
          ))}
          {tagFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-500 flex items-center gap-1"
              onClick={clearTagFilter}
            >
              <X className="h-3 w-3" /> Clear filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
