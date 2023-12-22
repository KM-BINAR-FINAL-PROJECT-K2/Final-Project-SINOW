import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function FAQ() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className=" h-auto m-4">
      <h1 className=" my-20 text-center text-2xl font-bold">
        Frequently Asked Question
      </h1>
      <div className="border mx-4 mt-4 mb-20 pt-6 px-6 pb-12 rounded-xl">
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader className="text-lg" onClick={() => handleOpen(1)}>
            Apakah kursus ini cocok untuk pemula yang ingin belajar coding dari
            nol?
          </AccordionHeader>
          <AccordionBody className="text-md">
            Ya, tentu saja program ini cocok untuk pemula yang ingin belajar
            coding dari nol! Bootcamp dari SINOW dirancang untuk pemula dan
            mereka yang ingin belajar coding dari nol. Kami akan membantu kamu
            memahami konsep dasar pemrograman dengan bahasa pemrograman
            JavaScript.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
          <AccordionHeader className="text-lg" onClick={() => handleOpen(2)}>
            Berapa lama proses pembelajaran berlangsung?
          </AccordionHeader>
          <AccordionBody className="text-md">
            Untuk Fase Persiapan berlangsung selama 4 minggu dan Bootcamp selama
            12 minggu mulai pukul 09:00-18:00 WIB. Jadi kamu dituntut untuk
            memiliki full time komitmen dalam mengikuti program ini.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
          <AccordionHeader className="text-lg" onClick={() => handleOpen(3)}>
            Apakah saya akan mendapat sertifikat setelah lulus?
          </AccordionHeader>
          <AccordionBody className="text-md">
            Setelah kamu lulus kamu akan mendapat sertifikat kelulusan dari
            SINOW yang bisa kamu gunakan sebagai pengalaman tambahan di CV kamu.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
          <AccordionHeader className="text-lg" onClick={() => handleOpen(4)}>
            Apa yang saya akan pelajari dalam kursus ini?
          </AccordionHeader>
          <AccordionBody className="text-md">
            Dalam bootcamp / kursus coding ini, kamu akan belajar dasar-dasar
            pemrograman, belajar bahasa pemrograman JavaScript, pemrograman web,
            dan banyak lagi. Ini adalah bootcamp yang akan menghasilkan front
            end developer dan juga back end developer bahkan full stack
            developer.
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
          <AccordionHeader className="text-lg" onClick={() => handleOpen(5)}>
            Apakah siswa akan dicarikan kerja setelah lulus?
          </AccordionHeader>
          <AccordionBody className="text-md">
            Setelah kamu lulus kami akan membantu kamu mendapatkan pekerjaan.
            Perusahaan rekanan kami akan melakukan rekrutmen bagi setiap peserta
            yang lulus pelatihan.
          </AccordionBody>
        </Accordion>
      </div>
    </div>
  );
}
