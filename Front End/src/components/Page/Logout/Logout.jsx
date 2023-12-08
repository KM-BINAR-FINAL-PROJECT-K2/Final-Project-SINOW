/* eslint-disable react/prop-types */
import { useEffect } from "react";
import MaskotLogout from "/images/logo-n-maskot/forgot_pass_aset.png";
import Swal from "sweetalert2";
export default function ButtonLogout({}) {
  // const handleLogout = () => {
  //   localStorage.clear();
  // };

  const handleLogout = () => {
    Swal.fire({
      title: "Keluar dari akun?",

      imageUrl: MaskotLogout,
      imageWidth: "250",
      imageHeight: "200",
      showCancelButton: true,
      customClass: {
        actions: "gap-5",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#73CA5C",
      cancelButtonText: "Batal",
      confirmButtonText: "Keluar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/";
        alert("Berhasil keluar dari akun!");
      }
    });
  };
  handleLogout();
}
