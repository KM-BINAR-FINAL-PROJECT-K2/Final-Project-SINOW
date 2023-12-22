/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const RandomNumberContext = createContext();
const RandomNumberContextProvider = ({ children }) => {
  const [randomNumber, setRandomNumber] = useState(false);

  return (
    <RandomNumberContext.Provider value={{ randomNumber, setRandomNumber }}>
      {children}
    </RandomNumberContext.Provider>
  );
};

export default RandomNumberContextProvider;
