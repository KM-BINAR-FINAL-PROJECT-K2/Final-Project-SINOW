import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";
import DashboadAdmin from "./components/Page/DashboardAdmin/DashboardAdmin";
import Login from "./components/Page/Login/Login";
import ResetPassword from "./components/Page/ResetPass/ResetPass";
import BackToLogin from "./components/Page/ResetPass/BackToLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboadAdmin location={"/dashboard"} />}
        />
        <Route
          path="/kelola-kelas"
          element={<CRUD location={"/kelola-kelas"} />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/message-succes-reset-password"
          element={<BackToLogin />}
        />
      </Routes>
    </BrowserRouter>
  );
}
