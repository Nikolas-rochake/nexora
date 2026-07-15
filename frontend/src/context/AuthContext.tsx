import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export type Auth = {
  userId: string | null;
  name: string | null;
  city: string | null;
  country: string | null;
  photo: string | null;
  inviteCode: string | null;
  collectorSince: string | null;
  loaded: boolean;
  signIn: (data: { name: string; city: string; country: string; photo?: string | null }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<Auth>({
  userId: null, name: null, city: null, country: null, photo: null, inviteCode: null,
  collectorSince: null, loaded: false,
  signIn: async () => {}, signOut: async () => {}, refresh: async () => {},
});

const KEY = 'nexora_user_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    userId: null as string | null,
    name: null as string | null,
    city: null as string | null,
    country: null as string | null,
    photo: null as string | null,
    inviteCode: null as string | null,
    collectorSince: null as string | null,
    loaded: false,
  });

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setState((s) => ({ ...s, ...parsed, loaded: true }));
          return;
        } catch {}
      }
      setState((s) => ({ ...s, loaded: true }));
    });
  }, []);

  const persist = async (next: Partial<typeof state>) => {
    const merged = { ...state, ...next };
    setState(merged);
    const { loaded, ...rest } = merged;
    await AsyncStorage.setItem(KEY, JSON.stringify(rest));
  };

  const signIn: Auth['signIn'] = async ({ name, city, country, photo }) => {
    const user = await api.createUser({ name, city, country, photo_base64: photo ?? null });
    await persist({
      userId: user.id,
      name: user.name,
      city: user.city,
      country: user.country,
      photo: user.photo_base64 ?? null,
      inviteCode: user.invite_code,
      collectorSince: user.collector_since,
    });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(KEY);
    setState({
      userId: null, name: null, city: null, country: null, photo: null,
      inviteCode: null, collectorSince: null, loaded: true,
    });
  };

  const refresh = async () => {
    if (!state.userId) return;
    try {
      const u = await api.getUser(state.userId);
      await persist({
        name: u.name, city: u.city, country: u.country,
        photo: u.photo_base64 ?? null, inviteCode: u.invite_code,
        collectorSince: u.collector_since,
      });
    } catch {}
  };

  const value = useMemo<Auth>(() => ({ ...state, signIn, signOut, refresh }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
