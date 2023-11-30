import axios from "axios";
import { useEffect, useState } from "react";
import { rupiah } from "../../../utils/formatCurrency";
export default function ClassTable() {
  const [classSinow, setClassSinow] = useState([]);
  useEffect(() => {
    const getClasses = async () => {
      try {
        const res = await axios.get(
          "https://sinow-production.up.railway.app/api/v1/courses"
        );
        setClassSinow(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getClasses();
  }, []);

  return (
    <table className="w-full table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left border-orange-700">
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
        {classSinow.map((classItem) => (
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
              <button className="m-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-success w-[50px] text-center leading-[14px]">
                Info
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
