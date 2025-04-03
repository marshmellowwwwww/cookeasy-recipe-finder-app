
import { Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
  };
  onTagClick?: (tag: string) => void;
}

export default function RecipeCard({ recipe, onTagClick }: RecipeCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(recipe.id);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-2">{recipe.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-cookeasy-accent"
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${favorite ? "fill-cookeasy-accent text-cookeasy-accent" : ""}`} 
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-1">Ingredients:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="line-clamp-1">{ingredient}</li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-gray-400">+{recipe.ingredients.length - 3} more</li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-1">
        {recipe.tags.map((tag) => (
          <Badge 
            key={tag}
            variant="outline" 
            className="bg-cookeasy-secondary hover:bg-gray-200 cursor-pointer"
            onClick={(e) => handleTagClick(e, tag)}
          >
            #{tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
