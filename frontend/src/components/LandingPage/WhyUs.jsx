import Icon from "/images/icon/Check.png";
export default function WhyUs() {
  return (
    <div className=" m-4 text-sinow-04">
      <h1 className="text-center text-2xl my-10 font-bold lg:text-3xl f lg:mt-16 lg:mb-16">
        Mengapa harus memilih <span className="text-sinow-05">SINOW</span> ?
      </h1>
      <div className=" h-auto w-full flex-auto md:gap-4 lg:pl-24 lg:grid lg:grid-cols-2 sm:flex ">
        <div className=" mx-2 lg:flex lg:justify-center">
          <img
            src="/images/Study_1.jpg"
            alt="image"
            className="h-64 sm:h-72 lg:h-96 lg:w-[520px] rounded-3xl"
          />
        </div>
        <div className=" mx-2 my-10 sm:my-3 lg:my-0  lg:flex-3 text-justify sm:flex-3">
          <div className=" flex lg:mb-4 gap-5">
            <div>
              <img src={Icon} alt="iconCheck" className="h-8 lg:h-10  sm:h-6" />
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="sm:text-md lg:text-2xl font-bold">
                Kualitas Pembelajaran Unggul
              </h1>
              <p className="text-sm lg:text-[14px] sm:text-xs text-justify">
                SINOW menawarkan pengalaman belajar online yang unggul dengan
                kurikulum yang dirancang secara cermat.
              </p>
            </div>
          </div>
          <div className=" flex lg:flex lg:mb-4 gap-5">
            <div className="my-2">
              <span>
                <img
                  src={Icon}
                  alt="iconCheck"
                  className="h-8 lg:h-10 sm:h-6"
                />
              </span>
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="sm:text-md lg:text-2xl font-bold my-1">
                Fleksibilitas Waktu dan Akses Anywhere
              </h1>
              <p className="text-sm lg:text-[14px] sm:text-xs ">
                SINOW memahami bahwa setiap individu memiliki jadwal yang
                berbeda-beda, kami menyediakan fleksibilitas waktu dalam
                mengakses materi pembelajaran.
              </p>
            </div>
          </div>
          <div className=" flex lg:mb-4 lg:flex gap-5">
            <div className="my-2">
              <span>
                <img
                  src={Icon}
                  alt="iconCheck"
                  className="h-8 lg:h-10 sm:h-6"
                />
              </span>
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="sm:text-md lg:text-2xl font-bold my-1">
                Komunitas Pembelajar yang Aktif
              </h1>
              <p className="text-sm lg:text-[14px] sm:text-xs ">
                Anda dapat berinteraksi dengan sesama peserta kursus, bertukar
                pengalaman, dan memperluas jaringan profesional Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
