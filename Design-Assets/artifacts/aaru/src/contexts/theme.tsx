import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";
interface ThemeCtx { theme: Theme; isDark: boolean; toggle: () => void }

const Ctx = createContext<ThemeCtx>({ theme: "dark", isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem("axion-theme") as Theme) || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("axion-theme", theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <Ctx.Provider value={{ theme, isDark: theme === "dark", toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
