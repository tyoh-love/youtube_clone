import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { User, LoginData, RegisterData } from '../services/auth';
import UserService from '../services/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const profile = await UserService.getProfile();
          setUser(profile);
        } catch (error) {
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    const response = await AuthService.login(data);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await AuthService.register(data);
    setUser(response.user);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
