import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api';

const STORAGE_KEY = 'wtlmini-dummy-auth';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;

    if (!parsed || !parsed.user || !parsed.token) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeStoredAuth = (auth) => {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
};

const formatUser = (userData) => {
  return {
    id: userData.id || userData._id,
    full_name: userData.fullName || userData.full_name,
    email: userData.email,
    role: userData.role,
  };
};

const createUser = ({ fullName, email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const displayName = fullName?.trim() || normalizedEmail.split('@')[0] || 'Guest User';

  return {
    id: normalizedEmail,
    full_name: displayName,
    email: normalizedEmail,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const user = auth?.user ?? null;
  const token = auth?.token ?? '';

  useEffect(() => {
    writeStoredAuth(auth);
  }, [auth]);

  const signIn = useCallback(async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const nextUser = formatUser(response.data.user);
      const nextToken = response.data.token;

      if (!nextToken) {
        throw new Error('Login response did not include a token');
      }

      setAuth({ user: nextUser, token: nextToken });
      return nextUser;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (userData) => {
    try {
      const response = await apiSignup(userData);
      // We don't automatically sign in here as per user request to redirect to login
      return response.data;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    setAuth(null);
  }, []);

  const getToken = useCallback(() => token, [token]);

  const value = useMemo(
    () => ({
      user,
      isSignedIn: Boolean(user),
      signIn,
      signUp,
      signOut,
      getToken,
    }),
    [user, signIn, signUp, signOut, getToken],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};