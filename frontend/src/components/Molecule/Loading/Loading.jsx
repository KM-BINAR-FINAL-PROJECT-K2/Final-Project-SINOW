import Lottie from "lottie-react";
import loadingIcon from "./loading_state_sinow.json";
import "./typing.css";
export default function Loading() {
  return (
    <>
      <div className=" mt-5 z-10 border-red-500">
        <div className="w-full">
          <div className="flex justify-center items-center w-full h-full">
            <Lottie
              className="w-[70px]"
              animationData={loadingIcon}
              loop={true}
            />
          </div>
        </div>

        <h1
          aria-label="Loading ..."
          className="flex justify-center items-center text-lg w-full font-bold text-[#3cc1ff] "
        >
          Loading&nbsp;<span className="typewriter"></span>
        </h1>
      </div>
    </>
  );
}
