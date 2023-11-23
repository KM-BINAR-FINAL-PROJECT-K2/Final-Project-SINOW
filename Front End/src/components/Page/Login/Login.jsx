import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "/images/logo.png";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      <div className="logo-app bg-darkblue-05 hidden sm:flex justify-center items-center">
        <img
          src={Logo}
          alt=""
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48"
        />
      </div>

      <div className="form-app flex flex-col justify-center md:h-screen lg:py-0">
        <form
          action=""
          className="space-y-4 md:space-y-6 max-w-[400px] w-full mx-auto"
        >
          <h1 className="text-darkblue-05 text-xl font-bold md:text-2xl">
            Log In
          </h1>
          <div>
            <label htmlFor="idAdmin" className="block mb-2 font-bold">
              ID Admin
            </label>
            <input
              type="text"
              className="border sm:text-sm rounded-lg block w-full p-3 text-lightgrey-05"
              placeholder="ID Admin Kamu"
              required=""
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className=" mb-2 font-bold flex items-start"
              >
                Password
              </label>
              <a href="#" className="mb-2 text-sm text-darkblue-05 font-bold">
                Lupa Kata Sandi
              </a>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border sm:text-sm rounded-lg block w-full p-3 text-lightgrey-05"
              placeholder="Masukkan Password"
              required=""
            />
            <span
              className="absolute right-[135px] top-[357px] transform -translate-y-1/2 cursor-pointer"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <FiEyeOff style={{ color: "#B0B0B0" }} />
              ) : (
                <FiEye style={{ color: "#B0B0B0" }} />
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-darkblue-05 font-medium rounded-lg text-center p-3 "
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
