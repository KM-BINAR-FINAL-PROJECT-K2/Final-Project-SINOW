/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import Swal from "sweetalert2";
import { Tooltip } from "flowbite-react";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";
import { LoaderContext } from "../../../store/Loader";

export default function EditClass() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [editClass, setEditClass] = useState();
  const [categories, setCategories] = useState([]);
  const [removeBenefits, setRemoveBenefits] = useState([]);
  const [benefitsValue, setBenefitsValue] = useState();
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
      console.error(error.response.data.message);
    }
  }, [id]);

  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      const benefitsData = [];
      const formData = new FormData(e.target);
      const name = formData.get("name");
      const level = formData.get("level");
      const rating = Number(formData.get("rating"));
      const category = Number(formData.get("category"));
      const description = formData.get("description");
      let classCode = formData.get("classCode");
      const type = formData.get("type");
      const price = Number(formData.get("price"));
      const promoDiscountPercentage = Number(
        formData.get("promoDiscountPercentage")
      );
      const courseBy = formData.get("courseBy");
      const imageUrl = formData.get("image");
      const videoPreviewUrl = formData.get("videoPreviewUrl");

      if (editClass && editClass.benefits) {
        editClass.benefits.forEach((benefit, index) => {
          formData.append(`benefits[${index}][id]`, benefit.id);
          formData.append(
            `benefits[${index}][description]`,
            benefit.description
          );

          if (!benefitsData[index]) {
            benefitsData[index] = {};
          }

          benefitsData[index].id = benefit.id;
          benefitsData[index].description = benefit.description;
        });
      }

      setBenefitsValue(Object.values(benefitsData));

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (!form.name) {
        return;
      }
      const updateClass = async () => {
        const allowedImageTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/svg+xml",
        ];
        const allowedVideoTypes = [
          "video/mp4",
          "video/ogg",
          "video/webm",
          "video/avi",
          "video/mpeg",
          "video/mov",
        ];

        if (
          form.image.size > 0 &&
          !allowedImageTypes.includes(form.image.type)
        ) {
          throw new Error("Tipe gambar harus .jpeg/.jpg/.png/.svg");
        }

        if (
          form.video.size > 0 &&
          !allowedVideoTypes.includes(form.video.type)
        ) {
          throw new Error("Tipe video harus .mp4/.ogg/.webm/.avi/.mpeg/.mov");
        }

        if (form.image.size > 2097152) {
          throw new Error("Ukuran gambar terlalu besar, maks 2MB");
        }

        if (form.video.size > 26214400) {
          throw new Error("Ukuran video terlalu besar, maks 25MB");
        }

        await Swal.fire({
          title: "Yakin menyimpan perubahan?",
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

              if (benefitsValue.length > 0) {
                if (removeBenefits.length > 0) {
                  for (let i = 0; i < removeBenefits.length; i++) {
                    await axios.delete(
                      `http://localhost:3000/api/v1/benefits/${removeBenefits[i]}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                  }
                }

                let filteredBenefitData = [];

                for (let i = 0; i < removeBenefits.length; i++) {
                  for (let j = 0; j < benefitsValue.length; j++) {
                    if (removeBenefits[i] === benefitsValue[j].id) {
                      filteredBenefitData.push(benefitsValue[j]);
                    }
                  }
                }

                let benefitChangeId = [];

                for (let i = 0; i < benefitsValue.length; i++) {
                  const benefitData = benefitsValue[i];
                  let shouldPush = true;

                  if (filteredBenefitData.length > 0) {
                    for (let j = 0; j < filteredBenefitData.length; j++) {
                      if (filteredBenefitData[j].id === benefitData.id) {
                        shouldPush = false;
                        break;
                      }
                    }
                  }

                  if (shouldPush) {
                    benefitChangeId.push(benefitData);
                  }
                }

                if (benefitChangeId.length > 0) {
                  for (let i = 0; i < benefitChangeId.length; i++) {
                    await axios.put(
                      `http://localhost:3000/api/v1/benefits/${benefitChangeId[i].id}`,
                      {
                        no: i + 1,
                        description: benefitChangeId[i].description,
                      },
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                  }
                }
              }

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
              console.log(error);
              if (error.response.status && error.response.status !== 200) {
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
            }
            setIsLoading(false);
            await Swal.fire({
              titleText: "Tersimpan!",
              imageUrl: "/images/logo-n-maskot/Sticker-3.png",
              imageWidth: 200,
              confirmButtonText: "Kembali ke Kelola Kelas",
              confirmButtonColor: "#73CA5C",
            });

            window.location.href = "/kelola-kelas";
          } else if (result.isDenied) {
            await Swal.fire({
              titleText: "Perubahan dibatalkan",
              imageUrl: "/images/logo-n-maskot/Sticker-2.png",
              imageWidth: 200,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#73CA5C",
              customClass: {
                confirmButton: "px-10",
              },
            });
          }
        });
      };
      updateClass().catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: true,
          confirmButtonColor: "#73CA5C",
        });
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
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
      console.error(error.response.data.message);
    }
  }, []);

  const handleRemoveBenefitById = (id) => {
    setRemoveBenefits((prev) => {
      if (prev.includes(id)) {
        return prev.filter((benefitId) => benefitId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleChangeBenefitValue = (benefitId, newValue) => {
    setEditClass((prev) => {
      const updatedBenefits = prev.benefits.map((benefit) =>
        benefit.id === benefitId
          ? { ...benefit, description: newValue }
          : benefit
      );
      return { ...prev, benefits: updatedBenefits };
    });
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
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
                      name="promoDiscountPercentage"
                      defaultValue={editClass.promoDiscountPercentage}
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
                      Perbarui Gambar
                    </label>
                    <div className="">
                      <input
                        type="file"
                        name="image"
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
                        multiple
                        accept="image/*"
                      />
                    </div>
                    <p className="font-semibold text-gray-600 text-xs pl-2 italic">
                      <span className="text-red-500">*</span> File Gambar Maks 2
                      MB
                    </p>
                  </div>

                  <div className="mb-1 col-span-2">
                    <label htmlFor="" className="block md:text-sm text-xs mb-1">
                      Upload Video Preview
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="file"
                        name="videoPreviewUrl"
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
                        accept="video/*"
                      />
                      <a
                        href={editClass.videoPreviewUrl}
                        className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        target="_blank"
                        rel="noreferrer"
                      >
                        Preview Video Terakhir
                      </a>
                    </div>
                    <p className="font-semibold text-gray-600 text-xs pl-2 italic">
                      <span className="text-red-500">*</span> File Video Maks 25
                      MB
                    </p>
                  </div>

                  {editClass.benefits.length > 0 && (
                    <div className="mb-1 col-span-2">
                      <label
                        htmlFor=""
                        className="block md:text-sm text-xs mb-1"
                      >
                        Benefit
                      </label>

                      {editClass.benefits &&
                        editClass.benefits
                          .sort((a, b) => a.no - b.no)
                          .map((benefit) => (
                            <div
                              key={benefit.id}
                              className="flex p-1 items-center gap-3"
                            >
                              <span>{benefit.no}</span>
                              <input
                                name="benefit"
                                className={`bg-gray-50 border border-gray-300 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                  removeBenefits.includes(benefit.id)
                                    ? "line-through text-alert-danger bg-slate-100"
                                    : "text-gray-900"
                                }`}
                                value={benefit.description}
                                onChange={(e) =>
                                  handleChangeBenefitValue(
                                    benefit.id,
                                    e.target.value
                                  )
                                }
                                disabled={removeBenefits.includes(benefit.id)}
                              />
                              <span
                                className="pb-1"
                                onClick={() =>
                                  handleRemoveBenefitById(benefit.id)
                                }
                              >
                                {!removeBenefits.includes(benefit.id) && (
                                  <Tooltip content="Hapus" placement="left">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      className="w-6 h-6 stroke-alert-danger hover:stroke-2 cursor-pointer"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </Tooltip>
                                )}

                                {removeBenefits.includes(benefit.id) && (
                                  <Tooltip content="Batal" placement="left">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      className="w-6 h-6 stroke-gray-800 hover:stroke-2 cursor-pointer"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                  </Tooltip>
                                )}
                              </span>
                            </div>
                          ))}
                      {removeBenefits.length > 0 && (
                        <p className="font-semibold text-gray-600 text-xs pl-2 italic">
                          <span className="text-red-500">*</span> Keuntungan
                          yang dicoret akan terhapus apabila perubahan disimpan.
                        </p>
                      )}
                    </div>
                  )}

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
