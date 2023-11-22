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
    <>
      <nav className="sticky top-0 bg-darkblue-05 h-screen  md:flex flex-col justify-center items-center flex-wrap w-auto lg:w-[300px] hidden">
        <img
          src="/images/logo-n-maskot/Logo-png.png"
          alt="logo"
          className=" w-[100px] h-[100px] lg:w-[100px] lg:h-[100px] m-4"
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
            href="#"
            className={`pl-[12px] text-[12px] inline-block lg:text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] lg:pl-[35px] w-full hover:pl-[18px]  lg:hover:pl-[45px] transition-all duration-300`}
          >
            <p>Keluar</p>
          </a>
        </div>
      </nav>
      <nav className="sticky top-0 bg-darkblue-05 h-screen md:hidden text-center flex flex-col">
        <a
          href="/"
          className="inline-block cursor-pointer w-[50px] relative group mb-7"
        >
          <img
            src="/images/dashboard-icon.png"
            alt=""
            className="w-[24px] h-[24px] inline-block mt-5 hover:w-[30px] hover:h-[30px] transition-all duration-300"
          />
          <span className="opacity-0 invisible absolute top-full left-1/2 transform -translate-x-1/2 bg-darkblue-05 text-white ml-6 mt-2 px-2 py-1 rounded-md text-xs transition-all duration-300 group-hover:opacity-100 group-hover:visible">
            Dashboard
          </span>
        </a>
        <a
          href="/kelola-kelas"
          className="inline-block cursor-pointer w-[50px] relative group mb-7"
        >
          <img
            src="/images/book-icon.png"
            alt=""
            className="w-[24px] h-[24px] inline-block mt-5 hover:w-[30px] hover:h-[30px] transition-all duration-300"
          />
          <span className="opacity-0 invisible absolute top-full left-1/2 transform  -translate-x-1/2 bg-darkblue-05 text-white ml-2 mt-2 px-2 py-1 rounded-md text-xs transition-all duration-300 group-hover:opacity-100 group-hover:visible">
            Kelola Kelas
          </span>
        </a>
        <a
          href="/#"
          className="inline-block cursor-pointer w-[50px] relative group"
        >
          <img
            src="/images/exit-icon.png"
            alt=""
            className="w-[24px] h-[24px] inline-block mt-5 hover:w-[30px] hover:h-[30px] transition-all duration-300"
          />
          <span className="opacity-0 invisible absolute top-full left-1/2 transform  -translate-x-1/2 bg-darkblue-05 text-white ml-2 mt-2 px-2 py-1 rounded-md text-xs transition-all duration-300 group-hover:opacity-100 group-hover:visible">
            Keluar
          </span>
        </a>
      </nav>
    </>
  );
}
