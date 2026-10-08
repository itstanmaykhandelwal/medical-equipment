import Benefits from "../components/home/Benefits";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import HospitalPartners from "../components/home/HospitalPartners";
import PriorityStats from "../components/home/PriorityStats";
import Testimonials from "../components/home/Testimonials";
import TrustedPartner from "../components/home/TrustedPartner";

const Home = () => {
    return (
        <>
            <Hero />
            <PriorityStats />
            <Categories />
            <TrustedPartner />
            <FeaturedProducts />
            <Benefits />
            <Testimonials />
            <HospitalPartners/>
        </>
    );
};

export default Home;
