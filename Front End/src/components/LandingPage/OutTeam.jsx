import Avatar1 from "/images/avatars/avatar_1.jpg";
import Avatar2 from "/images/avatars/avatar_2.jpg";
import Avatar3 from "/images/avatars/avatar_3.jpg";
import Avatar4 from "/images/avatars/avatar_4.jpg";
import Avatar5 from "/images/avatars/avatar_5.jpg";
import { FaInstagram, FaGithub } from "react-icons/fa";
export default function OurTeam() {
  const navigation = [
    {
      image: Avatar1,
      name: "Grace Natali S.",
    },
    {
      image: Avatar2,
      name: "Mohamad Fadhlan R.",
    },
    {
      image: Avatar3,
      name: "Mohamad Alif R.",
    },
    {
      image: Avatar4,
      name: "michael Arselius P.",
    },
    {
      image: Avatar5,
      name: "adella Desinta M",
    },
  ];
  return (
    <div className=" m-4 pt-10 pb-4 md:pt-10 lg:pb-14 bg-slate-100 rounded-lg">
      <h1 className="py-4 text-2xl font-bold text-center md:py-2"> Our Team</h1>
      <div className=" py-4 grid md:py-2 md:grid md:grid-cols-5 lg:grid lg:grid-cols-5 place-items-center ">
        {navigation.map((item) => (
          <div className="bg-white shadow-md h-[300px] w-[250px] my-10 mx-5 rounded-xl md:h-[260px] md:w-[150px] lg:h-[250px] lg:w-[200px]">
            <div className="m-5  flex justify-center">
              <img
                src={item.image}
                alt="avatar"
                className="rounded-full h-36 md:h-28 "
              />
            </div>
            <p
              key={item.name}
              className=" mx-5 mt-5 mb-3 text-center font-bold text-md md:mb-1 md:text-[12px]"
            >
              {item.name}
            </p>
            <p className=" mx-5 text-center font-normal text-sm md:text-[10px]">
              Fullstack Web Course
            </p>
            <div className=" flex gap-5 my-3 justify-center h-auto w-auto md:my-2 ">
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
                <FaGithub />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
