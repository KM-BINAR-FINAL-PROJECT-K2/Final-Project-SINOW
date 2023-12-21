/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { rupiah } from "../../../utils/formatCurrency";
import { Flowbite, Dropdown } from "flowbite-react";
import Loading from "../Loading/Loading";
import { LoaderContext } from "../../../store/Loader";
import { ClassContext } from "../../../store/ClassStore";
import { InfoClassContext } from "../../../store/InfoClassUI";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
import { ErrorContext } from "../../../store/Error";
import { FaPlus } from "react-icons/fa6";
export default function ClassTable() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { classSinow } = useContext(ClassContext);
  const { toggleShowInfo } = useContext(InfoClassContext);
  const { toggleShowWarning } = useContext(RemoveClassContext);
  const [categories, setCategories] = useState();

  const customTheme = {
    dropdown: {
      arrowIcon: "ml-2 h-4 w-4 text-black",
      content: "p-1 focus:outline-none",
      floating: {
        animation: "transition-opacity",
        arrow: {
          base: "absolute z-10 h-2 w-2 rotate-45",
          style: {
            dark: "bg-black border border-black fill-black ",
            light: "bg-black border border-black fill-black",
            auto: "bg-black border border-black fill-black ",
          },
          placement: "-4px",
        },
        base: "z-10 w-fit rounded divide-y divide-gray-100 shadow focus:outline-none",
        content: "py-1 text-sm text-white",
        divider: "my-1 h-px bg-gray-100 ",
        header: "block py-2 px-4 text-sm text-gray-700",
        hidden: "invisible opacity-0",
        item: {
          container: "",
          base: "flex items-center justify-start py-2 px-4 text-sm text-white cursor-default w-full bg-sinow-05 hover:bg-white hover:text-sinow-05 hover:stroke-sinow-05 focus:bg-gray-100 focus:outline-none",
          icon: "mr-2 h-4 w-4",
        },
        style: {
          dark: "bg-gray-900 text-sinow-05",
          light: "bg-sinow-05 text-gray-900",
          auto: "bg-sinow-05 text-gray-900 ",
        },
        target: "w-fit",
      },
      inlineWrapper: "flex items-center",
    },
  };

  useEffect(() => {
    try {
      const getCategories = async () => {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/v1/category"
        );
        setCategories(response.data.data);
      };
      getCategories();
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <table className="w-full snap-mandatory snap-x table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left text-gray-800">
          <th className="py-2 text-[12px] px-4 font-semibold w-1/7 ">
            Kode Kelas
          </th>
          <th className=" py-2 text-[12px] font-semibold w-1/7">
            {/* <div className="flex items-center gap-3">
              <span>Kategori</span>
              <button className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="rgb(0 204 244)"
                  // eslint-disable-next-line react/no-unknown-property
                  dataSlot="icon"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div> */}
            <Flowbite theme={{ theme: customTheme }}>
              <Dropdown
                label="Kategori"
                placement="right-start"
                style={{
                  color: "black",
                  border: "none",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                {categories && (
                  <>
                    {categories.map((category) => (
                      <Dropdown.Item key={category.id}>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            className="w-6 h-6 stroke-gray-700 cursor-pointer hover:stroke-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                          <input
                            className="bg-transparent"
                            type="text"
                            value={category.name}
                          />
                        </div>
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item>Tambah Kategori</Dropdown.Item>
                  </>
                )}
              </Dropdown>
            </Flowbite>
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-[150px] lg:w-2/7">
            Nama Kelas
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
            Tipe Kelas
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7 hidden lg:table-cell">
            Level
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7 hidden lg:table-cell">
            Harga Kelas
          </th>
          <th className=" px-4 py-2 text-[12px] font-semibold w-1/7">Aksi</th>
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

        {!isLoading &&
          !isError &&
          classSinow.map((classItem) => (
            <tr key={classItem.id} className="border-b border-slate-200">
              <td className="py-2 px-4 text-[10px] font-bold text-gray-600">
                {classItem.classCode ? classItem.classCode.toUpperCase() : "-"}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold text-gray-600">
                {classItem.category.name}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold">
                {classItem.name}
              </td>
              <td
                className={`px-4 py-2 text-[12px] font-bold ${
                  classItem && classItem.type === "gratis"
                    ? "text-alert-success"
                    : "text-darkblue-05"
                }`}
              >
                {classItem.type.toUpperCase()}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold hidden lg:table-cell">
                {classItem.level.charAt(0).toUpperCase() +
                  classItem.level.slice(1)}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold hidden lg:table-cell">
                {rupiah(classItem.price)}
              </td>
              <td
                className={`px-4 py-2 table-cell object-center text-[10px] font-bold`}
              >
                <a
                  className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] w-[50px] hover:bg-neutral-02 bg-alert-success text-center leading-[14px] shadow-md"
                  href={`/edit-kelas/${classItem.id}`}
                >
                  Ubah
                </a>
                <button
                  className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-alert-danger w-[50px] text-center leading-[14px] shadow-md"
                  onClick={() => toggleShowWarning(classItem.id)}
                >
                  Hapus
                </button>
                <button
                  onClick={() => toggleShowInfo(classItem.id)}
                  className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-sinow-03 w-[50px] text-center leading-[14px] shadow-md"
                >
                  Info
                </button>
                <a
                  className="m-2 py-[5px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-sinow-05 w-[50px] text-center leading-[14px] shadow-md cursor-pointer"
                  href={`/kelola-chapter/${classItem.id}`}
                >
                  Chapter
                </a>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
