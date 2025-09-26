import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

type ServerType = "jp" | "global";

type ServerContextType = {
  server: ServerType;
  setServer: (server: ServerType) => void;
};

interface ServerProviderProps {
  children: ReactNode;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider = ({ children }: ServerProviderProps) => {
  const [server, setServerState] = useState<ServerType>("global");

  // Initialize from localStorage on mount, but check if on /saved route
  useEffect(() => {
    // Check if /saved route

    const savedServer = localStorage.getItem("serverPreference") as ServerType;
    if (savedServer && ["jp", "global"].includes(savedServer)) {
      setServerState(savedServer);
    }
  }, []);

  const setServer = (newServer: ServerType) => {
    setServerState(newServer);
  };

  return (
    <ServerContext.Provider value={{ server, setServer }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServerContext must be used within a ServerProvider");
  }
  return context;
};
