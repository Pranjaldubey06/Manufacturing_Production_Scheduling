import { useState, useEffect } from "react";
import { Search, Settings, Plus, Pencil, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import { workstationAPI } from "../api/WorkstationApi";
import { shiftAPI } from "../api/ShiftApi";

const Workstations = () => {
  const [workstations, setWorkstations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignments: [{ shiftId: "", startDate: "", endDate: "" }],
  });

  const [editData, setEditData] = useState(null);

  const fetchWorkstations = async () => {
    const data = await workstationAPI.getAll();
    setWorkstations(data);
  };
  useEffect(() => {
    fetchWorkstations();
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    const data = await shiftAPI.getAll();
    setShifts(data);
  };

  const getShiftColor = (shift) => {
    if (shift === "Morning Shift") return "bg-blue-100 text-blue-600";
    if (shift === "Evening Shift") return "bg-purple-100 text-purple-600";
    if (shift === "Night Shift") return "bg-gray-200 text-gray-700";
  };

  const handleAddWorkstation = async () => {
    try {
      // ✅ validation
      if (!formData.name) {
        alert("Workstation name is required");
        return;
      }

      for (let a of formData.assignments) {
        if (!a.shiftId || !a.startDate || !a.endDate) {
          alert("Please fill all assignment fields");
          return;
        }
      }

      console.log("Sending:", formData); // DEBUG

      await workstationAPI.create(formData);

      setShowModal(false);
      fetchWorkstations();

      setFormData({
        name: "",
        description: "",
        assignments: [{ shiftId: "", startDate: "", endDate: "" }],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add workstation");
    }
  };

  const handleDelete = async (id) => {
    await workstationAPI.delete(id);
    fetchWorkstations();
  };

  //   const handleUpdateWorkstation = () => {
  //   const updated = workstations.map((w) =>
  //     w.id === editData.id
  //       ? {
  //           ...w,
  //           name: editData.name,
  //         }
  //       : w
  //   );

  //   setWorkstations(updated);
  //   setShowEditModal(false);
  // };

  const handleUpdateWorkstation = async () => {
    try {
      await workstationAPI.update(editData.id, editData);

      setShowEditModal(false);
      fetchWorkstations();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleAssignmentChange = (index, field, value) => {
  //   const updated = [...formData.assignments];
  //   updated[index][field] = value;
  //   setFormData({ ...formData, assignments: updated });
  // };

  // const addAssignment = () => {
  //   setFormData({
  //     ...formData,
  //     assignments: [...formData.assignments, { shift: "", startDate: "", endDate: "" }],
  //   });
  // };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...formData.assignments];
    updated[index][field] = value;
    setFormData({ ...formData, assignments: updated });
  };

  const addAssignment = () => {
    setFormData({
      ...formData,
      assignments: [
        ...formData.assignments,
        { shiftId: "", startDate: "", endDate: "" },
      ],
    });
  };

  const filteredWorkstations = workstations.filter((ws) =>
  ws.name?.toLowerCase().includes(search.toLowerCase()) ||
  ws.description?.toLowerCase().includes(search.toLowerCase()) ||
  ws.assignments?.some((a) =>
    String(a.shiftId).includes(search)
  )
);

  return (
    <Layout>
      <div className="px-8 mt-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Settings className="text-purple-600" size={18} />
                Workstation Master
              </h2>
              <p className="text-gray-500 text-xs">
                Manage machines and work centers with shift schedules
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-sm rounded-lg flex items-center gap-2"
            >
              <Plus size={14} />
              Add Workstation
            </button>
          </div>

          {/* SEARCH */}
          <div className="flex justify-between items-center mt-4">
            <div className="relative w-1/3">
              <Search
                className="absolute left-3 top-2 text-gray-400"
                size={14}
              />
             <input
  placeholder="Search workstations..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg bg-gray-100 outline-none"
/>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Page size:</span>
              <select className="bg-gray-100 px-2 py-1 rounded-md outline-none text-xs">
                <option>6</option>
                <option>12</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Showing {workstations.length} of 44 workstations
          </p>

          {/* CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  {filteredWorkstations.map((ws) => (
    <div
      key={ws.id}
      className="border rounded-xl p-4 relative border-l-4 border-purple-500"
    >
      <Settings
        className="absolute right-4 top-4 text-purple-500"
        size={16}
      />

      <h3 className="font-semibold text-sm">{ws.name}</h3>

      <p className="text-xs text-gray-500 mt-1">
        🗓 {ws.assignments?.length || 0} shift assignments
      </p>

      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1">
          Active Shifts Today
        </p>

        <div className="flex flex-wrap gap-2">
          {ws.assignments?.length > 0 ? (
            ws.assignments.map((a, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600"
              >
                ⏱ Shift ID: {a.shiftId}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">
              No shifts assigned
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            setEditData({
              ...ws,
              assignments: ws.assignments || [
                { shiftId: "", startDate: "", endDate: "" },
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
          onClick={() => handleDelete(ws.id)}
          className="p-2 border rounded-lg text-red-500 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  ))}
</div>

          {/* PAGINATION */}
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-5 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 text-sm"
            >
              ✕
            </button>

            <h2 className="text-base font-semibold">Add New Workstation</h2>
            <p className="text-gray-500 text-xs">
              Create a new workstation and assign shifts with date ranges.
            </p>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-medium">Workstation Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., CNC Machine 1"
                  className="w-full mt-1 px-3 py-1.5 text-sm bg-gray-100 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., High precision CNC machine"
                  className="w-full mt-1 px-3 py-1.5 text-sm bg-gray-100 rounded-lg outline-none"
                />
              </div>

              {/* SHIFT ASSIGNMENTS */}
              <div>
                <p className="text-sm font-semibold">Shift Assignments</p>

                <div className="border-2 border-dashed rounded-xl p-4 mt-3 space-y-4">
                  {formData.assignments.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                      {/* SHIFT */}
                      <select
                        value={item.shiftId || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          handleAssignmentChange(i, "shiftId", value);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                      >
                        <option value="">Select shift</option>

                        {shifts.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.name}
                          </option>
                        ))}
                      </select>
                      {/* START DATE */}
                      <input
                        type="date"
                        value={item.startDate}
                        onChange={(e) =>
                          handleAssignmentChange(i, "startDate", e.target.value)
                        }
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* END DATE */}
                      <input
                        type="date"
                        value={item.endDate}
                        onChange={(e) =>
                          handleAssignmentChange(i, "endDate", e.target.value)
                        }
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  {/* ADD BUTTON */}
                  <button
                    onClick={addAssignment}
                    className="w-full border rounded-lg py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                  >
                    <Plus size={16} />
                    Add Shift Assignment
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleAddWorkstation}
                className="px-6 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Add Workstation
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
              className="absolute right-5 top-5 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Edit Workstation</h2>
            <p className="text-gray-500 text-sm">
              Update workstation name and shift assignments.
            </p>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Workstation Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none"
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
                  placeholder="e.g., High precision CNC machine for metal parts"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-100 rounded-xl outline-none"
                />
              </div>

              {/* SHIFT ASSIGNMENTS */}
              <div>
                <p className="text-sm font-medium">Shift Assignments</p>

                <div className="border-2 border-dashed rounded-xl p-4 mt-2 space-y-3">
                  {editData.assignments.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3">
                      <select
                        value={item.shiftId}
                        onChange={(e) => {
                          const updated = [...editData.assignments];
                          updated[i].shiftId = Number(e.target.value);
                          setEditData({ ...editData, assignments: updated });
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                      >
                        <option value="">Select shift</option>

                        {shifts.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={item.startDate}
                        onChange={(e) => {
                          const updated = [...editData.assignments];
                          updated[i].startDate = e.target.value;
                          setEditData({ ...editData, assignments: updated });
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                      />

                      <input
                        type="date"
                        value={item.endDate}
                        onChange={(e) => {
                          const updated = [...editData.assignments];
                          updated[i].endDate = e.target.value;
                          setEditData({ ...editData, assignments: updated });
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setEditData({
                        ...editData,
                        assignments: [
                          ...editData.assignments,
                          { shiftId: "", startDate: "", endDate: "" },
                        ],
                      })
                    }
                    className="w-full border rounded-lg py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    Add Shift Assignment
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateWorkstation}
                className="px-5 py-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-pink-600"
              >
                Update Workstation
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Workstations;
