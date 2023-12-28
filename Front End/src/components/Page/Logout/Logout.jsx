import MaskotLogout from "/images/logo-n-maskot/forgot_pass_aset.png";
import Swal from "sweetalert2";
export default function ButtonLogout() {
  const handleLogout = () => {
    Swal.fire({
      title: "Keluar dari akun?",

      imageUrl: MaskotLogout,
      imageWidth: "200",
      imageHeight: "170",
      showCancelButton: true,
      cancelButtonColor: "#73CA5C",
      confirmButtonColor: "#FF0000",
      cancelButtonText: "Batal",
      confirmButtonText: "Keluar",
      customClass: {
        title: "text-[24px]",
        actions: "gap-3",
        confirmButton: "px-8",
        cancelButton: "px-10",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/admin";
        alert("Berhasil keluar dari akun!");
      }
    });
  };
  handleLogout();
}
