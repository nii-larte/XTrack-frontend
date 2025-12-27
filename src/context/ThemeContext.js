import { createContext, useEffect, useState } from "react";
import { api } from "../api";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await api.get("/user/profile");
        setTheme(res.data.theme || "light");
        document.body.setAttribute("data-theme", res.data.theme || "light");
      } catch {
        document.body.setAttribute("data-theme", "light");
      } finally {
        setInitialized(true);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);


    try {
      await api.put("/user/theme", { theme: newTheme });
    } catch (err) {
      console.error("Failed to save theme", err);
    }
  };

  if (!initialized) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
