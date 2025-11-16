import React from "react";
import { useNavigate } from "react-router-dom";

const TutorHero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="container mx-auto px-4 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 animate-fade-in-up">
                        <span className="text-[#0b6459]">
                            Share Your Knowledge,
                        </span>
                        <br />
                        Inspire the Future
                    </h1>
                    <p
                        className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Join our community of passionate educators and start
                        earning on your own schedule. Empower students worldwide
                        and make a real impact.
                    </p>
                    <div
                        className="mt-8 animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <button 
                            onClick={() => navigate('/signup?role=tutor')}
                            className="px-8 py-4 bg-[#0b6459] text-white font-bold rounded-lg transition-colors btn-scale text-lg"
                        >
                            Start teaching today
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div
                    className="relative flex items-center justify-center animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                >
                    <img
                        src="https://picsum.photos/seed/tutor-hero/600/500"
                        alt="Tutor teaching online"
                        className="rounded-2xl shadow-xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default TutorHero;
