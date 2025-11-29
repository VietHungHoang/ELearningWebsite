import React from "react";
import Layout from "../../../components/ui/Layout";
import TutorHero from "../components/TutorHero";
import HowToStart from "../components/HowToStart";
import WhyTeach from "../components/WhyTeach";
import TutorTestimonials from "../components/TutorTestimonials";

const BecomeTutorPage: React.FC = () => {
    return (
        <Layout>
            <TutorHero />
            <HowToStart />
            <WhyTeach />
            <TutorTestimonials />
        </Layout>
    );
};

export default BecomeTutorPage;
