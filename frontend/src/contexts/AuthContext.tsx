"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = "http://127.0.0.1:8000";
const AUTH_API = `${API_BASE}/api/auth`;

export interface User {
  id?: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  targetRole?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAvatar: (file: File) => Promise<void>;
  updateFullName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Resolves an avatar URL to a full absolute URL.
 * If it's a relative path like /uploads/avatars/xxx.jpg, prepend the API base.
 */
function resolveAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Relative path from backend — prepend API base
  return `${API_BASE}${url}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('majra_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading stored user:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserState = (userData: User) => {
    setUser(userData);
    localStorage.setItem('majra_user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('majra_token', userData.token);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: data.user_id,
          email: data.email,
          fullName: data.full_name || email.split('@')[0],
          avatarUrl: resolveAvatarUrl(data.avatar_url),
          token: data.access_token
        };
        saveUserState(userData);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.detail || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Make sure the backend is running.' };
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });

      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: data.user_id,
          email: data.email,
          fullName: data.full_name || fullName,
          avatarUrl: resolveAvatarUrl(data.avatar_url),
          token: data.access_token
        };
        saveUserState(userData);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.detail || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Make sure the backend is running.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('majra_user');
    localStorage.removeItem('majra_token');
  };

  const updateAvatar = async (file: File) => {
    if (!user) return;

    // Show local preview immediately for instant feedback
    const localUrl = URL.createObjectURL(file);
    const updated = { ...user, avatarUrl: localUrl };
    saveUserState(updated);

    // Upload to backend if we have a token
    const token = user.token || localStorage.getItem('majra_token');
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${AUTH_API}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const serverUrl = resolveAvatarUrl(data.avatar_url);
        // Replace local blob URL with permanent server URL
        const serverUpdated = { ...user, avatarUrl: serverUrl };
        saveUserState(serverUpdated);
        URL.revokeObjectURL(localUrl);
      }
    } catch (e) {
      // Keep local preview even if upload fails
      console.warn('Avatar upload failed, keeping local preview');
    }
  };

  const updateFullName = async (name: string) => {
    if (!user) return;
    const updated = { ...user, fullName: name };
    saveUserState(updated);

    const token = user.token || localStorage.getItem('majra_token');
    if (token) {
      try {
        await fetch(`${AUTH_API}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ full_name: name })
        });
      } catch (e) {
        console.error('Failed to sync name to backend:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateAvatar,
        updateFullName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
