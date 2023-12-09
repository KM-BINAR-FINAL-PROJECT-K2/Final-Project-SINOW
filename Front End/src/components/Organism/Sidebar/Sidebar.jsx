import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ButtonLogout from "../../Page/Logout/Logout";
export default function Sidebar() {
  const location = useLocation();
  const [background, setBackground] = useState({
    dashboard: false,
    kelolaKelas: false,
  });

  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setBackground({
        dashboard: true,
        kelolaKelas: false,
      });
    } else if (
      location.pathname === "/kelola-kelas" ||
      location.pathname.includes("/edit-kelas") ||
      location.pathname.includes("/tambah-kelas")
    ) {
      setBackground({
        dashboard: false,
        kelolaKelas: true,
      });
    }
  }, [location.pathname]);

  return (
    <>
      <nav className="sticky top-0 bg-white h-screen  md:flex flex-col justify-center items-center flex-wrap w-auto lg:w-[300px] hidden shadow-xl gap-4">
        <img
          src="/images/logo/Logo_01.png"
          alt="logo"
          className=" h-[42px] my-8 "
        />
        <div className="flex-1 w-full">
          <a
            id="dashboard"
            href="/dashboard"
            className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-sinow-05 font-montserrat hover:bg-sinow-05 hover:text-white py-[13px]  w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300 ${
              background.dashboard
                ? "bg-sinow-05 text-white pl-[18px] hover:pl-[18px] lg:pl-[45px]"
                : "lg:pl-[25px]"
            }`}
          >
            <p>Dashboard</p>
          </a>
          <a
            id="kelola-kelas"
            href="/kelola-kelas"
            className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-sinow-05 font-montserrat hover:bg-sinow-05 hover:text-white py-[13px]  w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300 ${
              background.kelolaKelas
                ? "bg-sinow-05 text-white pl-[18px] hover:pl-[18px] lg:pl-[45px]"
                : "lg:pl-[25px]"
            }`}
          >
            <p>Kelola Kelas</p>
          </a>
          <button
            id="keluar"
            className={`pl-[12px] text-left text-[12px] inline-block lg:text-[16px] font-bold text-sinow-05 font-montserrat hover:bg-sinow-05 hover:text-white py-[13px] lg:pl-[25px] w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300`}
            onClick={ButtonLogout}
          >
            <p>Keluar</p>
          </button>
        </div>
      </nav>
    </>
  );
}
