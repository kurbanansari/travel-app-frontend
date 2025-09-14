"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only runs in browser
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []); 

  return (
    <header className="sticky top-0 z-10 bg-green-100 flex items-center rounded justify-between shadow-sm px-4 py-2">
      <h1 className="text-xl font-bold tracking-tight text-green-800">
      Community
      </h1>

      {token ? (
        <span className="text-sm text-green-800">Welcome!</span>
      ) : (
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-medium text-sm hover:bg-blue-600 transition"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;
