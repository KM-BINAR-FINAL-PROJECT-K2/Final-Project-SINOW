import { useContext } from "react";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";
import { PaymentContext } from "../../../store/PaymentStore";

export default function PaymentTable() {
  const { isLoading } = useContext(LoaderContext);
  const { isError } = useContext(ErrorContext);
  const { PaymentDetail } = useContext(PaymentContext);
  return (
    <table className="w-full table-auto">
      <thead className="sticky top-0 bg-lightblue-05 z-10">
        <tr className="bg-lightblue-05 text-left border-orange-700">
          <th className="py-2 text-[12px] px-4 font-semibold w-1/7">ID</th>
          <th className="px-4 py-2 text-[12px] font-semibold w-1/7">
            Kategori
          </th>
          <th className="px-4 py-2 text-[12px] font-semibold w-2/7">
            Kelas Premium
          </th>
          <th className=" px-4 py-2 text-[12px] font-semibold w-1/7">Status</th>
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
                        href="/kelola-kelas"
                        className="text-darkblue-03 font-medium"
                        onClick={() => {
                          window.location.href = "/kelola-kelas";
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
          PaymentDetail.map((paymentItem) => (
            <tr key={paymentItem.id} className="border-b border-slate-200">
              <td className="py-2 px-4 text-[10px] font-bold text-gray-600">
                {paymentItem.id}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold text-gray-600">
                {paymentItem.coursePrice}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold">
                {paymentItem.totalPrice}
              </td>
              <td
                className={`px-4 py-2 text-[12px] font-bold ${
                  paymentItem && paymentItem.status === "SUDAH BAYAR"
                    ? "text-alert-success"
                    : "text-alert-danger"
                }`}
              >
                {paymentItem.status}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold">
                {paymentItem.promo}
              </td>
              <td className="px-4 py-2 text-[10px] font-bold">
                {paymentItem.createdAt}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
