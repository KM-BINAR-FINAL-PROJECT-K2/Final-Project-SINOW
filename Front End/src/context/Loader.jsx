import { createContext, useState } from "react";

const LoaderContext = createContext();

const LoaderContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const Loader = LoaderContext;
export default LoaderContextProvider;
