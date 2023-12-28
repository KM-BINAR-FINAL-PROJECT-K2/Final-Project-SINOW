import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";
import DashboadAdmin from "./components/Page/DashboardAdmin/DashboardAdmin";
import Login from "./components/Page/Login/Login";
import ResetPassword from "./components/Page/ResetPass/ResetPass";
import ForgotPassword from "./components/Page/ResetPass/ForgotPass";
import EditClass from "./components/Page/EditClass/EditClass";
import AddClass from "./components/Page/AddClass/AddClass";
import ManageChapter from "./components/Page/ManageChapter/ManageChapter";
import ManageClassContextProvider from "./store/ManageClassStore";
import LandingPage from "./components/Page/LandingPage/LandingPage";
import SearchValueContextProvider from "./store/SearchValue";
import FilterClassContextProvider from "./store/FilterClass";
import ManageNotification from "./components/Page/ManageNotification/ManageNotification";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <SearchValueContextProvider>
              <FilterClassContextProvider>
                <DashboadAdmin />
              </FilterClassContextProvider>
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/edit-kelas/:id" element={<EditClass />} />
        <Route path="/kelola-notifikasi" element={<ManageNotification />} />
        <Route path="/tambah-kelas" element={<AddClass />} />
        <Route path="/kelola-chapter/:id" element={<ManageChapter />} />
      </Routes>
    </BrowserRouter>
  );
}
