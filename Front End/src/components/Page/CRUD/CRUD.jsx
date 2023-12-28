import axios from "axios";

// hooks
import { useContext, useEffect, useState } from "react";

// components
import Card from "../../Molecule/Card/Card";
import Navigation from "../../Template/Navigation/Navigation";
import ClassTable from "../../Molecule/ClassTable/ClassTable";
import InfoClass from "../../Organism/InfoClass/InfoClass";
import RemoveClass from "../../Molecule/RemoveClass/RemoveClass";
import FilterKelolaKelas from "../../Molecule/Filter/FilterKelolaKelas";
import ManageCategory from "../../Organism/ManageCategory/ManageCategory";

// context
import { LoaderContext } from "../../../store/Loader";
import { InfoClassContext } from "../../../store/InfoClassUI";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
import { ClassContext } from "../../../store/ClassStore";
import { KeyContext } from "../../../store/ActiveKey";
import { ErrorContext } from "../../../store/Error";
import { IoIosAddCircle } from "react-icons/io";
import { ImSearch } from "react-icons/im";
import { FilterClassContext } from "../../../store/FilterClass";
import { SearchValueContext } from "../../../store/SearchValue";
import { CategoryContainerContext } from "../../../store/CategoryUI";
import { RandomNumberContext } from "../../../store/RandomNumber";
import { Tooltip } from "flowbite-react";

export default function CRUD() {
  const { setIsLoading } = useContext(LoaderContext);
  const { showInfoClass } = useContext(InfoClassContext);
  const { showRemoveClass } = useContext(RemoveClassContext);
  const { setClassSinow } = useContext(ClassContext);
  const { keyClass } = useContext(KeyContext);
  const { setIsError } = useContext(ErrorContext);
  const { filterClass } = useContext(FilterClassContext);
  const { searchValue, setSearchValue } = useContext(SearchValueContext);
  const { showCategoryContainer } = useContext(CategoryContainerContext);
  const { randomNumber } = useContext(RandomNumberContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [informationCard, setInformationCard] = useState({
    users: 0,
    courses: 0,
    premiumClass: 0,
  });

  useEffect(() => {
    const getClassesInformation = async () => {
      try {
        setIsLoading(true);
        setIsError("");

        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/courses`
        );
        setInformationCard({
          users: 0,
          courses: res.data.data.length,
          premiumClass: res.data.data.filter((item) => item.type === "premium")
            .length,
        });
      } catch (error) {
        setIsError(
          error.response ? error.response.data.message : "Kesalahan Jaringan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getClassesInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getClasses = async () => {
      try {
        setClassSinow([]);
        setIsLoading(true);
        setIsError("");

        const res = await axios.get(
          `https://sinow-production.up.railway.app/api/v1/courses?search=${searchValue}${
            filterClass ? `&type=${filterClass}` : ""
          }`
        );
        setClassSinow(res.data.data);
      } catch (error) {
        setIsError(
          error.response ? error.response.data.message : "Kesalahan Jaringan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getClasses();
    return () => {
      setClassSinow([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, filterClass, randomNumber]);

  const handleShowSearchInput = () => {
    setSearchValue("");
    setShowSearchInput(!showSearchInput);
  };

  const handleSearchButtonClick = (value) => {
    setSearchValue(value);
  };

  return (
    <>
      <Navigation>
        <section className="mx-8 lg:mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
          <Card
            color={"bg-darkblue-03"}
            quantity={informationCard.users}
            description={"Pengguna Aktif"}
          />
          <Card
            color={"bg-alert-success"}
            quantity={informationCard.courses}
            description={"Kelas Terdaftar"}
          />
          <Card
            color={"bg-darkblue-05"}
            quantity={informationCard.premiumClass}
            description={"Kelas Premium"}
          />
        </section>

        <section className="mx-4 lg:mx-16">
          <div className="py-[10px] flex flex-wrap">
            <h2 className="my-[10px] font-semibold text-[20px] flex-wrap flex-1 min-w-[200px]">
              Kelola Kelas
            </h2>
            <div className="flex items-center z-50 ">
              <Tooltip content="Kelola Notifikasi" placement="bottom">
                <a
                  className={`flex items-center border-sinow-05 rounded-md border-2 mr-[18px] my-[10px] gap-[7px] py-[3px] px-[10px] hover:cursor-pointer ${
                    !showSearchInput
                      ? "fill-sinow-05 text-sinow-05 hover:fill-white hover:text-white hover:bg-sinow-05"
                      : "fill-white text-white hover:fill-sinow-05 hover:text-sinow-05 bg-sinow-05 hover:bg-white"
                  }`}
                  href="/kelola-notifikasi"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-sm font-semibold">
                    Kelola Notifikasi
                  </span>
                </a>
              </Tooltip>
              {!showSearchInput && (
                <a
                  className="bg-darkblue-05 hover:bg-white border hover:text-darkblue-05 inline-block rounded-[6px] py-[5px] px-[10px] w-[120px] h-[34px] mr-[16px] my-[10px] shadow-md text-white fill-white hover:border-darkblue-05"
                  href="/tambah-kelas"
                >
                  <div className="flex gap-[7px] items-center justify-center">
                    <IoIosAddCircle className=" h-[24px] w-[24px]" />
                    <span className="text-[16px] font-semibold ">Tambah</span>
                  </div>
                </a>
              )}
              <FilterKelolaKelas />
              {showSearchInput && (
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border-2 text-darkblue-05 border-sinow-05 rounded-md focus:ring-sinow-05 outline-none py-1 px-2 placeholder-sinow-05"
                    placeholder="Cari..."
                    onChange={(e) => handleSearchButtonClick(e.target.value)}
                  />
                  <button onClick={handleShowSearchInput}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgb(0 204 244)"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {!showSearchInput && (
                <button className="" onClick={handleShowSearchInput}>
                  <ImSearch className="fill-darkblue-05 h-[24px] w-[24px]" />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className=" mx-4 n lg:mx-[64px] mb-64 ">
          <div className="">
            <section className="overflow-auto">
              <ClassTable />{" "}
            </section>
          </div>
        </section>
      </Navigation>
      {showCategoryContainer && <ManageCategory />}
      {showInfoClass && <InfoClass id={keyClass} />}
      {showRemoveClass && <RemoveClass id={keyClass} />}
    </>
  );
}
