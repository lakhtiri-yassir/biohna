"use client";

import { createContext, useContext } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

const AuthContext = createContext(null);

// Internal component that uses NextAuth hooks
function AuthProviderInner({ children }) {
  const { data: session, status, update } = useSession();

  function login(emailOrRole, password) {
    // If called with email and password (real login)
    if (typeof emailOrRole === 'string' && password) {
      return signIn('credentials', { 
        email: emailOrRole, 
        password,
        redirect: false 
      });
    }
    
    // Legacy support: if called with just role, redirect to login
    // This maintains compatibility during transition
    window.location.href = '/login';
    return Promise.resolve();
  }

  function logout() {
    return signOut({ redirect: false });
  }

  async function updateProfile(partial) {
    if (!session?.user) return;
    
    try {
      // Update user profile via API
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial)
      });

      if (response.ok) {
        // Trigger session refresh to get updated data
        await update();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  async function updateAvatar(base64) {
    return updateProfile({ avatar: base64 });
  }

  async function updateBanner(base64) {
    return updateProfile({ bannerUrl: base64 });
  }

  async function updateSettings(partialSettings) {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/users/me/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialSettings)
      });

      if (response.ok) {
        await update();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }

  // Transform NextAuth session to match expected format
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    firstName: session.user.fullName?.split(' ')[0] || '',
    lastName: session.user.fullName?.split(' ').slice(1).join(' ') || '',
    role: session.user.role,
    avatar: session.user.avatar,
    avatarUrl: session.user.avatar, // alias for compatibility
    bannerUrl: session.user.bannerUrl || null,
    initials: session.user.fullName ? 
      session.user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
      '??',
    settings: session.user.settings || {
      language: 'fr',
      currency: 'MAD',
      notifications: {
        email: true,
        push: false,
        marketing: false
      },
      privacy: {
        profilePublic: false,
        showEmail: false,
        showPhone: false
      }
    }
  } : null;

  const isAuthenticated = status === 'authenticated' && !!session?.user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        updateAvatar,
        updateBanner,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Main provider that wraps SessionProvider
export function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export const useAuth = () => useContext(AuthContext);