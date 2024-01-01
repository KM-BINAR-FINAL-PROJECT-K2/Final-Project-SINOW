/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const RotateContext = createContext();

const RotateContextProvider = ({ children }) => {
  const [rotate, setRotate] = useState("");

  return (
    <RotateContext.Provider value={{ rotate, setRotate }}>
      {children}
    </RotateContext.Provider>
  );
};

export default RotateContextProvider;
