/* eslint-disable react/prop-types */
import { useContext, useRef } from "react";
import { rupiah } from "../../../utils/formatCurrency";
import { convertSeconds } from "../../../utils/formatHour";
import "./rating.css";
import { ClassContext } from "../../../store/ClassStore";
import { InfoClassContext } from "../../../store/InfoClassUI";
import YoutubeEmbed from "../../Molecule/YoutubeEmbed/YoutubeEmbed";
import youtubeVideoId from "../../../utils/youtubeVideoId";
import "./skills.css";
export default function InfoClass({ id }) {
  const { classSinow } = useContext(ClassContext);
  const { toggleShowInfo } = useContext(InfoClassContext);
  const details = classSinow.find((item) => item.id === id);
  const formattedDescription = details.description
    .split("\n")
    .map((paragraph, index) => (
      <p key={index} className="mb-4" style={{ textIndent: "25px" }}>
        {paragraph}
      </p>
    ));
  return (
    <div
      className={`
       ${toggleShowInfo ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[500px] py-[50px] text-center overflow-y-auto overflow-x-hidden relative">
            <button
              onClick={toggleShowInfo}
              className="absolute top-5 right-5 z-[100]"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px] "
                alt="exit icon"
              />
            </button>
            <div className="relative top-0 -mt-[50px] z-0 bg-black drop-shadow-md">
              {details.videoPreviewUrl.includes("youtu.be") ||
              details.videoPreviewUrl.includes("youtube") ? (
                <YoutubeEmbed
                  embedId={youtubeVideoId(details.videoPreviewUrl)}
                ></YoutubeEmbed>
              ) : (
                <video
                  className="w-full h-[300px] bg-black drop-shadow-md"
                  src={details.videoPreviewUrl}
                  loop
                  autoPlay={true}
                ></video>
              )}
            </div>
            <div className="text-left mt-[10px] md:mt-[15px] w-[80%] mx-auto ">
              <div className="mb-[15px] absolute left-[30px] top-[285px] ">
                <div className="flex gap-4">
                  <img
                    src={
                      details.imageUrl
                        ? details.imageUrl
                        : "/images/logo-n-maskot/Stiker-1.png"
                    }
                    alt="image"
                    className="w-[90px] md:w-[120px] h-[90px] md:h-[120px] rounded-[16px] object-cover mx-auto mb-3"
                    disabled
                  />
                  <div className="py-3">
                    <h2 className="text-gray-800 font-semibold lg:text-lg md:text-md  text-sm mt-4">
                      {details.name}
                    </h2>
                    <p className="text-darkblue-05 font-semibold lg:text-md md:text-sm  text-xs pt-2">
                      {details.category.name ? details.category.name : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-[150px]"></div>

              <div className="flex md:flex-row flex-col md:items-center gap-8 mb-[15px]">
                <div className="self-start md:self-end">
                  <label
                    htmlFor="name"
                    className=" block -mb-2 md:text-[10px] text-[8px] text-black font-semibold"
                  >
                    Rating
                  </label>
                  <div>
                    <p className="text-[50px] font-bold text-gray-600 -mb-3 inline-block ">
                      {`${details.rating ? details.rating : "0"}`}{" "}
                    </p>
                    <span className="w-[16px] text-gray-600 font-semibold">
                      {" "}
                      / 5
                    </span>
                  </div>
                  <i
                    className="text-lg"
                    data-star={`${details.rating ? details.rating : "0"} / 5`}
                  ></i>
                </div>
                <div className="md:self-center md:block hidden">|</div>
                <div className="self-start md:self-end">
                  <label
                    htmlFor="name"
                    className=" block md:text-[10px] text-[8px] -mb-2  text-black font-semibold"
                  >
                    Level
                  </label>
                  <div>
                    <p className="inline-block font-bold text-gray-600 -mb-3">
                      <span
                        className="font-bold text-gray-600"
                        style={{ fontSize: "50px" }}
                      >
                        {details.level.charAt(0).toUpperCase()}
                      </span>
                      <span>{details.level.slice(1)}</span>
                    </p>
                  </div>
                  <div className="p-2 invisible">
                    <div className="container">
                      {console.log(details.level.toLowerCase())}
                      <div
                        className={`skills ${details.level.toLowerCase()}`}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="md:self-center md:block hidden">|</div>
                <div className="md:self-end md:block hidden">
                  <label
                    htmlFor="name"
                    className=" block md:text-[10px] text-[8px] -mb-2  text-black font-semibold"
                  >
                    Tipe
                  </label>
                  <div>
                    <p className="inline-block font-bold text-gray-600 -mb-3">
                      <span
                        className="font-bold text-gray-600"
                        style={{ fontSize: "50px" }}
                      >
                        {details.type.charAt(0).toUpperCase()}
                      </span>
                      <span className="">{details.type.slice(1)}</span>
                    </p>
                  </div>
                  <i
                    className="text-lg invisible"
                    data-star={`${details.rating ? details.rating : "0"}`}
                  ></i>
                </div>
              </div>

              <div className="mb-[15px] pt-10 pb-5 flex items-center md:flex-row flex-col gap-2 ">
                <div className="inline-block py-3 px-6 rounded-lg border border-darkblue-05 relative overflow-hidden md:w-auto w-full ">
                  {details.promoDiscountPercentage > 0 && (
                    <div className="absolute top-0 right-0  bg-darkblue-05 rounded-bl-md">
                      <p className="text-[20px] font-bold px-2 text-white">
                        {details.promoDiscountPercentage}%
                      </p>
                    </div>
                  )}
                  <span
                    className={` ${
                      details.promoDiscountPercentage > 0 && "line-through"
                    } text-${
                      details.promoDiscountPercentage > 0
                        ? "gray-600"
                        : "darkblue-05"
                    } ${
                      details.promoDiscountPercentage > 0
                        ? "font-normal"
                        : "font-bold"
                    } ${
                      details.promoDiscountPercentage > 0
                        ? "text-[10px]"
                        : "text-[18px]"
                    } `}
                  >
                    {rupiah(details.price)} <br />{" "}
                  </span>
                  {details.promoDiscountPercentage > 0 && (
                    <span className="text-darkblue-05 font-semibold ">
                      {rupiah(
                        details.price -
                          (details.price * details.promoDiscountPercentage) /
                            100
                      )}
                    </span>
                  )}
                </div>
                <span
                  className={`py-3 px-6 md:ml-4 rounded-lg border bg-darkblue-05 text-white text-[18px] font-semibold md:w-auto w-full ${
                    !details.totalDuration && "hidden"
                  } inline-block}`}
                >
                  {details.totalDuration
                    ? convertSeconds(details.totalDuration)
                    : "-"}
                </span>
                <span className="py-3 px-6 md:ml-4 rounded-lg border bg-darkblue-05 text-white text-[18px] font-semibold md:w-auto w-full md:hidden">
                  {details.type.charAt(0).toUpperCase() + details.type.slice(1)}
                </span>
              </div>

              <div className="mb-[15px]">
                <p className="font-semibold text-[17px] text-gray-600 mb-2">
                  Tentang kelas ini
                </p>
                <p className="font-normal text-[13px] text-gray-600">
                  {formattedDescription}
                </p>
                <div className="mb-[15px]">
                  <p className="font-semibold text-[13px] text-gray-600 indent-6 mb-2">
                    Keuntungan yang didapat di kelas ini adalah:
                  </p>
                  <div className="font-normal text-[13px] text-gray-600 ml-4">
                    <ol className="list-decimal">
                      {details.benefits
                        .sort((a, b) => a.no - b.no)
                        .map((benefit) => (
                          <li key={benefit.id}>{benefit.description}</li>
                        ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mb-[15px]  p-3 border border-gray-300 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(75 85 99)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </span>
                  <span>
                    <p className="text-[10px] font-medium text-gray-600">
                      Pengguna Terdaftar
                    </p>
                    <p className="text-[13px] font-semibold text-gray-600 tracking-widest">
                      {details.totalUser}
                    </p>
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2">
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(75 85 99)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </span>
                  <span>
                    <p className="text-[10px] font-medium text-gray-600">
                      Total Modul
                    </p>
                    <p className="text-[13px] font-semibold text-gray-600 tracking-widest">
                      {details.totalModule}
                    </p>
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2">
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(75 85 99)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </span>
                  <span>
                    <p className="text-[10px] font-medium text-gray-600">
                      Dibuat Oleh
                    </p>
                    <p className="text-[13px] font-semibold text-gray-600 tracking-widest">
                      {details.courseBy}
                    </p>
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2">
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(75 85 99)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </span>
                  <span>
                    <p className="text-[10px] font-medium text-gray-600">
                      Dibuat Tanggal
                    </p>
                    <p className="text-[13px] font-semibold text-gray-600 tracking-widest">
                      {details.createdAt ? details.createdAt.slice(0, 10) : "-"}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
