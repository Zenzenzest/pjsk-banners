import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    return savedTheme || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}

      <div
        style={{
          position: "fixed",
          left: "20px",
          bottom: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 15px",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            backgroundColor: theme === "light" ? "#333" : "#fff",
            color: theme === "light" ? "#fff" : "#333",
            fontWeight: "bold",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
