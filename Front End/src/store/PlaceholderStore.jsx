/* eslint-disable react/prop-types */
import { createContext, useState, useRef } from "react";

export const PlaceholderContext = createContext();

const PlaceholderContextProvider = ({ children }) => {
  const [inputPlaceholder, setInputPlaceholder] = useState("Cari");
  const searchInputRef = useRef(null);

  const handleSearchButtonClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setInputPlaceholder("Mulai mengetik...");
    }
  };

  const handleInputBlur = () => {
    if (searchInputRef.current && !searchInputRef.current.value) {
      setInputPlaceholder("Cari");
    }
  };

  const ctxValue = {
    inputPlaceholder,
    searchInputRef,
    setInputPlaceholder,
    handleSearchButtonClick,
    handleInputBlur,
  };

  return (
    <PlaceholderContext.Provider value={ctxValue}>
      {children}
    </PlaceholderContext.Provider>
  );
};

export default PlaceholderContextProvider;
