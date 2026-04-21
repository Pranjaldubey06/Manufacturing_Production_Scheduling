import React, { useState, useEffect } from "react";
import { Search, Plus, Layers, GitBranch, Pencil, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import { routeAPI } from "../api/RoutesApi";

const Routess = () => {
  const [showModal, setShowModal] = useState(false);
  const [routeType, setRouteType] = useState("main");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
const [filterType, setFilterType] = useState("all"); // all | main | sub

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const data = await routeAPI.getAll();
    setRoutes(data);
  };

  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/processes");
    const data = await res.json();
    setProcesses(data);
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "main",
    steps: [],
  });

  const handleAddStep = () => {
    if (!selectedProcess) return;

    setEditData({
      ...editData,
      steps: [...editData.steps, Number(selectedProcess)],
    });

    setSelectedProcess("");
  };

  const handleAddStepForm = () => {
    if (!selectedProcess) return;

    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, Number(selectedProcess)],
    }));

    setSelectedProcess("");
  };

const handleCreateRoute = async () => {
  try {
    //  VALIDATION (VERY IMPORTANT)
    if (!form.name.trim()) {
      alert("Route name is required");
      return;
    }

    if (form.steps.length === 0) {
      alert("Please add at least one process step");
      return;
    }

    // ✅ API CALL
    await routeAPI.create({
      name: form.name,
      description: form.description,
      type: routeType,
      steps: form.steps, // [1,2,3]
    });

    // ✅ RESET FORM (YOU MISSED THIS)
    setForm({
      name: "",
      description: "",
      type: "main",
      steps: [],
    });

    setSelectedProcess("");

    // ✅ CLOSE MODAL
    setShowModal(false);

    // ✅ REFRESH DATA
    fetchRoutes();

  } catch (err) {
    console.error("Create Route Error:", err);
    alert("Failed to create route");
  }
};


  const handleDelete = async (id) => {
    await routeAPI.delete(id);
    fetchRoutes();
  };

  const handleRemoveStep = (index) => {
    const updated = editData.steps.filter((_, i) => i !== index);
    setEditData({ ...editData, steps: updated });
  };

  const handleUpdateRoute = async () => {
    try {
      await routeAPI.update(editData.id, {
        name: editData.name,
        description: editData.description,
        type: routeType,
        steps: editData.steps,
      });

      setShowEditModal(false);
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  const totalRoutes = routes.length;
const mainRoutes = routes.filter(r => r.type === "main").length;
const subRoutes = routes.filter(r => r.type === "sub").length;

const filteredRoutes = routes.filter((route) => {
  const matchesSearch =
    route.name?.toLowerCase().includes(search.toLowerCase()) ||
    route.description?.toLowerCase().includes(search.toLowerCase()) ||
    route.steps?.some((step) => {
      const process = processes.find((p) => p.id === step);
      return process?.name?.toLowerCase().includes(search.toLowerCase());
    });

  const matchesType =
    filterType === "all" || route.type === filterType;

  return matchesSearch && matchesType;
});

  return (
    <Layout>
      <div className="px-6 mt-6">
        {/* MAIN CARD */}
        <div className="bg-white border rounded-xl p-6 border-l-4 border-purple-500">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <GitBranch className="text-purple-600" size={20} />
                Route Master
              </h2>
              <p className="text-sm text-gray-500">
                Define main routes and sub-routes with process sequences
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg bg-purple-600"
            >
              <Plus size={16} /> Add Route
            </button>
          </div>

          {/* SEARCH + PAGE SIZE */}
          <div className="flex justify-between mt-5">
            <div className="relative w-[40%]">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
             <input
  placeholder="Search routes..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 rounded-lg outline-none"
/>
            </div>

            <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">10</div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-3 mt-4 text-xs">
            <button className="px-3 py-1 rounded-full bg-gray-200">
             All Routes ({totalRoutes})
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-100">
              Main Routes ({mainRoutes})
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-100">
               Sub Routes ({subRoutes})
            </button>
          </div>

          {/* CARDS */}
         <div className="grid grid-cols-2 gap-6 mt-6">
  {filteredRoutes.length > 0 ? (
    filteredRoutes.map((route) => {
      return (
        <div
          key={route.id}
          className="border rounded-xl p-4 border-l-4 border-orange-500 bg-white"
        >
          {/* TITLE */}
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-sm">
                {route.name}
                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                  {route.type === "main" ? "Main" : "Sub"}
                </span>
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {route.description || "No description"}
              </p>
            </div>

            <Layers className="text-orange-500" size={20} />
          </div>

          {/* PROCESS LIST */}
          <div className="mt-4 bg-gray-100 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
            {route.steps?.length > 0 ? (
              route.steps.map((step, i) => {
                const process = processes.find((p) => p.id === step);

                return (
                  <div key={i} className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {i + 1}
                    </span>

                    <div>
                      <p className="text-sm font-medium">
                        {process?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400 uppercase">
                        {process?.description || ""}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No steps added</p>
            )}
          </div>

          {/* SUB ROUTES */}
          <div className="mt-3 text-xs">
            <p className="text-gray-500">Sub-Routes</p>

            {route.subRoutes?.length > 0 ? (
              route.subRoutes.map((sr, i) => (
                <span
                  key={i}
                  className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full"
                >
                  {sr}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No sub-routes</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setEditData({
                  ...route,
                  steps: [...(route.steps || [])],
                });
                setRouteType(route.type);
                setShowEditModal(true);
              }}
              className="flex items-center gap-2 border px-3 py-1 rounded-lg text-xs"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              onClick={() => handleDelete(route.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-sm text-gray-400 col-span-2 text-center">
      No routes found
    </p>
  )}
</div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-5 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-semibold">Add New Route</h2>
            <p className="text-xs text-gray-500">
              Create a new main route or sub-route with a sequence of processes.
            </p>

            {/* FORM */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs">Route Name</label>
               <input
  value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
  placeholder="e.g., Standard 4-Layer PCB Route"
  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
/>

              </div>

              <div>
                <label className="text-xs">Description</label>
               <input
  value={form.description}
  onChange={(e) => setForm({ ...form, description: e.target.value })}
  placeholder="Brief description"
  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
/>
              </div>

              {/* ROUTE TYPE */}
              <div>
                <label className="text-xs">Route Type</label>

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setRouteType("main")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      routeType === "main"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Main Route
                  </button>

                  <button
                    onClick={() => setRouteType("sub")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      routeType === "sub"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Sub Route
                  </button>
                </div>
              </div>

              {/* PROCESS SELECT */}
              <div>
                <label className="text-xs">Process Sequence</label>

                <div className="flex gap-2 mt-1">
                  <select
                    value={selectedProcess}
                    onChange={(e) => setSelectedProcess(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                  >
                    <option value="">Select process</option>
                    {processes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      if (!selectedProcess) return;

                      // setEditData((prev) => ({
                      //   ...prev,
                      //   steps: [...prev.steps, Number(selectedProcess)],
                      // }));

                      handleAddStepForm();
                      setSelectedProcess("");
                    }}
                  >
                    + Add
                  </button>
                </div>

               <div className="mt-3 space-y-2">
  {form.steps.map((step, i) => {
    const process = processes.find((p) => p.id === step);
    return (
      <div key={i} className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm">
        <span className="bg-blue-100 text-blue-600 px-2 rounded text-xs">
          {i + 1}
        </span>
        {process?.name}
      </div>
    );
  })}
</div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRoute}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg"
              >
                Add Route
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto">
            {/* CLOSE */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Edit Route</h2>
            <p className="text-gray-500 text-sm">
              Update the route details and process sequence.
            </p>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Route Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>

              {/* ROUTE TYPE */}
              <div>
                <label className="text-sm font-medium">Route Type</label>

                <div className="flex gap-3 mt-2 items-center">
                  <button
                    onClick={() => setRouteType("main")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      routeType === "main"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Main Route
                  </button>

                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>

                  <button
                    onClick={() => setRouteType("sub")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      routeType === "sub"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Sub Route
                  </button>
                </div>
              </div>

              {/* PROCESS SEQUENCE */}
              <div>
                <label className="text-sm font-medium">Process Sequence</label>

                {/* SELECT + ADD */}
                <div className="flex gap-2 mt-2">
                  <select
                    value={selectedProcess}
                    onChange={(e) => setSelectedProcess(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select process</option>
                    {processes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <button onClick={handleAddStep}>+ Add</button>
                </div>

                {/* STEP LIST */}
                <div className="mt-3 bg-gray-100 rounded-xl p-3 max-h-60 overflow-y-auto space-y-2">
                  <p className="text-xs text-gray-500">
                    {editData.steps.length} Processes in Sequence
                  </p>

                  {editData.steps.map((step, i) => {
                    const process = processes.find((p) => p.id === step);

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-600 px-2 rounded">
                            {i + 1}
                          </span>
                          <p className="font-medium">{process?.name}</p>
                        </div>

                        <button
                          onClick={() => handleRemoveStep(i)}
                          className="text-gray-400 hover:text-black"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateRoute}
                className="px-5 py-2 text-white bg-purple-600 rounded-lg"
              >
                Update Route
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Routess;
