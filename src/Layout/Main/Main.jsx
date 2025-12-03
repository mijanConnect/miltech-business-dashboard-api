import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Drawer } from "antd";

const Main = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) setDrawerVisible(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <div className="h-screen w-screen flex bg-baseBg overflow-hidden">
      {/* Desktop Sidebar (left) */}
      {!isMobile && <Sidebar collapsed={false} />}

      {/* Mobile Sidebar Drawer (right side) */}
      {isMobile && (
        <Drawer
          open={drawerVisible}
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <Sidebar collapsed={false} />
        </Drawer>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header with toggle button */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        <div className="flex-1 px-8 py-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;

// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { Outlet } from "react-router-dom";

// const Main = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   // Auto-collapse below 992px on mount + resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 992) setCollapsed(true);
//       else setCollapsed(false);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="h-screen w-screen flex bg-baseBg overflow-auto">
//       {/* Sidebar */}
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col h-screen transition-all duration-300 min-w-0">
//         <Header toggleSidebar={() => setCollapsed(!collapsed)} />

//         <div className="flex-1 mt-3 min-w-0">
//           <div className="h-full bg-baseBg rounded-md p-7 pt-0 min-w-0">
//             {/* Outlet for other dynamic pages */}
//             <div className="mt-6 h-full overflow-auto min-w-0">
//               {/* ✅ This ensures tables or wide content scroll */}
//               <div className="overflow-x-auto overflow-y-auto h-full min-w-0">
//                 <Outlet />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Main;
