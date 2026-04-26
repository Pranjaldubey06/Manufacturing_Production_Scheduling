// import React from "react";
// import { MdDashboard } from "react-icons/md";
// import { FaCalendarAlt } from "react-icons/fa";
// import { FaBox } from "react-icons/fa";
// import { IoSettingsSharp } from "react-icons/io5";

// const TopNav = () => {
//   return (
//     <div className="mt-4 px-8">
//       <div className="bg-gray-200 rounded-full p-1 w-full flex">

//         <div className="flex w-full text-sm font-semibold">

//           <span className="flex-1 flex items-center justify-center gap-2 py-1.5 cursor-pointer text-gray-700 hover:text-black">
//             <MdDashboard />
//             Dashboard
//           </span>

//           <span className="flex-1 flex items-center justify-center gap-2 py-1.5 cursor-pointer text-gray-700 hover:text-black">
//             <FaCalendarAlt />
//             Schedule
//           </span>

//           <span className="flex-1 flex items-center justify-center gap-2 py-1.5 cursor-pointer text-gray-700 hover:text-black">
//             <FaBox />
//             Orders
//           </span>

//           <span className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-white rounded-full font-medium shadow-sm cursor-pointer">
//             <IoSettingsSharp />
//             Master Data
//           </span>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default TopNav;



import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaBox } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

const TopNav = () => {

  const navClass = ({ isActive }) =>
    `flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full cursor-pointer transition ${
      isActive
        ? "bg-white shadow-sm font-medium text-black"
        : "text-gray-700 hover:text-black"
    }`;

  return (
    <div className="mt-4 px-8">
      <div className="bg-gray-200 rounded-full p-1 w-full flex">

        <div className="flex w-full text-sm font-semibold">

          <NavLink to="/dashboard" className={navClass}>
            <MdDashboard />
            Dashboard
          </NavLink>

          <NavLink to="/schedule" className={navClass}>
            <FaCalendarAlt />
            Schedule
          </NavLink>

          <NavLink to="/orders" className={navClass}>
            <FaBox />
            Orders
          </NavLink>

          <NavLink to="/units" className={navClass}>
            <IoSettingsSharp />
            Master Data
          </NavLink>

        </div>

      </div>
    </div>
  );
};

export default TopNav;