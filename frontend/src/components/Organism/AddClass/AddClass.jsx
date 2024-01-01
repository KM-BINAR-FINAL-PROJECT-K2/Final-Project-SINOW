import { useContext, useRef, useState } from "react";
import { AddClassContext } from "../../../store/AddClassUI";
export default function AddClass() {
  const { toggleShowContainer } = useContext(AddClassContext);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    console.log(selectedFiles);
    return selectedFiles;
  };

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
              Tambah Kelas
            </h3>
            <form action="" className="text-left mt-[43px] w-[80%] mx-auto">
              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Nama Kelas
                </label>
                <input
                  type="text"
                  placeholder="text"
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                />
              </div>

              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Nama Kelas
                </label>
                <input
                  type="text"
                  placeholder="text"
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                />
              </div>

              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Nama Kelas
                </label>
                <input
                  type="text"
                  placeholder="text"
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                />
              </div>

              <div className="mb-[15px]">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Nama Kelas
                </label>
                <input
                  type="text"
                  placeholder="text"
                  className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                />
              </div>

              <div className="mb-[15px] select-wrapper">
                <label
                  htmlFor="name"
                  className="mb-[4px] block text-[10px] text-black font-semibold"
                >
                  Kategori
                </label>
                <select className="px-[16px]  py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none ">
                  <option value="">Tes1</option>
                  <option value="">Tes2</option>
                  <option value="">Te3</option>
                </select>
              </div>

              <div className="flex justify-between flex-wrap gap-[15px]">
                <button
                  className="text-white text-[16px] font-semibold bg-alert-danger p-[12px] rounded-[25px] flex-1 lg:w-full"
                  onClick={handleButtonClick}
                >
                  {selectedFiles && selectedFiles.length > 0
                    ? `Total Files: ${selectedFiles.length}`
                    : "Upload Video"}
                </button>
                <input
                  type="file"
                  multiple
                  id="videoUpload"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="video/mp4,video/x-m4v,video/*"
                />
                <button className="text-white text-[16px] font-semibold bg-darkblue-05 p-[12px] rounded-[25px] w-[120px] md:w-[200px]">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
