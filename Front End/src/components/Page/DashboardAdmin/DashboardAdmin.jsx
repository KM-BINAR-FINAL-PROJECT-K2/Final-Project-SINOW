import axios from "axios";
import { rupiah } from "../../../utils/formatCurrency";
import { useContext, useEffect, useState } from "react";
import Navigation from "../../Template/Navigation/Navigation";
import Card from "../../Molecule/Card/Card";
import Loading from "../../Molecule/Loading/Loading";
import { LoaderContext } from "../../../store/Loader";
import { ImSearch } from "react-icons/im";
import { ErrorContext } from "../../../store/Error";
import { SearchValueContext } from "../../../store/SearchValue";
import FilterKelolaDashboard from "../../Molecule/Filter/FilterKelolaDashboard";
import { FilterClassContext } from "../../../store/FilterClass";
export default function DashboadAdmin() {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const { isLoading } = useContext(LoaderContext);
  const { setIsError } = useContext(ErrorContext);
  const { isError } = useContext(ErrorContext);
  const { searchValue, setSearchValue } = useContext(SearchValueContext);
  const { filterClass } = useContext(FilterClassContext);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [paymentDetail, setPaymentDetail] = useState([]);
  const [informationCard, setInformationCard] = useState({
    users: 0,
    courses: 0,
    premiumClass: 0,
  });

  useEffect(() => {
    const getClassesInformation = async () => {
      try {
        setIsLoading(true);
        setIsError("");

        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/courses`
        );
        setInformationCard({
          users: 0,
          courses: res.data.data.length,
          premiumClass: res.data.data.filter((item) => item.type === "premium")
            .length,
        });
      } catch (error) {
        setIsError(
          error.response ? error.response.data.message : "Kesalahan Jaringan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getClassesInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getpaymentDetail = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/transactions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log(res.data.data);
        setPaymentDetail(res.data.data);
      } catch (error) {
        setError(
          error.response ? error.response.data.message : "Network Error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getpaymentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const handleSearchButtonClick = (value) => {
    setSearchValue(value);
  };

  return (
    <Navigation>
      <section className="mx-8 lg:mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
        <Card
          color={"bg-darkblue-03"}
          quantity={informationCard.users}
          description={"Pengguna Aktif"}
        />
        <Card
          color={"bg-alert-success"}
          quantity={informationCard.courses}
          description={"Kelas Terdaftar"}
        />
        <Card
          color={"bg-darkblue-05"}
          quantity={informationCard.premiumClass}
          description={"Kelas Premium"}
        />
      </section>

      <section className="mx-4 lg:mx-16">
        <div className="py-[10px] flex flex-wrap">
          <h2 className="my-[10px] font-semibold text-[20px] flex-wrap flex-1 min-w-[200px]">
            Kelola Kelas
          </h2>
          <div className="flex items-center">
            <FilterKelolaDashboard />
            {showSearchInput && (
              <div className="flex items-center">
                <input
                  type="text"
                  className="border-2 text-darkblue-05 border-sinow-05 rounded-md focus:ring-sinow-05 outline-none py-1 px-2 placeholder-sinow-05"
                  placeholder="Cari..."
                  onChange={(e) => handleSearchButtonClick(e.target.value)}
                />
                <button onClick={handleShowSearchInput}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="rgb(0 204 244)"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {!showSearchInput && (
              <button className="" onClick={handleShowSearchInput}>
                <ImSearch className="fill-darkblue-05 h-[24px] w-[24px]" />
              </button>
            )}
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
                  <th className="px-4 py-2 text-[12px] font-semibold w-2/7">
                    Total Harga
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
                                href="/dashboard"
                                className="text-darkblue-03 font-medium"
                                onClick={() => {
                                  window.location.href = "/dashboard";
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

                {/* {!isError &&
                  paymentDetail.map((paymentItem) => {
                    
                  })} */}
                {!isLoading &&
                  !isError &&
                  paymentDetail.map((paymentItem) => {
                    if (
                      (!searchValue ||
                        paymentItem.Course.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())) &&
                      (!filterClass ||
                        paymentItem.status
                          .toLowerCase()
                          .includes(filterClass.toLowerCase()))
                    ) {
                      return (
                        <tr key={paymentItem.id}>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {paymentItem.courseId}
                          </td>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {paymentItem.Course.category.name}
                          </td>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {paymentItem.Course.name}
                          </td>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {rupiah(paymentItem.totalPrice)}
                          </td>
                          <td
                            className={`py-2 px-4 text-[10px] font-bold ${
                              paymentItem
                                ? paymentItem.status === "SUDAH_BAYAR"
                                  ? "text-alert-success"
                                  : paymentItem.status === "BELUM_BAYAR"
                                  ? "text-alert-danger"
                                  : paymentItem.status === "KADALUARSA"
                                  ? "text-slate-400"
                                  : ""
                                : ""
                            }`}
                          >
                            {paymentItem.status}
                          </td>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {paymentItem.paymentMethod
                              ? paymentItem.paymentMethod
                              : "-"}
                          </td>
                          <td className="py-2 px-4 text-[10px] font-bold ">
                            {paymentItem.updatedAt.slice(0, 10)}{" "}
                            {/* Fixed typo in 'updatedAt' */}
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </Navigation>
  );
}
