// md: ukuran Tablet lg:ukuran laptop

export default function Hero() {
  return (
    <div
      id="profile"
      className=" pt-16 pb-8 h-auto w-full bg-sinow-04 flex-2 md:flex md:h-auto md:w-auto lg:flex lg:pt-20 lg:pb-10"
    >
      <div className=" lg:mx-20 md:mx-10 my-5  flex items-center justify-center md:w-2/5 lg:w-2/5">
        <img
          src="/images/logo-n-maskot/app.png"
          alt=""
          className=" h-56 md:h-56 lg:h-80"
        />
      </div>
      <div></div>
      <div className=" text-white w-auto mb-10 mx-10 md:mx-10 md:my-10 md:w-3/5 lg:mx-10 lg:mb-10 lg:w-3/5 ">
        <h1 className=" text-[35px] font-bold lg:text-[72px]">
          SELAMAT DATANG SOBAT <span className="text-sinow-05">SINOW!</span>
        </h1>
        <p className="text-[14px] lg:text-[18px] my-5 lg:pr-20 text-justify">
          <b>SINOW</b> adalah Platform yang menyediakan konten pembelajaran
          online berupa video. Platform ini akan menyediakan konten pembelajaran
          yang dapat diakses secara gratis atau berlangganan, ditambah dengan
          fitur-fitur yang mudah digunakan.
        </p>
        <div className="pt-5">
          <a
            href="/#"
            className="px-6 py-2 rounded-md hover:bg-sinow-03 bg-sinow-05 text-white text-[16px] font-semibold "
          >
            Download Sekarang!
          </a>
        </div>
      </div>
    </div>
  );
}
