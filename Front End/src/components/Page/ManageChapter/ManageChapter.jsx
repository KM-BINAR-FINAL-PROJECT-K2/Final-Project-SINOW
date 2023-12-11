/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { Accordion } from "flowbite-react";
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
                <Accordion>
                  {chapters.map((chapter) => {
                    return (
                      <Accordion.Panel key={chapter.id}>
                        <Accordion.Title className="px-[20px] border border-gray-200">
                          <p className="text-darkblue-05 font-bold  py-[20px]">
                            {chapter.name}
                          </p>
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
              </div>
            )}
          </section>
        </section>
      </Navigation>
    </>
  );
}
