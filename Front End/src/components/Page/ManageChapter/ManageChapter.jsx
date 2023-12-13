/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { Accordion, Flowbite } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
// import ImageUploader from "../../Molecule/ImageUploader/ImageUploader";
import Swal from "sweetalert2";
import { LoaderContext } from "../../../store/Loader";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";
import { convertSeconds } from "../../../utils/formatHour";
import { ErrorContext } from "../../../store/Error";

export default function ManageChapter() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const [chapters, setChapters] = useState();
  const [classData, setClassData] = useState();
  const [random, setRandom] = useState();
  const [form, setForm] = useState();
  const [showAddForm, setShowAddForm] = useState(false);

  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const no = Number(formData.get("no"));

    setForm({
      name,
      no,
      courseId: id,
    });
  };

  useEffect(() => {
    try {
      if (!form || !form.name || !form.no) {
        return;
      }
      const addChapter = async () => {
        await Swal.fire({
          title: "Yakin menambahkan chapter?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Tambah",
          confirmButtonColor: "#6148FF",
          denyButtonColor: "#FF0000",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.post(`http://localhost:3000/api/v1/chapters/`, form, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              setRandom(Math.random());
            } catch (error) {
              if (error.response.status !== 200) {
                const err = error.response.data.message;
                await Swal.fire({
                  titleText: err,
                  imageUrl: "/images/logo-n-maskot/failed_payment.png",
                  imageWidth: 200,
                  confirmButtonText: "Kembali",
                  confirmButtonColor: "#73CA5C",
                });
              }
              setIsLoading(false);
              return;
            }
            setIsLoading(false);
            await Swal.fire({
              titleText: "Berhasil Ditambahkan!",
              imageUrl: "/images/logo-n-maskot/Sticker-3.png",
              imageWidth: 200,
              confirmButtonText: "Ok",
              confirmButtonColor: "#73CA5C",
            });
          } else if (result.isDenied) {
            await Swal.fire({
              titleText: "Perubahan dibatalkan",
              imageUrl: "/images/logo-n-maskot/Sticker-2.png",
              imageWidth: 200,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#73CA5C",
            });
          }
        });
      };
      addChapter();
    } catch (error) {
      console.log(error.response.data.message.split(", ")[1]);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    const getChapters = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/api/v1/chapters/`);

        const filteredResponse = await res.data.data.filter(
          (chapter) => chapter.courseId == id
        );
        setChapters(filteredResponse);
      } catch (error) {
        console.log(error);
        setIsError(error ? error.message : "Kesalahan Jaringan");
      } finally {
        setIsLoading(false);
      }
    };
    getChapters();
  }, [random]);

  useEffect(() => {
    const getClass = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/v1/courses/${id}`
        );
        setClassData(res.data.data);
      } catch (error) {
        if (error.response.status === 404) {
          return setIsError("Chapter Tidak Ada");
        }
        setIsError(error ? error.message : "Kesalahan Jaringan");
      } finally {
        setIsLoading(false);
      }
    };
    getClass();
  }, []);

  const handleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const removeModuleHandle = (e, id) => {
    e.preventDefault();

    try {
      const removeModule = async () => {
        await Swal.fire({
          title: "Yakin menghapus modul?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Hapus",
          confirmButtonColor: "#FF0000",
          denyButtonColor: "#6148FF",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.delete(`http://localhost:3000/api/v1/modules/${id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              while (random === Math.random()) {
                setRandom(Math.random());
              }

              setRandom(Math.random());
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
              }
              console.log(error);

              return (window.location.href = "/kelola-kelas");
            }
            setIsLoading(false);
            await Swal.fire({
              titleText: "Dihapus!",
              imageUrl: "/images/logo-n-maskot/Sticker-3.png",
              imageWidth: 200,
              confirmButtonText: "Ok",
              confirmButtonColor: "#73CA5C",
            });
          } else if (result.isDenied) {
            await Swal.fire({
              titleText: "Perubahan dibatalkan",
              imageUrl: "/images/logo-n-maskot/Sticker-2.png",
              imageWidth: 200,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#73CA5C",
            });
          }
        });
      };
      removeModule();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const customTheme = {
    accordion: {
      root: {
        base: "overflow-hidden",
      },
      title: {
        open: {
          on: "opacity-100 bg-darkblue-05 bg-opacity-10",
          off: "opacity-80",
        },
      },
    },
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navigation>
        <section className=" mx-4 n lg:mx-[64px] mb-64 -mt-[70px] ">
          <section className="overflow-auto">
            <div className="mb-[20px]">
              <Breadcrumb
                links={[
                  { name: "Kelola Kelas", url: "/kelola-kelas" },
                  { name: "Kelola Chapter" },
                ]}
              />
            </div>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Kelola Chapter
            </h1>
            {isError && (
              <>
                <div className="font-bold bg-slate-950 bg-opacity-10 p-10 flex justify-center gap-5 items-center text-center">
                  <img
                    src="/images/logo-n-maskot/failed_payment.png"
                    alt=""
                    className="w-[100px]"
                  />
                  <p className="text-xl text-alert-danger">
                    {isError}
                    <br />
                    <span className="text-sm text-gray-800 font-normal">
                      Cobalah untuk{" "}
                      {isError === "Chapter Tidak Ada" && (
                        <a
                          href="/kelola-kelas"
                          className="text-darkblue-03 font-medium"
                          onClick={() => {
                            window.location.href = "/kelola-kelas";
                            window.location.reload();
                          }}
                        >
                          Mencari Chapter Lain
                        </a>
                      )}
                      {isError !== "Chapter Tidak Ada" && (
                        <a
                          href={`/kelola-chapter/${id}`}
                          className="text-darkblue-03 font-medium"
                          onClick={() => {
                            window.location.href = `/kelola-chapter/${id}`;
                            window.location.reload();
                          }}
                        >
                          Muat Ulang Halaman
                        </a>
                      )}
                    </span>
                  </p>
                </div>
              </>
            )}
            {chapters && classData && (
              <>
                <div className="flex justify-between items-center mb-4 mx-2">
                  <p className="">
                    {classData.classCode} | {classData.category.name}
                  </p>
                  <button
                    className="text-white bg-darkblue-05 hover:bg-blue-800  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={handleAddForm}
                  >
                    Tambah
                  </button>
                </div>
                <div
                  className={`w-full px-[20px] border border-gray-200 rounded-md my-5 ${
                    showAddForm ? "block" : "hidden"
                  }`}
                >
                  <button
                    className="border-red-600 w-full text-left mt-3"
                    onClick={handleAddForm}
                  >
                    <p className="flex justify-end items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="rgb(97 72 255)"
                        className="h-6 w-6 inline-block ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </p>
                  </button>

                  <form
                    action=""
                    className="text-left py-3 mx-auto"
                    type="submit"
                    onSubmit={handleSubmit}
                  >
                    <div className="mb-[15px]">
                      <label
                        htmlFor="noChapter"
                        className="mb-[4px] block text-[10px] text-black font-semibold ml-2"
                      >
                        Urutan Chapter
                      </label>
                      <input
                        type="number"
                        min={1}
                        placeholder="contoh: 2"
                        className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                        name="no"
                        id="noChapter"
                        required
                      />
                    </div>
                    <div className="mb-[15px]">
                      <label
                        htmlFor="nameChapter"
                        className="mb-[4px] block text-[10px] text-black font-semibold ml-2"
                      >
                        Judul Chapter
                      </label>
                      <input
                        type="text"
                        placeholder="Memulai Design"
                        className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                        id="nameChapter"
                        name="name"
                      />
                    </div>
                    <button className="px-[16px] py-[12px] rounded-[16px] border-darkblue-05 text-neutral-01 bg-darkblue-05 border w-full hover:bg-blue-800">
                      Tambah Chapter
                    </button>
                  </form>
                </div>
                <div>
                  <Flowbite theme={{ theme: customTheme }}>
                    <Accordion alwaysOpen>
                      {chapters.map((chapter) => {
                        return (
                          <Accordion.Panel key={chapter.id}>
                            <Accordion.Title className="px-[20px] border border-gray-200 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                    />
                                  </svg>
                                </span>

                                <p
                                  className={`text-darkblue-05 font-bold  py-[20px]`}
                                >
                                  {chapter.name}
                                  {" | "}
                                  <span>
                                    {convertSeconds(chapter.duration)}
                                  </span>
                                </p>
                              </div>
                            </Accordion.Title>
                            <Accordion.Content className="px-[20px]">
                              {!chapter.modules[0] && (
                                <div className="-mx-[20px] font-bold bg-slate-950 bg-opacity-10 p-10 flex justify-center gap-5 items-center">
                                  <img
                                    src="/images/logo-n-maskot/failed_payment.png"
                                    alt=""
                                    className="w-[100px]"
                                  />
                                  <p className="text-xl text-alert-danger">
                                    Modul masih kosong
                                    <br />
                                    <span className="text-sm text-gray-800 font-normal">
                                      Cobalah untuk{" "}
                                      <a
                                        href="/kelola-kelas"
                                        className="text-darkblue-03 font-medium"
                                        onClick={() => {
                                          window.location.href =
                                            "/kelola-kelas";
                                          window.location.reload();
                                        }}
                                      >
                                        Menambahkan modul
                                      </a>
                                    </span>
                                  </p>
                                </div>
                              )}
                              <div className="py-[20px] grid  grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                                {chapter.modules &&
                                  chapter.modules.map((module) => {
                                    return (
                                      <div
                                        key={module.id}
                                        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-hidden"
                                      >
                                        <video
                                          controls={true}
                                          src={module.videoUrl}
                                        ></video>
                                        <div className="px-5 pb-5">
                                          <h5 className="text-xl font-semibold tracking-tight text-gray-900 my-3">
                                            {module.name}
                                          </h5>
                                          <span className="text-md font-bold text-gray-900 ">
                                            {module.createdAt.slice(0, 10)}
                                          </span>
                                          <hr className="my-3 border border-gray-300" />
                                          <div className="flex items-center justify-end gap-3">
                                            <button className="text-white bg-darkblue-05 hover:bg-blue-800  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                                              Ubah
                                            </button>
                                            <button
                                              className="text-white bg-alert-danger hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                              onClick={(e) =>
                                                removeModuleHandle(e, module.id)
                                              }
                                            >
                                              Hapus
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                {chapter.modules[0] && (
                                  <button
                                    className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-hidden text-center p-5 flex items-center flex-col justify-center cursor-pointer hover:bg-gray-100 gap-5"
                                    onClick={() => alert("Coming Soon!")}
                                  >
                                    <div className="">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="rgb(51 65 85)"
                                        className="w-20 h-20 border border-gray-700 rounded-md border-dashed"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                      </svg>
                                    </div>
                                    <p className="font-semibold text-gray-700">
                                      Tambah Modul
                                    </p>
                                  </button>
                                )}
                              </div>
                            </Accordion.Content>
                          </Accordion.Panel>
                        );
                      })}
                    </Accordion>
                  </Flowbite>
                </div>
              </>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
