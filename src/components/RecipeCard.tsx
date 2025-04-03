
import { useState } from "react";
import { Heart, Edit, Trash, Tag, Check, X } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { useRecipes } from "../hooks/useRecipes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    userId?: string;
  };
  onTagClick?: (tag: string) => void;
}

export default function RecipeCard({ recipe, onTagClick }: RecipeCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isRecipeOwner, updateRecipeItem, deleteRecipeItem } = useRecipes();
  const favorite = isFavorite(recipe.id);
  const isOwner = isRecipeOwner(recipe);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(", "));
  const [steps, setSteps] = useState(recipe.steps.join(", "));
  const [tags, setTags] = useState(recipe.tags.join(", "));
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    const updatedRecipe = {
      title: title.trim(),
      ingredients: ingredients.split(",").map(i => i.trim()).filter(i => i),
      steps: steps.split(",").map(s => s.trim()).filter(s => s),
      tags: tags.split(",").map(t => t.trim().toLowerCase()).filter(t => t),
    };
    
    const success = await updateRecipeItem(recipe.id, updatedRecipe);
    
    if (success) {
      setEditDialogOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const success = await deleteRecipeItem(recipe.id);
    
    if (success) {
      setDeleteDialogOpen(false);
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <Card className="h-full overflow-hidden hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl line-clamp-2">{recipe.title}</CardTitle>
            <div className="flex items-center gap-1">
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditClick}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Edit recipe"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteClick}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Delete recipe"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
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
              className="bg-cookeasy-secondary hover:bg-gray-200 cursor-pointer flex items-center gap-1"
              onClick={(e) => handleTagClick(e, tag)}
            >
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>

      {/* Edit Recipe Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>
              Make changes to your recipe. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Recipe title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ingredients">Ingredients (comma separated)</Label>
              <Textarea 
                id="edit-ingredients" 
                value={ingredients} 
                onChange={(e) => setIngredients(e.target.value)} 
                placeholder="Ingredient 1, Ingredient 2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-steps">Steps (comma separated)</Label>
              <Textarea 
                id="edit-steps" 
                value={steps} 
                onChange={(e) => setSteps(e.target.value)} 
                placeholder="Step 1, Step 2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input 
                id="edit-tags" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="Tag1, Tag2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEdit}
              disabled={isSubmitting}
              className="bg-cookeasy-primary hover:bg-green-600"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  Saving <span className="animate-spin ml-1">⋯</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4" /> Save Changes
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the recipe from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  Deleting <span className="animate-spin ml-1">⋯</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Trash className="h-4 w-4" /> Delete
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
