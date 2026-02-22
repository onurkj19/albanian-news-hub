const API_BASE = (import.meta.env.VITE_API_URL || "") + "/api";

function getToken(): string | null {
  try {
    const stored = localStorage.getItem("alnn-auth");
    if (stored) {
      const { token } = JSON.parse(stored);
      return token || null;
    }
  } catch { /* empty */ }
  return null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; meta?: unknown }> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }

  return json;
}

// Auth
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: number; email: string; name: string; role: string } }>(
        "/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    profile: () => request<{ id: number; email: string; name: string; role: string }>("/auth/profile"),
  },

  articles: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<unknown[]>(`/articles${qs}`);
    },
    getBySlug: (slug: string) => request<unknown>(`/articles/slug/${slug}`),
    adminList: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<unknown[]>(`/articles/admin${qs}`);
    },
    adminGet: (id: number) => request<unknown>(`/articles/admin/${id}`),
    create: (data: unknown) =>
      request<{ id: number; slug: string }>("/articles", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) =>
      request<{ id: number; slug: string }>(`/articles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/articles/${id}`, { method: "DELETE" }),
    updateStatus: (id: number, status: string) =>
      request(`/articles/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  comments: {
    forArticle: (articleId: number) => request<unknown[]>(`/comments/article/${articleId}`),
    post: (data: unknown) =>
      request("/comments", { method: "POST", body: JSON.stringify(data) }),
    adminList: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<unknown[]>(`/comments/admin${qs}`);
    },
    updateStatus: (id: number, status: string) =>
      request(`/comments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    delete: (id: number) =>
      request(`/comments/${id}`, { method: "DELETE" }),
    like: (id: number) =>
      request(`/comments/${id}/like`, { method: "POST" }),
  },

  media: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request<{ id: number; url: string; filename: string }>("/media/upload", {
        method: "POST",
        body: formData,
      });
    },
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<unknown[]>(`/media${qs}`);
    },
    delete: (id: number) =>
      request(`/media/${id}`, { method: "DELETE" }),
  },

  dashboard: {
    stats: () => request<{
      stats: {
        totalArticles: number; published: number; drafts: number; scheduled: number;
        totalViews: number; totalComments: number; pendingComments: number; totalMedia: number;
      };
      categoryCounts: { name: string; slug: string; count: number }[];
      recentArticles: unknown[];
      topArticles: unknown[];
    }>("/dashboard/stats"),
    categories: () => request<{ id: number; name: string; slug: string; description: string }[]>("/dashboard/categories"),
  },
};
