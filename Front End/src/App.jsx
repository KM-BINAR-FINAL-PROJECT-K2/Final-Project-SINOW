import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";
import DashboadAdmin from "./components/Page/DashboardAdmin/DashboardAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboadAdmin location={"/"} />} />
        <Route
          path="/kelola-kelas"
          element={<CRUD location={"/kelola-kelas"} />}
        />
        <Route path="/login" element={<Login location={"/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
