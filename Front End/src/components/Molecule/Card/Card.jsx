/* eslint-disable react/prop-types */
export default function Card({ color, quantity, description }) {
  return (
    <div
      className={`flex-3 md:flex-1 ${color} p-7 rounded-[8px] w-full xl:h-[118px] shadow-lg`}
    >
      <div className="flex gap-8 justify-center items-center flex-wrap">
        <span className="bg-neutral-01 p-4 rounded-full">
          <img
            src="/images/logo-n-maskot/Sticker-1.png"
            alt=""
            className="w-8 h-8"
          />
        </span>
        <span className="text-neutral-01">
          <p className="text-[18px] md:text-[24px] ">{quantity}</p>
          <p
            className={`text-[16px] font-bold ${
              description.length >= 13 ? "md:text-[18px]" : "md:text-[20px]"
            }`}
          >
            {description}
          </p>
        </span>
      </div>
    </div>
  );
}
