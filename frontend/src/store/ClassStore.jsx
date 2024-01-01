/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ClassContext = createContext();

const ClassContextProvider = ({ children }) => {
  const [classSinow, setClassSinow] = useState([]);

  return (
    <ClassContext.Provider value={{ classSinow, setClassSinow }}>
      {children}
    </ClassContext.Provider>
  );
};

export default ClassContextProvider;
