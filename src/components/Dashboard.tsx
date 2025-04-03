
import { useState, useEffect } from "react";
import { useStats } from "../hooks/useStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { searchCount, loading, refreshStats } = useStats();
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Total number of recipe searches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">User Engagement</CardTitle>
            <BarChart className="h-5 w-5 text-cookeasy-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-cookeasy-primary h-4 rounded-full" 
                    style={{ width: `${Math.min(100, searchCount / 10)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{Math.min(100, searchCount / 10)}%</span>
              </div>
              <p className="text-sm text-gray-500">
                Based on search activity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
