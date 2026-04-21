const BASE_URL = "http://127.0.0.1:5000/api/units";

export const unitAPI = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(result);
      throw new Error(result.message || "Failed to add unit");
    }

    return result;
  },

 update: async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error(result);
    throw new Error(result.message || "Failed to update unit");
  }

  return result;
},

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete unit");
    }
  },
};