import Icon from "/images/icon/Check.png";
export default function WhyUs() {
  return (
    <div className=" m-4 text-sinow-04">
      <h1 className="text-center text-2xl my-10 font-bold lg:text-3xl f lg:mt-16 lg:mb-16">
        Mengapa harus memilih <span className="text-sinow-05">SINOW</span> ?
      </h1>
      <div className="h-auto w-full flex-auto md:gap-4 md:flex lg:flex ">
        <div className=" mx-2 lg:w-1/2  lg:flex lg:justify-center">
          <img
            src="/images/Study_1.jpg"
            alt="image"
            className="h-64 md:h-[320px] md:w-[350px] lg:h-96 rounded-3xl"
          />
        </div>
        <div className=" my-10 md:my-0 md:w-1/2 md:flex-3 lg:my-0 lg:w-1/2 lg:flex-3 ">
          <div className=" flex md:mb-4 md:flex md:gap-5 lg:mb-4 lg:flex gap-5">
            <div>
              <img src={Icon} alt="iconCheck" className="h-10 lg:h-10 md:h-8" />
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="md:text-md lg:text-2xl font-bold">
                Kualitas Pembelajaran Unggul
              </h1>
              <p className="text-sm md:text-xs text-justify">
                SINOW menawarkan pengalaman belajar online yang unggul dengan
                kurikulum yang dirancang secara cermat.
              </p>
            </div>
          </div>
          <div className=" flex md:mb-4 md:flex md:gap-5 lg:mb-4 lg:flex gap-5">
            <div className="my-2">
              <span>
                <img src={Icon} alt="iconCheck" className="h-10 md:h-8" />
              </span>
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="md:text-md lg:text-2xl font-bold my-1">
                Fleksibilitas Waktu dan Akses Anywhere
              </h1>
              <p className="text-sm md:text-xs">
                SINOW memahami bahwa setiap individu memiliki jadwal yang
                berbeda-beda, kami menyediakan fleksibilitas waktu dalam
                mengakses materi pembelajaran.
              </p>
            </div>
          </div>
          <div className=" flex md:mb-4 md:flex md:gap-5 lg:mb-4 lg:flex gap-5">
            <div className="my-2">
              <span>
                <img src={Icon} alt="iconCheck" className="h-10 md:h-8" />
              </span>
            </div>
            <div className=" w-72 lg:w-96">
              <h1 className="lmd:text-md lg:text-2xl font-bold my-1">
                Komunitas Pembelajar yang Aktif
              </h1>
              <p className="text-sm md:text-xs">
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
