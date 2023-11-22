/* eslint-disable react/prop-types */
import Sidebar from "../../Organism/Sidebar/Sidebar";
import Header from "../../Organism/Header/Header";
export default function Navigation({ children }) {
  return (
    <main className="flex flex-auto">
      <Sidebar />
      <section className="w-full">
        <Header name={"Admin"} />
        {children}
      </section>
    </main>
  );
}
