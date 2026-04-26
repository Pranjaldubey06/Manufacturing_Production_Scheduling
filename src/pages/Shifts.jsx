import { useState, useEffect } from "react";
import { shiftAPI } from "../api/ShiftApi";

import { Search, Clock, Pencil, Trash2, Plus } from "lucide-react";
import Layout from "../components/Layout";

const colorMap = {
  "bg-blue-500": "#3b82f6",
  "bg-purple-500": "#a855f7",
  "bg-pink-500": "#ec4899",
  "bg-orange-500": "#f97316",
  "bg-green-500": "#22c55e",
  "bg-cyan-500": "#06b6d4",
  "bg-slate-500": "#64748b",
  "bg-red-500": "#ef4444",
};

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
 const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    color: "bg-blue-500",
    customColor: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    const data = await shiftAPI.getAll();


    const formatted = data.map((s) => ({
      ...s,
      duration: calculateDuration(s.start, s.end),

      // REMOVE tailwind dependency
      border: "border-gray-300",

      // store hex color separately
      customColor: s.color,
      color: "", // optional (not needed now)
    }));

    setShifts(formatted);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    if (endMinutes < startMinutes) endMinutes += 24 * 60;

    const diff = endMinutes - startMinutes;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  //   const handleAddShift = () => {
  //     if (!formData.name || !formData.start || !formData.end) return;

  //     const newShift = {
  //       id: Date.now(),
  //       ...formData,
  //       duration: calculateDuration(formData.start, formData.end),
  //      border: formData.color
  //   ? formData.color.replace("bg", "border")
  //   : "border-gray-400",
  //     };

  //     setShifts([...shifts, newShift]);
  //     setFormData({
  //   name: "",
  //   start: "",
  //   end: "",
  //   color: "bg-blue-500",
  //   customColor: "",
  // });

  //     setShowModal(false);
  //   };

  //   const handleUpdateShift = () => {
  //   const updated = shifts.map((s) =>
  //     s.id === editData.id
  //       ? {
  //           ...editData,
  //           duration: calculateDuration(editData.start, editData.end),
  //           border: editData.color
  //             ? editData.color.replace("bg", "border")
  //             : "border-gray-400",
  //         }
  //       : s
  //   );

  //   setShifts(updated);
  //   setShowEditModal(false);
  // };

  const handleAddShift = async () => {
    if (!formData.name || !formData.start || !formData.end) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        start: formData.start,
        end: formData.end,
        color: formData.customColor || colorMap[formData.color],
      };

      console.log("Sending data:", payload); // DEBUG

      await shiftAPI.create(payload);

      await fetchShifts();

      setFormData({
        name: "",
        start: "",
        end: "",
        color: "bg-blue-500",
        customColor: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Add shift failed:", error);
      alert("Something went wrong while adding shift");
    }
  };

  const handleUpdateShift = async () => {
    const payload = {
      name: editData.name,
      start: editData.start,
      end: editData.end,
      // color: editData.customColor || editData.color,
      color: editData.customColor || colorMap[editData.color],
    };

    await shiftAPI.update(editData.id, payload);

    await fetchShifts();

    setShowEditModal(false);
  };


  const handleDelete = async (id) => {
    await shiftAPI.delete(id);
    await fetchShifts();
  };

 const filteredShifts = shifts.filter((s) =>
  s.name?.toLowerCase().includes(search?.toLowerCase() || "") ||
  s.start?.includes(search) ||
  s.end?.includes(search)
);

  return (
    <Layout>
      <div className="px-8 mt-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 border-l-4 border-blue-600">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="text-blue-500" size={20} />
                Shift Master
              </h2>
              <p className="text-gray-500 text-sm">
                Define shift timings and working hours
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Shift
            </button>
          </div>

          {/* SEARCH */}
          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
         <input
  placeholder="Search shifts..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 text-sm outline-none"
/>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Showing {shifts.length} shifts
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-lg">
            {filteredShifts.map((shift) => (
  <div
  key={shift.id}
  className="border rounded-xl p-4 relative border-l-4"
  style={{
    borderLeftColor: shift.customColor || "#3b82f6",

  }}
>
    <div
      className="w-6 h-6 rounded-md absolute right-4 top-4"
      style={{
        backgroundColor: shift.customColor || "#3b82f6",
      }}
    />

    <h3 className="font-semibold text-base">{shift.name}</h3>

    <div className="mt-3 space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span>Start:</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
          {shift.start}
        </span>
      </div>

      <div className="flex justify-between">
        <span>End:</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
          {shift.end}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Duration:</span>
        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
          {shift.duration}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button
        onClick={() => {
          setEditData(shift);
          setShowEditModal(true);
        }}
        className="flex-1 border rounded-lg py-1 text-sm flex items-center justify-center gap-2 font-semibold"
      >
        <Pencil size={12} />
        Edit
      </button>

      <button
        onClick={() => handleDelete(shift.id)}
        className="p-2 border rounded-lg text-red-500 hover:bg-red-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Add New Shift</h2>
            <p className="text-gray-500 text-xs">
              Create a new work shift with timing and color.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium">Shift Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Shift"
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
                <input
                  type="time"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
              </div>

              {/* COLORS */}
              <div>
                <p className="text-xs font-medium mb-2">🎨 Color Code</p>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-orange-500",
                    "bg-green-500",
                    "bg-cyan-500",
                    "bg-slate-500",
                    "bg-red-500",
                  ].map((color, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          color,
                          customColor: "",
                        })
                      }
                      className={`h-10 rounded-lg cursor-pointer border ${
                        formData.color === color
                          ? "border-black"
                          : "border-gray-200"
                      } ${color}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500">Or pick custom:</span>

                  {/* COLOR PREVIEW */}
                  <div
                    className={`w-10 h-6 rounded border ${formData.color}`}
                    style={{
                      backgroundColor: formData.customColor || undefined,
                    }}
                  />

                  {/* COLOR PICKER */}
                  <input
                    type="color"
                    value={formData.customColor || "#3b82f6"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: "",
                        customColor: e.target.value,
                      })
                    }
                    className="w-8 h-6 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddShift}
                className="px-4 py-1.5 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Add Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-5 top-5 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Edit Shift</h2>
            <p className="text-gray-500 text-sm">
              Update shift timing and color code.
            </p>

            <div className="mt-4 space-y-3">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Shift Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={editData.start}
                  onChange={(e) =>
                    setEditData({ ...editData, start: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
                <input
                  type="time"
                  value={editData.end}
                  onChange={(e) =>
                    setEditData({ ...editData, end: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg"
                />
              </div>

              {/* COLORS */}
              <div>
                <p className="text-xs font-medium mb-2">🎨 Color Code</p>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-orange-500",
                    "bg-green-500",
                    "bg-cyan-500",
                    "bg-slate-500",
                    "bg-red-500",
                  ].map((color, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setEditData({
                          ...editData,
                          color,
                          customColor: "",
                        })
                      }
                      className={`h-10 rounded-lg cursor-pointer border ${
                        editData.color === color
                          ? "border-black"
                          : "border-gray-200"
                      } ${color}`}
                    />
                  ))}
                </div>

                {/* CUSTOM */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500">Or pick custom:</span>

                  <div
                    className={`w-10 h-6 rounded border ${editData.color}`}
                    style={{
                      backgroundColor: editData.customColor || undefined,
                    }}
                  />

                  <input
                    type="color"
                    value={editData.customColor || "#3b82f6"}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        color: "",
                        customColor: e.target.value,
                      })
                    }
                    className="w-8 h-6 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateShift}
                className="px-4 py-1.5 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Update Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Shifts;
