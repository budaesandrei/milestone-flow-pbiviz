import React, { createContext, useContext, ReactNode } from "react";
import powerbi from "powerbi-visuals-api";

interface DataContextType {
  dataViews?: powerbi.DataView[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
  dataViews?: powerbi.DataView[];
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  dataViews,
}) => {
  return (
    <DataContext.Provider value={{ dataViews }}>
      {children}
    </DataContext.Provider>
  );
};
