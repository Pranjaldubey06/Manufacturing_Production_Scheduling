import { useState, useEffect } from "react";
import { Search, Ruler, Plus, Trash2, Pencil } from "lucide-react";
import Layout from "../components/Layout";
import { unitAPI } from "../api/UnitApi";

const Units = () => {
  const [showModal, setShowModal] = useState(false);
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    name: "",
    symbol: "",
    description: "",
  });

  const fetchUnits = async () => {
    try {
      const data = await unitAPI.getAll();
      setUnits(data);
    } catch (err) {
      console.error(err);
    }
  };

 const filteredUnits = units.filter((u) =>
  u.name?.toLowerCase().includes(search.toLowerCase()) ||
  u.symbol?.toLowerCase().includes(search.toLowerCase()) ||
  u.description?.toLowerCase().includes(search.toLowerCase())
);

  useEffect(() => {
    fetchUnits();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
const handleAddUnit = async () => {
    try {
      const newUnit = {
        name: formData.name,
        symbol: formData.symbol, // ✅ ADD THIS
        description: formData.description,
      };

      await unitAPI.create(newUnit);

      fetchUnits();
      setFormData({ name: "", symbol: "", description: "" }); // reset
      setShowModal(false);
    } catch (err) {
      alert("Something went wrong while adding unit");
    }
  };

  //update unit

  const handleDelete = async (id) => {
    try {
      await unitAPI.delete(id);
      fetchUnits();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEditClick = (unit) => {
    console.log("Clicked edit:", unit); // 👈 check this
    setEditData(unit);
    setShowEditModal(true);
  };

  const handleUpdateUnit = async () => {
    try {
      if (!editData.name) {
        alert("Unit name is required");
        return;
      }

      const payload = {
        name: editData.name,
        symbol: editData.symbol || "",
        description: editData.description || "",
      };

      await unitAPI.update(editData.id, payload);

      alert("Unit updated successfully");

      setShowEditModal(false);
      fetchUnits(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update unit");
    }
  };

  return (
    <Layout>
      <div className="px-8 mt-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 relative">
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Ruler className="text-blue-500" size={20} />
                Unit Master
              </h2>
              <p className="text-gray-500 text-sm">
                Define measurement units for process technical values
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Unit
            </button>
          </div>

          {/* SEARCH */}
          <div className="mt-4 relative">
            
           <input
  type="text"
  placeholder="Search units.."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-96 px-3 py-2 bg-gray-100 rounded-lg border-gray-200"
/>
          </div>

          {/* LIST OR EMPTY */}
          {units.length === 0 ? (
  // 🔹 No data at all
  <div className="mt-6 border-2 border-dashed rounded-lg p-10 text-center text-gray-400">
    <div className="flex flex-col items-center">
      <Ruler size={32} className="mb-2 opacity-50" />
      <p className="font-medium">No units defined yet</p>
      <p className="text-sm">Add your first measurement unit</p>
    </div>
  </div>
) : filteredUnits.length === 0 ? (
  // 🔹 No search results
  <div className="mt-6 text-center text-gray-400">
    <p className="font-medium">No matching units found</p>
    <p className="text-sm">Try a different search keyword</p>
  </div>
) : (
  // 🔹 Show filtered data
  <div className="mt-6 space-y-3">
    {filteredUnits.map((unit) => (
      <div
        key={unit.id}
        className="grid grid-cols-4 px-4 py-3 border-t items-center text-sm"
      >
        {/* NAME */}
        <span className="font-medium">{unit.name}</span>

        {/* SYMBOL */}
        <span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md">
            {unit.symbol}
          </span>
        </span>

        {/* DESCRIPTION */}
        <span className="text-gray-500">
          {unit.description || "-"}
        </span>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleEditClick(unit)}
            className="text-gray-600 hover:text-black"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => handleDelete(unit.id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    ))}
  </div>
)}

          {/* COUNT */}
          <div className="absolute right-6 top-20 bg-gray-100 px-3 py-1 rounded-full text-xs">
            {units.length} units
          </div>
        </div>
      </div>

      {/* FOOTER */}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-purple-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-md font-semibold">Add New Unit</h2>
            <p className="text-gray-500 text-sm mt-1">
              Create a new measurement unit.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Unit Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., Revolutions Per Minute"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-3 focus:ring-gray-300 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Symbol</label>
                <input
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., RPM"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-3 focus:ring-gray-300 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-3 focus:ring-gray-300 transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUnit}
                className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Edit Unit</h2>
            <p className="text-gray-500 text-sm">
              Update measurement unit details.
            </p>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Unit Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none"
                />
              </div>

              {/* SYMBOL */}
              <div>
                <label className="text-sm font-medium">Symbol</label>
                <input
                  value={editData.symbol}
                  onChange={(e) =>
                    setEditData({ ...editData, symbol: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none"
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
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUnit}
                className="px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
              >
                Update Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Units;
