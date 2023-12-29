/* eslint-disable react/no-unescaped-entities */
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";

import Loading from "../../Molecule/Loading/Loading";
import { AddNotificationContext } from "../../../store/ShowAddNotification";
import { RandomNumberContext } from "../../../store/RandomNumber";
export default function AddNotification() {
  const { showAddNotification, setShowAddNotification } = useContext(
    AddNotificationContext
  );
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { setRandomNumber } = useContext(RandomNumberContext);
  const [newNotification, setNewNotification] = useState({
    title: "",
    type: "",
    content: "",
  });

  const handleShowAddNotificationContainer = () => {
    setShowAddNotification(!showAddNotification);
  };

  const handleAddNotificationForm = (e, value) => {
    e.preventDefault();
    const formData = new FormData(value);
    const title = formData.get("title");
    const type = formData.get("type");
    const content = formData.get("content");

    if (!title || !content) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Seluruh field harus diisi",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const data = {
      title,
      type,
      content,
    };

    setNewNotification(data);
  };

  useEffect(() => {
    const addNotification = async () => {
      try {
        if (!newNotification.title) {
          return;
        }
        const result = await Swal.fire({
          title: "Yakin Menambahkan Notifikasi?",
          imageUrl: "/images/logo-n-maskot/forgot_pass_aset.png",
          imageWidth: "200",
          imageHeight: "170",
          showCancelButton: true,
          confirmButtonColor: "#73CA5C",
          cancelButtonColor: "#FF0000",
          confirmButtonText: "Tambah",
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
          await axios.post(
            `https://sinow-production.up.railway.app/api/v1/notifications/`,
            newNotification,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("tessss");

          setRandomNumber(Math.random());
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Notifikasi berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: error.response.data.message,
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#73CA5C",
        });
      } finally {
        setIsLoading(false);
      }
    };

    addNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotification]);
  return (
    <div
      className={`
       ${showAddNotification ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[600px] py-[50px] text-center overflow-y-auto overflow-x-hidden relative px-7">
            <button
              onClick={handleShowAddNotificationContainer}
              className="absolute top-5 right-5 z-[100]"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px] "
                alt="exit icon"
              />
            </button>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[10px]">
              Tambah Notifikasi
            </h1>
            {isError && (
              <>
                <div className="font-bold bg-slate-950 bg-opacity-10 p-10 flex justify-center gap-5 items-center text-center">
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
                        href={`/kelola-kelas`}
                        className="text-darkblue-03 font-medium"
                        onClick={() => {
                          window.location.href = `/kelola-kelas`;
                          window.location.reload();
                        }}
                      >
                        Muat Ulang Halaman
                      </a>
                    </span>
                  </p>
                </div>
              </>
            )}
            {isLoading && (
              <div className="pt-3">
                <Loading />
              </div>
            )}
            {!isError && !isLoading && (
              <form
                action=""
                className="text-left mt-[25px] w-[90%] mx-auto"
                type="submit"
                onSubmit={(e) => handleAddNotificationForm(e, e.target)}
              >
                <div className="mb-[15px]">
                  <label
                    htmlFor="title"
                    className="mb-[4px] block text-[10px] text-black font-semibold"
                  >
                    Judul <span className="text-alert-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Versi lebih baru tersedia"
                    name="title"
                    className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                  />
                </div>

                <div className="mb-[15px] select-wrapper">
                  <label
                    htmlFor="name"
                    className="mb-[4px] block text-[10px] text-black font-semibold"
                  >
                    Tipe <span className="text-alert-danger">*</span>
                  </label>
                  <select
                    className="px-[16px]  py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                    name="type"
                  >
                    <option value="Promosi">Promosi</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div className="mb-[15px]">
                  <label
                    htmlFor="content"
                    className="mb-[4px] block text-[10px] text-black font-semibold"
                  >
                    Isi Konten <span className="text-alert-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="Versi 1.1.2 kini sudah tersedia, update aplikasi untuk menikmati fitur baru"
                    name="content"
                    className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none resize-none h-[200px]"
                  />
                </div>

                <button className="text-white mt-4 text-[16px] font-semibold bg-darkblue-05 p-[12px] rounded-[25px] w-full">
                  Simpan
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
