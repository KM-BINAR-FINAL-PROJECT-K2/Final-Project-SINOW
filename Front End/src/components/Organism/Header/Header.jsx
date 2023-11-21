/* eslint-disable react/prop-types */
export default function Header({ name }) {
  return (
    <header className="bg-lightblue-05 pt-[46px] pb-[40px] pl-10 pr-[87px] flex justify-between drop-shadow-sm mb-[79px]">
      <h1 className="font-bold text-[24px] text-darkblue-05 flex-1">
        Hi, {name}
      </h1>
      <div className="flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          className="py-[12px] px-[24px] mr-[10px] border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-300 focus:ring-gray-300"
          placeholder="Search"
        />
        <div className="bg-neutral-01 p-[5px] -m-3 rounded-r-lg  border-y-[1px] border-r-[1px] border-gray-300">
          <button className="bg-darkblue-05 p-[7px] rounded-lg">
            <img
              src="/images/search-icon.png"
              alt="search-icon"
              className="w-[24px] h-[24px]"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
