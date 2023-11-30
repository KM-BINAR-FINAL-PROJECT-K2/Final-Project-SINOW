/* eslint-disable react/prop-types */
import { rupiah } from "../../../utils/formatCurrency";
import { convertSeconds } from "../../../utils/formatHour";
export default function InfoClass({ toggleShowContainer, dataClass, id }) {
  const details = dataClass[id - 1];
  console.log(details);
  return (
    <div
      className={`
       ${toggleShowContainer ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[500px] py-[50px] text-center overflow-y-auto">
            <button
              onClick={toggleShowContainer}
              className="absolute top-5 right-5"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px]"
                alt="exit icon"
              />
            </button>
            <h3 className="text-darkblue-05 font-semibold text-[20px]">
              Detail Kelas
            </h3>
            <div className="text-left mt-[10px] md:mt-[15px] w-[80%] mx-auto">
              <div className="mb-[15px]">
                <img
                  src={details.imageUrl ? details.imageUrl : ""}
                  alt="image"
                  className="w-[200px] md:w-[300px] h-[150px] rounded-[16px] object-cover mx-auto mb-3"
                  disabled
                />
                <hr className="border-neutral-02 mb-[20px]" />
              </div>

              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder={
                    details.category.name ? details.category.name : "-"
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
                  Rating
                </label>
                <input
                  type="text"
                  placeholder={`${details.rating ? details.rating : "-"} / 5`}
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
