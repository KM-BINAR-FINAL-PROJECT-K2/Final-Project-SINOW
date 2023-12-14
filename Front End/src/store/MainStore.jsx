// MainContextProvider.jsx

import LoaderContextProvider from "./Loader.jsx";
import ErrorContextProvider from "./Error.jsx";
import PlaceholderContextProvider from "./PlaceholderStore.jsx";
import QueryContextProvider from "./QuerySearch.jsx";
import ClassContextProvider from "./ClassStore.jsx";

const MainContextProvider = ({ children }) => (
  <PlaceholderContextProvider>
    <LoaderContextProvider>
      <QueryContextProvider>
        <ErrorContextProvider>
          <ClassContextProvider>{children}</ClassContextProvider>
        </ErrorContextProvider>
      </QueryContextProvider>
    </LoaderContextProvider>
  </PlaceholderContextProvider>
);

export default MainContextProvider;
