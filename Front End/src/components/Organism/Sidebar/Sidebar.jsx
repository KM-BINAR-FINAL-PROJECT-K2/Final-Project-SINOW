import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [background, setBackground] = useState({
    dashboard: false,
    kelolaKelas: false,
  });

  useEffect(() => {
    // Atur nilai background berdasarkan path saat ini
    if (location.pathname === "/kelola-kelas") {
      setBackground({
        dashboard: false,
        kelolaKelas: true,
      });
    } else if (location.pathname === "/dashboard") {
      setBackground({
        dashboard: true,
        kelolaKelas: false,
      });
    }
  }, [location.pathname]);
  return (
    <nav className="sticky top-0 bg-darkblue-05 h-screen w-[300px] flex flex-col justify-center items-center flex-wrap">
      <img
        src="/images/logo.png"
        alt="logo"
        className="w-[134.13px] h-[150px] mb-4"
      />
      <div className="flex-1 w-full">
        <a
          id="dashboard"
          href="/dashboard"
          className={`inline-block text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px] w-full hover:pl-[45px] transition-all duration-300 ${
            background.dashboard ? "bg-darkblue-03 pl-[45px]" : ""
          }`}
        >
          <p>Dashboard</p>
        </a>
        <a
          id="kelola-kelas"
          href="/kelola-kelas"
          className={`inline-block text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px] w-full hover:pl-[45px] transition-all duration-300 ${
            background.kelolaKelas ? "bg-darkblue-03 pl-[45px]" : ""
          }`}
        >
          <p>Kelola Kelas</p>
        </a>
        <a
          id="keluar"
          href="#"
          className={`inline-block text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px] w-full hover:pl-[45px] transition-all duration-300`}
        >
          <p>Keluar</p>
        </a>
      </div>
    </nav>
  );
}
