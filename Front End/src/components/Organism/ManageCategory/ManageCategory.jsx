/* eslint-disable react/prop-types */
import axios from "axios";

import { useContext, useEffect, useRef, useState } from "react";
import { Flowbite, Alert } from "flowbite-react";

import { CategoryContainerContext } from "../../../store/CategoryUI";
import { LoaderContext } from "../../../store/Loader";
import { ErrorContext } from "../../../store/Error";

import Loading from "../../Molecule/Loading/Loading";
import { RandomNumberContext } from "../../../store/RandomNumber";
export default function ManageCategory() {
  const { showCategoryContainer, setShowCategoryContainer } = useContext(
    CategoryContainerContext
  );
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const { isError, setIsError } = useContext(ErrorContext);
  const { randomNumber, setRandomNumber } = useContext(RandomNumberContext);

  const [categories, setCategories] = useState();
  const [editedCategories, setEditedCategories] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [isAlert, setIsAlert] = useState(false);
  const [dataCategory, setDataCategory] = useState({});

  const inputRefs = useRef({});

  useEffect(() => {
    try {
      const getCategories = async () => {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/v1/category"
        );
        setCategories(response.data.data);
      };
      getCategories();
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategoryContainer = () => {
    if (showCategoryContainer) {
      setRandomNumber(Math.random());
    }
    setShowCategoryContainer(!showCategoryContainer);
  };

  const handleClickEdit = async (categoryId) => {
    setEditedCategories((prevEditedCategories) => ({
      ...prevEditedCategories,
      [categoryId]: !prevEditedCategories[categoryId],
    }));

    if (!editedCategories[categoryId]) {
      if (!isAlert) {
        setIsAlert(!isAlert);
      }
    } else {
      // Memperbarui banyak data kategori
      const updatedCategories = categories.map((category) => {
        if (editedValues[category.id]) {
          return {
            ...category,
            name: editedValues[category.id],
          };
        }
        return category;
      });

      try {
        setIsLoading(true);
        await Promise.all(
          updatedCategories.map(async (category) => {
            await axios.put(
              `http://localhost:3000/api/v1/category/${category.id}`,
              { name: category.name },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
          })
        );

        setCategories(updatedCategories);
      } catch (error) {
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitCategoryName = (e, categoryId) => {
    e.preventDefault();
    handleClickEdit(categoryId);
  };

  const handleInputChange = (categoryId, value) => {
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [categoryId]: value,
    }));
  };

  const customTheme = {
    alert: {
      base: "flex flex-col gap-2 p-4 text-sm",
      borderAccent: "border-t-4",
      closeButton: {
        base: "-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 focus:ring-2",
        icon: "w-5 h-5",
        color: {
          success:
            "bg-green-100 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-green-200 dark:text-green-600 dark:hover:bg-green-300",
        },
      },
      color: {
        success:
          "text-green-700 bg-green-100 border-green-500 dark:bg-green-200 dark:text-green-800",
      },
      icon: "mr-3 inline h-5 w-5 flex-shrink-0",
      rounded: "rounded-lg",
      wrapper: "flex items-center",
    },
  };

  return (
    <div
      className={`
       ${showCategoryContainer ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0 ">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01 w-[350px] sm:w-[500px] md:w-[600px] lg:w-[750px] h-[500px] py-[50px] text-center overflow-y-auto overflow-x-hidden relative px-7">
            <button
              onClick={handleCategoryContainer}
              className="absolute top-5 right-5 z-[100]"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px] "
                alt="exit icon"
              />
            </button>
            <h1 className="text-center font-bold text-md md:text-2xl text-darkblue-05 mb-[30px]">
              Kelola Kategori
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
                      <a
                        href={`/kelola-kelas`}
                        className="text-darkblue-03 font-medium"
                        onClick={() => {
                          window.location.href = `/kelola-kelas`;
                          window.location.reload();
                        }}
                      >
                        Muat Ulang Halaman
                      </a>
                    </span>
                  </p>
                </div>
              </>
            )}
            {isLoading && (
              <div className="pt-3">
                <Loading />
              </div>
            )}
            {!isError && !isLoading && categories && (
              <ul className="max-w-xl divide-y divide-gray-200 text-left mx-auto ">
                {editedCategories && isAlert && (
                  <Flowbite theme={{ theme: customTheme }}>
                    <Alert
                      color="success"
                      onDismiss={() => setIsAlert(!isAlert)}
                    >
                      <span className="font-medium">Edit kategori, </span>{" "}
                      Silahkan ubah kategori yang anda pilih
                    </Alert>
                  </Flowbite>
                )}
                {categories.map((category) => (
                  <li key={category.id} className="pb-3 sm:pb-4 pt-3">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={category.imageUrl}
                          alt="Neil image"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <form
                          action=""
                          type="submit"
                          onSubmit={(e) =>
                            handleSubmitCategoryName(e, category.id)
                          }
                        >
                          <input
                            type="text"
                            id={category.id}
                            className="text-sm font-medium text-gray-900 truncate p-3 w-full bg-white"
                            ref={(ref) =>
                              (inputRefs.current[category.id] = ref)
                            }
                            value={editedValues[category.id] || category.name}
                            onChange={(e) =>
                              handleInputChange(category.id, e.target.value)
                            }
                            disabled={!editedCategories[category.id]}
                          />
                        </form>
                      </div>
                      <div className="inline-flex gap-2 items-center text-base font-semibold text-gray-900 ">
                        {!editedCategories[category.id] && (
                          <>
                            <button>
                              <label htmlFor={category.id}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  className="w-6 h-6 stroke-gray-800 cursor-pointer hover:stroke-2"
                                  onClick={() => handleClickEdit(category.id)}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                  />
                                </svg>
                              </label>
                            </button>
                            <button>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                className="w-6 h-6 stroke-alert-danger cursor-pointer hover:stroke-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                        {editedCategories[category.id] && (
                          <button onClick={() => handleClickEdit(category.id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
                <li className="pb-3 sm:pb-4 pt-3">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 rounded-full"
                        src="/images/logo-n-maskot/Sticker-1.png"
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate ">
                        Tambah Kategori
                      </p>
                    </div>
                    <div className="inline-flex gap-2 items-center text-base font-semibold text-gray-900 ">
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          className="w-6 h-6 stroke-gray-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
