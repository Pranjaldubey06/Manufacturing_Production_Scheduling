// import { NavLink } from "react-router-dom";

// const tabs = [
//   { name: "Units", path: "/units" },
//   { name: "Shifts", path: "/shifts" },
//   { name: "Workstations", path: "/workstations" },
//   { name: "Processes", path: "/processes" },
//   { name: "Routes", path: "/routes" },
//   { name: "Products", path: "/products" },
// ];

// const SubNav = () => {
//   return (
//     <div className="flex gap-4 px-8 mt-6 text-sm">
//       {tabs.map((tab) => (
//         <NavLink
//           key={tab.name}
//           to={tab.path}
//           className={({ isActive }) =>
//             `px-4 py-1 rounded-full ${
//               isActive
//                 ? "bg-gray-200 font-medium"
//                 : "hover:bg-gray-100"
//             }`
//           }
//         >
//           {tab.name}
//         </NavLink>
//       ))}
//     </div>
//   );
// };

// export default SubNav;


import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Units", path: "/units" },
  { name: "Shifts", path: "/shifts" },
  { name: "Workstations", path: "/workstations" },
  { name: "Processes", path: "/processes" },
  { name: "Routes", path: "/routes" },
  { name: "Products", path: "/products" },
];

const SubNav = () => {
  return (
    <div className="px-8 mt-6">
      <div className="rounded-full p-1 bg-gray-200 inline-flex gap-1 font-semibold">

        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-sm transition-all ${
                isActive
                  ? "bg-white shadow-sm font-medium text-gray-900"
                  : "text-gray-600 hover:text-black"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default SubNav;