
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addRecipe } from "../services/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddRecipeForm() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !ingredients.trim() || !steps.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const recipeData = {
        title: title.trim(),
        ingredients: ingredients.split(",").map(i => i.trim()).filter(i => i),
        steps: steps.split(",").map(s => s.trim()).filter(s => s),
        tags: tags.split(",").map(t => t.trim().toLowerCase()).filter(t => t),
      };
      
      await addRecipe(recipeData);
      
      toast({
        title: "Recipe Added",
        description: "Your recipe has been added successfully",
        duration: 3000,
      });
      
      // Reset form
      setTitle("");
      setIngredients("");
      setSteps("");
      setTags("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Recipe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ingredients">
              Ingredients (comma separated)
            </Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="steps">
              Steps (comma separated)
            </Label>
            <Textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g., Mix dry ingredients, Add wet ingredients, Bake at 350F for 25 minutes"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags (comma separated)
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., breakfast, quick, vegan"
            />
          </div>
          
          <CardFooter className="px-0 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-cookeasy-primary hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Adding Recipe..." : "Add Recipe"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
