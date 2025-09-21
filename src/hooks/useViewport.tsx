import React, { createContext, useContext, ReactNode } from "react";
import powerbi from "powerbi-visuals-api";

interface ViewportContextType {
  viewport?: powerbi.IViewport;
}

const ViewportContext = createContext<ViewportContextType | undefined>(
  undefined
);

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
};

interface ViewportProviderProps {
  children: ReactNode;
  viewport?: powerbi.IViewport;
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  viewport,
}) => {
  return (
    <ViewportContext.Provider value={{ viewport }}>
      {children}
    </ViewportContext.Provider>
  );
};
