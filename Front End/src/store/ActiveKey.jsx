/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const KeyContext = createContext();

const KeyContextProvider = ({ children }) => {
  const [keyClass, setKeyClass] = useState("");

  return (
    <KeyContext.Provider value={{ keyClass, setKeyClass }}>
      {children}
    </KeyContext.Provider>
  );
};

export default KeyContextProvider;
