/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { KeyContext } from "./ActiveKey";

export const RemoveClassContext = createContext();

const RemoveClassContextProvider = ({ children }) => {
  const [showRemoveClass, setShowRemoveClass] = useState(false);
  const { setKeyClass } = useContext(KeyContext);

  const toggleShowWarning = (id) => {
    setKeyClass(id);
    setShowRemoveClass(!showRemoveClass);
  };

  const ctxValue = {
    showRemoveClass,
    setShowRemoveClass,
    toggleShowWarning,
  };
  return (
    <RemoveClassContext.Provider value={ctxValue}>
      {children}
    </RemoveClassContext.Provider>
  );
};

export default RemoveClassContextProvider;
