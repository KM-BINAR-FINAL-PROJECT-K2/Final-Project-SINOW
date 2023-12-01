/* eslint-disable react/prop-types */
import MaskotLogout from "/images/logo-n-maskot/forgot_pass_aset.png";
export default function Logout({ toggleShowLogout }) {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div
      className={`
       ${toggleShowLogout ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="border rounded-[16px] bg-neutral-01 w-[300px] sm:w-[400px]  h-auto py-[10px] text-center">
            <div className="justify-center items-center">
              <h3 className="text-darkblue-05 font-semibold text-[20px] m-[20px]">
                Keluar Dari Akun?
              </h3>
              <img
                className="m-auto w-40 h-34 sm:w-40 sm:h-34 md:w-40 md:h-34"
                src={MaskotLogout}
                alt="maskot"
              />
            </div>

            <div className="flex justify-between flex-wrap gap-[15px] m-[50px]">
              <a
                href="/"
                className="text-white text-[16px] font-semibold bg-alert-success p-[12px] rounded-[25px] flex-1 md:w-[200px]"
                onClick={handleLogout}
              >
                Keluar
              </a>
              <button
                className="text-white text-[16px] font-semibold bg-alert-danger p-[12px] rounded-[25px] flex-1 md:w-[200px]"
                onClick={toggleShowLogout}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
