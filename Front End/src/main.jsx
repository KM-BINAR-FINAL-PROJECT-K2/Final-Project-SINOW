import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import LoaderContextProvider from "./store/Loader.jsx";
import ErrorContextProvider from "./store/Error.jsx";
import PlaceholderContextProvider from "./store/PlaceholderStore.jsx";
import QueryContextProvider from "./store/QuerySearch.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlaceholderContextProvider>
      <LoaderContextProvider>
        <QueryContextProvider>
          <ErrorContextProvider>
            <App />
          </ErrorContextProvider>
        </QueryContextProvider>
      </LoaderContextProvider>
    </PlaceholderContextProvider>
  </React.StrictMode>
);
