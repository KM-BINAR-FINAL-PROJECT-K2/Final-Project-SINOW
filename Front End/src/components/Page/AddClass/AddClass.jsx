/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
import Swal from "sweetalert2";
import { LoaderContext } from "../../../store/Loader";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";

export default function AddClass() {
  const [categories, setCategories] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [form, setForm] = useState({
    name: "",
    level: "",
    rating: 0,
    category: 1,
    description: "",
    classCode: "",
    type: "",
    price: 0,
    promoDiscountPercentage: 0,
    courseBy: "",
    imageUrl: "",
    videoPreviewUrl: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const level = formData.get("level").toLowerCase();
    const rating = Number(formData.get("rating"));
    const category = Number(formData.get("category"));
    const description = formData.get("description");
    let classCode = formData.get("classCode");
    const type = formData.get("type").toLowerCase();
    const price = Number(formData.get("price"));
    const promoDiscountPercentage = Number(
      formData.get("promoDiscountPercentage")
    );
    const courseBy = formData.get("courseBy");
    const imageUrl = formData.get("imageUrl");
    const videoPreviewUrl = formData.get("videoPreviewUrl");

    if (classCode === " - ") {
      classCode = "";
    }

    setForm({
      name,
      level,
      rating,
      categoryId: category,
      description,
      classCode,
      type,
      price,
      promoDiscountPercentage,
      courseBy,
      image: imageUrl,
      video: videoPreviewUrl,
    });
  };

  console.log(form);

  useEffect(() => {
    try {
      if (!form.name) {
        return;
      }
      const addClass = async () => {
        await Swal.fire({
          title: "Yakin menambahkan Course baru?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Simpan",
          confirmButtonColor: "#73CA5C",
          denyButtonColor: "#FF0000",
          denyButtonText: `Batal`,
          customClass: {
            actions: "gap-3",
            confirmButton: "px-8",
            denyButton: "px-10",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.post(`http://localhost:3000/api/v1/courses`, form, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
            } catch (error) {
              if (error.response.status !== 200) {
                const err =
                  error.response.data.message.charAt(0).toUpperCase() +
                  error.response.data.message.slice(1);
                await Swal.fire({
                  titleText: err,
                  imageUrl: "/images/logo-n-maskot/failed_payment.png",
                  imageWidth: 200,
                  confirmButtonText: "Kembali",
                  confirmButtonColor: "#73CA5C",
                });

                return;
              }
              console.log(error);
            }
            await Swal.fire({
              titleText: "Tersimpan!",
              imageUrl: "/images/logo-n-maskot/Sticker-3.png",
              imageWidth: 200,
              confirmButtonText: "Kembali ke Kelola Kelas",
              confirmButtonColor: "#73CA5C",
            });

            window.location.href = "/kelola-kelas";
          } else if (result.isDenied) {
            Swal.fire({
              titleText: "Perubahan dibatalkan",
              imageUrl: "/images/logo-n-maskot/Sticker-2.png",
              imageWidth: 200,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#73CA5C",
            });
          }
        });
      };
      addClass();
    } catch (error) {
      console.log(error);
    }
  }, [form]);

  useEffect(() => {
    try {
      const getCategory = async () => {
        const res = await axios.get("http://localhost:3000/api/v1/category");
        setCategories(res.data.data);
      };
      getCategory();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navigation>
        <section className={`mx-4 n lg:mx-[64px] mb-64 -mt-[70px] `}>
          <section className="overflow-auto">
            <div className="mb-[20px]">
              <Breadcrumb
                links={[
                  { name: "Kelola Kelas", url: "/kelola-kelas" },
                  { name: "Tambah Kelas" },
                ]}
              />
            </div>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Tambah Kelas
            </h1>

            <form className="" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Kode Kelas
                  </label>
                  <input
                    type="text"
                    name="classCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="FE-01"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Judul Course
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Belajar ReactJS dan NextJS dalam 1 Bulan 🚀"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Level
                  </label>
                  <select
                    name="level"
                    id=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 md:text-sm text-xs"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Rating [ 1 -5 ]
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min={0}
                    max={5}
                    step="any"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-xs"
                    placeholder="4,5"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Tipe
                  </label>
                  <select
                    name="type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option
                      className="font-normal text-neutral-05"
                      value="gratis"
                    >
                      GRATIS
                    </option>
                    <option
                      className="font-normal text-neutral-05"
                      value="premium"
                    >
                      PREMIUM
                    </option>
                  </select>
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Harga [ dalam Rupiah. ]
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="50000"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Promo [ Persen (%) ]
                  </label>
                  <input
                    type="number"
                    name="promoDiscountPercentage"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="20"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Course Oleh
                  </label>
                  <input
                    type="text"
                    name="courseBy"
                    className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Fadhlan"
                  />
                </div>

                <div className="mb-1 col-span-2">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Kategori
                  </label>
                  {categories && (
                    <div className="flex">
                      <select
                        id="countries"
                        name="category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      >
                        {categories.map((category) => (
                          <option
                            key={category.id}
                            className="font-normal text-neutral-05"
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-1 col-span-2">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Upload Gambar
                  </label>

                  <input
                    placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                    className=" focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    cursor-pointer"
                    aria-describedby="file_input_help"
                    id="file_input"
                    name="imageUrl"
                    type="file"
                    accept="image/*"
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 "
                    id="file_input_help"
                  >
                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                  </p>
                </div>

                <div className="mb-1 col-span-2">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Upload Video
                  </label>
                  <input
                    placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                    name="videoPreviewUrl"
                    className=" focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    cursor-pointer"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="video/*"
                  />
                </div>

                <div className="mb-1 col-span-2">
                  <label htmlFor="" className="block md:text-sm text-xs mb-1">
                    Deskripsi
                  </label>

                  <textarea
                    name="description"
                    id=""
                    cols="30"
                    rows="10"
                    className="block p-2.5 w-full md:text-sm text-xs mb-1 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="Masukkan deskripsi kelas..."
                  ></textarea>
                </div>

                <div className="text-left col-span-2">
                  <button
                    type="submit"
                    className="bg-darkblue-05 text-white md:text-sm text-xs mb-1 font-semibold  p-[12px] rounded-[15px] flex-1 lg:w-full text-center w-full"
                  >
                    Tambah Kelas
                  </button>
                </div>
              </div>
            </form>
          </section>
        </section>
      </Navigation>
    </>
  );
}
