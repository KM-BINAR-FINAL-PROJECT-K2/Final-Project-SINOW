import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import LoaderContextProvider from "./store/Loader.jsx";
import ErrorContextProvider from "./store/Error.jsx";
import PlaceholderContextProvider from "./store/PlaceholderStore.jsx";
import QueryContextProvider from "./store/QuerySearch.jsx";
import "./index.css";
import ClassContextProvider from "./store/ClassStore.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <PlaceholderContextProvider>
      <LoaderContextProvider>
        <QueryContextProvider>
          <ErrorContextProvider>
            <ClassContextProvider>
              <App />
            </ClassContextProvider>
          </ErrorContextProvider>
        </QueryContextProvider>
      </LoaderContextProvider>
    </PlaceholderContextProvider>
  </>
);
