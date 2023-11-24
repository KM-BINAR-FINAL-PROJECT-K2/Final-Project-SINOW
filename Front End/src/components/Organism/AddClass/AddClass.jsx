export default function AddClass({ toggleShowContainer }) {
  return (
    <div
      className={`
       ${toggleShowContainer ? "block" : "hidden"}}`}
    >
      <div className="fixed z-[1000] bg-black opacity-40 top-0 left-0 right-0 bottom-0"></div>
      <div className="absolute z-[1000] top-0 left-0 right-0 bottom-0">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[16px] bg-neutral-01  w-[750px] h-[600px] py-[50px] text-center">
            <button
              onClick={toggleShowContainer}
              className="absolute top-5 right-5"
            >
              <img
                src="/images/x-icon.png"
                className="w-[24px] h-[24px]"
                alt="exit icon"
              />
            </button>
            <h3 className="text-darkblue-05 font-semibold text-[20px]">
              Tambah Kelas
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
