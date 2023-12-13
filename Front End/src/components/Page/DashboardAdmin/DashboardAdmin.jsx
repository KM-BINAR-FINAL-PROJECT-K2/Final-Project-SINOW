import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navigation from "../../Template/Navigation/Navigation";
import Card from "../../Molecule/Card/Card";
import PaymentTable from "../../Molecule/PaymentTable/PaymentTable";
import { LoaderContext } from "../../../store/Loader";
import FilterKelolaDashboard from "../../Molecule/Filter/FilterKelolaDashboard";
import { PlaceholderContext } from "../../../store/PlaceholderStore";
import { ImSearch } from "react-icons/im";
export default function DashboadAdmin() {
  const [paymentDetail, setPaymentDetail] = useState([]);
  const [classSinow, setClassSinow] = useState([]);
  const { setIsLoading } = useContext(LoaderContext);
  const [error, setError] = useState("");
  const { handleSearchButtonClick } = useContext(PlaceholderContext);

  useEffect(() => {
    const getPaymentDetail = async () => {
      try {
        setPaymentDetail([]);
        setIsLoading(true);
        setError("");
        const res = await axios.get(
          "https://sinow-production.up.railway.app/api/v1/transactions"
        );
        setPaymentDetail(res.data.data);
      } catch (error) {
        setError(
          error.response ? error.response.data.message : "Network Error"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getPaymentDetail();
    return () => {
      setPaymentDetail([]);
    };
  }, []);

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

  const totalQuantity = classSinow.reduce((total, item) => {
    return total + item.totalUser;
  }, 0);
  return (
    <Navigation>
      <section className="mx-8 lg:mx-16 flex justify-around gap-16 flex-wrap mb-[54px]">
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
              <ImSearch className="fill-darkblue-05 h-[24px] w-[24px]" />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-4 n lg:mx-[64px] mb-64">
        <div className="border-blue-500 ">
          <section className="border-yellow-300 overflow-auto">
            {/* Payment Table */}
            <PaymentTable />
          </section>
        </div>
      </section>
    </Navigation>
  );
}
