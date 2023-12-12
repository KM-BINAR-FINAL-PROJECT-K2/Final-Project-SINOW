/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { Accordion, Flowbite } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../Template/Navigation/Navigation";
import Breadcrumb from "../../Organism/Breadcrumb/Breadcrumb";
// import ImageUploader from "../../Molecule/ImageUploader/ImageUploader";
import Swal from "sweetalert2";
import { LoaderContext } from "../../../store/Loader";
import LoadingScreen from "../../Molecule/Loading/LoadingScreen";

export default function ManageChapter() {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [chapters, setChapters] = useState();
  const [classData, setClassData] = useState();

  const { id } = useParams();

  useEffect(() => {
    try {
      const getChapters = async () => {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/api/v1/chapters/`);

        const filteredResponse = await res.data.data.filter(
          (chapter) => chapter.courseId == id
        );

        setChapters(filteredResponse);
      };
      getChapters();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const getClass = async () => {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/v1/courses/${id}`
        );
        setClassData(res.data.data);
      };
      getClass();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const customTheme = {
    accordion: {
      title: {
        open: {
          on: "opacity-100",
          off: "opacity-80",
        },
      },
    },
  };

  console.log(chapters);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Navigation>
        <section className=" mx-4 n lg:mx-[64px] mb-64 -mt-[70px]">
          <section className="overflow-auto">
            <div className="mb-[20px]">
              <Breadcrumb
                links={[
                  { name: "Kelola Kelas", url: "/kelola-kelas" },
                  { name: "Kelola Chapter" },
                ]}
              />
            </div>
            <h1 className="text-center font-bold text-2xl text-darkblue-05 mb-[30px]">
              Kelola Chapter
            </h1>
            {chapters && classData && (
              <div>
                <Flowbite theme={{ theme: customTheme }}>
                  <Accordion alwaysOpen>
                    {chapters.map((chapter) => {
                      return (
                        <Accordion.Panel key={chapter.id}>
                          <Accordion.Title className="px-[20px] border border-gray-200">
                            <div className="flex items-center gap-2">
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                  />
                                </svg>
                              </span>

                              <p
                                className={`text-darkblue-05 font-bold  py-[20px]`}
                              >
                                {chapter.name}
                              </p>
                            </div>
                          </Accordion.Title>
                          <Accordion.Content className="px-[20px]">
                            <div className="py-[20px]">
                              <p>{chapter.id}</p>
                              <p>{classData.name}</p>
                            </div>
                          </Accordion.Content>
                        </Accordion.Panel>
                      );
                    })}
                  </Accordion>
                </Flowbite>
              </div>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
