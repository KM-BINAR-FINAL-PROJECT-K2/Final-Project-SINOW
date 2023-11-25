export default function ClassTable() {
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
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">Level</th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
            Harga Kelas
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 text-[10px] font-bold text-gray-600">
            UIUX0123
          </td>
          <td className="px-4 py-2 text-[10px] font-bold text-gray-600">
            UI/UX Design
          </td>
          <td className="px-4 py-2 text-[10px] font-bold">
            Belajar Web Designer dengan Figma
          </td>
          <td className="px-4 py-2 text-[12px] font-bold text-alert-success">
            GRATIS
          </td>
          <td className="px-4 py-2 text-[10px] font-bold">Beginner</td>
          <td className="px-4 py-2 text-[10px] font-bold">Rp 0</td>
          <td className="px-4 text-[10px] font-bold ">
            <button className="mr-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] w-[50px] bg-darkblue-05 text-center leading-[14px]">
              Ubah
            </button>
            <button className="py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-danger w-[50px] text-center leading-[14px]">
              Hapus
            </button>
          </td>
        </tr>
        <tr>
          <td className="py-2 px-4 text-[10px] font-bold text-gray-600">
            DS0323
          </td>
          <td className="px-4 py-2 text-[10px] font-bold text-gray-600">
            Data Science
          </td>
          <td className="px-4 py-2 text-[10px] font-bold">
            Data Cleaning untuk Professional
          </td>
          <td className="px-4 py-2 text-[12px] font-bold text-darkblue-05">
            PREMIUM
          </td>
          <td className="px-4 py-2 text-[10px] font-bold">Advanced</td>
          <td className="px-4 py-2 text-[10px] font-bold">Rp 199,000</td>
          <td className="px-4 text-[10px] font-bold">
            <button className="mr-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] w-[50px] bg-darkblue-05 text-center leading-[14px]">
              Ubah
            </button>
            <button className="py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-danger w-[50px] text-center leading-[14px]">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
