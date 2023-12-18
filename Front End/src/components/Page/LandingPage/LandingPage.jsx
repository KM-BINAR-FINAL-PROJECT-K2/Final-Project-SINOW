import CampusPartner from "../../LandingPage/CampusPartner";
import FAQ from "../../LandingPage/FAQ";
import Footer from "../../LandingPage/Footer";
import HeaderLandingPage from "../../LandingPage/HeaderLandingPage";
import Hero from "../../LandingPage/Hero";
import OurTeam from "../../LandingPage/OutTeam";
import WhyUs from "../../LandingPage/WhyUs";

export default function LandingPage() {
  return (
    <>
      <div>
        <HeaderLandingPage />
      </div>
      <div>
        <Hero />
      </div>
      <div>
        <WhyUs />
      </div>
      <div>
        <CampusPartner />
      </div>
      <div>
        <OurTeam />
      </div>
      <div className="z-0">
        <FAQ />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
