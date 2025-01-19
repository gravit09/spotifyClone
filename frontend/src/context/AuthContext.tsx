import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "../types/auth";

interface AuthContextType {
  auth: AuthState;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
  });

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("token", auth.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [auth.token]);

  const login = (token: string, user: User) => {
    setAuth({ user, token });
  };

  const logout = () => {
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
