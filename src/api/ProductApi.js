const BASE_URL = "http://127.0.0.1:5000/api/products";

export const productAPI = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed");
    return result;
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed");
    return result;
  },

  delete: async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  },
};