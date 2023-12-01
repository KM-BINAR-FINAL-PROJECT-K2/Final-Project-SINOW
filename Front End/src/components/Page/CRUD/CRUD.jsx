/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Card from "../../Molecule/Card/Card";
import Navigation from "../../Template/Navigation/Navigation";
import ClassTable from "../../Molecule/ClassTable/ClassTable";
import AddClass from "../../Organism/AddClass/AddClass";
import InfoClass from "../../Organism/InfoClass/InfoClass";
export default function CRUD() {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showInfoClass, setshowInfoClass] = useState(false);
  const [classSinow, setClassSinow] = useState([]);
  const [keyClass, setKeyClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchInputRefCrud = useRef(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("Cari");

  useEffect(() => {
    const getClasses = async () => {
      try {
        setClassSinow([]);
        setIsLoading(true);
        setError("");
        const res = await axios.get("http://localhost:3000/api/v1/courses");
        setClassSinow(res.data.data);
      } catch (error) {
        setError(
          error.response ? error.response.data.message : "Network Error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getClasses();
    return () => {
      setClassSinow([]);
    };
  }, []);

  const toggleShowContainer = () => {
    setShowAddClass(!showAddClass);
  };

  const toggleShowInfo = (id) => {
    setKeyClass(id);
    setshowInfoClass(!showInfoClass);
  };

  const handleSearchButtonClick = () => {
    if (searchInputRefCrud.current) {
      searchInputRefCrud.current.focus();
      setInputPlaceholder("Mulai mengetik...");
    }
  };

  const handleInputBlur = () => {
    if (searchInputRefCrud.current && !searchInputRefCrud.current.value) {
      setInputPlaceholder("Cari");
    }
  };

  const totalQuantity = classSinow.reduce((total, item) => {
    return total + item.totalUser;
  }, 0);

  return (
    <>
      <Navigation
        searchInputRefCrud={searchInputRefCrud}
        inputPlaceholderCrud={inputPlaceholder}
        onBlurCrud={handleInputBlur}
      >
        <section className="mx-8 lg:mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
          <Card
            color={"bg-darkblue-03"}
            quantity={totalQuantity}
            description={"Pengguna Aktif"}
          />
          <Card
            color={"bg-alert-success"}
            quantity={classSinow.length}
            description={"Kelas Terdaftar"}
          />
          <Card
            color={"bg-darkblue-05"}
            quantity={
              classSinow.filter((item) => item.type === "premium").length
            }
            description={"Kelas Premium"}
          />
        </section>

        <section className="mx-4 lg:mx-16">
          <div className="py-[10px] flex flex-wrap">
            <h2 className="my-[10px] font-semibold text-[20px] flex-wrap flex-1 min-w-[200px]">
              Kelola Kelas
            </h2>
            <div className="flex">
              <button
                className="bg-darkblue-05 inline-block rounded-[16px] py-[5px] px-[10px] w-[125px] h-[34px] mr-[16px] my-[10px]"
                onClick={toggleShowContainer}
              >
                <div className="flex gap-[8px] items-center justify-center">
                  <img
                    src="/images/gala-add.png"
                    alt=""
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-[16px] font-semibold text-neutral-01">
                    Tambah
                  </span>
                </div>
              </button>
              <button className="bg-neutral-01 border-2 border-darkblue-05 inline-block rounded-[16px] py-[5px] px-[10px] w-[125px] h-[34px] mr-[16px] my-[10px]">
                <div className="flex gap-[8px] items-center justify-center">
                  <img
                    src="/images/prefix-wrapper.png"
                    alt=""
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-[16px] font-semibold text-darkblue-05">
                    Filter
                  </span>
                </div>
              </button>

              <button className="" onClick={handleSearchButtonClick}>
                <img
                  src="/images/search-icon-2.png"
                  alt=""
                  className=" w-[24px] h-[24px] inline-block"
                />
              </button>
            </div>
          </div>
        </section>

        <section className=" mx-4 n lg:mx-[64px] mb-64 ">
          <div className="">
            <section className="overflow-auto">
              <ClassTable
                toggleShowInfo={toggleShowInfo}
                dataClass={classSinow}
                loading={isLoading}
                error={error}
              />{" "}
            </section>
          </div>
        </section>
      </Navigation>
      {showAddClass && <AddClass toggleShowContainer={toggleShowContainer} />}
      {showInfoClass && (
        <InfoClass
          toggleShowContainer={toggleShowInfo}
          dataClass={classSinow}
          id={keyClass}
        />
      )}
    </>
  );
}
