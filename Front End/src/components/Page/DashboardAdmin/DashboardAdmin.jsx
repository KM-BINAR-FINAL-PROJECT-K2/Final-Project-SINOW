import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navigation from "../../Template/Navigation/Navigation";
import Card from "../../Molecule/Card/Card";
import PaymentTable from "../../Molecule/PaymentTable/PaymentTable";
import { LoaderContext } from "../../../store/Loader";
import FilterKelolaDashboard from "../../Molecule/Filter/FilterKelolaDashboard";
import { PlaceholderContext } from "../../../store/PlaceholderStore";

export default function DashboadAdmin() {
  const { setIsLoading } = useContext(LoaderContext);
  const [error, setError] = useState("");
  const { handleSearchButtonClick } = useContext(PlaceholderContext);
  useEffect(() => {
    const getClasses = async () => {
      try {
        setClassSinow([]);
        setIsLoading(true);
        setError("");
        const res = await axios.get("http://localhost:3000/api/v1/courses");
        setClassSinow(res.data.data);
      } catch (error) {
        setError(
          error.response ? error.response.data.message : "Network Error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getClasses();
    return () => {
      setClassSinow([]);
    };
  }, []);
  const [classSinow, setClassSinow] = useState([]);
  const totalQuantity = classSinow.reduce((total, item) => {
    return total + item.totalUser;
  }, 0);
  return (
    <Navigation>
      <section className="mx-8 lg:mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
        <Card
          color={"bg-darkblue-03"}
          quantity={totalQuantity}
          description={"Pengguna Aktif"}
        />
        <Card
          color={"bg-alert-success"}
          quantity={classSinow.length}
          description={"Kelas Terdaftar"}
        />
        <Card
          color={"bg-darkblue-05"}
          quantity={classSinow.filter((item) => item.type === "premium").length}
          description={"Kelas Premium"}
        />
      </section>

      <section className="mx-4 lg:mx-16">
        <div className="py-[10px] flex flex-wrap">
          <h2 className="my-[10px] font-semibold text-[20px] flex-wrap flex-1 min-w-[200px]">
            Status Pembayaran
          </h2>

          <div className="flex">
            <FilterKelolaDashboard />
            <button className="" onClick={handleSearchButtonClick}>
              <img
                src="/images/search-icon-2.png"
                alt=""
                className=" w-[24px] h-[24px] inline-block"
              />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-4 n lg:mx-[64px] mb-64">
        <div className="border-blue-500 ">
          <section className="border-yellow-300 overflow-auto">
            {/* Payment Table */}
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-lightblue-05 z-10">
                <tr className="bg-lightblue-05 text-left border-orange-700">
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
                <PaymentTable
                  color={"bg-alert-success"}
                  id={"johndoe123"}
                  category={"UI/UX Design"}
                  premiumClass={"Belajar Web Designer dengan Figma"}
                  statusMessage={"SUDAH BAYAR"}
                  paymenMethod={"Credit Card"}
                  paymentDate={"21 Sep, 2023 at 2:00 AM"}
                />
                <PaymentTable
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
