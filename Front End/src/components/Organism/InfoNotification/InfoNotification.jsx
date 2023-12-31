/* eslint-disable react/no-unescaped-entities */
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

import { CategoryContainerContext } from "../../../store/CategoryUI";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";

import Loading from "../../Molecule/Loading/Loading";
import { RandomNumberContext } from "../../../store/RandomNumber";
import { NotificationDataContext } from "../../../store/NotificationData";
import { formatTime } from "../../../utils/formatTime";
export default function InfoNotification() {
  const { showCategoryContainer, setShowCategoryContainer } = useContext(
    CategoryContainerContext
  );
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { setRandomNumber } = useContext(RandomNumberContext);
  const { notificationData } = useContext(NotificationDataContext);
  const [activeEdit, setActiveEdit] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [form, setForm] = useState();

  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [type, setType] = useState();
  // eslint-disable-next-line no-unused-vars
  const [notificationId, setNotificationId] = useState(false);

  useEffect(() => {
    if (notificationData && notificationData.length > 0) {
      notificationData.map((notification) => {
        setType(notification.type);
        setTitle(notification.title);
        setContent(notification.content);
        setNotificationId(notification.id);
      });
    }
  }, [notificationData]);

  useEffect(() => {
    if (!form || form.length > 0) {
      return;
    }
    const updateNotification = async () => {
      try {
        const result = await Swal.fire({
          title: "Simpan Perubahan?",
          imageUrl: "/images/logo-n-maskot/forgot_pass_aset.png",
          imageWidth: "200",
          imageHeight: "170",
          showCancelButton: true,
          confirmButtonColor: "#73CA5C",
          cancelButtonColor: "#FF0000",
          confirmButtonText: "Simpan",
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
          const encodedTitle = encodeURIComponent(title);
          await axios.put(
            `https://sinow-production.up.railway.app/api/v1/notifications/title/` +
              encodedTitle,
            form,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setType(form.type);
          setTitle(form.title);
          setContent(form.content);
          setRandomNumber(Math.random());
          handleActiveEdit();

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Notifikasi berhasil diperbarui",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Terjadi Kesalahan",
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#73CA5C",
        });
      } finally {
        setIsLoading(false);
      }
    };
    updateNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleCategoryContainer = () => {
    if (showCategoryContainer) {
      if (form) {
        setRandomNumber(Math.random());
      }
    }
    setShowCategoryContainer(!showCategoryContainer);
  };

  const handleActiveEdit = () => {
    setActiveEdit(!activeEdit);
  };

  const handleUpdateNotification = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const content = formData.get("content");
    const camelCaseType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    const updateNotificationData = {
      title,
      content,
      type: camelCaseType,
    };

    setForm(updateNotificationData);
  };

  const handleShowTypeDropdown = () => {
    setShowTypeDropdown(!showTypeDropdown);
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setShowTypeDropdown(false);
  };

  return (
    <div
      className={`
       ${showCategoryContainer ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[600px] py-[50px] text-center overflow-y-auto overflow-x-hidden relative px-7">
            <button
              onClick={handleCategoryContainer}
              className="absolute top-5 right-5 z-[100]"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px] "
                alt="exit icon"
              />
            </button>
            {/* <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Info Notifikasi
            </h1> */}
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
            {!isError &&
              !isLoading &&
              notificationData &&
              notificationData.map((notification) => (
                <form
                  key={notification.id}
                  type="submit"
                  onSubmit={(e) => handleUpdateNotification(e, notification.id)}
                >
                  <div className="text-right mt-3">
                    {!activeEdit && (
                      <span
                        className="mr-3 py-[10px] px-[20px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-white border border-sinow-05 hover:text-sinow-05 bg-sinow-05 text-center leading-[14px] shadow-md cursor-pointer"
                        onClick={handleActiveEdit}
                      >
                        Edit
                      </span>
                    )}
                    {activeEdit && (
                      <>
                        <button className="mr-3 py-[10px] px-[20px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-white border border-alert-success hover:text-alert-success bg-alert-success text-center leading-[14px] shadow-md cursor-pointer">
                          Simpan
                        </button>
                        <span
                          className="mr-3 py-[10px] px-[20px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-white border border-alert-danger hover:text-alert-danger bg-alert-danger text-center leading-[14px] shadow-md cursor-pointer"
                          onClick={handleActiveEdit}
                        >
                          Batal
                        </span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-11 overflow-y-auto overflow-x-hidden m-3">
                    <div className="flex items-center justify-center sm:col-span-1 col-span-2 px-3">
                      <p className="font-bold text-gray-700 text-5xl">
                        <img
                          src="/images/logo-n-maskot/notify_null.svg"
                          alt=""
                          className="w-[150px]"
                        />
                      </p>
                    </div>
                    <div className=" h-[100px] border-t-2 border-gray-600  flex items-center justify-center sm:col-span-1 col-span-2 px-3">
                      <p className="font-extrabold text-sinow-05 text-2xl sm:text-xl lg:text-3xl uppercase flex items-center gap-2">
                        <p>{type}</p>
                        {activeEdit && (
                          <span className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 cursor-pointer"
                              onClick={handleShowTypeDropdown}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                              />
                            </svg>
                            {showTypeDropdown && (
                              <div className="absolute left-[-100px] top-9">
                                <p
                                  className="font-normal text-sm bg-gray-700 text-white py-1 px-2 border-b border-white cursor-pointer hover:font-semibold"
                                  onClick={() => handleTypeChange("PROMOSI")}
                                >
                                  PROMOSI
                                </p>
                                <p
                                  className="font-normal text-sm bg-gray-700 text-white py-1 px-2 cursor-pointer hover:font-semibold"
                                  onClick={() => handleTypeChange("PENGUMUMAN")}
                                >
                                  PENGUMUMAN
                                </p>
                              </div>
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className=" mx-3 flex p-8 justify-center bg-sinow-05  col-span-2 rounded-t-3xl flex-col gap-6">
                      <div className="flex mb-5 justify-center">
                        <hr className="border-2 border-white w-[40%]" />
                        <hr className="border-2 border-sinow-03 w-[40%]" />
                      </div>
                      <p className="text-center">
                        {notification.type === "promosi" ? (
                          <svg
                            fill="#ffffff"
                            height="100px"
                            width="100px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 511.999 511.999"
                            xmlSpace="preserve"
                            stroke="#ffffff"
                            className="mx-auto"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              {"{"}" "{"}"}
                              <g>
                                {"{"}" "{"}"}
                                <g>
                                  {"{"}" "{"}"}
                                  <g>
                                    {"{"}" "{"}"}
                                    <path d="M361.079,110.717c3.076-4.802,1.674-11.19-3.128-14.264c-30.42-19.474-65.673-29.769-101.95-29.769 c-104.388,0-189.317,84.927-189.317,189.317s84.928,189.317,189.317,189.317s189.317-84.927,189.315-189.316 c0-42.677-13.861-82.965-40.087-116.509c-3.51-4.491-10-5.286-14.494-1.775c-4.494,3.512-5.288,10.001-1.775,14.495 c23.358,29.876,35.704,65.765,35.704,103.787c0,93.002-75.662,168.664-168.664,168.664S87.337,349.001,87.337,255.999 S162.999,87.336,256.001,87.336c32.323,0,63.725,9.167,90.814,26.51C351.613,116.92,358.003,115.52,361.079,110.717z" />
                                    {"{"}" "{"}"}
                                    <path d="M500.389,255.999c0-11.871,2.872-25.02,5.649-37.735c4.878-22.338,9.922-45.437,1.246-66.359 c-9.045-21.812-29.357-34.694-49.002-47.151c-11.117-7.051-21.618-13.709-29.474-21.566 c-7.855-7.856-14.515-18.356-21.564-29.474c-12.458-19.643-25.34-39.956-47.15-49.001c-20.924-8.674-44.021-3.631-66.36,1.247 c-12.715,2.777-25.863,5.648-37.734,5.648c-11.871,0-25.019-2.871-37.734-5.648c-22.337-4.878-45.437-9.922-66.36-1.247 c-21.812,9.044-34.692,29.357-47.15,49.001c-7.049,11.117-13.709,21.618-21.564,29.474c-7.856,7.855-18.358,14.515-29.474,21.564 C34.073,117.21,13.76,130.093,4.715,151.905c-8.675,20.921-3.632,44.019,1.246,66.357c2.777,12.715,5.649,25.864,5.649,37.735 c0,11.871-2.872,25.02-5.649,37.735c-4.878,22.338-9.922,45.437-1.246,66.359c9.046,21.813,29.359,34.695,49.003,47.153 l3.971,2.524c4.808,3.066,11.192,1.656,14.259-3.152c3.069-4.808,1.658-11.192-3.15-14.26l-4.019-2.554 c-17.713-11.232-34.443-21.842-40.987-37.621c-6.192-14.936-2.043-33.931,2.348-54.041c3.01-13.786,6.123-28.042,6.123-42.143 c0-14.1-3.112-28.356-6.123-42.143c-4.391-20.11-8.539-39.105-2.348-54.04c6.544-15.78,23.274-26.39,40.986-37.622 c11.577-7.34,23.545-14.932,33.017-24.402c9.47-9.47,17.062-21.44,24.403-33.017c11.231-17.712,21.841-34.44,37.62-40.983 c14.935-6.194,33.931-2.046,54.043,2.346c13.785,3.01,28.041,6.123,42.14,6.123c14.099,0,28.353-3.112,42.14-6.123 c20.112-4.392,39.109-8.541,54.043-2.346c15.779,6.543,26.387,23.271,37.62,40.983c7.341,11.577,14.933,23.547,24.403,33.017 c9.47,9.47,21.442,17.062,33.017,24.403c17.713,11.232,34.442,21.842,40.986,37.621c6.192,14.936,2.043,33.931-2.347,54.041 c-3.01,13.786-6.123,28.042-6.123,42.143s3.112,28.356,6.123,42.143c4.391,20.11,8.539,39.105,2.347,54.04 c-6.544,15.78-23.274,26.39-40.986,37.622c-11.577,7.34-23.545,14.932-33.017,24.402c-9.47,9.47-17.062,21.44-24.403,33.017 c-11.231,17.712-21.841,34.44-37.62,40.983c-14.935,6.193-33.931,2.046-54.043-2.346c-13.785-3.01-28.041-6.123-42.14-6.123 c-14.099,0-28.353,3.112-42.14,6.123c-20.112,4.392-39.105,8.541-54.043,2.348c-15.779-6.543-26.387-23.273-37.62-40.983 c-2.942-4.639-5.984-9.434-9.124-14.031c-3.219-4.709-9.646-5.916-14.352-2.699c-4.709,3.218-5.918,9.643-2.7,14.352 c2.942,4.304,5.757,8.74,8.735,13.438c12.458,19.643,25.339,39.956,47.15,49.001c8.271,3.428,16.877,4.714,25.645,4.714 c13.416,0,27.206-3.011,40.715-5.963c12.715-2.777,25.863-5.648,37.734-5.648c11.871,0,25.019,2.871,37.734,5.648 c22.338,4.878,45.436,9.922,66.36,1.247c21.812-9.045,34.692-29.357,47.15-49.001c7.049-11.117,13.709-21.618,21.564-29.474 c7.856-7.855,18.357-14.515,29.474-21.564c19.645-12.458,39.957-25.341,49.002-47.153c8.675-20.921,3.632-44.019-1.246-66.357 C503.261,281.019,500.389,267.87,500.389,255.999z" />
                                    {"{"}" "{"}"}
                                    <path d="M166.087,345.913c2.017,2.017,4.661,3.025,7.303,3.025c2.642,0,5.286-1.009,7.301-3.025l165.222-165.222 c4.033-4.031,4.033-10.57,0-14.603s-10.57-4.033-14.604,0L166.087,331.31C162.055,335.341,162.055,341.88,166.087,345.913z" />
                                    {"{"}" "{"}"}
                                    <path d="M200.927,238.79c20.877,0,37.863-16.985,37.863-37.863c0-20.878-16.986-37.863-37.863-37.863 s-37.863,16.985-37.863,37.863C163.064,221.805,180.05,238.79,200.927,238.79z M200.927,183.716 c9.489,0,17.211,7.72,17.211,17.211c0,9.491-7.72,17.211-17.211,17.211c-9.491,0-17.211-7.72-17.211-17.211 C183.717,191.436,191.437,183.716,200.927,183.716z" />
                                    {"{"}" "{"}"}
                                    <path d="M311.075,348.938c20.877,0,37.863-16.985,37.863-37.863c0-20.879-16.986-37.863-37.863-37.863 s-37.863,16.985-37.863,37.863C273.212,331.953,290.198,348.938,311.075,348.938z M311.075,293.864 c9.489,0,17.211,7.72,17.211,17.211c0,9.491-7.72,17.211-17.211,17.211c-9.491,0-17.211-7.72-17.211-17.211 C293.864,301.584,301.584,293.864,311.075,293.864z" />
                                    {"{"}" "{"}"}
                                  </g>
                                  {"{"}" "{"}"}
                                </g>
                                {"{"}" "{"}"}
                              </g>
                              {"{"}" "{"}"}
                            </g>
                          </svg>
                        ) : (
                          <svg
                            className="mx-auto"
                            fill="#fff"
                            width="100px"
                            height="100px"
                            viewBox="-6.31 0 122.88 122.88"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            style={{
                              enableBackground: "new 0 0 110.26 122.88",
                            }}
                            xmlSpace="preserve"
                            stroke="#fff"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <style
                                type="text/css"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    ".st0{fill-rule: evenodd;clip-rule:evenodd}",
                                }}
                              />{" "}
                              <g>
                                {" "}
                                <path
                                  className="st0"
                                  d="M10.69,55.55C5.74,57,3.64,62.09,3.71,67.87c0.03,2.61,0.5,5.35,1.35,8c0.85,2.64,2.07,5.15,3.62,7.31 c3.52,4.93,8.76,7.94,14.9,5.83c0.46-0.16,0.95-0.12,1.36,0.07c0.1-0.04,0.2-0.07,0.31-0.11c1.53-0.5,2.95-0.93,4.24-1.32 c1.44-0.43,2.8-0.82,4.08-1.16c0.99-0.27,2.01,0.32,2.28,1.31c0.02,0.07,0.03,0.14,0.04,0.21c0.18,0.81,0.37,1.62,0.55,2.43 c1.41,6.28,2.77,12.34,4.59,17.26c0.03,0.09,0.27,0.76,0.52,1.43c1.12,3.1,2.33,6.41,3.88,8.36c1.37,1.71,3.26,2.22,6.2-0.08 c0.55-0.52,1.11-1,1.68-1.49c1.75-1.51,3.51-3.01,4.15-5.27c-0.4-0.55-1.17-0.88-1.94-1.21c-2.57-1.09-5.14-2.19-4.45-7.59 c0.03-0.28,0.07-0.53,0.1-0.78c0.2-1.58,0.31-2.39,0.21-2.74c-0.05-0.19-0.44-0.54-1.21-1.25l-0.28-0.26 c-1.52-1.39-2.06-3.38-2.04-5.53c0.02-2.53,0.85-5.31,1.68-7.31c0.26-0.63,0.83-1.04,1.46-1.13l0,0 c19.22-2.66,30.94,0.68,40.26,3.34c0.4,0.11,0.8,0.23,1.19,0.34c-8.32-8.58-15.14-21.58-19.81-34.9 c-4.93-14.07-7.46-28.61-6.8-38.79c-7.62,11.26-20.99,29.14-52.86,40.86c-0.03,0.01-0.06,0.02-0.09,0.03l-0.25,0.09 c-0.33,0.12-0.38,0.09-0.43,0.13c-0.07,0.06,0,0.06-0.13,0.27c-0.02,0.03,0.04-0.07-0.34,0.53C11.49,55.15,11.11,55.42,10.69,55.55 L10.69,55.55L10.69,55.55z M90.07,52.82c0,4.61-4.52,12.9-7.35,13.06c4.82,9.44,10.74,17.61,17.41,22.49 c0.39,0.05,0.75,0.08,1.09,0.06c0.65-0.02,1.29-0.2,1.99-0.64c1.52-1.53,2.48-3.93,2.97-6.96c1.5-9.34-1.56-23.97-6.69-38.05 C94.35,28.67,87.17,15.22,80.46,8.26C78,5.71,75.68,4.11,73.67,3.78c-0.51-0.08-0.8-0.1-0.94-0.05c-0.17,0.06-0.43,0.3-0.84,0.71 c-0.2,0.2-0.4,0.42-0.61,0.66c-0.02,0.06-0.05,0.12-0.07,0.17c-3.14,6.48-2.12,20.47,1.95,35.47l0,0 C76.23,39.3,90.07,40.94,90.07,52.82L90.07,52.82z M99.94,92.08c-0.4,0.08-0.83,0.02-1.21-0.18c-0.35-0.06-0.7-0.14-1.07-0.21 c-2.42-0.5-4.83-1.19-7.43-1.93c-8.81-2.51-19.86-5.66-37.66-3.38c-0.55,1.52-1.01,3.33-1.02,4.94c-0.01,1.16,0.21,2.18,0.83,2.75 l0.28,0.26c1.32,1.2,1.97,1.79,2.3,3.04c0.28,1.04,0.14,2.09-0.13,4.17c-0.03,0.24-0.06,0.5-0.1,0.78 c-0.33,2.62,0.95,3.17,2.23,3.71c1.66,0.71,3.33,1.42,4.15,3.69c0.14,0.33,0.19,0.71,0.12,1.09c-0.75,3.84-3.13,5.89-5.52,7.94 c-0.53,0.46-1.06,0.91-1.56,1.38l0,0c-0.04,0.04-0.08,0.07-0.12,0.11c-5.2,4.16-8.77,2.99-11.5-0.42 c-1.95-2.44-3.26-6.04-4.48-9.41c-0.1-0.29-0.21-0.57-0.52-1.42c-1.89-5.1-3.28-11.31-4.72-17.73l-0.15-0.65 c-0.72,0.2-1.43,0.41-2.13,0.62c-1.45,0.43-2.84,0.86-4.17,1.29c-0.17,0.05-0.28,0.1-0.37,0.14c-0.87,0.35-1.26,0.5-2.04,0.14 c-7.65,2.23-14.04-1.46-18.32-7.45C3.89,82.86,2.49,79.99,1.53,77C0.57,74.01,0.04,70.89,0,67.9c-0.08-7.1,2.62-13.44,8.94-15.68 c0.31-0.51,0.49-0.79,0.88-1.12c0.44-0.37,0.8-0.5,1.55-0.77l0.24-0.09c0.03-0.01,0.06-0.02,0.09-0.03 C44.41,38.17,56.97,19.42,64.11,8.75c2-2.98,3.59-5.36,5.16-6.93c0.77-0.77,1.36-1.26,2.16-1.56c0.83-0.31,1.64-0.33,2.82-0.14 c2.86,0.46,5.87,2.45,8.88,5.57c7.06,7.32,14.55,21.28,19.85,35.84c5.31,14.6,8.47,29.91,6.86,39.89 c-0.62,3.88-1.96,7.03-4.16,9.15l0,0c-0.07,0.07-0.16,0.14-0.25,0.2c-1.4,0.95-2.72,1.32-4.08,1.38 C100.88,92.16,100.41,92.13,99.94,92.08L99.94,92.08z"
                                />{" "}
                              </g>{" "}
                            </g>
                          </svg>
                        )}
                      </p>

                      {activeEdit && (
                        <input
                          id="titleId"
                          className="text-white mx-auto font-bold bg-sinow-05 w-full border-b border-gray-700 p-1"
                          defaultValue={title}
                          name="title"
                        />
                      )}

                      {!activeEdit && (
                        <p className="text-white font-bold ">{title}</p>
                      )}

                      <div className="text-gray-700 font-normal">
                        {activeEdit && (
                          <input
                            type="text"
                            name="content"
                            className="mx-auto w-full bg-sinow-05 p-1 border-b border-gray-700 "
                            defaultValue={content}
                          />
                        )}
                        {!activeEdit && (
                          <p className="text-center">{content}</p>
                        )}
                        <p className="italic">
                          Terakhir diperbarui:{" "}
                          {formatTime(notification.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
