import Logo from "/images/logo/Logo_01.png";
import Instagram from "/images/icon/ig1.png";
import Facebook from "/images/icon/fb1.png";
import X from "/images/icon/x1.png";
import Youtube from "/images/icon/yt1.png";
import { HiOutlineMail } from "react-icons/hi";
import { IoCallOutline } from "react-icons/io5";
export default function Footer() {
  const sosmed = [
    {
      icon: Instagram,
      link: "https://www.instagram.com/ ",
    },
    {
      icon: Facebook,
      link: "https://id-id.facebook.com/login/device-based/regular/login/?login_attempt=1",
    },
    {
      icon: X,
      link: "https://twitter.com/?lang=id",
    },
    {
      icon: Youtube,
      link: "https://www.youtube.com/",
    },
  ];
  return (
    <>
      <div className="mt-24 lg:mt-32 bg-sinow-03 text-white">
        <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 gap-16 place-items-center items-start py-20 px-1 h-auto mx-10 lg:grid lg:grid-cols-4 lg:place-items-center lg:items-start lg:py-20 lg:px-1 lg:h-auto lg:mx-10">
          <div className=" grid grid-cols-1 gap-6 font-bold text-xl lg:text-sm mb-8">
            <img src={Logo} alt="logo" className=" h-16 lg:h-12" />
            <div className="flex gap-2 items-center ">
              <HiOutlineMail className=" w-8" />
              <p className="">sinow00@gmail.com</p>
            </div>
            <div className="flex gap-2 items-center">
              <IoCallOutline className="w-8" />
              <p className="">(021) 1234 5678 </p>
            </div>
            <div className=" flex justify-between">
              {sosmed.map((item, index) => (
                <a key={index} href={item.link} className="">
                  <img
                    src={item.icon}
                    alt="logo"
                    className="h-8 p-1 bg-white rounded-full md:p-1 md:bg-white md:rounded-full lg:p-1 lg:bg-white lg:rounded-full"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className=" grid grid-cols-1 gap-4 text-center text-lg lg:text-sm lg:text-start">
            <h1 className="font-bold text-xl lg:text-lg">ABOUT</h1>
            <p>Profile</p>
            <p>Why Us</p>
            <p>Our Team</p>
            <p>FAQ</p>
          </div>
          {/* Sosmed */}
          <div className=" grid grid-cols-1 gap-4 text-lg text-center lg:text-sm lg:text-start">
            <h1 className="font-bold text-xl lg:text-lg">BOOTCAMP</h1>
            <p>UI/UX Designer</p>
            <p>Product Management</p>
            <p>Web Development</p>
            <p>Android Development</p>
            <p>IOS Development</p>
            <p>Business Intelegence</p>
            <p>Digital Marketing</p>
          </div>

          <div className=" grid grid-cols-1 gap-4 text-center text-lg lg:text-sm lg:text-start">
            <h1 className="font-bold text-xl lg:text-lg">LOCATION</h1>
            <p>Jakarta</p>
            <p>Tangerang</p>
            <p>Karawang</p>
            <p>Kalimantan</p>
            <p>Sulawesi</p>
            <p>Remote</p>
          </div>
        </div>
      </div>
      <div className=" text-white ">
        <div className="py-4 bg-sinow-04 ">
          <div className=" grid grid-cols-1 place-items-center lg:grid lg:grid-cols-2 lg:place-items-center lg:h-auto">
            <div className="flex gap-2">
              <a href="">Syarat & ketentuan</a>
              <a href="">Kebijakan Privasi</a>
            </div>
            <p>© 2023 SINOW.All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}
