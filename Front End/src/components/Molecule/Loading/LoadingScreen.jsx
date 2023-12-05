import Lottie from "lottie-react";
import loadingIcon from "./loading_state_sinow.json";
import "./typing.css";

export default function LoadingScreen() {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-[1000] flex justify-center items-center">
        <div className="absolute w-full mb-24">
          <div className="flex justify-center items-center h-screen">
            <Lottie
              className="w-[100px]"
              animationData={loadingIcon}
              loop={true}
            />
          </div>
        </div>
        <h1
          aria-label="Loading ..."
          className="flex justify-center items-center h-screen text-2xl w-full font-bold text-[#3cc1ff] mt-10"
        >
          Loading&nbsp;<span className="typewriter"></span>
        </h1>
        <div className="inset-0 bg-black opacity-40 fixed"></div>
      </div>
    </>
  );
}
