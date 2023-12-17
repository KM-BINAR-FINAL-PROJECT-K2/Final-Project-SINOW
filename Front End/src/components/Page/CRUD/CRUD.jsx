/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Card from "../../Molecule/Card/Card";
import Navigation from "../../Template/Navigation/Navigation";
import ClassTable from "../../Molecule/ClassTable/ClassTable";
import InfoClass from "../../Organism/InfoClass/InfoClass";
import RemoveClass from "../../Molecule/RemoveClass/RemoveClass";
import { LoaderContext } from "../../../store/Loader";
import { InfoClassContext } from "../../../store/InfoClassUI";
import { RemoveClassContext } from "../../../store/RemoveClassUI";
import { ClassContext } from "../../../store/ClassStore";
import { KeyContext } from "../../../store/ActiveKey";
import { ErrorContext } from "../../../store/Error";
import { PlaceholderContext } from "../../../store/PlaceholderStore";
import FilterKelolaKelas from "../../Molecule/Filter/FilterKelolaKelas";
import { IoIosAddCircle } from "react-icons/io";
import { ImSearch } from "react-icons/im";
import { QueryContext } from "../../../store/QuerySearch";
import { FilterClassContext } from "../../../store/FilterClass";
export default function CRUD() {
  const { setIsLoading } = useContext(LoaderContext);
  const { showInfoClass } = useContext(InfoClassContext);
  const { showRemoveClass } = useContext(RemoveClassContext);
  const { classSinow, setClassSinow } = useContext(ClassContext);
  const { keyClass } = useContext(KeyContext);
  const { setIsError } = useContext(ErrorContext);
  const { query } = useContext(QueryContext);
  const { filterClass } = useContext(FilterClassContext);
  const { handleSearchButtonClick } = useContext(PlaceholderContext);
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

        const res = await axios.get(`http://localhost:3000/api/v1/courses`);
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
  }, []);

  useEffect(() => {
    const getClasses = async () => {
      try {
        setClassSinow([]);
        setIsLoading(true);
        setIsError("");

        const res = await axios.get(
          `http://localhost:3000/api/v1/courses?search=${query}${
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
  }, [query, filterClass]);

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
            <div className="flex">
              <a
                className="bg-darkblue-05 hover:bg-darkblue-03 inline-block rounded-[6px] py-[5px] px-[10px] w-[120px] h-[34px] mr-[16px] my-[10px] shadow-md"
                href="/tambah-kelas"
              >
                <div className="flex gap-[7px] items-center justify-center">
                  <IoIosAddCircle className="fill-white h-[24px] w-[24px]" />
                  <span className="text-[16px] font-semibold text-neutral-01">
                    Tambah
                  </span>
                </div>
              </a>
              <FilterKelolaKelas />
              <button className="" onClick={handleSearchButtonClick}>
                <ImSearch className="fill-darkblue-05 h-[24px] w-[24px]" />
              </button>
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
      {showInfoClass && <InfoClass id={keyClass} />}
      {showRemoveClass && <RemoveClass id={keyClass} />}
    </>
  );
}
