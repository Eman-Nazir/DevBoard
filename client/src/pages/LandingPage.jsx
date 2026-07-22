import NavBar from "../components/landing/NavBar.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import FeaturesSection from "../components/landing/FeaturesSection.jsx";
import StackSection from "../components/landing/StackSection.jsx";
import PricingSection from "../components/landing/PricingSection.jsx";
import LandingFooter from "../components/landing/LandingFooter.jsx";

const LandingPage = () => (
  <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
    <NavBar />
    <HeroSection />
    <FeaturesSection />
    <StackSection />
    <PricingSection />
    <LandingFooter />
  </div>
);

export default LandingPage;