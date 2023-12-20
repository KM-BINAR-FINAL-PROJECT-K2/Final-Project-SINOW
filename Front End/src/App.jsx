import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";
import DashboadAdmin from "./components/Page/DashboardAdmin/DashboardAdmin";
import Login from "./components/Page/Login/Login";
import ResetPassword from "./components/Page/ResetPass/ResetPass";
import BackToLogin from "./components/Page/ResetPass/BackToLogin";
import EditClass from "./components/Page/EditClass/EditClass";
import AddClass from "./components/Page/AddClass/AddClass";
import ManageChapter from "./components/Page/ManageChapter/ManageChapter";
import ManageClassContextProvider from "./store/ManageClassStore";
import LandingPage from "./components/Page/LandingPage/LandingPage";
import SearchValueContextProvider from "./store/SearchValue";
import UserLogin from "./components/Page/Login/LoginUser";
import Sinow from "./components/Page/Sinow/DashboardSinow";
import Register from "./components/Page/Register/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sinow" element={<Sinow />} />
        <Route path="/dashboard" element={<DashboadAdmin />} />
        <Route
          path="/dashboard"
          element={
            <SearchValueContextProvider>
              <DashboadAdmin />
            </SearchValueContextProvider>
          }
        />
        <Route
          path="/kelola-kelas"
          element={
            <ManageClassContextProvider>
              <CRUD />
            </ManageClassContextProvider>
          }
        />
        <Route path="/admin" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/message-succes-reset-password"
          element={<BackToLogin />}
        />
        <Route path="/edit-kelas/:id" element={<EditClass />}></Route>
        <Route path="/tambah-kelas" element={<AddClass />}></Route>
        <Route path="/kelola-chapter/:id" element={<ManageChapter />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
