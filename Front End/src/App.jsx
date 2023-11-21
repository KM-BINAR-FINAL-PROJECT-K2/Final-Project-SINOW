import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/kelola-kelas"
          element={<CRUD location={"/kelola-kelas"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
