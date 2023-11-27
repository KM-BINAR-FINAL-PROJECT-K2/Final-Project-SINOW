import { useState } from "react";
import Card from "../../Molecule/Card/Card";
import Navigation from "../../Template/Navigation/Navigation";
import ClassTable from "../../Molecule/ClassTable/ClassTable";
import AddClass from "../../Organism/AddClass/AddClass";
export default function CRUD() {
  const [showAddClass, setShowAddClass] = useState(false);

  const toggleShowContainer = () => {
    setShowAddClass(!showAddClass);
  };
  return (
    <>
      <Navigation>
        <section className="mx-8 lg:mx-16 flex justify-around gap-6 flex-wrap mb-[54px]">
          <Card
            color={"bg-darkblue-03"}
            quantity={"450"}
            description={"Active Users"}
          />
          <Card
            color={"bg-alert-success"}
            quantity={"25"}
            description={"Active Class"}
          />
          <Card
            color={"bg-darkblue-05"}
            quantity={"20"}
            description={"Premium Class"}
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
              <button className="">
                <img
                  src="/images/search-icon-2.png"
                  alt=""
                  className=" w-[24px] h-[24px] inline-block"
                />
              </button>
            </div>
          </div>
        </section>

        <section className="border-red-500 mx-4 n lg:mx-[64px] mb-64 ">
          <div className="border-blue-500 ">
            <section className="border-yellow-300 overflow-auto">
              <ClassTable />{" "}
            </section>
          </div>
        </section>
      </Navigation>
      {showAddClass && <AddClass toggleShowContainer={toggleShowContainer} />}
    </>
  );
}
