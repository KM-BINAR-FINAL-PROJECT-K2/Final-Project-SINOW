/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
export default function Header() {
  const [name, setName] = useState("");

  const adminToken = localStorage.getItem("token");
  useEffect(() => {
    if (!adminToken) {
      window.location.href = "/";
      return;
    }

    const validateToken = async () => {
      try {
        if (adminToken) {
          const res = await axios.get(
            "https://sinow-production.up.railway.app/api/v1/user",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );
          if (res.data.status === "Success" && res.data.data.role === "admin") {
            const response = res.data.data;

            const dataListString = JSON.stringify([
              response.Auth.email,
              response.name,
              response.city,
              response.country,
            ]);

            setName(response.name);

            localStorage.setItem("data", dataListString);
          } else {
            localStorage.clear();
            window.location.href = "/admin";
          }
        }
      } catch (error) {
        if (error.response.data.status === "Failed") {
          console.log(error);
          localStorage.clear();
          window.location.href = "/admin";
        }
      }
    };

    validateToken();
  }, [adminToken]);

  return (
    <header className="bg-sinow-05 pt-[26px] pb-[20px] md:pt-[25px] md:pb-[25px] pl-10 pr-[35px] lg:pr-[87px] flex justify-between drop-shadow-sm mb-[79px] sticky top-0 gap-5 flex-wrap z-[600] shadow-lg">
      <h1 className=" font-normal text-[24px] text-white flex-1 py-2 ">
        Selamat Datang, <b>{name}</b>
      </h1>
    </header>
  );
}
