/* eslint-disable react/prop-types */

import LoaderContextProvider from "./Loader.jsx";
import ErrorContextProvider from "./Error.jsx";
import QueryContextProvider from "./QuerySearch.jsx";
import ClassContextProvider from "./ClassStore.jsx";
import RandomNumberContextProvider from "./RandomNumber.jsx";
import FilterClassContextProvider from "./FilterClass.jsx";

const MainContextProvider = ({ children }) => (
  <LoaderContextProvider>
    <QueryContextProvider>
      <ErrorContextProvider>
        <ClassContextProvider>
          <FilterClassContextProvider>
            <RandomNumberContextProvider>
              {children}
            </RandomNumberContextProvider>
          </FilterClassContextProvider>
        </ClassContextProvider>
      </ErrorContextProvider>
    </QueryContextProvider>
  </LoaderContextProvider>
);

export default MainContextProvider;
