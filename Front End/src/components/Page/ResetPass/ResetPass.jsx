import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "/images/logo-n-maskot/Logo-png.png";
export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      <div className="p-[50px] orm-app flex flex-col justify-center md:h-screen lg:py-0">
        <form
          action=""
          className="space-y-4 md:space-y-6 max-w-[400px] w-full mx-auto"
        >
          <h1 className="text-darkblue-05 text-xl font-bold md:text-2xl md:py-[20px]">
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
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                className="border sm:text-sm rounded-l-lg block w-full p-3 text-lightgrey-05 border-r-0"
                placeholder="Min 8 karakter"
                required=""
              />
              <span
                className="border p-[20px] sm:p-[20px] cursor-pointer rounded-r-lg border-l-0"
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
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                className="border sm:text-sm rounded-l-lg block w-full p-3 text-lightgrey-05 border-r-0"
                placeholder="Min 8 Karakter"
                required=""
              />
              <span
                className="border p-[20px] sm:p-[20px] cursor-pointer rounded-r-lg border-l-0"
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
            className="w-full text-white bg-darkblue-05 font-medium rounded-lg text-center p-3 "
          >
            Simpan
          </button>
        </form>
      </div>
      <div className="logo-app bg-darkblue-05 hidden sm:flex justify-center items-center">
        <img
          src={Logo}
          alt=""
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48"
        />
      </div>
    </div>
  );
}
