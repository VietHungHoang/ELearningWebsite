import React, { useRef } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { LernenLogo } from '../LernenLogo';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a href={href} className="text-gray-300 hover:text-white transition-colors">{children}</a>
    </li>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
        <span className="sr-only">{href}</span>
        {children}
    </a>
);

const Footer: React.FC = () => {
    const footerRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(footerRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <footer ref={footerRef} className={`bg-[#345B55] text-white transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Column 1: Logo & Info */}
                    <div className="lg:col-span-2">
                        <LernenLogo />
                        <p className="mt-4 text-gray-300 max-w-sm">
                            Empowering minds through accessible, personalized, and engaging online education for a brighter future.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <SocialIcon href="#"><FaFacebook size={20} /></SocialIcon>
                            <SocialIcon href="#"><FaTwitter size={20} /></SocialIcon>
                            <SocialIcon href="#"><FaLinkedin size={20} /></SocialIcon>
                            <SocialIcon href="#"><FaInstagram size={20} /></SocialIcon>
                        </div>
                    </div>

                    {/* Column 2: For Student */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">For Student</h4>
                        <ul className="space-y-3">
                            <FooterLink href="#">Find a Tutor</FooterLink>
                            <FooterLink href="#">Find a Course</FooterLink>
                            <FooterLink href="#">My Bookings</FooterLink>
                            <FooterLink href="#">My Learning</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: For Tutors */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">For Tutors</h4>
                        <ul className="space-y-3">
                            <FooterLink href="#">Become a Tutor</FooterLink>
                            <FooterLink href="#">Tutor Dashboard</FooterLink>
                            <FooterLink href="#">Payouts</FooterLink>
                            <FooterLink href="#">Help Center</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Column 4: Company */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Company</h4>
                        <ul className="space-y-3">
                            <FooterLink href="#">About Us</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Blog</FooterLink>
                            <FooterLink href="#">Contact</FooterLink>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-black/20">
                <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Lernen. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;