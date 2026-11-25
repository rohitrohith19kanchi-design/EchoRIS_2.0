
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "echoris_token";

// Authentication token helpers
export const saveToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

// Central API request handler
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
  const error = new Error(data.message || "Something went wrong.");
  error.status = response.status;
  throw error;
}

  return data;
};

// Authentication API
export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

// Memory API
export const memoryAPI = {
  getAll: () => apiRequest("/memories"),

  getById: (id) => apiRequest(`/memories/${id}`),

  create: (memory) =>
    apiRequest("/memories", {
      method: "POST",
      body: JSON.stringify(memory),
    }),

  update: (id, memory) =>
    apiRequest(`/memories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(memory),
    }),

  delete: (id) =>
    apiRequest(`/memories/${id}`, {
      method: "DELETE",
    }),
};
