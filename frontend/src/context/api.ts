const BASE = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return (await res.json()) as T;
}

export type ApiRelic = {
  key: string; name: string; max_supply: number; discovered: number;
  description_pt: string; description_en: string;
  history_pt: string; history_en: string;
  first_collector_name?: string | null;
  remaining?: number;
};

export type ApiRegistry = {
  key: string; name: string; max_supply: number; discovered: number; remaining: number;
};

export type ApiUser = {
  id: string; name: string; city: string; country: string;
  photo_base64?: string | null; invite_code: string;
  influence: number; invites_sent: number; collector_since: string;
};

export type ApiDiscoverResponse = {
  discovery: {
    id: string; user_id: string; relic_key: string; relic_name: string;
    serial_number: number; city: string; country: string; discovered_at: string;
  };
  relic: ApiRegistry;
  is_first_collector: boolean;
};

export type ApiCollectionItem = {
  relic_key: string; relic_name: string; count: number;
  first_serial: number; latest_discovered_at: string;
};

export const api = {
  listRelics: () => request<ApiRelic[]>('/relics'),
  registry: () => request<ApiRegistry[]>('/registry'),
  relicDetail: (k: string) => request<ApiRelic>(`/relics/${k}`),
  createUser: (b: { name: string; city: string; country: string; photo_base64?: string | null }) =>
    request<ApiUser>('/users', { method: 'POST', body: JSON.stringify(b) }),
  getUser: (id: string) => request<ApiUser>(`/users/${id}`),
  discover: (userId: string) =>
    request<ApiDiscoverResponse>('/discover', { method: 'POST', body: JSON.stringify({ user_id: userId }) }),
  collection: (userId: string) => request<ApiCollectionItem[]>(`/users/${userId}/collection`),
  rarest: (userId: string) =>
    request<{ relic_key: string; relic_name: string; serial_number: number; discovered_at: string } | null>(
      `/users/${userId}/rarest`
    ),
  stats: (userId: string) =>
    request<{ total_relics: number; influence: number; invites_sent: number; invite_code: string; collector_since: string }>(
      `/users/${userId}/stats`
    ),
};
