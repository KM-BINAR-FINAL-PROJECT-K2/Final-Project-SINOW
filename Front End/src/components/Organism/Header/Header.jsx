/* eslint-disable react/prop-types */
export default function Header({ name }) {
  return (
    <header className="bg-lightblue-05 pt-[26px] pb-[20px] md:pt-[46px] md:pb-[40px] pl-10 pr-[35px] lg:pr-[87px] flex justify-between drop-shadow-sm mb-[79px] sticky top-0 gap-5 flex-wrap z-[600]">
      <h1 className=" font-bold text-[24px] text-darkblue-05 flex-1 ">
        Hi, {name}
      </h1>
      <div className="border-alert-danger flex items-center flex-wrap">
        <input
          type="text"
          name="search"
          id="search"
          className="py-[13px] px-[20px] md:py-[15px] md:px-[24px] mr-[10px] border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-300 focus:ring-gray-300 text-gray-500 text-[12px]"
          placeholder="Cari"
        />
        <div className="bg-neutral-01 md:p-[5px] p-[5px] -m-3 rounded-r-lg  border-y-[1px] border-r-[1px] border-gray-300">
          <button className="bg-darkblue-05 p-[3.6px] md:p-[7px] rounded-lg">
            <img
              src="/images/search-icon.png"
              alt="search-icon"
              className="w-[24px] h-[24px] "
            />
          </button>
        </div>
      </div>
    </header>
  );
}
