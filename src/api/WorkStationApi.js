const BASE_URL = "http://127.0.0.1:5000/api/workstations";

export const workstationAPI = {
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

    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  delete: async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};