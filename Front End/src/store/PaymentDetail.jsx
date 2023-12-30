/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const PaymentDetailContext = createContext();
const PaymentDetailContextProvider = ({ children }) => {
  const [paymentDetail, setPaymentDetail] = useState(false);

  return (
    <PaymentDetailContext.Provider value={{ paymentDetail, setPaymentDetail }}>
      {children}
    </PaymentDetailContext.Provider>
  );
};

export default PaymentDetailContextProvider;
