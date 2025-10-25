"use client";

import React, { useState } from "react";
import { Home, Users, Heart, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "./card";
import Link from "next/link";
import UserProfileIcon from "../UserProfileIcon";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";


const Footer = () => {
  const [active, setActive] = useState<string>("");
  
  const navItems = [
    { name: "Community", icon: Home, href: "/" },
    { name: "User", icon: Users, href: "/search_users" },
    { name: "Trips", icon: LayoutDashboard, href: "/trips" },
    { name: "Health", icon: Heart, href: "/likes" },
    // { name: "My", icon: UserProfileIcon, href: "/profile" },
  ];
  const router = useRouter();
 

    
  
  const handleProfileClick = () => {
    
      
      router.push("/profile/me"); // 👈 fallback if not logged in
    
  };



  return (
    // <Card className="w-full max-w-xl fixed bottom-6 left-0 right-0 mx-auto bg-emerald-700 rounded-t-lg shadow-lg">
    //   <CardContent className="p-2 sm:p-4 flex items-center justify-between text-white pb-2 sm:pb-4">
    //     <div className="flex w-full justify-between items-center gap-2 sm:gap-4">
    //       {/* Home */}
    //       <Link href="/" className="flex-1 flex justify-center">Community
    //         <Home className="transition-transform duration-300 hover:scale-110 hover:text-grey-100" />
    //       </Link>

    //       {/* Users */}
    //       <Link href="/search_users" className="flex-1 flex justify-center">User
    //         <Users className="transition-transform duration-300 hover:scale-110 hover:text-grey-100" />
    //       </Link>

    //       {/* Start New Trip */}
    //       <Link href="/trips" className="flex-1 flex justify-center">Trips
    //         <LayoutDashboard className="transition-transform duration-300 hover:scale-110 hover:text-grey-100" />
    //       </Link>

    //       {/* Likes */}
    //       <Link href="/likes" className="flex-1 flex justify-center">Health
    //         <Heart className="transition-transform duration-300 hover:scale-110 hover:text-grey-100" />
    //       </Link>

    //        {/* User Profile */}
    //        <button onClick={handleProfileClick} className="flex-1 flex justify-center">My Profile
    //         <UserProfileIcon />
    //       </button>
      
    //     </div>
    //   </CardContent>
    // </Card>
   <Card
      className="
        w-full max-w-xl fixed bottom-0 left-0 right-0 mx-auto
        bg-emerald-700 text-white
        rounded-t-2xl shadow-2xl border border-emerald-600/30
        backdrop-blur-md z-50 overflow-hidden
      "
    >
      <CardContent className="sm:p-2 flex items-center justify-between sm:pb-2">
        <div className="flex w-full justify-between items-center gap-2 sm:gap-3">
          {/* Regular Nav Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActive(item.name)}
                className="flex-1 flex justify-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#065f46" : "#f0fdf4",
                    boxShadow: isActive
                      ? "0px 4px 10px rgba(0,0,0,0.15)"
                      : "0px 0px 0px rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all duration-300 cursor-pointer"
                >
                  <Icon
                    size={22}
                    className={`transition-transform duration-300 ${
                      isActive
                        ? "text-emerald-700 scale-110"
                        : "text-emerald-100 hover:scale-110"
                    }`}
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm sm:text-base font-semibold text-emerald-700"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* ✅ Profile Item - Not using Link so onClick works */}
          <button
            onClick={handleProfileClick}
            className="flex-1 flex justify-center focus:outline-none"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={{
                backgroundColor: active === "My" ? "#ffffff" : "transparent",
                color: active === "My" ? "#065f46" : "#f0fdf4",
                boxShadow:
                  active === "My"
                    ? "0px 4px 10px rgba(0,0,0,0.15)"
                    : "0px 0px 0px rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all duration-300 cursor-pointer"
            >
              <UserProfileIcon
                // size={22}
                className={`transition-transform duration-300 ${
                  active === "My"
                    ? "text-emerald-700 scale-110"
                    : "text-emerald-100 hover:scale-110"
                }`}
              />
              {active === "My" && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm sm:text-base font-semibold text-emerald-700"
                >
                  My
                </motion.span>
              )}
            </motion.div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Footer
