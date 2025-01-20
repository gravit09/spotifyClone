import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
  role: boolean | null;
  isAuthenticated: boolean;
  login: (token: string, role: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        setIsAuthenticated(false);
        setIsLoading(false); // Update loading state
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auth/protected`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API Response:", response.data);
        setRole(response.data.role);
        setIsAuthenticated(response.data.success);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Loading completed
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, role: boolean) => {
    localStorage.setItem("token", token);
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
