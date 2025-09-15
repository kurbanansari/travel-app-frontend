// // providers/AuthProvider.tsx
// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   setToken: (token: string | null) => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   token: null,
//   isAuthenticated: false,
//   setToken: () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setTokenState] = useState<string | null>(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) setTokenState(savedToken);
//   }, []);

//   const setToken = (newToken: string | null) => {
//     if (newToken) localStorage.setItem("token", newToken);
//     else localStorage.removeItem("token");
//     setTokenState(newToken);
//   };

//   return (
//     <AuthContext.Provider value={{ token, isAuthenticated: !!token, setToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use token anywhere
// export const useAuth = () => useContext(AuthContext);



"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  loading: boolean; // NEW
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  setToken: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setTokenState(savedToken);
    setLoading(false); // done checking localStorage
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

