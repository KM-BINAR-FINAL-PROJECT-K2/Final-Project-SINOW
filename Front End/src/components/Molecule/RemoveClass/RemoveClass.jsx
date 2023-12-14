/* eslint-disable react/prop-types */
import Swal from "sweetalert2";
import MaskotLogout from "/images/logo-n-maskot/forgot_pass_aset.png";
import axios from "axios";
import { useContext } from "react";
import { ClassContext } from "../../../store/ClassStore";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
export default function RemoveClass({ id }) {
  const { classSinow, setClassSinow } = useContext(ClassContext);
  const { toggleShowWarning } = useContext(RemoveClassContext);
  const handleRemoveButton = async () => {
    try {
      toggleShowWarning();

      const result = await Swal.fire({
        title: "Yakin Menghapus Data?",
        imageUrl: MaskotLogout,
        imageWidth: "200",
        imageHeight: "170",
        showCancelButton: true,
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#73CA5C",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        customClass: {
          title: "text-[24px]",
          actions: "gap-3",
          confirmButton: "px-8",
          cancelButton: "px-10",
        },
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/v1/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const deletedIndex = classSinow.findIndex((item) => item.id === id);
        const updatedClasses = [...classSinow];
        updatedClasses.splice(deletedIndex, 1);
        setClassSinow(updatedClasses);

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Data berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleRemoveButton();
}
