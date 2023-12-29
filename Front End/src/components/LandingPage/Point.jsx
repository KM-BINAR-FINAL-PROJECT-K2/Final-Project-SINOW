import { MdLibraryBooks } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi";
import { FaThumbsUp } from "react-icons/fa6";
import { FaSuitcase } from "react-icons/fa6";
import { BsFillDiagram2Fill } from "react-icons/bs";
export default function Point() {
  return (
    <div className="m-4  p-4">
      <h1 className=" text-center lg:text-center font-bold text-2xl lg:text-[32px] lg:p-16">
        Bootcamp Coding dengan Pembelajaran Intensif
      </h1>
      <div className=" my-4 justify-items-center grid grid-cols-1 items-center lg:grid lg:grid-cols-3">
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <MdLibraryBooks
              color="#00CCF4"
              className="  shadow-xl shadow-op rounded-lg p-3 h-20 w-20"
            />
          </div>
          <h1 className="text-lg font-bold mt-5">
            Kurikulum Kebutuhan Industri
          </h1>
          <p className="text-sm mt-2">
            Materi dirancang sesuai dengan kompetensi di industri terkini.
          </p>
        </div>
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <BsFillPeopleFill
              color="#00CCF4"
              className=" shadow-xl rounded-lg p-3 h-20 w-20"
            />
          </div>
          <h1 className="text-lg font-bold mt-5">1-On-1 Mentoring</h1>
          <p className="text-sm mt-2">
            Dibimbing langsung instruktur profesional dengan fasilitas 1-on-1
            mentoring.
          </p>
        </div>
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <HiLightBulb
              color="#00CCF4"
              className=" shadow-xl rounded-lg p-3 h-20 w-20"
            />
          </div>
          <h1 className="text-lg font-bold mt-5">Growth Mindset</h1>
          <p className="text-sm mt-2">
            Sesi konsultasi pengembangan diri untuk mengembangkan soft skill.
          </p>
        </div>
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <FaThumbsUp
              color="#00CCF4"
              className=" shadow-xl rounded-lg p-3 h-20 w-20"
            />
          </div>

          <h1 className="text-lg font-bold mt-5">Dicarikan Kerja</h1>
          <p className="text-sm mt-2">
            Dibantu dapat kerja setelah lulus di 800+ perusahaan Hiring
            Partners.
          </p>
        </div>
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <FaSuitcase
              color="#00CCF4"
              className=" shadow-xl rounded-lg p-3 h-20 w-20"
            />
          </div>
          <h1 className="text-lg font-bold mt-5">Projek Portofolio</h1>
          <p className="text-sm mt-2">
            MMembuat final projek berupa aplikasi web atau mobile untuk
            portofolio.
          </p>
        </div>
        <div className=" m-5 w-80">
          <div className="flex justify-center lg:flex lg:justify-start">
            <BsFillDiagram2Fill
              color="#00CCF4"
              className=" shadow-xl rounded-lg p-3 h-20 w-20"
            />
          </div>
          <h1 className="text-lg font-bold mt-5">Pelatihan Karir</h1>
          <p className="text-sm mt-2">
            Gratis pelatihan membuat CV dan interview, hingga konsultasi seputar
            pekerjaan.
          </p>
        </div>
      </div>
    </div>
  );
}
