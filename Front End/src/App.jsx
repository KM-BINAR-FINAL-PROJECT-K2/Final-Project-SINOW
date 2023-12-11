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
import EditClass from "./components/Page/EditClass/EditClass";
import AddClass from "./components/Page/AddClass/AddClass";
import RotateContextProvider from "./store/RotateAction";
import ManageChapter from "./components/Page/ManageChapter/ManageChapter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboadAdmin />} />
        <Route
          path="/kelola-kelas"
          element={
            <AddClassContextProvider>
              <ClassContextProvider>
                <KeyContextProvider>
                  <RemoveClassContextProvider>
                    <InfoClassContextProvider>
                      <RotateContextProvider>
                        <CRUD />
                      </RotateContextProvider>
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
        <Route path="/edit-kelas/:id" element={<EditClass />}></Route>
        <Route path="/tambah-kelas" element={<AddClass />}></Route>
        <Route path="/kelola-chapter/:id" element={<ManageChapter />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
