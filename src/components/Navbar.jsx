import React from "react";
import { GoGraph } from "react-icons/go";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4">

      {/* TOP ROW */}
      <div className="flex items-center gap-3">
        <GoGraph className="text-3xl" />

        <h1 className="text-2xl font-semibold">
          Manufacturing Production Scheduling
        </h1>
      </div>

      {/* SUBTEXT */}
      <p className="text-sm opacity-90 ml-10 mt-1">
        Intelligent production planning and resource optimization
      </p>

    </div>
  );
};

export default Navbar;