const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

export const postDate = async (path, data) => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return await response.json();
};
