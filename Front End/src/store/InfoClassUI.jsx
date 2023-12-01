/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";
import { KeyContext } from "./ActiveKey";

export const InfoClassContext = createContext();
const InfoClassContextProvider = ({ children }) => {
  const { setKeyClass } = useContext(KeyContext);
  const [showInfoClass, setShowInfoClass] = useState(false);

  const toggleShowInfo = (id) => {
    setKeyClass(id);
    setShowInfoClass(!showInfoClass);
  };

  const ctxValue = {
    showInfoClass,
    setShowInfoClass,
    toggleShowInfo,
  };

  return (
    <InfoClassContext.Provider value={ctxValue}>
      {children}
    </InfoClassContext.Provider>
  );
};

export default InfoClassContextProvider;
