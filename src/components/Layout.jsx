import Navbar from "./Navbar";
import TopNav from "./TopNav";
import SubNav from "./SubNav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* TOP SECTIONS */}
      <Navbar />
      <TopNav />
      <SubNav />

      {/* PAGE CONTENT */}
      <div className="flex-1">
        {children}
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-500 py-4 border-t bg-white mt-32">
        Manufacturing Production Scheduling System • ERP/MES Integration Ready • Real-time Optimization
      </div>

    </div>
  );
};

export default Layout;