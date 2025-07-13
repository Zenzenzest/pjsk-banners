import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

type ServerType = "jp" | "global" | "saved";

type ServerContextType = {
  server: ServerType;
  setServer: (server: ServerType) => void;
};

interface ServerProviderProps {
  children: ReactNode;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider = ({ children }: ServerProviderProps) => {
  const [server, setServer] = useState<ServerType>("global");
  
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