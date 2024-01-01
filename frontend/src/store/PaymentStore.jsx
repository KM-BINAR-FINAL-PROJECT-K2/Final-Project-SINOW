/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const PaymentContext = createContext();

const PaymentContextProvider = ({ children }) => {
  const [paymentDetail, setPaymentDetail] = useState([]);

  return (
    <PaymentContext.Provider value={{ paymentDetail, setPaymentDetail }}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContextProvider;
