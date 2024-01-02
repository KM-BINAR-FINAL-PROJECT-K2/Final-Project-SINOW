import axios from "axios";
import { usePDF } from "react-to-pdf";
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
import { InfoTransactionContext } from "../../../store/InfoTransaction";
import InfoTransaction from "../../Organism/InfoTransaction/InfoTransaction";
import { PaymentDetailContext } from "../../../store/PaymentDetail";
import { KeyContext } from "../../../store/ActiveKey";
import { formatTime } from "../../../utils/formatTime";
export default function DashboadAdmin() {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const { isLoading } = useContext(LoaderContext);
  const { setIsError } = useContext(ErrorContext);
  const { isError } = useContext(ErrorContext);
  const { searchValue, setSearchValue } = useContext(SearchValueContext);
  const { filterClass } = useContext(FilterClassContext);
  const { showInfoTransaction, setShowInfoTransaction } = useContext(
    InfoTransactionContext
  );
  const { setKeyClass } = useContext(KeyContext);
  const { paymentDetail, setPaymentDetail } = useContext(PaymentDetailContext);
  const [informationCard, setInformationCard] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const getDashboardInformation = async () => {
      try {
        setIsLoading(true);
        setIsError("");

        const totalCourse = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/dashboard/totalCourse`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const totalPremiumCourse = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/dashboard/totalPremiumCourse`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const totalActiveUser = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/dashboard/totalActiveUser`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const users = totalActiveUser.data.data.totalActiveUsers;
        const courses = totalCourse.data.data.totalCourses;
        const premiumClass = totalPremiumCourse.data.data.totalPremiumCourses;

        setInformationCard({
          courses,
          premiumClass,
          users,
        });
      } catch (error) {
        setIsError(
          error.response ? error.response.data.message : "Kesalahan Jaringan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getpaymentDetail = async () => {
      try {
        setIsLoading(true);
        setIsError("");
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/transactions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPaymentDetail(res.data.data);
      } catch (error) {
        setIsError(
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

  const handleDownloadData = async () => {
    await setHide(true);
    await toPDF();

    setHide(false);
  };

  const { toPDF, targetRef } = usePDF({
    method: "open",
    page: {
      format: "A4",
      orientation: "landscape",
    },
    filename: `transaksi-${filterClass}`,
    overrides: {
      canvas: {
        windowWidth: 1500,
      },
    },
  });

  const handleShowInfoTransaction = (id) => {
    if (!showInfoTransaction) {
      setKeyClass(id);
    }
    setShowInfoTransaction(!showInfoTransaction);
  };

  return (
    <>
      <Navigation>
        {informationCard && (
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
        )}

        <section className="mx-4 lg:mx-16">
          <div className="py-[10px] flex flex-wrap">
            <h2 className="my-[10px] font-semibold text-[20px] flex-wrap flex-1 min-w-[200px]">
              Riwayat Transaksi
            </h2>
            <div className="flex items-center">
              <button
                className="border-2 border-sinow-05 py-1 px-2 text-white bg-sinow-05 flex items-center gap-3 rounded-lg mr-3"
                onClick={() => handleDownloadData()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>

                <span className="font-semibold">Download Data</span>
              </button>
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
          <div className="border-blue-500 " ref={targetRef}>
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
                      Tanggal Bayar
                    </th>
                    <th
                      className={`px-4 py-2 text-[12px] font-semibold w-1/7 ${
                        hide && "hidden"
                      }`}
                    >
                      Aksi
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
                  {!isLoading &&
                    !isError &&
                    paymentDetail &&
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
                              {formatTime(paymentItem.updatedAt)}
                            </td>
                            <td className={`${hide && "hidden"}`}>
                              <button
                                className="m-2 py-[2px] font-bold text-neutral-01 inline-block rounded-[4px] hover:stroke-2 bg-sinow-05 stroke-[1.5] px-[8px] text-center leading-[14px] shadow-md"
                                onClick={() =>
                                  handleShowInfoTransaction(paymentItem.id)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6 mx-auto"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              </button>
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

      {showInfoTransaction && <InfoTransaction />}
    </>
  );
}
