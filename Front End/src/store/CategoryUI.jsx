/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const CategoryContainerContext = createContext();
const CategoryContainerContextProvider = ({ children }) => {
  const [showCategoryContainer, setShowCategoryContainer] = useState(false);

  return (
    <CategoryContainerContext.Provider
      value={{ showCategoryContainer, setShowCategoryContainer }}
    >
      {children}
    </CategoryContainerContext.Provider>
  );
};

export default CategoryContainerContextProvider;
