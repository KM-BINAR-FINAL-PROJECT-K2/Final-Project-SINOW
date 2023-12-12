import { Fragment, useContext, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FilterClassContext } from "../../../store/FilterClass";

export default function FilterKelolaKelas() {
  const [selected, setSelected] = useState(null);
  const { filterClass, setFilterClass } = useContext(FilterClassContext);

  const solutions = [
    {
      name: "GRATIS",
      value: "gratis",
    },
    {
      name: "PREMIUM",
      value: "premium",
    },
  ];

  const handleFilterClick = (item) => {
    setSelected(item.value === selected ? null : item.value);
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
        className={`bg-neutral-01 border-2 border-darkblue-05 rounded-[18px] py-[3px] px-[10px] w-[150px] h-[34px] mr-[16px] my-[10px] inline-flex items-center gap-x-12 text-sm font-semibold leading-6 text-gray-900 justify-center`}
      >
        <span>Filter</span>
        <img
          src="/images/prefix-wrapper.png"
          alt=""
          className="w-[24px] h-[24px] "
        />
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
              <form action="">
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
                      <a
                        href={item.href}
                        className={`font-semibold text-gray-900 ${
                          selected === item.value
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
