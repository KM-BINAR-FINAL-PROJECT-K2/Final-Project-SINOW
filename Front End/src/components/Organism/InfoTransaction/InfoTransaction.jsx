import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { InfoTransactionContext } from "../../../store/InfoTransaction";
import { KeyContext } from "../../../store/ActiveKey";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";
import Loading from "../../Molecule/Loading/Loading";
import { formatTime } from "../../../utils/formatTime";
import { rupiah } from "../../../utils/formatCurrency";
import { usePDF } from "react-to-pdf";

export default function InfoTransaction() {
  const { showInfoTransaction, setShowInfoTransaction } = useContext(
    InfoTransactionContext
  );
  const { keyClass } = useContext(KeyContext);
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const [paymentData, setPaymentData] = useState(false);

  const handleShowInfoTransaction = () => {
    setShowInfoTransaction(!showInfoTransaction);
  };

  useEffect(() => {
    const getPaymentData = async () => {
      if (!keyClass) {
        setIsError("ID Transaki tidak ditemukan");
        return;
      }
      try {
        setIsLoading(true);
        setIsError("");
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/transactions/${keyClass}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPaymentData(res.data.data);
      } catch (error) {
        setIsError(
          error.response ? error.response.data.message : "Network Error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyClass]);

  const formatStatusText = (text) => {
    if (!text) {
      return "-";
    }
    const words = text.split("_");
    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return formattedWords.join(" ");
  };

  const { toPDF, targetRef } = usePDF({
    method: "open",
    page: {
      format: "A4", // Ganti sesuai kebutuhan
      orientation: "potrait", // Ganti sesuai kebutuhan
    },
    filename: `transaksi-${keyClass}`,
    overrides: {
      canvas: {
        windowWidth: 1000,
      },
    },
  });

  return (
    <div
      className={`
       ${showInfoTransaction ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-gray-100 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[500px] py-[50px] text-center overflow-y-auto">
            {isError && (
              <>
                <div className="font-bold bg-slate-950 bg-opacity-10 p-10 flex justify-center gap-5 items-center h-full">
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
              </>
            )}
            {isLoading && <Loading />}
            {!isError && !isLoading && paymentData && (
              <>
                <div className="bg-white rounded-lg mx-10 p-4 text-xs flex flex-col gap-3">
                  <p>
                    Tanggal:{" "}
                    <span className="font-semibold">
                      {formatTime(paymentData.updatedAt)}
                    </span>
                  </p>
                  <p>
                    <p className="mb-1">Total Pembayaran</p>
                    <p className="font-bold text-2xl">
                      {rupiah(paymentData.totalPrice)}
                    </p>
                  </p>
                  <p className="flex justify-between">
                    <span>Status transaksi</span>
                    <span>{formatStatusText(paymentData.status)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>ID Pesanan</span>
                    <span>{paymentData.id}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Metode Bayar</span>
                    <span>{formatStatusText(paymentData.paymentMethod)}</span>
                  </p>

                  <p className="mt-3 flex justify-between">
                    <span className="font-semibold text-[10px]">
                      Rincian pembayaran
                    </span>
                    <span></span>
                  </p>
                  <hr />
                  <p>{paymentData.Course.name}</p>
                  <p className="flex justify-between">
                    <span>Harga Course</span>
                    <span>{rupiah(paymentData.coursePrice)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Diskon</span>
                    <span>{paymentData.promoDiscountPercentage}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Pajak</span>
                    <span>
                      {rupiah(paymentData.taxPrice)} (
                      {paymentData.taxPercentage}%)
                    </span>
                  </p>
                  <hr />
                  <p className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{rupiah(paymentData.totalPrice)}</span>
                  </p>
                </div>
                <div className="flex text-white font-semibold mt-5 mb-[-15px] mx-10">
                  <button
                    className="bg-sinow-05 flex-1 rounded-l-lg"
                    onClick={() => toPDF()}
                  >
                    Cetak
                  </button>
                  <button
                    onClick={handleShowInfoTransaction}
                    className="flex-1 bg-alert-danger py-1 px-2 rounded-r-lg"
                  >
                    Kembali
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {!isError && !isLoading && paymentData && (
        <div className="">
          <div className="w-full h-[800px] bg-white absolute"></div>
          <div
            className="bg-white text-lg rounded-lg mx-10 p-4 flex flex-col gap-3 text-center"
            ref={targetRef}
          >
            <p>
              Tanggal:{" "}
              <span className="font-semibold">
                {formatTime(paymentData.updatedAt)}
              </span>
            </p>
            <p>
              <p className="mb-1">Total Pembayaran</p>
              <p className="font-bold text-2xl">
                {rupiah(paymentData.totalPrice)}
              </p>
            </p>
            <p className="flex justify-between">
              <span>Status transaksi</span>
              <span>{formatStatusText(paymentData.status)}</span>
            </p>
            <p className="flex justify-between">
              <span>ID Pesanan</span>
              <span>{paymentData.id}</span>
            </p>
            <p className="flex justify-between">
              <span>Metode Bayar</span>
              <span>{formatStatusText(paymentData.paymentMethod)}</span>
            </p>

            <p className="mt-3 flex justify-between">
              <span className="font-semibold text-md">Rincian pembayaran</span>
              <span></span>
            </p>
            <hr />
            <p>{paymentData.Course.name}</p>
            <p className="flex justify-between">
              <span>Harga Course</span>
              <span>{rupiah(paymentData.coursePrice)}</span>
            </p>
            <p className="flex justify-between">
              <span>Diskon</span>
              <span>{paymentData.promoDiscountPercentage}%</span>
            </p>
            <p className="flex justify-between">
              <span>Pajak</span>
              <span>
                {rupiah(paymentData.taxPrice)} ({paymentData.taxPercentage}%)
              </span>
            </p>
            <hr />
            <p className="flex justify-between font-bold">
              <span>Total</span>
              <span>{rupiah(paymentData.totalPrice)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
