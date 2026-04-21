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
    </Routes>
  );
}

export default App;