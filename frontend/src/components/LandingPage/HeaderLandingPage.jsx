export default function HeaderLandingPage() {
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

          <div className=" hidden lg:flex ">
            <a
              href="#"
              className="px-5 py-1 rounded-md hover:bg-sinow-03 bg-sinow-05 text-white text-[14px] font-semibold leading-6"
            >
              Download
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}
