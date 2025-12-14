import React, { useState, useEffect, useRef } from 'react';
import type { TutorDetail } from '../../../../types/api';

interface TutorDetailsTabsProps {
    tutor: TutorDetail;
}

const TutorDetailsTabs: React.FC<TutorDetailsTabsProps> = ({ tutor }) => {
    const [activeTab, setActiveTab] = useState('introduction');
    const navRef = useRef<HTMLElement>(null);

    const groupClassesLength = tutor.groupClasses?.length ?? 0;
    const reviewsLength = tutor.reviews?.length ?? 0;

    const tabs = [
        { name: 'Introduction', id: 'introduction', count: null },
        { name: 'Availability', id: 'availability', count: null },
    ...(groupClassesLength > 0 ? [{ name: 'Group Class', id: 'group-class', count: groupClassesLength }] : []),
        { name: 'Resume Highlights', id: 'resume-highlights', count: null },
        { name: 'Reviews', id: 'reviews', count: reviewsLength },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.id);
                    }
                });
            },
            { 
                rootMargin: `-${(navRef.current?.offsetHeight || 60) + 20}px 0px -75% 0px`,
                threshold: 0
            }
        );

        const sections = tabs.map(tab => document.getElementById(tab.id)).filter(Boolean);
        sections.forEach(section => observer.observe(section!));

        return () => {
            sections.forEach(section => observer.unobserve(section!));
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = (navRef.current?.offsetHeight || 0) + 16;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
            setActiveTab(id); // Set active tab immediately on click
        }
    };

    return (
        <div className="sticky top-0 bg-[#F8F7F4] z-10 pt-2">
            <div className="border-b border-gray-200">
                <nav ref={navRef} className="-mb-px flex gap-12" aria-label="Tabs">
                    {tabs.map(tab => (
                        <a
                            key={tab.name}
                            href={`#${tab.id}`}
                            onClick={(e) => handleNavClick(e, tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-base transition-colors focus:outline-none ${
                            activeTab === tab.id
                                ? 'border-[#0b6459] text-[#0b6459]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.name}
                            {tab.count !== null && (
                            <span className={`ml-2 text-sm font-bold px-2 py-0.5 rounded-full transition-colors ${activeTab === tab.id ? 'bg-[#0b6459] text-white' : 'bg-[#f9f3eb] text-gray-700'}`}>
                                {tab.count}
                            </span>
                            )}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default TutorDetailsTabs;