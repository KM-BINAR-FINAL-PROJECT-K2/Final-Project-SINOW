/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const QueryContext = createContext();

const QueryContextProvider = ({ children }) => {
  const [query, setQuery] = useState("");

  return (
    <QueryContext.Provider value={{ query, setQuery }}>
      {children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
