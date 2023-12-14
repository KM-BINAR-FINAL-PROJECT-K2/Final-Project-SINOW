export default function PaymentTable({
  id,
  category,
  premiumClass,
  statusMessage,
  paymenMethod,
  paymentDate,
}) {
  return (
    <tr>
      <td className="py-2 px-4 text-[10px] font-bold text-gray-600">{id}</td>
      <td className="px-4 py-2 text-[10px] font-bold text-gray-600">
        {category}
      </td>
      <td className="px-4 py-2 text-[10px] font-bold">{premiumClass}</td>
      <td
        className={`px-4 py-2 text-[12px] font-bold ${
          statusMessage === "SUDAH BAYAR"
            ? "text-alert-success"
            : "text-alert-danger"
        }`}
      >
        {statusMessage}
      </td>
      <td className="px-4 py-2 text-[10px] font-bold">{paymenMethod}</td>
      <td className="px-4 py-2 text-[10px] font-bold">{paymentDate}</td>
    </tr>
  );
}
