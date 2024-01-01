/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const SearchValueContext = createContext();

const SearchValueContextProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");

  const ctxValue = {
    searchValue,
    setSearchValue,
  };
  return (
    <SearchValueContext.Provider value={ctxValue}>
      {children}
    </SearchValueContext.Provider>
  );
};

export default SearchValueContextProvider;
