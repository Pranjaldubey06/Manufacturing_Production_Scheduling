import { Routes, Route, Navigate } from "react-router-dom";
import Units from "./pages/Unit";
import Shifts from "./pages/Shifts";
import Workstations from "./pages/Workstations";
import Processes from "./pages/Processes"
import Routess from "./pages/Routess"
import Products from "./pages/Products"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/units" />} />
      <Route path="/units" element={<Units />} />
      <Route path="/shifts" element={<Shifts />} />
      <Route path="/workstations" element={<Workstations />} />
      <Route path="/processes" element={<Processes />} />
      <Route path="/routes" element={<Routess />} />
      <Route path="/products" element={<Products />} />
<Route
  path="/dashboard"
  element={
    <div className="flex items-center justify-center h-[60vh] text-center">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 mt-2">This page is not available</p>
      </div>
    </div>
  }
/>

<Route
  path="/schedule"
  element={
    <div className="flex items-center justify-center h-[60vh] text-center">
      <div>
        <h1 className="text-xl font-semibold">Schedule</h1>
        <p className="text-gray-500 mt-2">This page is not available</p>
      </div>
    </div>
  }
/>

<Route
  path="/orders"
  element={
    <div className="flex items-center justify-center h-[60vh] text-center">
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-gray-500 mt-2">This page is not available</p>
      </div>
    </div>
  }
/>

    </Routes>
  );
}

export default App;