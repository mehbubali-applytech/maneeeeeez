"use client";

import React, { createContext, useEffect, useState } from "react";
import { AppContextType } from "@/interface/common.interface";

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (error) {
      console.warn("Theme storage access blocked:", error);
    }
  }, []);

  // ✅ Apply theme & save
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Unable to save theme:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const sidebarHandle = () => {
    setIsCollapse((prev) => !prev);
  };

  const contextValue: AppContextType = {
    scrollDirection,
    setScrollDirection,
    sideMenuOpen,
    setSideMenuOpen,
    sidebarHandle,
    isCollapse,
    setIsCollapse,
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
