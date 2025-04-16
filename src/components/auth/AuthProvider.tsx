import React, { ReactNode } from 'react';
import { AuthProvider as ContextAuthProvider } from '../../context/AuthContext.js';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ContextAuthProvider>{children}</ContextAuthProvider>;
}

// Re-export the useAuthContext hook from the context
export { useAuthContext } from '../../context/AuthContext.js';