import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MainContextProvider from "./store/MainStore.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <MainContextProvider>
      <App />
    </MainContextProvider>
  </>
);
