export default function Sidebar() {
  return (
    <nav className="sticky top-0 bg-darkblue-05 h-screen w-[300px] flex flex-col justify-center items-center flex-wrap">
      <img
        src="/images/logo.png"
        alt="logo"
        className="w-[134.13px] h-[150px] mb-4"
      />
      <div className="flex-1 w-full">
        <a
          href="#"
          className="inline-block text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px] w-full"
        >
          <p>Dashboard</p>
        </a>
        <p className="text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px]">
          <a href="#">Kelola Kelas</a>
        </p>
        <p className="text-[16px] font-bold text-neutral-01 font-montserrat hover:bg-darkblue-03 py-[13px] pl-[39px]">
          <a href="#">Keluar</a>
        </p>
      </div>
    </nav>
  );
}
