/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
// import ImageUploader from "../../Molecule/ImageUploader/ImageUploader";
import Swal from "sweetalert2";

export default function EditClass() {
  const [editClass, setEditClass] = useState();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    level: "",
    rating: 0,
    category: 1,
    description: "",
    classCode: "",
    type: "",
    price: 0,
    promo: 0,
    courseBy: "",
    imageUrl: "",
    videoPreviewUrl: "",
  });

  const { id } = useParams();
  useEffect(() => {
    try {
      const getClass = async () => {
        const res = await axios.get(
          `http://localhost:3000/api/v1/courses/${id}`
        );
        setEditClass(res.data.data);
      };
      getClass();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const level = formData.get("level");
    const rating = Number(formData.get("rating"));
    const category = Number(formData.get("category"));
    const description = formData.get("description");
    let classCode = formData.get("classCode");
    const type = formData.get("type");
    const price = Number(formData.get("price"));
    const promo = Number(formData.get("promo"));
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
      category,
      description,
      classCode,
      type,
      price,
      promo,
      courseBy,
      imageUrl,
      videoPreviewUrl,
    });
  };

  useEffect(() => {
    try {
      if (!form.name) {
        return;
      }
      const updateClass = async () => {
        await Swal.fire({
          title: "Yakin menyimpan perubahan?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save",
          confirmButtonColor: "#6148FF",
          denyButtonColor: "#FF0000",
          cancelButtonColor: "#73CA5C",
          denyButtonText: `Don't save`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.put(
                `http://localhost:3000/api/v1/courses/${id}`,
                form,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
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

                return (window.location.href = "/kelola-kelas");
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
      updateClass();
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
      <Navigation>
        <section className=" mx-4 n lg:mx-[64px] mb-64 -mt-[70px]">
          <section className="overflow-auto">
            <div className="mb-[20px]">
              <Breadcrumb
                links={[
                  { name: "Kelola Kelas", url: "/kelola-kelas" },
                  { name: "Edit Kelas" },
                ]}
              />
            </div>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Edit Kelas
            </h1>
            {editClass && (
              <form className="" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                  <div className="col-span-2 flex md:gap-8 gap-4">
                    <div>
                      <input
                        type="hidden"
                        name="imageUrl"
                        value={editClass.imageUrl}
                      />
                      <img
                        src={editClass.imageUrl}
                        alt=""
                        className="md:w-[200px] w-[180px] text-sm rounded-lg block "
                      />
                    </div>

                    <div className="flex-1">
                      <div className="mb-3">
                        <label
                          htmlFor=""
                          className="block md:text-sm text-xs mb-1"
                        >
                          Kode Kelas
                        </label>
                        <input
                          type="text"
                          name="classCode"
                          defaultValue={
                            editClass.classCode ? editClass.classCode : " - "
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor=""
                          className="block md:text-sm text-xs mb-1"
                        >
                          Judul Course
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editClass.name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="name@flowbite.com"
                        />
                      </div>
                    </div>
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
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      min={0}
                      max={5}
                      step="any"
                      defaultValue={editClass.rating}
                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-xs"
                    />
                  </div>

                  <div className="mb-1">
                    <label htmlFor="" className="block md:text-sm text-xs mb-1">
                      Tipe
                    </label>
                    <select
                      name="type"
                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      defaultValue={editClass.type}
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
                      defaultValue={editClass.price}
                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    />
                  </div>

                  <div className="mb-1">
                    <label htmlFor="" className="block md:text-sm text-xs mb-1">
                      Promo [ Persen (%) ]
                    </label>
                    <input
                      type="number"
                      name="promo"
                      defaultValue={editClass.promo}
                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    />
                  </div>

                  <div className="mb-1">
                    <label htmlFor="" className="block md:text-sm text-xs mb-1">
                      Course Oleh
                    </label>
                    <input
                      type="text"
                      name="courseBy"
                      defaultValue={editClass.courseBy}
                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                          defaultValue={editClass.category.id}
                          className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        >
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              className="font-normal text-neutral-05"
                              value={parseInt(category.id, 10)}
                              selected={category.id === editClass.category.id}
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
                      Video Url
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="videoPreviewUrl"
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        defaultValue={editClass.videoPreviewUrl}
                      />
                      <a
                        href={editClass.videoPreviewUrl}
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        target="_blank"
                        rel="noreferrer"
                      >
                        Preview Video
                      </a>
                    </div>
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
                      defaultValue={editClass.description}
                      className="block p-2.5 w-full md:text-sm text-xs mb-1 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      placeholder="Leave a comment..."
                    ></textarea>
                  </div>

                  <div className="text-left col-span-2">
                    <button
                      type="submit"
                      className="bg-darkblue-05 text-white md:text-sm text-xs mb-1 font-semibold  p-[12px] rounded-[15px] flex-1 lg:w-full text-center w-full"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
