import React, { useState, useEffect } from "react";
import { Search, Plus, Box, Pencil, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import { processAPI } from "../api/ProcessApi";
import { productAPI } from "../api/productAPI";
import { routeAPI } from "../api/RoutesApi";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    routeId: "",
  });

  const [editData, setEditData] = useState(null);

  const fetchProcesses = async () => {
    const data = await processAPI.getAll();
    setProcesses(data);
  };

  const fetchRoutes = async () => {
    const data = await routeAPI.getAll();
    setRoutes(data);
  };

  const fetchProducts = async () => {
    const data = await productAPI.getAll();
    setProducts(data);
  };
  useEffect(() => {
    fetchProducts();
    fetchRoutes();
    fetchProcesses();
  }, []);

  // ✅ CREATE PRODUCT
  const handleCreate = async () => {
    try {
      // ✅ VALIDATION
      if (!form.name.trim()) {
        alert("Product name is required");
        return;
      }

      // routeId can be optional, but if required:
      if (!form.routeId) {
        alert("Please select a route");
        return;
      }

      // ✅ PREPARE CLEAN DATA
      const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || "",
        routeId: Number(form.routeId),
      };

      // ✅ API CALL
      await productAPI.create(payload);

      // ✅ RESET FORM
      setForm({
        name: "",
        description: "",
        routeId: "",
      });

      // ✅ CLOSE MODAL
      setShowModal(false);

      // ✅ REFRESH DATA
      fetchProducts();
    } catch (err) {
      console.error("Create Product Error:", err);
      alert(err?.response?.data?.error || "Failed to create product");
    }
  };

  // ✅ UPDATE PRODUCT
  const handleUpdateProduct = async () => {
    try {
      const payload = {
        name: editData.name.trim(),
        description: editData.description?.trim() || "",
        routeId: editData.routeId ? Number(editData.routeId) : null,
      };

      await productAPI.update(editData.id, payload);

      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      alert(err?.response?.data?.error || "Update failed");
    }
  };


  // ✅ DELETE PRODUCT
  const handleDelete = async (id) => {
    await productAPI.delete(id);
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
  const route = routes.find((r) => r.id === p.routeId);

  const routeName = route?.name || "";

  const processNames =
    route?.steps
      ?.map((stepId) => {
        const pr = processes.find((x) => x.id === stepId);
        return pr?.name || "";
      })
      .join(" ")
      .toLowerCase() || "";

  return (
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    routeName.toLowerCase().includes(search.toLowerCase()) ||
    processNames.includes(search.toLowerCase())
  );
});

  return (
    <Layout>
      <div className="px-6 mt-6">
        {/* CARD */}
        <div className="bg-white border rounded-xl p-6 border-l-4 border-green-500">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Box className="text-green-600" /> Product Master
              </h2>
              <p className="text-sm text-gray-500">
                Define products with main routes
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          {/* SEARCH */}
          <div className="mt-5">
           <input
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-[40%] bg-gray-100 px-3 py-2 rounded"
/>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-5 mt-5 border-b pb-2 text-gray-500 text-sm">
            <span>Name</span>
            <span>Description</span>
            <span>Route</span>
            <span>Steps</span>
            <span className="text-right">Actions</span>
          </div>

          {/* DATA */}
        {filteredProducts.length > 0 ? (
  filteredProducts.map((p) => {
    const route = routes.find((r) => Number(r.id) === Number(p.routeId));
    const steps = route?.steps || [];

    return (
      <div key={p.id} className="grid grid-cols-5 py-4 border-b text-sm">
        {/* NAME */}
        <span>{p.name}</span>

        {/* DESCRIPTION */}
        <span>{p.description || "—"}</span>

        {/* ROUTE */}
        <span className="text-gray-500">
          {route?.name || "No route"}
        </span>

        {/* STEPS */}
        <div className="flex flex-wrap gap-2">
          {steps.slice(0, 3).map((stepId, i) => {
            const process = processes.find((pr) => pr.id === stepId);

            return (
              <span
                key={i}
                className={`px-2 py-1 rounded-full text-xs ${
                  i === 0
                    ? "bg-blue-100 text-blue-600"
                    : i === 1
                    ? "bg-purple-100 text-purple-600"
                    : "bg-pink-100 text-pink-600"
                }`}
              >
                {i + 1}. {process?.name || "Unknown"}
              </span>
            );
          })}

          {steps.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              +{steps.length - 3} more
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Pencil
            onClick={() => {
              setEditData({ ...p });
              setShowEditModal(true);
            }}
            className="cursor-pointer"
            size={16}
          />

          <Trash2
            onClick={() => handleDelete(p.id)}
            className="text-red-500 cursor-pointer"
            size={16}
          />
        </div>
      </div>
    );
  })
) : (
  <p className="col-span-5 text-center text-gray-400 py-6">
    No products found
  </p>
)}
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 text-gray-400 text-xl"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-semibold">Add New Product</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new product with routing configuration.
            </p>

            {/* FORM */}
            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Standard PCB"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product description"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none"
                />
              </div>

              {/* ROUTE */}
              <div>
                <label className="text-sm font-medium">Main Route</label>
                <select
                  value={form.routeId}
                  onChange={(e) =>
                    setForm({ ...form, routeId: Number(e.target.value) })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                >
                  <option value="">Select route</option>

                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400 text-xl"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-semibold">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update product details and routing configuration.
            </p>

            {/* FORM */}
            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
              </div>

              {/* ROUTE */}
              <div>
                <label className="text-sm font-medium">Main Route</label>
                <select
                  value={editData.routeId || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      routeId: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                >
                  <option value="">No route</option>

                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
