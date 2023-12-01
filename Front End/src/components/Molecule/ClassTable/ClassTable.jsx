/* eslint-disable react/prop-types */
import { rupiah } from "../../../utils/formatCurrency";
import Loading from "../Loading/Loading";
export default function ClassTable({
  toggleShowInfo,
  dataClass,
  loading,
  error,
}) {
  return (
    <table className="w-full table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left ">
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
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan={7} className="text-center">
              <Loading />
            </td>
          </tr>
        )}

        {error && (
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
                    {error}
                    <br />
                    <span className="text-sm text-gray-800 font-normal">
                      Cek jaringan dan Muat{" "}
                      <a
                        href="/kelola-kelas"
                        className="text-darkblue-03 font-medium"
                        onClick={() => {
                          window.location.href = "/kelola-kelas";
                          window.location.reload();
                        }}
                      >
                        Ulang Halaman
                      </a>
                    </span>
                  </p>
                </div>
              </td>
            </tr>
          </>
        )}

        {!loading &&
          !error &&
          dataClass.map((classItem) => (
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
              <td className="px-4 text-[10px] font-bold ">
                <button className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] w-[50px] bg-darkblue-05 text-center leading-[14px]">
                  Ubah
                </button>
                <button className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-danger w-[50px] text-center leading-[14px]">
                  Hapus
                </button>
                <button
                  onClick={() => toggleShowInfo(classItem.id)}
                  className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-success w-[50px] text-center leading-[14px]"
                >
                  Info
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
