import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthResolved(true);
      }
    };

    initializeAuth();
  }, []);

  const handleRegister = async (payload) => {
    setLoading(true);
    try {
      const data = await registerUser(payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authResolved,
        handleRegister,
        handleLogin,
        handleLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);