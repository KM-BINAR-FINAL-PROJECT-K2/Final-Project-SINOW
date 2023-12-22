import Logo from "/images/logo-n-maskot/Logo-png.png";
export default function ForgotPassword() {
  return (
    <div className="h-[729px] w-full flex justify-center items-center">
      <div className=" bg-white border shadow-sm m-4 h-76 w-96 rounded-lg flex-2">
        <h1 className="text-sinow-05 text-center font-bold py-10 text-xl lg:text-2xl lg:py-10 lg:px-4 ">
          Lupa Kata Sandi
        </h1>
        <div className=" px-8 pt-2 pb-8 ">
          <p className="font-bold">Email</p>
          <input
            type="text"
            placeholder="email.."
            className=" w-full h-10 px-2 border rounded-lg mt-2 mb-8"
          />
          <button
            type="submit"
            className="w-full text-white bg-sinow-05 hover:bg-darkblue-03 font-bold rounded-lg text-center px-2 py-2 "
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
