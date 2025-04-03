
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cookeasy-primary"></div>
      </div>
    );
  }

  return user ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default Index;
