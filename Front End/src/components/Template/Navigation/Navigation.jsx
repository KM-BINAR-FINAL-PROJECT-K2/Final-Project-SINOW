/* eslint-disable react/prop-types */
import Sidebar from "../../Organism/Sidebar/Sidebar";
import Header from "../../Organism/Header/Header";
import SmallSidebar from "../../Organism/Sidebar/SmallSidebar";
export default function Navigation({
  children,
  searchInputRefCrud,
  inputPlaceholderCrud,
  onBlurCrud,
}) {
  return (
    <>
      <SmallSidebar />
      <main className="flex flex-auto">
        <Sidebar />
        <section className="w-full">
          <Header
            searchInputRef={searchInputRefCrud}
            placeholderSearch={inputPlaceholderCrud}
            handleInputBlur={onBlurCrud}
          />
          {children}
        </section>
      </main>
    </>
  );
}
