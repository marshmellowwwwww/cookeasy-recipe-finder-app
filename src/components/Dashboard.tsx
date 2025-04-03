
import { useStats } from "../hooks/useStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, RefreshCw, Search, Book, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { searchCount, recipeCount, favoriteCount, loading, refreshStats } = useStats();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Engagement Dashboard</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshStats}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Searches</CardTitle>
            <Search className="h-5 w-5 text-cookeasy-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : searchCount}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Total recipe searches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Recipes</CardTitle>
            <Book className="h-5 w-5 text-cookeasy-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : recipeCount}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Recipes in database
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Favorites</CardTitle>
            <Heart className="h-5 w-5 text-cookeasy-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : favoriteCount}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Recipes added to favorites
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">User Engagement</CardTitle>
            <BarChart className="h-5 w-5 text-cookeasy-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Searches</span>
                  <span className="text-sm text-gray-500">{searchCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cookeasy-primary h-2 rounded-full" 
                    style={{ width: `${Math.min(100, searchCount / 10)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Recipes</span>
                  <span className="text-sm text-gray-500">{recipeCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, recipeCount * 2)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Favorites</span>
                  <span className="text-sm text-gray-500">{favoriteCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cookeasy-accent h-2 rounded-full" 
                    style={{ width: `${Math.min(100, favoriteCount * 2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
