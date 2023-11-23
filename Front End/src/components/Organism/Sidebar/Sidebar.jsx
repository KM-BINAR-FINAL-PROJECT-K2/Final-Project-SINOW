import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [background, setBackground] = useState({
    dashboard: false,
    kelolaKelas: false,
  });

  useEffect(() => {
    if (location.pathname === "/") {
      setBackground({
        dashboard: true,
        kelolaKelas: false,
      });
    } else if (location.pathname === "/kelola-kelas") {
      setBackground({
        dashboard: false,
        kelolaKelas: true,
      });
    }
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 bg-darkblue-05 h-screen  md:flex flex-col justify-center items-center flex-wrap w-auto lg:w-[300px] hidden">
      <img
<<<<<<< HEAD
        src="/images/logo.png"
=======
        src="/images/logo-n-maskot/Logo-png.png"
>>>>>>> 6a20ef9 (membuat sidebar responsive design - final)
        alt="logo"
        className=" w-[100px] h-[100px] lg:w-[100px] lg:h-[100px] lg:m-4"
      />
      <div className="flex-1 w-full">
        <a
          id="dashboard"
          href="/dashboard"
          className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300 ${
            background.dashboard
              ? "bg-darkblue-03 pl-[18px] hover:pl-[18px] lg:pl-[45px]"
              : "lg:pl-[35px]"
          }`}
        >
          <p>Dashboard</p>
        </a>
        <a
          id="kelola-kelas"
          href="/kelola-kelas"
          className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px]  w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300 ${
            background.kelolaKelas
              ? "bg-darkblue-03 pl-[18px] hover:pl-[18px] lg:pl-[45px]"
              : "lg:pl-[35px]"
          }`}
        >
          <p>Kelola Kelas</p>
        </a>
        <a
          id="keluar"
          href="/"
          className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] lg:pl-[35px] w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300`}
        >
          <p>Keluar</p>
        </a>
      </div>
    </nav>
  );
}
