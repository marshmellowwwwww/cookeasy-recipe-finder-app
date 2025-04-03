
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  PlusCircle, 
  Heart, 
  BarChart, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import { logoutUser } from "../services/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/add-recipe", icon: PlusCircle, label: "Add Recipe" },
    { path: "/favorites", icon: Heart, label: "Favorites" },
    { path: "/dashboard", icon: BarChart, label: "Dashboard" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-cookeasy-text" />
        ) : (
          <Menu className="h-6 w-6 text-cookeasy-text" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen && window.innerWidth < 768,
            "translate-x-0": window.innerWidth >= 768,
          }
        )}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-cookeasy-primary">CookEasy</h1>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-2 text-base font-medium rounded-lg",
                    location.pathname === item.path
                      ? "bg-cookeasy-primary text-white"
                      : "text-cookeasy-text hover:bg-cookeasy-secondary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className="px-3 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-base font-medium text-cookeasy-text rounded-lg hover:bg-cookeasy-secondary"
            >
              <LogOut className="w-6 h-6 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
