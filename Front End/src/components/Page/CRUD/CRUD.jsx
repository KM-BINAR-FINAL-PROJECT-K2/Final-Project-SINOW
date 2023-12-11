/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect } from "react";
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
import { QueryContext } from "../../../store/QuerySearch";
export default function CRUD() {
  const { setIsLoading } = useContext(LoaderContext);
  const { showInfoClass } = useContext(InfoClassContext);
  const { showRemoveClass } = useContext(RemoveClassContext);
  const { classSinow, setClassSinow } = useContext(ClassContext);
  const { keyClass } = useContext(KeyContext);
  const { setIsError } = useContext(ErrorContext);
  const { query } = useContext(QueryContext);

  const { handleSearchButtonClick } = useContext(PlaceholderContext);

  console.log(classSinow);
  useEffect(() => {
    const getClasses = async () => {
      try {
        setClassSinow([]);
        setIsLoading(true);
        setIsError("");
        const res = await axios.get(
          `http://localhost:3000/api/v1/courses?search=${query}`
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
  }, [query]);

  const totalQuantity = classSinow.reduce((total, item) => {
    return total + item.totalUser;
  }, 0);

  return (
    <>
      <Navigation>
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
              <a
                className="bg-darkblue-05 inline-block rounded-[16px] py-[5px] px-[10px] w-[125px] h-[34px] mr-[16px] my-[10px]"
                href="/tambah-kelas"
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
              </a>
              <FilterKelolaKelas />
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
