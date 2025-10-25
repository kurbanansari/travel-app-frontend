// "use client";

// import React, { useState, useEffect } from "react";


// const Header = () => {

//   return (
//     <header className="sticky top-0 z-10 bg-green-100 flex items-center rounded justify-between shadow-sm px-4 py-2">
//       <h1 className="text-xl font-bold tracking-tight text-green-800">
//       Community
//       </h1>

     
//     </header>
//   );
// };

// export default Header;
"use client";

import React from "react";
import { Bell, UserCircle } from "lucide-react"; // Optional icons
import {  LuMessageCircleMore } from "react-icons/lu";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-green-200 to-green-100 flex items-center justify-between px-6 py-2 shadow-md rounded-b-xl">
      {/* Logo / Title */}
      <h1 className="text-xl sm:text-xl font-bold text-green-900 tracking-wide">
        Community
      </h1>

      {/* Right-side actions */}
      <div className="flex items-center gap-4">
        {/* Notification icon */}
        <button className="p-2 rounded-full hover:bg-green-200 transition-colors">
          <Bell className="w-6 h-6 text-emerald-600" />
        </button>

        {/* User avatar / profile */}
        <button className="p-2 rounded-full text-emerald-600 hover:bg-emerald-200 transition-colors ">
          <LuMessageCircleMore  onClick={() => router.push("/chat")} className="w-7 h-7 " />
        </button>
      </div>
    </header>
  );
};

export default Header;
