/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { rupiah } from "../../../utils/formatCurrency";
import { Tooltip } from "flowbite-react";
import Loading from "../Loading/Loading";
import { LoaderContext } from "../../../store/Loader";
import { ClassContext } from "../../../store/ClassStore";
import { InfoClassContext } from "../../../store/InfoClassUI";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
import { ErrorContext } from "../../../store/Error";
import { CategoryContainerContext } from "../../../store/CategoryUI";

export default function ClassTable() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { classSinow } = useContext(ClassContext);
  const { toggleShowInfo } = useContext(InfoClassContext);
  const { toggleShowWarning } = useContext(RemoveClassContext);
  const { showCategoryContainer, setShowCategoryContainer } = useContext(
    CategoryContainerContext
  );

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

  const handleCategoryContainer = () => {
    console.log(showCategoryContainer);
    setShowCategoryContainer(!showCategoryContainer);
  };

  return (
    <table className="w-full snap-mandatory snap-x table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left text-gray-800">
          <th className="py-2 text-[12px] px-4 font-semibold w-1/7 ">
            Kode Kelas
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
            <Tooltip content="Kelola Kategori">
              <button
                className="cursor-pointer flex items-center gap-3"
                onClick={handleCategoryContainer}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-4 h-4 stroke-gray-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>

                <span>Kategori</span>
              </button>
            </Tooltip>
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
