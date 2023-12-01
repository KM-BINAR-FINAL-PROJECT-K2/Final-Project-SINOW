/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const LoaderContext = createContext();

const LoaderContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderContextProvider;
