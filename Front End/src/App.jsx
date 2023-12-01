import { BrowserRouter, Route, Routes } from "react-router-dom";
import CRUD from "./components/Page/CRUD/CRUD";
import DashboadAdmin from "./components/Page/DashboardAdmin/DashboardAdmin";
import Login from "./components/Page/Login/Login";
import ResetPassword from "./components/Page/ResetPass/ResetPass";
import BackToLogin from "./components/Page/ResetPass/BackToLogin";
import AddClassContextProvider from "./store/AddClassUI";
import InfoClassContextProvider from "./store/InfoClassUI";
import RemoveClassContextProvider from "./store/RemoveClassUI";
import ClassContextProvider from "./store/ClassStore";
import KeyContextProvider from "./store/ActiveKey";

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
          element={
            <AddClassContextProvider>
              <ClassContextProvider>
                <KeyContextProvider>
                  <RemoveClassContextProvider>
                    <InfoClassContextProvider>
                      <CRUD location={"/kelola-kelas"} />
                    </InfoClassContextProvider>
                  </RemoveClassContextProvider>
                </KeyContextProvider>
              </ClassContextProvider>
            </AddClassContextProvider>
          }
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
