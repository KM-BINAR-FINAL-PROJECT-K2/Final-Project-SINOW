/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { Accordion, Flowbite } from "flowbite-react";
import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
// import ImageUploader from "../../Molecule/ImageUploader/ImageUploader";
import Swal from "sweetalert2";
import { LoaderContext } from "../../../store/Loader";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";
import { convertSeconds } from "../../../utils/formatHour";
import { ErrorContext } from "../../../store/Error";
import { RiVideoAddFill } from "react-icons/ri";
export default function ManageChapter() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const [classSinow, setClassSinow] = useState();
  const [chapters, setChapters] = useState();
  const [classData, setClassData] = useState();
  const [random, setRandom] = useState();
  const [form, setForm] = useState();
  const [editForm, setEditForm] = useState();
  const [moduleForm, setModuleForm] = useState();
  const [editModuleForm, setEditModuleForm] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editChapter, setEditChapter] = useState({});
  const [selectedKey, setSelectedKey] = useState({
    id: null,
  });
  const [showAddModule, setShowAddModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState(false);
  const editRef = useRef(null);

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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const no = Number(formData.get("no"));
    const courseId = Number(formData.get("courseId"));

    setEditForm({
      name,
      no,
      courseId,
    });
  };

  const handleModuleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const no = Number(formData.get("no"));
    const video = formData.get("video");
    const chapterId = selectedKey.id;

    setModuleForm({
      name,
      no,
      video,
      chapterId,
    });
  };

  const handleEditModuleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const no = Number(formData.get("no"));
    const video = formData.get("video");
    const chapterId = selectedKey.id;

    setEditModuleForm({
      name,
      no,
      video,
      chapterId,
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
              await axios.post(
                `https://sinow-production.up.railway.app/api/v1/chapters/`,
                form,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
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
      addChapter().catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: true,
          confirmButtonColor: "#73CA5C",
        });
      });
    } catch (error) {
      console.log(error.response.data.message.split(", ")[1]);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: true,
        confirmButtonColor: "#73CA5C",
      });
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    try {
      if (!editForm || !editForm.name || !editForm.no || !editForm.courseId) {
        return;
      }
      const editChapter = async () => {
        await Swal.fire({
          title: "Yakin menyimpan perubahan?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Simpan",
          confirmButtonColor: "rgb(115 202 92)",
          denyButtonColor: "#FF0000",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.put(
                `https://sinow-production.up.railway.app/api/v1/chapters/${selectedKey.id}`,
                editForm,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              while (random === Math.random()) {
                Math.random();
              }
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
              titleText: "Berhasil Diperbarui!",
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
      editChapter();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [editForm]);

  useEffect(() => {
    try {
      if (!moduleForm || !moduleForm.name || !moduleForm.no) {
        return;
      }
      const addModule = async () => {
        const allowedVideoTypes = [
          "video/mp4",
          "video/ogg",
          "video/webm",
          "video/avi",
          "video/mpeg",
          "video/mov",
        ];

        if (
          moduleForm.video.size > 0 &&
          !allowedVideoTypes.includes(moduleForm.video.type)
        ) {
          throw new Error("Tipe video harus .mp4/.ogg/.webm/.avi/.mpeg/.mov");
        }

        if (moduleForm.video.size > 26214400) {
          throw new Error("Ukuran video terlalu besar, maks 25MB");
        }
        await Swal.fire({
          title: "Yakin menambahkan modul?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Tambah",
          confirmButtonColor: "#73CA5C",
          denyButtonColor: "#FF0000",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          setShowAddModule(false);
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.post(
                `https://sinow-production.up.railway.app/api/v1/modules/`,
                moduleForm,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
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
      addModule().catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: true,
          confirmButtonColor: "#73CA5C",
        });
      });
    } catch (error) {
      console.log(error.response.data.message.split(", ")[1]);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: true,
        confirmButtonColor: "#73CA5C",
      });
    } finally {
      setIsLoading(false);
    }
  }, [moduleForm]);

  useEffect(() => {
    try {
      if (!editModuleForm || !editModuleForm.name || !editModuleForm.no) {
        return;
      }
      const editModule = async () => {
        const allowedVideoTypes = [
          "video/mp4",
          "video/ogg",
          "video/webm",
          "video/avi",
          "video/mpeg",
          "video/mov",
        ];

        if (
          editModuleForm.video.size > 0 &&
          !allowedVideoTypes.includes(editModuleForm.video.type)
        ) {
          throw new Error("Tipe video harus .mp4/.ogg/.webm/.avi/.mpeg/.mov");
        }

        if (editModuleForm.video.size > 26214400) {
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
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          setShowEditModule(false);
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.put(
                `https://sinow-production.up.railway.app/api/v1/modules/${selectedKey.moduleId}`,
                editModuleForm,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
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
              titleText: "Berhasil Diperbarui!",
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
      editModule().catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: true,
          confirmButtonColor: "#73CA5C",
        });
      });
    } catch (error) {
      console.log(error.response.data.message.split(", ")[1]);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: true,
        confirmButtonColor: "#73CA5C",
      });
    } finally {
      setIsLoading(false);
    }
  }, [editModuleForm]);

  useEffect(() => {
    const getChapters = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/chapters/`
        );

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
          `https://sinow-production.up.railway.app/api/v1/courses/${id}`
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

  useEffect(() => {
    const getAllClass = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/courses/`
        );
        setClassSinow(res.data.data);
      } catch (error) {
        if (error.response.status === 404) {
          return setIsError("Chapter Tidak Ada");
        }
        setIsError(error ? error.message : "Kesalahan Jaringan");
      } finally {
        setIsLoading(false);
      }
    };
    getAllClass();
  }, []);

  useEffect(() => {
    if (!selectedKey.id) {
      return;
    }
    try {
      const getChapterById = async () => {
        setIsLoading(true);
        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/chapters/${selectedKey.id}`
        );
        setEditChapter(res.data.data);
      };

      getChapterById();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedKey]);

  const handleAddForm = () => {
    setShowEditForm(false);
    setShowAddForm(!showAddForm);
  };

  const handleAddModule = (e, id) => {
    e.preventDefault();
    setSelectedKey({
      id,
    });
    setShowAddModule(true);
  };

  const handleEditModule = (e, moduleId, chapterId) => {
    e.preventDefault();
    setSelectedKey({
      id: chapterId,
      moduleId,
    });
    setShowEditModule(true);
  };

  const handleCloseEditForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedKey({
      id: null,
    });
  };

  const handleEditForm = (id) => {
    if (editRef.current) {
      editRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    setSelectedKey({
      id,
    });
    setShowAddForm(false);
    setShowEditForm(true);
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
          denyButtonColor: "#73CA5C",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.delete(
                `https://sinow-production.up.railway.app/api/v1/modules/${id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

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

  const removeChapterHandle = (e, id) => {
    e.preventDefault();
    console.log(id);
    try {
      const removeChapter = async () => {
        await Swal.fire({
          title: "Yakin menghapus Chapter?",
          imageUrl: "/images/logo-n-maskot/Sticker-1.png",
          color: "#3C3C3C",
          imageWidth: 200,
          showDenyButton: true,
          confirmButtonText: "Hapus",
          confirmButtonColor: "#FF0000",
          denyButtonColor: "#73CA5C",
          denyButtonText: `Batalkan`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await axios.delete(
                `https://sinow-production.up.railway.app/api/v1/chapters/${id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

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
      removeChapter();
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
            <div className="mb-[20px]" ref={editRef}>
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
                  <p className="text-sinow-05">
                    {classData.classCode} | {classData.category.name}
                  </p>
                  <button
                    className="text-white bg-darkblue-05 hover:bg-sky-500  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
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
                        stroke="rgb(0 204 244)"
                        className="h-6 w-6 inline-block ml-2 "
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
                    <button className="px-[16px] py-[12px] rounded-[16px] border-darkblue-05 text-neutral-01 bg-darkblue-05 border w-full hover:bg-sky-500">
                      Tambah Chapter
                    </button>
                  </form>
                </div>
                {classSinow && editChapter && (
                  <div
                    id="editChapter"
                    className={`w-full px-[20px] border border-gray-200 rounded-md my-5 ${
                      showEditForm ? "block" : "hidden"
                    }`}
                  >
                    <button
                      className="border-red-600 w-full text-left mt-3 "
                      onClick={handleCloseEditForm}
                    >
                      <p className="flex justify-end items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="rgb(0 204 244)"
                          className="h-6 w-6 inline-block ml-2 "
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
                      onSubmit={handleEditSubmit}
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
                          defaultValue={editChapter.no ? editChapter.no : ""}
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
                          defaultValue={editChapter.name}
                          required
                        />
                      </div>
                      <div className="mb-[15px]">
                        <label
                          htmlFor="courseId"
                          className="mb-[4px] block text-[10px] text-black font-semibold ml-2"
                        >
                          Kode Kelas
                        </label>
                        <select
                          type="text"
                          className="px-[16px] py-[12px] rounded-[16px] border-neutral-02 text-gray-600 border w-full focus:ring-darkblue-05 focus:border-darkblue-05 focus:outline-none"
                          id="courseId"
                          name="courseId"
                          defaultValue={
                            editChapter.courseId ? editChapter.courseId : ""
                          }
                        >
                          {classSinow.map((course) => (
                            <option
                              key={course.id}
                              value={course.id}
                              selected={course.id === editChapter.courseId}
                            >
                              {course.classCode}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button className="px-[16px] py-[12px] rounded-[16px] border-darkblue-05 text-neutral-01 bg-darkblue-05 border w-full hover:bg-sky-500">
                        Edit Chapter
                      </button>
                    </form>
                  </div>
                )}

                <div>
                  <Flowbite theme={{ theme: customTheme }}>
                    <Accordion alwaysOpen>
                      {chapters
                        .sort((a, b) => a.no - b.no)
                        .map((chapter) => {
                          return (
                            <Accordion.Panel key={chapter.id}>
                              <Accordion.Title className="px-[20px] border border-gray-200 overflow-hidden ">
                                <div className="flex justify-between items-center ">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="w-6 h-6 curson-pointer hover:stroke-2 stroke-alert-danger"
                                        onClick={(e) =>
                                          removeChapterHandle(e, chapter.id)
                                        }
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="w-6 h-6 stroke-gray-700 cursor-pointer hover:stroke-2"
                                        onClick={() =>
                                          handleEditForm(chapter.id)
                                        }
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                        />
                                      </svg>
                                    </div>
                                    <p
                                      className={`text-darkblue-05 font-bold  py-[20px]`}
                                    >
                                      <span>{chapter.no}</span>
                                      {". "}
                                      {chapter.name}

                                      {" | "}
                                      <span>
                                        {convertSeconds(chapter.duration)}
                                      </span>
                                    </p>
                                  </div>
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
                                        <button
                                          className="text-darkblue-03 font-medium"
                                          onClick={(e) =>
                                            handleAddModule(e, chapter.id)
                                          }
                                        >
                                          Menambahkan modul
                                        </button>
                                      </span>
                                    </p>
                                  </div>
                                )}

                                <div className="border py-[20px] grid  grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                                  {chapter.modules &&
                                    chapter.modules
                                      .sort((a, b) => a.no - b.no)
                                      .map((module) => {
                                        return (
                                          <>
                                            <div
                                              key={module.id}
                                              className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-hidden"
                                            >
                                              <video
                                                className="w-full border"
                                                controls={true}
                                                src={module.videoUrl}
                                              ></video>
                                              <div className="px-5 pb-5">
                                                <h5 className="border text-md font-bold tracking-tight text-gray-900 mt-4 mb-2">
                                                  {module.name}
                                                </h5>
                                                <span className="border text-sm font-normal text-gray-900 ">
                                                  {module.createdAt.slice(
                                                    0,
                                                    10
                                                  )}
                                                </span>
                                                <hr className="my-3 border border-gray-300" />
                                                <div className="flex items-center justify-end gap-3">
                                                  <button
                                                    className="text-white bg-darkblue-05 hover:bg-sky-500  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-1.5 text-center "
                                                    onClick={(e) =>
                                                      handleEditModule(
                                                        e,
                                                        module.id,
                                                        chapter.id
                                                      )
                                                    }
                                                  >
                                                    Ubah
                                                  </button>
                                                  <button
                                                    className="text-white bg-alert-danger hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-1.5 text-center "
                                                    onClick={(e) =>
                                                      removeModuleHandle(
                                                        e,
                                                        module.id
                                                      )
                                                    }
                                                  >
                                                    Hapus
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })}

                                  {chapter.modules[0] && (
                                    <button
                                      className="h-96 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-hidden text-center p-5 flex items-center flex-col justify-center cursor-pointer hover:bg-gray-100 gap-5"
                                      onClick={(e) =>
                                        handleAddModule(e, chapter.id)
                                      }
                                    >
                                      <div className=" border-dashed border-[3px] border-neutral-02 p-5 rounded-full">
                                        <RiVideoAddFill
                                          color="#D0D0D0"
                                          className="h-10 w-10"
                                        />
                                      </div>

                                      <p className="font-semibold text-neutral-02">
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
            {showAddModule && (
              <>
                {isLoading && <LoadingScreen />}
                <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
                <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px]  py-[50px] text-center overflow-y-auto overflow-x-hidden relative">
                      <button
                        className="absolute top-5 right-5 z-[100]"
                        onClick={() => setShowAddModule(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="rgb(0 204 244)"
                          className="h-6 w-6 inline-block ml-2 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <h3 className="text-center font-semibold text-xl text-darkblue-05 mb-[30px]">
                        Tambah Modul
                      </h3>
                      <div className="mx-5">
                        <form
                          action=""
                          className="w-full text-left overflow-y-auto"
                          onSubmit={(e) => handleModuleSubmit(e)}
                        >
                          <div className="mb-[15px]">
                            <label
                              htmlFor=""
                              className="block md:text-sm text-xs mb-1 ml-2"
                            >
                              Judul Modul
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                              placeholder="Sejarah UI"
                            />
                          </div>
                          <div className="mb-[15px]">
                            <label
                              htmlFor=""
                              className="block md:text-sm text-xs mb-1 ml-2"
                            >
                              Urutan Modul
                            </label>
                            <input
                              type="text"
                              name="no"
                              className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                              placeholder="1"
                            />
                          </div>
                          <div className="mb-[15px]">
                            <label
                              htmlFor=""
                              className="block md:text-sm text-xs mb-1 ml-2"
                            >
                              Upload Video
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              name="video"
                              className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                            />
                            <p className="font-semibold text-gray-600 text-xs pl-2 italic">
                              <span className="text-red-500">*</span> File Video
                              Maks 25 MB
                            </p>
                          </div>
                          <div className="mt-[30px]">
                            <button
                              type="submit"
                              className="bg-darkblue-05 text-white md:text-sm text-xs mb-1 font-semibold  p-[12px] rounded-[15px] flex-1 lg:w-full text-center w-full"
                            >
                              Tambah Modul
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {showEditModule && Object.keys(editChapter).length > 0 && (
              <>
                {isLoading && <LoadingScreen />}

                {editChapter.modules.map((module) => {
                  if (module.id === selectedKey.moduleId) {
                    return (
                      <>
                        <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
                        <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
                          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px]  py-[50px] text-center overflow-y-auto overflow-x-hidden relative">
                              <button
                                className="absolute top-5 right-5 z-[100]"
                                onClick={() => setShowEditModule(false)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="rgb(0 204 244)"
                                  className="h-6 w-6 inline-block ml-2 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                              <h3 className="text-center font-semibold text-xl text-darkblue-05 mb-[30px]">
                                Edit Modul
                              </h3>
                              <div className="mx-5">
                                <form
                                  action=""
                                  className="w-full text-left overflow-y-auto"
                                  onSubmit={(e) => handleEditModuleSubmit(e)}
                                >
                                  <div className="mb-[15px]">
                                    <label
                                      htmlFor=""
                                      className="block md:text-sm text-xs mb-1 ml-2"
                                    >
                                      Judul Modul
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                      placeholder={module.name}
                                      defaultValue={module.name}
                                    />
                                  </div>
                                  <div className="mb-[15px]">
                                    <label
                                      htmlFor=""
                                      className="block md:text-sm text-xs mb-1 ml-2"
                                    >
                                      Urutan Modul
                                    </label>
                                    <input
                                      type="text"
                                      name="no"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                      placeholder={module.no}
                                      defaultValue={module.no}
                                    />
                                  </div>
                                  <div className="mb-[15px]">
                                    <label
                                      htmlFor=""
                                      className="block md:text-sm text-xs mb-1 ml-2"
                                    >
                                      Upload Video
                                    </label>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      name="video"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 md:text-sm text-xs mb-1 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    />
                                    <p className="font-semibold text-gray-600 text-xs pl-2 italic">
                                      <span className="text-red-500">*</span>{" "}
                                      File Video Maks 25 MB
                                    </p>
                                  </div>
                                  <div className="mt-[30px]">
                                    <button
                                      type="submit"
                                      className="bg-darkblue-05 text-white md:text-sm text-xs mb-1 font-semibold  p-[12px] rounded-[15px] flex-1 lg:w-full text-center w-full"
                                    >
                                      Edit Modul
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
              </>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
