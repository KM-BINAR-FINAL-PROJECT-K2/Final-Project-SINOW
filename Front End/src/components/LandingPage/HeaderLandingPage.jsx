import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function HeaderLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <header className="z-50 fixed -top-1 lg:top-0 left-0 right-0 bg-white shadow-lg w-full">
        <nav
          className=" flex items-center justify-between px-3 pb-3 pt-4 lg:px-8 lg:gap-4"
          aria-label="Global"
        >
          {/* logo */}
          <div className=" flex pr-48 md:pl-3 md:pr-[560px] lg:flex-1 ">
            <a href="#" className="-m-1.5 p-1.5 ">
              <span className="sr-only">Your Company</span>
              <img
                className="lg:h-10 h-8 w-auto"
                src="/images/logo/Logo_01.png"
                alt=""
              />
            </a>
          </div>
          {/* Hamberger nav */}
          <div className=" flex lg:hidden ">
            <button
              type="button"
              className=" -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-sinow-05"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
            </button>
          </div>
          {/* navbar */}
          <div className=" lg:mx-5 lg:grid lg:grid-cols-2 gap-8">
            <div className=" hidden lg:flex ">
              <a
                href="#"
                className="px-5 py-1 rounded-md hover:bg-sinow-03 bg-sinow-05 text-white text-[14px] font-semibold leading-6"
              >
                Daftar
              </a>
            </div>
            <div className="hidden lg:flex ">
              <a
                href="#"
                className="px-5 py-1 rounded-md hover:bg-sinow-03 bg-sinow-05 text-white text-[14px] font-semibold leading-6"
              >
                Masuk
              </a>
            </div>
          </div>
        </nav>

        {/* ------------------------------------- */}

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-sinow-04">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="lg:h-12 h-8 w-auto"
                  src="/images/logo/Logo_01.png"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-sinow-05"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className=" py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-sinow-05 hover:bg-sinow-03 hover:text-white"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  );
}
