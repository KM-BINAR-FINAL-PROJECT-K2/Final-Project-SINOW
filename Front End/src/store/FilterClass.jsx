/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const FilterClassContext = createContext();

const FilterClassContextProvider = ({ children }) => {
  const [filterClass, setFilterClass] = useState(false);

  return (
    <FilterClassContext.Provider value={{ filterClass, setFilterClass }}>
      {children}
    </FilterClassContext.Provider>
  );
};

export default FilterClassContextProvider;
