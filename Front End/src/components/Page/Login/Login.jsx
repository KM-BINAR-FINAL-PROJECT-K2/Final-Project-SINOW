import Logo from "/images/logo.png";

export default function Login() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-screen w-full">
      <div className="logo-app bg-purple hidden sm:block">
        <img src={Logo} alt="" className="items-center justify-center" />
      </div>

      <div className="form-app flex flex-col justify-center md:h-screen lg:py-0">
        <form
          action=""
          className="space-y-4 md:space-y-6 max-w-[400px] w-full mx-auto"
        >
          <h1 className="text-purple text-xl font-bold md:text-2xl">Log In</h1>
          <div>
            <label htmlFor="idAdmin" className="block mb-2 font-bold">
              ID Admin
            </label>
            <input
              type="text"
              className="border sm:text-sm rounded-lg block w-full p-3 text-placeholder"
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
              <a href="#" className="mb-2 text-sm text-purple font-bold">
                Lupa Kata Sandi
              </a>
            </div>
            <input
              type="text"
              className="border sm:text-sm rounded-lg block w-full p-3 text-placeholder"
              placeholder="Masukkan Password"
              required=""
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-purple font-medium rounded-lg text-center p-3 "
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
