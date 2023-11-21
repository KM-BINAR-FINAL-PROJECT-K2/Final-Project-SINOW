/* eslint-disable react/prop-types */
export default function Card({ color, quantity, description }) {
  return (
    <div
      className={`flex-1 ${color} p-8 rounded-[15px] w-full md:w-auto xl:h-[118px]`}
    >
      <div className="flex gap-4  items-center flex-wrap">
        <span className="bg-neutral-01 p-4 rounded-full">
          <img src="/images/users.png" alt="" className="w-8 h-8" />
        </span>
        <span className="text-neutral-01">
          <p className="text-24">{quantity}</p>
          <p className="font-bold text-20">{description}</p>
        </span>
      </div>
    </div>
  );
}
