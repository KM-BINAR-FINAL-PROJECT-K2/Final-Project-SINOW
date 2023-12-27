import Avatar1 from "/images/avatars/avatar_1.jpg";
import Avatar2 from "/images/avatars/avatar_2.jpg";
import Avatar3 from "/images/avatars/avatar_3.jpg";
import Avatar4 from "/images/avatars/avatar_4.jpg";
import Avatar5 from "/images/avatars/avatar_5.jpg";
import Avatar6 from "/images/avatars/avatar_6.jpg";
import Avatar7 from "/images/avatars/avatar_7.jpg";
import Avatar8 from "/images/avatars/avatar_8.jpg";
import Avatar9 from "/images/avatars/avatar_9.jpg";
import Avatar10 from "/images/avatars/avatar_10.jpg";
import { FaInstagram, FaGithub } from "react-icons/fa";
export default function OurTeam() {
  const navigation = [
    {
      image: Avatar1,
      name: "Grace Natali S.",
      class: "Fullstack Web Course",
    },
    {
      image: Avatar2,
      name: "Mohamad Fadhlan R.",
      class: "Fullstack Web Course",
    },
    {
      image: Avatar3,
      name: "Mohamad Alif R.",
      class: "Fullstack Web Course",
    },
    {
      image: Avatar4,
      name: "Michael Arselius P.",
      class: "Fullstack Web Course",
    },
    {
      image: Avatar5,
      name: "Adella Desinta M",
      class: "Fullstack Web Course",
    },
    {
      image: Avatar6,
      name: "Randika Akhdan Afghani",
      class: "Android",
    },
    {
      image: Avatar7,
      name: "Ragil Budiarto",
      class: "Android",
    },
    {
      image: Avatar8,
      name: "M. Farhan Al Anzhari",
      class: "Android",
    },
    {
      image: Avatar9,
      name: "Ivanston Simbolon",
      class: "Android",
    },
    {
      image: Avatar10,
      name: "Dian Permata Kusuma",
      class: "Android",
    },
  ];
  return (
    <div className=" m-4 pt-10 pb-4 sm:pt-10 lg:pb-14 bg-slate-100 rounded-lg">
      <h1 className="py-4 text-2xl font-bold text-center sm:py-2"> Our Team</h1>
      <div className="overflow-auto">
        <div className=" py-4 grid sm:py-2 sm:grid sm:grid-cols-3 lg:grid lg:grid-cols-5 place-items-center ">
          {navigation.map((item) => (
            <div className="bg-white shadow-sm h-[300px] w-[250px] my-10 mx-5 sm:h-[300px] sm:w-[230px] rounded-xl border lg:h-[250px] lg:w-[200px]">
              <div className="m-5  flex justify-center">
                <img
                  src={item.image}
                  alt="avatar"
                  className="rounded-full h-36 sm:h-28 "
                />
              </div>
              <p
                key={item.name}
                className=" mx-5 mt-5 mb-3 text-center font-bold text-sm sm:mb-1 sm:text-[12px]"
              >
                {item.name}
              </p>
              <p className=" mx-5 text-center font-normal text-sm sm:text-[10px]">
                {item.class}
              </p>
              <div className=" flex gap-5 my-3 justify-center h-auto w-auto sm:my-2 ">
                <a href="https://www.instagram.com/">
                  <FaInstagram />
                </a>
                <a href="https://github.com/">
                  <FaGithub />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
