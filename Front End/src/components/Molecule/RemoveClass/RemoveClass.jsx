import Swal from "sweetalert2";
import MaskotLogout from "/images/logo-n-maskot/forgot_pass_aset.png";
import axios from "axios";
export default function RemoveClass({ toggleShowContainer, id, data, update }) {
  const handleRemoveButton = async () => {
    try {
      toggleShowContainer();
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Dapatkan indeks item yang dihapus
      const deletedIndex = data.findIndex((item) => item.id === id);

      // Buat salinan array untuk memodifikasinya
      const updatedClasses = [...data];

      // Hapus item dari array
      updatedClasses.splice(deletedIndex, 1);

      // Perbarui state dengan data yang telah diperbarui
      update(updatedClasses);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data berhasil dihapus",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`
       ${toggleShowContainer ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="border rounded-[16px] bg-neutral-01 w-[300px] sm:w-[400px]  h-auto py-[10px] text-center">
            <div className="justify-center items-center">
              <h3 className="text-darkblue-05 font-semibold text-[20px] m-[20px]">
                Yakin Menghapus Data ?
              </h3>
              <img
                className="m-auto w-40 h-34 sm:w-40 sm:h-34 md:w-40 md:h-34"
                src={MaskotLogout}
                alt="maskot"
              />
            </div>

            <div className="flex justify-between flex-wrap gap-[15px] m-[50px]">
              <button
                className="text-white text-[16px] font-semibold bg-alert-danger p-[12px] rounded-[25px] flex-1 md:w-[200px]"
                onClick={handleRemoveButton}
              >
                Hapus
              </button>
              <button
                className="text-white text-[16px] font-semibold bg-alert-success p-[12px] rounded-[25px] flex-1 md:w-[200px]"
                onClick={toggleShowContainer}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
