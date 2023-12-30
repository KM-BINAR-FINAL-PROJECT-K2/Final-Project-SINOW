/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const InfoTransactionContext = createContext();
const InfoTransactionContextProvider = ({ children }) => {
  const [showInfoTransaction, setShowInfoTransaction] = useState(false);

  return (
    <InfoTransactionContext.Provider
      value={{ showInfoTransaction, setShowInfoTransaction }}
    >
      {children}
    </InfoTransactionContext.Provider>
  );
};

export default InfoTransactionContextProvider;
