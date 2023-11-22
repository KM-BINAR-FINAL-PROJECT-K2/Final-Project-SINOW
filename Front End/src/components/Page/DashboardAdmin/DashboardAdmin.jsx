import Navigation from "../../Template/Navigation/Navigation";
import Card from "../../Molecule/Card/Card";
import TableBody from "../../Molecule/TablePayment/TablePayment";

export default function DashboadAdmin() {
  return (
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
            Status Pembayaran
          </h2>

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
                    ID
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                    Kategori
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-2/7">
                    Kelas Premium
                  </th>
                  <th className=" px-4 py-2 text-[12px] font-semibold w-1/7">
                    Status
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                    Metode Pembayaran
                  </th>
                  <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
                    Tanggal Bayar
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableBody
                  color={"bg-alert-success"}
                  id={"johndoe123"}
                  category={"UI/UX Design"}
                  premiumClass={"Belajar Web Designer dengan Figma"}
                  statusMessage={"SUDAH BAYAR"}
                  paymenMethod={"Credit Card"}
                  paymentDate={"21 Sep, 2023 at 2:00 AM"}
                />
                <TableBody
                  color={"bg-alert-danger"}
                  id={"supermanxx"}
                  category={"UI/UX Design"}
                  premiumClass={"Belajar Web Designer dengan Figma"}
                  statusMessage={"BELUM BAYAR"}
                  paymenMethod={"-"}
                  paymentDate={"-"}
                />
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </Navigation>
  );
}
