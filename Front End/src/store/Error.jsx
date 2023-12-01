/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ErrorContext = createContext();

const ErrorContextProvider = ({ children }) => {
  const [isError, setIsError] = useState("");

  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
