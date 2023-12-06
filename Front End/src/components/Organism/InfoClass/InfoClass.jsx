/* eslint-disable react/prop-types */
import { useContext, useRef } from "react";
import { rupiah } from "../../../utils/formatCurrency";
import { convertSeconds } from "../../../utils/formatHour";
import "./rating.css";
import { ClassContext } from "../../../store/ClassStore";
import { InfoClassContext } from "../../../store/InfoClassUI";
import YoutubeEmbed from "../../Molecule/YoutubeEmbed/YoutubeEmbed";
import youtubeVideoId from "../../../utils/youtubeVideoId";
export default function InfoClass({ id }) {
  const { classSinow } = useContext(ClassContext);
  const { toggleShowInfo } = useContext(InfoClassContext);
  const details = classSinow.find((item) => item.id === id);
  console.log(details);

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
                    <h2 className="text-gray-800 font-semibold lg:text-lg md:text-md  text-sm mt-2">
                      {details.name}
                    </h2>
                    <p className="text-darkblue-05 font-semibold lg:text-md md:text-sm  text-xs pt-2">
                      {details.category.name ? details.category.name : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-[150px]"></div>

              <div className="flex items-center gap-8">
                <div className="mb-[15px]">
                  <label
                    htmlFor="name"
                    className=" block -mb-2 text-[10px] text-black font-semibold"
                  >
                    Rating
                  </label>
                  <div>
                    <p className="text-[50px] font-bold text-gray-600 -mb-3 inline-block">
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
                <div>|</div>
                <div className="mb-[15px]">
                  <label
                    htmlFor="name"
                    className=" block -mb-2 text-[10px] text-black font-semibold"
                  >
                    Level
                  </label>
                  <div>{details.level}</div>
                </div>
                <div>|</div>
                <div className="mb-[15px]">
                  <label
                    htmlFor="name"
                    className=" block -mb-2 text-[10px] text-black font-semibold"
                  >
                    Kelas
                  </label>
                  <div>{details.type}</div>
                </div>
              </div>

              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Pembuat Kelas
                </label>
                <input
                  type="text"
                  placeholder={
                    details.courseCreator.name
                      ? details.courseCreator.name
                      : "-"
                  }
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Dibuat Tanggal
                </label>
                <input
                  type="text"
                  placeholder={
                    details.createdAt ? details.createdAt.slice(0, 10) : "-"
                  }
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Deskripsi Kelas
                </label>
                <textarea
                  placeholder={details.description ? details.description : "-"}
                  className="px-[16px] py-[12px] rounded-[16px] text-[12px] border-neutral-02 text-gray-800 border w-full h-[200px] resize-none"
                  disabled
                ></textarea>
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Level
                </label>
                <input
                  type="text"
                  placeholder={
                    details.level
                      ? details.level.charAt(0).toUpperCase() +
                        details.level.slice(1)
                      : "-"
                  }
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Tipe Kelas
                </label>
                <input
                  type="text"
                  placeholder={details.type ? details.type.toUpperCase() : "-"}
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Harga
                </label>
                <input
                  type="text"
                  placeholder={rupiah(details.price)}
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Promo
                </label>
                <input
                  type="text"
                  placeholder={rupiah(details.promo)}
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>

              <div className="mb-[15px]">
                <label className="mb-[4px] block text-[10px] text-black font-semibold">
                  Durasi Kelas
                </label>
                <input
                  type="text"
                  placeholder={
                    details.totalDuration
                      ? convertSeconds(details.totalDuration)
                      : "-"
                  }
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label className="mb-[4px] block text-[10px] text-black font-semibold">
                  Total Modul
                </label>
                <input
                  type="text"
                  placeholder={details.totalModule ? details.totalModule : "-"}
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>
              <div className="mb-[15px]">
                <label className="mb-[4px] block text-[10px] text-black font-semibold">
                  Pengguna Terdaftar
                </label>
                <input
                  type="text"
                  placeholder={details.totalUser > 0 ? details.totalUser : "0"}
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-800 border w-full "
                  disabled
                />
              </div>

              <div className="mb-[15px]">
                <label className="mb-[4px] block text-[10px] text-black font-semibold">
                  Video
                </label>
                {/* <video
                  src="https://www.youtube.com/embed/ixOd42SEUF0?si=BPy9frn5kkFpNQBJ"
                  autoPlay
                  loop
                  muted
                ></video> */}
              </div>

              <div className="mt-[30px] flex justify-between flex-wrap gap-[15px]">
                <a
                  href={details.videoPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white text-[16px] font-semibold bg-alert-danger p-[12px] rounded-[15px] flex-1 lg:w-full text-center"
                >
                  Preview Video
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
