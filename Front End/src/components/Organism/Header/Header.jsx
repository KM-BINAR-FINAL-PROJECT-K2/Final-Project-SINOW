/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PlaceholderContext } from "../../../store/PlaceholderStore";
import { BiSearchAlt } from "react-icons/bi";
export default function Header() {
  const [name, setName] = useState("");
  const {
    inputPlaceholder,
    searchInputRef,
    handleInputBlur,
    handleSearchButtonClick,
  } = useContext(PlaceholderContext);

  const adminToken = localStorage.getItem("token");
  useEffect(() => {
    if (!adminToken) {
      window.location.href = "/";
      return;
    }
    const validateToken = async () => {
      try {
        if (adminToken) {
          const res = await axios.get(
            "https://sinow-production.up.railway.app/api/v1/auth/check-token",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );
          if (res.data.status === "Success") {
            const response = res.data.data;

            const dataListString = JSON.stringify([
              response.Auth.email,
              response.name,
              response.city,
              response.country,
            ]);

            setName(response.name);

            localStorage.setItem("data", dataListString);
          }
        }
      } catch (error) {
        if (error.response.data.status === "Failed") {
          localStorage.clear();
          window.location.href = "/";
        }
      }
    };

    validateToken();
  }, [adminToken]);

  return (
    <header className="bg-sinow-05 pt-[26px] pb-[20px] md:pt-[25px] md:pb-[25px] pl-10 pr-[35px] lg:pr-[87px] flex justify-between drop-shadow-sm mb-[79px] sticky top-0 gap-5 flex-wrap z-[600]">
      <h1 className=" font-bold text-[24px] text-white flex-1 py-2 ">
        Selamat Datang, {name}
      </h1>
      <div className=" flex items-center flex-wrap">
        <input
          type="text"
          ref={searchInputRef}
          name="search"
          id="search"
          className="py-[13px] px-[20px] w-[200px] md:w-[300px] md:py-[15px] md:px-[15px] mr-[10px]  rounded-l-lg focus:outline-none  text-black text-[12px]"
          placeholder={inputPlaceholder}
          onBlur={handleInputBlur}
          onClick={handleSearchButtonClick}
        />
        <div className="bg-neutral-01 md:p-[5px] p-[5px] -m-3 rounded-r-lg ">
          <button className="bg-sinow-05 p-[3.6px] md:p-[7px] rounded-lg">
            <BiSearchAlt className="fill-white w-[24px] h-[24px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
