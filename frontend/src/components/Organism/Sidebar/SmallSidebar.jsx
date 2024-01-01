import { useState } from "react";
import ButtonLogout from "../../Page/Logout/Logout";
export default function SmallSidebar() {
  const [showNav, setShowNav] = useState(false);
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <>
      <div className="sticky top-0 z-[700]">
        {showNav && (
          <div
            onClick={toggleNav}
            className="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-50"
          ></div>
        )}
        <button
          onClick={toggleNav}
          className={`absolute top-0 z-10 p-0  mt-[15px] ${
            showNav ? "ml-[42px]" : "-ml-[8px]"
          }`}
        >
          {/* <img
            src="/images/slide.svg"
            alt=""
            className={`w-[24px] h-[34px] opacity-100 md:opacity-0`}
          >
          </img> */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`opacity-100 md:opacity-0`}
          >
            <path d="M12 7.5L4 0V15L12 7.5Z" fill="white" />
          </svg>
        </button>

        <nav
          className={`absolute top-0 bg-sinow-05 h-screen md:hidden text-center flex flex-col ${
            showNav ? "" : "hidden"
          }`}
        >
          <a
            href="/dashboard"
            className="inline-block cursor-pointer w-[50px] relative group mb-7"
          >
            <img
              src="/images/dashboard-icon.png"
              alt=""
              className="inline-block  w-[24px] h-[24px]  mt-5 hover:w-[30px] hover:h-[30px] transition-all duration-300"
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
          <button
            className="inline-block cursor-pointer w-[50px] relative group"
            onClick={ButtonLogout}
          >
            <img
              src="/images/exit-icon.png"
              alt=""
              className="item-center w-[24px] h-[24px] inline-block mt-5 hover:w-[30px] hover:h-[30px] transition-all duration-300"
            />
            <span className="opacity-0 invisible absolute top-full left-1/2 transform  -translate-x-1/2 bg-darkblue-05 text-white ml-2 mt-2 px-2 py-1 rounded-md text-xs transition-all duration-300 group-hover:opacity-100 group-hover:visible">
              Keluar
            </span>
          </button>
        </nav>
      </div>
    </>
  );
}
