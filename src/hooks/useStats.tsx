
import { useState, useEffect } from "react";
import { getSearchCount } from "../services/firebase";

export const useStats = () => {
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const count = await getSearchCount();
      setSearchCount(count);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchCount,
    loading,
    error,
    refreshStats: fetchStats
  };
};
