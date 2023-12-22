/* eslint-disable react/prop-types */

import LoaderContextProvider from "./Loader.jsx";
import ErrorContextProvider from "./Error.jsx";
import QueryContextProvider from "./QuerySearch.jsx";
import ClassContextProvider from "./ClassStore.jsx";
import RandomNumberContextProvider from "./RandomNumber.jsx";

const MainContextProvider = ({ children }) => (
  <LoaderContextProvider>
    <QueryContextProvider>
      <ErrorContextProvider>
        <ClassContextProvider>
          <RandomNumberContextProvider>{children}</RandomNumberContextProvider>
        </ClassContextProvider>
      </ErrorContextProvider>
    </QueryContextProvider>
  </LoaderContextProvider>
);

export default MainContextProvider;
