import { useState } from "react";
import { useEffect } from "react";
import { processAPI } from "../api/processAPI";
import { Search, Settings, Plus, Pencil, Trash2, Clock } from "lucide-react";
import Layout from "../components/Layout";

const Processes = () => {
  const [processes, setProcesses] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workstationId: 0,
    processTime: "",
    setupTime: "",
    technical: [], // ✅ ADD THIS
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchProcesses();
    fetchWorkstations(); // ✅ ADD THIS
  }, []);

  const fetchProcesses = async () => {
    try {
      const data = await processAPI.getAll();
      setProcesses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkstations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/workstations");
      const data = await res.json();
      setWorkstations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await processAPI.delete(id);
      fetchProcesses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTechChange = (i, field, value) => {
    const updated = [...formData.technical];
    updated[i][field] = value;
    setFormData({ ...formData, technical: updated });
  };

  const addTechRow = () => {
    setFormData({
      ...formData,
      technical: [...formData.technical, { name: "", value: "", unit: "" }],
    });
  };

  const handleAddProcess = async () => {
    try {
      await processAPI.create(formData);
      fetchProcesses();
      setShowModal(false);

      // ✅ MOVE HERE
      setFormData({
        name: "",
        description: "",
        workstationId: "",
        processTime: "",
        setupTime: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProcess = async () => {
    try {
      const payload = {
        name: editData.name,
        description: editData.description,
        workstationId: editData.workstationId,
        processTime: editData.processTime,
        setupTime: editData.setupTime,
      };

      await processAPI.update(editData.id, payload);

      fetchProcesses();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProcesses = processes.filter((p) => {
  const workstationName =
    workstations.find((w) => w.id === p.workstationId)?.name || "";

  return (
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    workstationName.toLowerCase().includes(search.toLowerCase()) ||
    String(p.processTime).includes(search) ||
    String(p.setupTime).includes(search)
  );
});

  return (
    <Layout>
      <div className="px-8 mt-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 border-l-4 border-orange-500">
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Settings className="text-orange-500" size={18} />
                Process Master
              </h2>
              <p className="text-gray-500 text-xs">
                Define individual manufacturing operations and their timings
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-1.5 text-sm rounded-lg flex items-center gap-2"
            >
              <Plus size={14} />
              Add Process
            </button>
          </div>

          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
           <input
  type="text"
  placeholder="Search process..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-96 pl-9 pr-1 py-2 text-sm bg-gray-100 rounded-lg outline-none"
/>
          </div>

          {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  {filteredProcesses.length > 0 ? (
    filteredProcesses.map((p) => {
      const workstationName =
        workstations.find((w) => w.id === p.workstationId)?.name || "Unknown";

      return (
        <div
          key={p.id}
          className="border rounded-xl p-4 relative border-l-4 border-orange-500"
        >
          <Settings
            className="absolute right-4 top-4 text-orange-500"
            size={16}
          />

          <h3 className="font-semibold text-sm">{p.name}</h3>

          <p className="text-xs text-gray-500">{workstationName}</p>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                <Clock size={12} />
                Process Time
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {p.processTime || 0} min
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">⚙ Setup Time</span>
              <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                {p.setupTime || 0} min
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setEditData({
                  ...p,
                  technical: p.technical || [
                    { name: "", value: "", unit: "" },
                  ],
                });
                setShowEditModal(true);
              }}
              className="flex-1 border rounded-lg py-1 text-xs flex items-center justify-center gap-1"
            >
              <Pencil size={12} />
              Edit
            </button>

            <button
              onClick={() => handleDelete(p.id)}
              className="p-2 border rounded-lg text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-sm text-gray-400 col-span-3 text-center">
      No processes found
    </p>
  )}
</div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <p className="text-xs text-gray-500">Page 1 of 8</p>

            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs border rounded-lg text-gray-400">
                ← Previous
              </button>
              <button className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 text-gray-400 text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Add New Process</h2>
            <p className="text-gray-500 text-sm">
              Create a new manufacturing operation with technical parameters.
            </p>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Process Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., CNC Machining"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Detailed description"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>

              {/* WORKSTATION */}
              <div>
                <label className="text-sm font-medium">Workstation</label>
                <select
                  value={formData.workstationId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workstationId: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                >
                  <option value="">Select workstation</option>
                  {workstations.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <input
                  type="number"
                  name="processTime"
                  value={formData.processTime}
                  onChange={handleChange}
                  placeholder="Process Time (min)"
                  className="px-4 py-2.5 bg-gray-100 rounded-xl"
                />

                <input
                  type="number"
                  name="setupTime"
                  value={formData.setupTime}
                  onChange={handleChange}
                  placeholder="Setup Time (min)"
                  className="px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProcess}
                className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Add Process
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400 text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Edit Process</h2>
            <p className="text-gray-500 text-sm">Update the process details.</p>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Process Name</label>
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
                <label className="text-sm font-medium">Description</label>
                <input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>

              {/* WORKSTATION */}
              <div>
                <label className="text-sm font-medium">Workstation</label>
                <select
                  value={editData.workstationId}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      workstationId: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                >
                  {workstations.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <input
                  type="number"
                  value={editData.processTime}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      processTime: Number(e.target.value),
                    })
                  }
                  placeholder="Process Time"
                  className="px-4 py-2.5 bg-gray-100 rounded-xl"
                />

                <input
                  type="number"
                  value={editData.setupTime}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      setupTime: Number(e.target.value),
                    })
                  }
                  placeholder="Setup Time"
                  className="px-4 py-2.5 bg-gray-100 rounded-xl"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProcess}
                className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Update Process
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Processes;
