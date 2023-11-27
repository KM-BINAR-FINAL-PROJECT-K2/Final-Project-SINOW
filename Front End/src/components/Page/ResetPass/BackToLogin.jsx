import App from "../../../App";
import Login from "../Login/Login";
import Logo from "/images/logo-n-maskot/Logo-png.png";
export default function BackToLogin() {
  return (
    <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      <div className="border-[2px] rounded-lg text-center mx-[100px] my-[200px] p-[30px] flex flex-col justify-center ">
        <h1 className="text-darkblue-05 text-xl font-bold md:text-2xl md:py-[20px]">
          Reset Password Berhasil!
        </h1>
        <p className="py-[20px]">
          Silahkan kembali ke aplikasi atau halaman login untuk melakukan
          Autentikasi Ulang!{" "}
        </p>
        <button
          id="kembali"
          type="submit"
          className="w-full text-white bg-darkblue-05 font-medium rounded-lg text-center p-3 "
        >
          Kembali
        </button>
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
