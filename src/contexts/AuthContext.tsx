import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types/auth.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    setUser({
      id: '1',
      email,
      created_at: new Date().toISOString(),
      is_admin: false
    });
  };

  const signUp = async (email: string, password: string) => {
    // Mock sign up
    setUser({
      id: '1',
      email,
      created_at: new Date().toISOString(),
      is_admin: false
    });
  };

  const signOut = async () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 