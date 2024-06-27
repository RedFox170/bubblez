const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const apiClient = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    // JWT-Token ungültig oder abgelaufen
    localStorage.clear();
    window.location.href = "/login";
  }

  return response;
};

export default apiClient;
