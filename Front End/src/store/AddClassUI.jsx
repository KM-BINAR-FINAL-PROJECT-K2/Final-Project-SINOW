/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AddClassContext = createContext();

const AddClassContextProvider = ({ children }) => {
  const [showAddClass, setShowAddClass] = useState(false);

  const toggleShowContainer = () => {
    console.log(!showAddClass);
    setShowAddClass(!showAddClass);
  };

  const ctxValue = {
    showAddClass,
    toggleShowContainer,
  };

  return (
    <AddClassContext.Provider value={ctxValue}>
      {children}
    </AddClassContext.Provider>
  );
};

export default AddClassContextProvider;
