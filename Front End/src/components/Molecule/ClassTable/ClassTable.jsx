/* eslint-disable react/prop-types */
import { useContext } from "react";
import { rupiah } from "../../../utils/formatCurrency";
import Loading from "../Loading/Loading";
import { LoaderContext } from "../../../store/Loader";
import { ClassContext } from "../../../store/ClassStore";
import { InfoClassContext } from "../../../store/InfoClassUI";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
import { ErrorContext } from "../../../store/Error";
import { RotateContext } from "../../../store/RotateAction";
export default function ClassTable() {
  const { isLoading } = useContext(LoaderContext);
  const { isError } = useContext(ErrorContext);
  const { classSinow } = useContext(ClassContext);
  const { toggleShowInfo } = useContext(InfoClassContext);
  const { toggleShowWarning } = useContext(RemoveClassContext);
  const { rotate, setRotate } = useContext(RotateContext);

  const toggleRotateIcon = () => {
    setRotate((prevRotated) => !prevRotated);
  };
  return (
    <table className="w-full snap-mandatory snap-x table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left">
          <th className="py-2 text-[12px] px-4 font-semibold w-1/7">
            Kode Kelas
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
            Kategori
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
          <th className=" px-4 py-2 text-[12px] font-semibold w-1/7 flex items-center justify-between gap-2 lg:mt-0 mt-1">
            Aksi{" "}
            <span className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`hover:cursor-pointer w-6 h-6 transition-all ${
                  rotate ? "rotate-180" : "rotate-0"
                }`}
                onClick={toggleRotateIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </span>
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
                className={`px-4 text-[10px] font-bold ${
                  rotate ? "block" : "hidden"
                }`}
              >
                <a
                  className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[4px] w-[50px] hover:bg-neutral-02 bg-alert-success text-center leading-[14px] shadow-md"
                  href={`/edit-kelas/${classItem.id}`}
                >
                  Ubah
                </a>
                <button
                  className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-alert-danger w-[50px] text-center leading-[14px] shadow-md"
                  onClick={() => toggleShowWarning(classItem.id)}
                >
                  Hapus
                </button>
                <button
                  onClick={() => toggleShowInfo(classItem.id)}
                  className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[4px] hover:bg-neutral-02 bg-sinow-03 w-[50px] text-center leading-[14px] shadow-md"
                >
                  Info
                </button>
              </td>
              <td
                className={`px-4 text-[10px] font-bold border-blue-600 h-[150px] flex items-center justify-center ${
                  !rotate ? "block" : "hidden"
                }`}
              >
                <div className=" text-center flex items-center justify-center border-red-500">
                  <a
                    className=" font-bold py-[10px] px-[20px] text-neutral-01 rounded-[10px] text-center bg-darkblue-05"
                    href={`/kelola-chapter/${classItem.id}`}
                  >
                    Kelola Chapter
                  </a>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
