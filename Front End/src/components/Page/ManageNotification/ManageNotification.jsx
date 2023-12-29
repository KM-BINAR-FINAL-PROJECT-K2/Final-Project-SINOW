import axios from "axios";

import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";
import Loading from "../../Molecule/Loading/Loading";
import FilterKelolaNotifikasi from "../../Molecule/Filter/FilterKelolaNotifikasi";
import { FilterClassContext } from "../../../store/FilterClass";
import { ImSearch } from "react-icons/im";
import { IoIosAddCircle } from "react-icons/io";
import InfoNotification from "../../Organism/InfoNotification/InfoNotification.jsx";
import { CategoryContainerContext } from "../../../store/CategoryUI.jsx";
import { NotificationDataContext } from "../../../store/NotificationData.jsx";
import { RandomNumberContext } from "../../../store/RandomNumber.jsx";
import { AddNotificationContext } from "../../../store/ShowAddNotification.jsx";
import AddNotification from "../../Organism/AddNotification/AddNotification.jsx";

export default function ManageNotification() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { filterClass } = useContext(FilterClassContext);
  const { showCategoryContainer, setShowCategoryContainer } = useContext(
    CategoryContainerContext
  );
  const { showAddNotification, setShowAddNotification } = useContext(
    AddNotificationContext
  );

  const [searchValue, setSearchValue] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notifications, setNotification] = useState();
  const [idNotification, setIdNotification] = useState(false);
  const { setNotificationData } = useContext(NotificationDataContext);
  const { randomNumber, setRandomNumber } = useContext(RandomNumberContext);

  useEffect(() => {
    const getNotification = async () => {
      try {
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
          (notification) =>
            notification.type !== "Transaksi" &&
            notification.type !== "Notifikasi"
        );

        if (idNotification) {
          const filteredNotificationById = response.data.data.filter(
            (notification) => notification.id === idNotification
          );
          setNotificationData(filteredNotificationById);
          setIdNotification(false);
        }
        setNotification(filteredNotifications);
      } catch (error) {
        setIsError("Notifikasi tidak ditemukan");
      } finally {
        setIsLoading(false);
      }
    };
    getNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, filterClass, idNotification, randomNumber]);

  const handleShowSearchInput = () => {
    setSearchValue("");
    setShowSearchInput(!showSearchInput);
  };

  const handleSearchButtonClick = (value) => {
    setSearchValue(value);
  };

  const handleShowInfoNotification = (idNotification) => {
    setIdNotification(idNotification);
    setShowCategoryContainer(!showCategoryContainer);
  };

  const handleShowAddNotification = () => {
    setShowAddNotification(!showAddNotification);
  };

  const handleDeleteNotification = (title) => {
    console.log(title);

    const deleteNotification = async () => {
      try {
        if (!title) {
          return;
        }
        const result = await Swal.fire({
          title: "Yakin Menghapus Notifikasi?",
          imageUrl: "/images/logo-n-maskot/forgot_pass_aset.png",
          imageWidth: "200",
          imageHeight: "170",
          showCancelButton: true,
          confirmButtonColor: "#FF0000",
          cancelButtonColor: "#73CA5C",
          confirmButtonText: "Hapus",
          cancelButtonText: "Batal",
          customClass: {
            title: "text-[24px]",
            actions: "gap-3",
            confirmButton: "px-8",
            cancelButton: "px-10",
          },
        });

        if (result.isConfirmed) {
          setIsLoading(true);
          setIsError("");
          await axios.delete(
            `https://sinow-production.up.railway.app/api/v1/notifications/title/${title}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setRandomNumber(Math.random());
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Notifikasi berhasil dihapus",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#73CA5C",
        });
      } finally {
        setIsLoading(false);
      }
    };

    deleteNotification();
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
              <button
                className="bg-darkblue-05 hover:bg-white border hover:text-darkblue-05 inline-block rounded-[6px] py-[5px] px-[10px] w-[120px] h-[34px] mr-[16px] my-[10px] shadow-md text-white fill-white hover:border-darkblue-05"
                onClick={handleShowAddNotification}
              >
                <div className="flex gap-[7px] items-center justify-center">
                  <IoIosAddCircle className=" h-[24px] w-[24px]" />
                  <span className="text-[16px] font-semibold ">Tambah</span>
                </div>
              </button>
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
                  <th className="py-2 text-[12px] px-4 font-semibold w-1/7 ">
                    User ID
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
                        <td className="py-2 px-4 text-[12px]  text-gray-600">
                          {notification.userId}
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
                          <button
                            className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:stroke-2 stroke-[1.5] bg-alert-danger w-[50px] text-center leading-[14px] shadow-md"
                            onClick={() =>
                              handleDeleteNotification(notification.title)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6 mx-auto"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                          <button
                            className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:stroke-2 bg-sinow-05 stroke-[1.5] w-[50px] text-center leading-[14px] shadow-md "
                            onClick={() =>
                              handleShowInfoNotification(notification.id)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6 mx-auto"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </section>
        </section>
      </Navigation>
      {showCategoryContainer && <InfoNotification />}
      {showAddNotification && <AddNotification />}
    </>
  );
}
