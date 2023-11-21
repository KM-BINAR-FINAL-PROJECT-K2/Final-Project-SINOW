import Card from "../../Molecule/Card/Card";
import Navigation from "../../Template/Navigation/Navigation";
export default function CRUD() {
  return (
    <>
      <Navigation>
        <section className="mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
          <Card
            color={"bg-darkblue-03"}
            quantity={"450"}
            description={"Active Users"}
          />
          <Card
            color={"bg-alert-success"}
            quantity={"25"}
            description={"Active Class"}
          />
          <Card
            color={"bg-darkblue-05"}
            quantity={"20"}
            description={"Premium Class"}
          />
        </section>

        <section className="mx-16">
          <div className="py-[10px] flex">
            <h2 className="my-[10px] font-semibold text-[20px] flex-1">
              Kelola Kelas
            </h2>
            <button className="bg-darkblue-05 inline-block rounded-[16px] py-[5px] px-[10px] w-[125px] h-[34px] mr-[16px] my-[10px]">
              <div className="flex gap-[8px] items-center justify-center">
                <img
                  src="/images/gala-add.png"
                  alt=""
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[16px] font-semibold text-neutral-01">
                  Tambah
                </span>
              </div>
            </button>
            <button className="bg-neutral-01 border-2 border-darkblue-05 inline-block rounded-[16px] py-[5px] px-[10px] w-[125px] h-[34px] mr-[16px] my-[10px]">
              <div className="flex gap-[8px] items-center justify-center">
                <img
                  src="/images/prefix-wrapper.png"
                  alt=""
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[16px] font-semibold text-darkblue-05">
                  Filter
                </span>
              </div>
            </button>
            <button className="my-[10px]">
              <img
                src="/images/search-icon-2.png"
                alt=""
                className="w-[24px] h-[24px] inline-block"
              />
            </button>
          </div>
        </section>

        <section className="w-full px-[63px]">
          <div>
            <section className="w-full">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-lightblue-05 text-left">
                    <th className="py-2 text-[12px] px-4 font-semibold w-1/7">
                      Kode Kelas
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                      Kategori
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-2/7">
                      Nama Kelas
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                      Tipe Kelas
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                      Level
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                      Harga Kelas
                    </th>
                    <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                      Aksi
                    </th>
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
                    <td className="px-4 py-2 text-[10px] font-bold">
                      Beginner
                    </td>
                    <td className="px-4 py-2 text-[10px] font-bold">Rp 0</td>
                    <td className="px-4 text-[10px] font-bold">
                      <span className="mr-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] w-[50px] bg-darkblue-05 text-center leading-[14px]">
                        Ubah
                      </span>
                      <span className="py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-danger w-[50px] text-center leading-[14px]">
                        Hapus
                      </span>
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
                    <td className="px-4 py-2 text-[10px] font-bold">
                      Advanced
                    </td>
                    <td className="px-4 py-2 text-[10px] font-bold">
                      Rp 199,000
                    </td>
                    <td className="px-4 text-[10px] font-bold">
                      <span className="mr-2 py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] w-[50px] bg-darkblue-05 text-center leading-[14px]">
                        Ubah
                      </span>
                      <span className="py-[3px] font-bold text-neutral-01 inline-block rounded-[10px] bg-alert-danger w-[50px] text-center leading-[14px]">
                        Hapus
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </section>
      </Navigation>
    </>
  );
}
