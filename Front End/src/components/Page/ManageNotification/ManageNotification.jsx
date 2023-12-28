import axios from "axios";

import { useContext, useEffect, useState } from "react";

import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";
import Loading from "../../Molecule/Loading/Loading";
import { formatTime } from "../../../utils/formatTime";
import FilterKelolaNotifikasi from "../../Molecule/Filter/FilterKelolaNotifikasi";
import { FilterClassContext } from "../../../store/FilterClass";
import { ImSearch } from "react-icons/im";

export default function ManageNotification() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { filterClass, setFilterClass } = useContext(FilterClassContext);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notifications, setNotification] = useState();

  useEffect(() => {
    try {
      const getNotification = async () => {
        setIsError("");
        setIsLoading(true);
        const response = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/notifications?${
            searchValue.length > 0 ? `&title=${searchValue}` : ""
          }${filterClass ? `&type=${filterClass}` : ""}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filteredNotifications = response.data.data.filter(
          (notification) => notification.type !== "Transaksi"
        );
        setNotification(filteredNotifications);
      };
      getNotification().catch((error) => {
        setIsError("Notifikasi tidak ditemukan");
      });
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchValue, filterClass]);

  const handleShowSearchInput = () => {
    setSearchValue("");
    setShowSearchInput(!showSearchInput);
  };

  const handleSearchButtonClick = (value) => {
    setSearchValue(value);
  };

  return (
    <>
      <Navigation>
        <section className=" mx-4 n lg:mx-[64px] mb-64 -mt-[70px]">
          <section className="">
            <div className="mb-[20px]">
              <Breadcrumb
                links={[
                  { name: "Kelola Kelas", url: "/kelola-kelas" },
                  { name: "Kelola Notifikasi" },
                ]}
              />
            </div>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Kelola Notifikasi
            </h1>
            <div className="flex justify-end ">
              <FilterKelolaNotifikasi />
              {showSearchInput && (
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border-2 text-darkblue-05 border-sinow-05 rounded-md focus:ring-sinow-05 outline-none py-1 px-2 placeholder-sinow-05"
                    placeholder="Cari..."
                    onChange={(e) => handleSearchButtonClick(e.target.value)}
                  />
                  <button onClick={handleShowSearchInput}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(0 204 244)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {!showSearchInput && (
                <button className="" onClick={handleShowSearchInput}>
                  <ImSearch className="fill-darkblue-05 h-[24px] w-[24px]" />
                </button>
              )}
            </div>
            <table className="w-full snap-mandatory snap-x table-auto">
              <thead className="sticky top-0 bg-lightblue-05 z-10">
                <tr className="bg-lightblue-05 text-left text-gray-800">
                  <th className="py-2 text-[12px] px-4 font-semibold w-1/7 ">
                    ID
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                    Tipe
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                    Judul
                  </th>
                  <th className="px-4 py-2 text-[12px] w-[500px] hidden lg:table-cell font-semibold w-1/7">
                    Konten
                  </th>
                  <th className="py-2 text-[12px] px-4 lg:w-[300px] font-semibold w-1/7">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <Loading />
                    </td>
                  </tr>
                )}

                {isError && (
                  <>
                    <tr>
                      <td colSpan={7} className="text-center">
                        <div className="font-bold bg-slate-950 bg-opacity-10 p-10 flex justify-center gap-5 items-center">
                          <img
                            src="/images/logo-n-maskot/failed_payment.png"
                            alt=""
                            className="w-[100px]"
                          />
                          <p className="text-xl text-alert-danger">
                            {isError}
                            <br />
                            <span className="text-sm text-gray-800 font-normal">
                              Cobalah untuk{" "}
                              <a
                                href="/kelola-kelas"
                                className="text-darkblue-03 font-medium"
                                onClick={() => {
                                  window.location.href = "/kelola-kelas";
                                  window.location.reload();
                                }}
                              >
                                Muat Ulang Halaman
                              </a>
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
                {!isError &&
                  !isLoading &&
                  notifications &&
                  notifications.length > 0 &&
                  notifications
                    .sort((a, b) => a.id - b.id)
                    .map((notification) => (
                      <tr
                        key={notification.id}
                        className="border-b border-slate-200"
                      >
                        <td className="py-2 px-4 text-[12px]  text-gray-600">
                          {notification.id}
                        </td>
                        <td className="px-4 py-2 text-[12px]  text-gray-600">
                          {notification.type}
                        </td>
                        <td className="px-4 py-2 text-[12px] ">
                          {notification.title}
                        </td>
                        <td
                          className={`px-4 py-2 text-[12px] hidden lg:table-cell`}
                        >
                          {notification.content}
                        </td>
                        <td className="px-4 py-2 text-[12px] ">
                          <button className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] w-[50px] hover:bg-neutral-02 bg-alert-success text-center leading-[14px] shadow-md">
                            Ubah
                          </button>
                          <button className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-alert-danger w-[50px] text-center leading-[14px] shadow-md">
                            Hapus
                          </button>
                          <button className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-sinow-03 w-[50px] text-center leading-[14px] shadow-md">
                            Info
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </section>
        </section>
      </Navigation>
    </>
  );
}
