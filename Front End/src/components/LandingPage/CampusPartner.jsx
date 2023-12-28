import Campus1 from "/images/campus/UBJ.png";
import Campus2 from "/images/campus/UNSIKA.png";
import Campus3 from "/images/campus/UNPAD.png";
import Campus4 from "/images/campus/UB.png";
import Campus5 from "/images/campus/ITB.png";
import Campus6 from "/images/campus/UM.png";
import Campus7 from "/images/campus/UGM.png";
import Campus8 from "/images/campus/BSI.png";
export default function CampusPartner() {
  const campus = [
    { image: Campus1 },
    { image: Campus2 },
    { image: Campus3 },
    { image: Campus4 },
    { image: Campus5 },
    { image: Campus6 },
    { image: Campus7 },
    { image: Campus8 },
  ];
  return (
    <div className="bg-white m-4 pt-8 pb-4 lg:py-14  text-center text-2xl font-bold">
      <p className="lg:py-6 mb-10">Campus Partner</p>
      <div className=" gap-2 h-auto grid grid-cols-2 md:grid md:grid-cols-4 md:mx-24 md:pb-8 lg:mx-56 lg:grid lg:grid-cols-4 place-items-center">
        {campus.map((item, index) => (
          <div key={index} className=" m-5 h-24 md:h-24 lg:h-28">
            <a href="#">
              <img
                src={item.image}
                alt="campus"
                className="h-24 md:h-20 lg:h-28 "
              />
            </a>
            <p className=" h-5 w-auto mt-2 "></p>
          </div>
        ))}
      </div>
    </div>
  );
}
