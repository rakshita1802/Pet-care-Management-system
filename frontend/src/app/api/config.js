export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://pet-care-management-system-cea6.onrender.com";

export async function fetchAuth(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
  }

  return response;
}
