import axios from "axios";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "/images/logo-n-maskot/Sticker-3.png";
import Logo_2 from "/images/logo-n-maskot/Logo-png.png";
import { IoMdArrowRoundBack } from "react-icons/io";
export default function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState("");
  const [formLength, setFormLength] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setPasswordError("");
      setPasswordLengthError("");
      setFormLength("Silahkan isi Email dan Password terlebih dahulu");
      return;
    }
    // if password less than 8
    if (password.length < 8) {
      setPasswordLengthError("Password harus memiliki minimal 8 karakter."); // Pesan password lebih dari 8
      setPasswordError(""); // Reset pesan kesalahan password salah
      setFormLength("");
      return;
    }

    setForm({
      email,
      password,
    });
  };

  //   useEffect(() => {
  //     const login = async () => {
  //       try {
  //         if (form.email && form.password) {
  //           const res = await axios.post(
  //             " https://localhost:3000/api/v1/auth/login",

  //             form,
  //             {
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //           console.log(res.data);
  //           if (res.data.status === "Success") {
  //             localStorage.setItem("token", res.data.data.token);
  //             window.location.href = "/sinow";
  //           }
  //         }
  //       } catch (error) {
  //         console.error(error.response.data);
  //         setFormLength("");
  //         setPasswordLengthError(""); // Reset pesan kesalahan panjang password
  //         setPasswordError("Email atau Password salah. Silakan coba lagi."); // Pesan ID atau password salah
  //         return;
  //       }
  //     };
  //     login();
  //   }, [form]);

  return (
    <div className=" lg:grid lg:grid-cols-2 ">
      <div className=" flex-2 w-full ">
        <div className=" m-4 ">
          <a
            href="/"
            className="bg-white text-darkblue-05   hover:bg-darkblue-05 hover:text-white flex items-center justify-center rounded-full p-1 w-10 h-10"
          >
            <IoMdArrowRoundBack className="h-8 w-8 transition-colors rounded-full duration-100 ease-in-out " />
          </a>
        </div>

        {/* <div className=" my-[30px] logo-app md:hidden flex justify-center items-center">
            <img
              src={Logo_2}
              alt=""
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-80 md:h-80 "
            />
          </div> */}
        <div className=" w-full py-full px-40">
          <form
            onSubmit={handleSubmit}
            action=""
            className=" space-y-4 lg:space-y-4 my-9 w-full "
          >
            <h1 className="text-sinow-05 text-xl font-bold md:text-2xl py-[20px]">
              Daftar
            </h1>
            {/* message if ID and password wrong */}
            {passwordError && (
              <p className="text-alert-danger text-sm mt-2">{passwordError}</p>
            )}
            {/* message if passsword less than 8 */}
            {passwordLengthError && (
              <p className="text-red-500 text-sm mt-2">{passwordLengthError}</p>
            )}
            {formLength && (
              <p className="text-red-500 text-sm mt-2">{formLength}</p>
            )}
            <div>
              <label htmlFor="idAdmin" className="block mb-2 font-bold">
                Nama
              </label>
              <input
                type="text"
                className="border text-neutral-05 sm:text-sm rounded-lg block w-full p-3"
                placeholder="Johnatan Liandi"
                required=""
                name="name"
              />
            </div>
            <div>
              <label htmlFor="idAdmin" className="block mb-2 font-bold">
                Email
              </label>
              <input
                type="text"
                className="border text-neutral-05 sm:text-sm rounded-lg block w-full p-3"
                placeholder="Contoh: johndoe@gmail.com"
                required=""
                name="email"
              />
            </div>
            <div>
              <label htmlFor="idAdmin" className="block mb-2 font-bold">
                No. Telp
              </label>
              <input
                type="number"
                className="border text-neutral-05 sm:text-sm rounded-lg block w-full p-3"
                placeholder="+62 "
                required=""
                name="numberPhone"
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
              </div>
              <div className="flex">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border sm:text-sm rounded-l-lg block w-full p-3 text-neutral-05 border-r-0"
                  placeholder="Masukkan Password"
                  required=""
                  name="password"
                />
                <span
                  className="border justify-center px-3 py-4 md:px-3 md:py-4 cursor-pointer rounded-r-lg border-l-0"
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
            <div className=" h-[100px] justify-center items-center flex">
              <button
                type="submit"
                className="hover:bg-darkblue-03 py-[12px] hover:py-[12px] w-full  transition-all duration-300 text-white bg-sinow-05 font-semibold rounded-2xl text-center p-1 "
              >
                Masuk
              </button>
            </div>
          </form>{" "}
        </div>
      </div>
      <div className="border logo-app bg-sinow-05  hidden sm:flex justify-center items-center">
        <img
          src={Logo}
          alt=""
          className="w-24 h-24 md:w-32 md:h-32 lg:h-[360px] lg:w-[400px] "
        />
      </div>
    </div>
  );
}
