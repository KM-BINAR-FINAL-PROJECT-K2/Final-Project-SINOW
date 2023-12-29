
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "/images/logo-n-maskot/Sticker-3.png";
import Logo_2 from "/images/logo-n-maskot/Logo-png.png";
import { useParams } from "react-router-dom";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";

export default function ResetPassword({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState();
  const { token } = useParams();

  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          window.location.href = "/not-found";
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const handleResetPassword = (e, form) => {
    e.preventDefault();
    const formData = new FormData(form);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const data = { password, confirmPassword };

    if (password.length >= 8 && confirmPassword === password) {
      setResetPassword(data);
      return;
    }

    Swal.fire({
      position: "center",
      icon: "error",
      title: "Password harus sama dan minimal 8 karakter",
      showConfirmButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "#73CA5C",
    });
  };

  useEffect(() => {
    const runResetPassword = async () => {
      try {
        if (!resetPassword) {
          return;
        }
        setIsError("");
        setIsLoading(true);
        console.log("Masuk??");
        const response = await axios.post(
          `https://sinow-production.up.railway.app/api/v1/auth/reset-password/${token}`,
          resetPassword,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status !== "Success") {
          throw new Error(response.data.message);
        }

        await Swal.fire({
          position: "center",
          icon: "success",
          title: response.data.message,
          confirmButtonText: "Ok",
          confirmButtonColor: "#73CA5C",
        });

        localStorage.clear();
        return (window.location.href = "/");
      } catch (error) {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#73CA5C",
        });
      } finally {
        setIsLoading(false);
      }
    };
    runResetPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetPassword]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      {isLoading && <LoadingScreen />}
      <div className="p-[50px] orm-app flex flex-col justify-center md:h-screen lg:py-0">
        <form
          action=""
          className="space-y-4 md:space-y-6 max-w-[400px] w-full mx-auto"
          type="submit"
          onSubmit={(e) => handleResetPassword(e, e.target)}
        >
          <div className=" my-[30px] logo-app md:hidden flex justify-center items-center">
            <img
              src={Logo_2}
              alt=""
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-80 md:h-80 "
            />
          </div>
          <h1 className="text-sinow-05 text-xl font-bold md:text-2xl py-[20px]">
            Reset Password
          </h1>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className=" mb-2 font-bold flex items-start"
              >
                Masukkan Password Baru
              </label>
            </div>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="border sm:text-sm rounded-l-lg block w-full p-3 text-lightgrey-05 border-r-0"
                placeholder="Min 8 karakter"
                required=""
              />
              <span
                className="border px-3 py-4  cursor-pointer rounded-r-lg border-l-0"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <FiEyeOff style={{ color: "#B0B0B0" }} />
                ) : (
                  <FiEye style={{ color: "#B0B0B0" }} />
                )}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className=" mb-2 font-bold flex items-start"
              >
                Ulangi Password Baru
              </label>
            </div>
            <div className="flex">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="border sm:text-sm rounded-l-lg block w-full p-3 text-lightgrey-05 border-r-0"
                placeholder="Min 8 Karakter"
                required=""
              />
              <span
                className="border px-3 py-4 cursor-pointer rounded-r-lg border-l-0"
                onClick={handleToggleConfirmPassword}
              >
                {showConfirmPassword ? (
                  <FiEyeOff style={{ color: "#B0B0B0" }} />
                ) : (
                  <FiEye style={{ color: "#B0B0B0" }} />
                )}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-sinow-05 font-bold rounded-lg text-center p-3 "
          >
            Simpan
          </button>
        </form>
      </div>
      <div className="logo-app bg-sinow-05 hidden sm:flex justify-center items-center">
        <img
          src={Logo}
          alt=""
          className="w-28 h-24 sm:w-32 sm:h-32 md:w-96 md:h-80"
        />
      </div>
    </div>
  );
}
