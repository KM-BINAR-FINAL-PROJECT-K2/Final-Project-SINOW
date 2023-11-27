import axios from "axios";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "/images/logo-n-maskot/Logo-png.png";

export default function Login() {
  const checkToken = localStorage.getItem("token");
  if (checkToken) {
    window.location.href = "/dashboard";
  }

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    setForm({
      email,
      password,
    });
  };

  useEffect(() => {
    const login = async () => {
      try {
        if (form.email && form.password) {
          const res = await axios.post(
            "http://localhost:3000/api/v1/auth/login",
            form,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log(res.data);
          if (res.data.status === "Success") {
            localStorage.setItem("token", res.data.data.token);
            window.location.href = "/dashboard";
          }
        }
      } catch (error) {
        console.error(error.response.data);
      }
    };
    login();
  }, [form]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      <div className="logo-app bg-darkblue-05 hidden sm:flex justify-center items-center">
        <img
          src={Logo}
          alt=""
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48"
        />
      </div>

      <div className="p-[50px] orm-app flex flex-col justify-center md:h-screen lg:py-0">
        <form
          onSubmit={handleSubmit}
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
              name="email"
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
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border sm:text-sm rounded-l-lg block w-full p-3 text-lightgrey-05 border-r-0"
                placeholder="Masukkan Password"
                required=""
                name="password"
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
