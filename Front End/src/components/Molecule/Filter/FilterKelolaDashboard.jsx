import { Fragment, useContext, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MdFilterAlt } from "react-icons/md";
import { FilterClassContext } from "../../../store/FilterClass";

export default function FilterKelolaDashboard() {
  const [selected, setSelected] = useState(null);
  const { filterClass, setFilterClass } = useContext(FilterClassContext);

  const solutions = [
    {
      name: "SUDAH BAYAR",
      value: "sudah_bayar",
    },
    {
      name: "BELUM BAYAR",
      value: "belum_bayar",
    },
    {
      name: "KADALUARSA",
      value: "kadaluarsa",
    },
  ];

  const handleFilterClick = (item) => {
    setSelected(item.value === selected ? false : item.value);
  };

  useEffect(() => {
    const temp = selected;
    if (temp === null) {
      return setFilterClass("");
    }
    setFilterClass(temp);
  }, [selected]);

  return (
    <Popover className="relative">
      <Popover.Button
        className={`bg-white text-darkblue-05  border-darkblue-05 hover:bg-darkblue-05 hover:text-white  border-2 rounded-[6px] py-[3px] px-[10px] w-[100px] h-[34px] mr-[16px] my-[10px] inline-flex items-center gap-x-2 text-sm font-semibold leading-6  justify-center`}
      >
        <MdFilterAlt className="ffill-current h-[24px] w-[24px] transition-colors duration-100 ease-in-out group-hover:text-white" />
        <span>Filter</span>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-[1000] mt-5 flex w-screen max-w-max -translate-x-2/3 px-4">
          <div className="w-[250px] max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {solutions.map((item) => (
                <div
                  key={item.name}
                  className={`group relative flex gap-x-6 rounded-lg p-4 cursor-pointer ${
                    selected === item.value
                      ? "bg-darkblue-05 bg-opacity-100 "
                      : "hover:bg-darkblue-05 hover:bg-opacity-10"
                  }`}
                  onClick={() => handleFilterClick(item)}
                >
                  <div>
                    <a href={item.href} className="font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
