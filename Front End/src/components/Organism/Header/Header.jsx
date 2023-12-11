/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PlaceholderContext } from "../../../store/PlaceholderStore";
<<<<<<< HEAD
import { BiSearchAlt } from "react-icons/bi";
=======
import { QueryContext } from "../../../store/QuerySearch";
>>>>>>> a2decdf29760224c3f2737aadaf5cbd7407f2f4b
export default function Header() {
  const [name, setName] = useState("");
  const {
    inputPlaceholder,
    searchInputRef,
    handleInputBlur,
    handleSearchButtonClick,
  } = useContext(PlaceholderContext);

  const { setQuery } = useContext(QueryContext);

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

  const handleSearchQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.search.value);
  };

  return (
    <header className="bg-sinow-05 pt-[26px] pb-[20px] md:pt-[25px] md:pb-[25px] pl-10 pr-[35px] lg:pr-[87px] flex justify-between drop-shadow-sm mb-[79px] sticky top-0 gap-5 flex-wrap z-[600] shadow-lg">
      <h1 className=" font-normal text-[24px] text-white flex-1 py-2 ">
        Selamat Datang, <b>{name}</b>
      </h1>
<<<<<<< HEAD
      <div className=" flex items-center flex-wrap">
        <input
          type="text"
          ref={searchInputRef}
          name="search"
          id="search"
          className="py-[13px] px-[20px] w-[270px] md:w-[300px] md:py-[15px] md:px-[15px] mr-[10px]  rounded-l-lg focus:outline-none  text-black text-[12px]"
          placeholder={inputPlaceholder}
          onBlur={handleInputBlur}
          onClick={handleSearchButtonClick}
        />
        <div className="bg-neutral-01 md:p-[5px] p-[5px] -m-3 rounded-r-lg ">
          <button className="bg-sinow-05 p-[3.6px] md:p-[7px] rounded-lg">
            <BiSearchAlt className="fill-white w-[24px] h-[24px]" />
          </button>
=======
      <form action="" onSubmit={(e) => handleSearchQuery(e)}>
        <div className="border-alert-danger flex items-center flex-wrap">
          <input
            type="text"
            ref={searchInputRef}
            name="search"
            id="search"
            className="py-[13px] px-[20px] md:py-[15px] md:px-[24px] mr-[10px] border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-300 focus:ring-gray-300 text-gray-500 text-[12px]"
            placeholder={inputPlaceholder}
            onBlur={handleInputBlur}
            onClick={handleSearchButtonClick}
          />
          <div className="bg-neutral-01 md:p-[5px] p-[5px] -m-3 rounded-r-lg  border-y-[1px] border-r-[1px] border-gray-300">
            <button
              className="bg-darkblue-05 p-[3.6px] md:p-[7px] rounded-lg"
              type="submit"
            >
              <img
                src="/images/search-icon.png"
                alt="search-icon"
                className="w-[24px] h-[24px] "
              />
            </button>
          </div>
>>>>>>> a2decdf29760224c3f2737aadaf5cbd7407f2f4b
        </div>
      </form>
    </header>
  );
}
