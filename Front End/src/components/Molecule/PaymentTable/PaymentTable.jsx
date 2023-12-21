import { useContext } from "react";
import Loading from "../Loading/Loading";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";
export default function PaymentTable({ paymentDetail }) {
  const { isLoading } = useContext(LoaderContext);
  const { isError } = useContext(ErrorContext);

  return <div>p</div>;
}
