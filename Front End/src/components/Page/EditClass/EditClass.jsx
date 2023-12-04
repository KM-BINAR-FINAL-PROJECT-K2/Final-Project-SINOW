/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../Template/Navigation/Navigation";
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

  console.log(form);

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
        await axios.put(`http://localhost:3000/api/v1/courses/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire({
          title: "Do you want to save the changes?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save",
          denyButtonText: `Don't save`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log("yg dikirim:");
            console.log(form);
            Swal.fire("Saved!", "", "success");
            window.location.href = "/kelola-kelas";
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
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
        <section className=" mx-4 n lg:mx-[64px] mb-64 ">
          <section className="overflow-auto">
            <nav
              className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 "
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="/kelola-kelas"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
                  >
                    Kelola Kelas
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <a
                      href="#"
                      className="ms-1 text-sm text-gray-700 hover:text-blue-600 md:ms-2 font-semibold"
                    >
                      Edit Kelas
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            {editClass && (
              <form className="" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="" className="block">
                    Judul Course
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editClass.name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="name@flowbite.com"
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Level
                  </label>
                  <input
                    type="text"
                    name="level"
                    defaultValue={
                      editClass.level.charAt(0).toUpperCase() +
                      editClass.level.slice(1)
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    defaultValue={editClass.rating}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Kategori
                  </label>
                  {categories && (
                    <div className="flex">
                      <select
                        id="countries"
                        name="category"
                        defaultValue={editClass.category.id}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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

                <div>
                  <label htmlFor="" className="block">
                    Deskripsi
                  </label>

                  <textarea
                    name="description"
                    id=""
                    cols="30"
                    rows="10"
                    defaultValue={editClass.description}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="Leave a comment..."
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Kode Kelas
                  </label>
                  <input
                    type="text"
                    name="classCode"
                    defaultValue={
                      editClass.classCode ? editClass.classCode : " - "
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Tipe
                  </label>
                  <select
                    name="type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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

                <div>
                  <label htmlFor="" className="block">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editClass.price}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Promo
                  </label>
                  <input
                    type="number"
                    name="promo"
                    defaultValue={editClass.promo}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Course Oleh
                  </label>
                  <input
                    type="text"
                    name="courseBy"
                    defaultValue={editClass.courseBy}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Gambar
                  </label>
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={editClass.imageUrl}
                  />
                  <img
                    src={editClass.imageUrl}
                    alt=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>

                <div>
                  <label htmlFor="" className="block">
                    Video Url
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="videoPreviewUrl"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      defaultValue={editClass.videoPreviewUrl}
                    />
                    <a
                      href={editClass.videoPreviewUrl}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      target="_blank"
                      rel="noreferrer"
                    >
                      Preview Video
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-darkblue-05 text-white text-[16px] font-semibold  p-[12px] rounded-[15px] flex-1 lg:w-full text-center w-[50%]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
