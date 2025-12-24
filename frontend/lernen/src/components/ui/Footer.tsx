import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaShieldAlt, FaAward, FaCheckCircle } from 'react-icons/fa';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { LernenLogo } from '../LernenLogo';

interface FooterLinkProps {
    to: string;
    children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
    <li>
        <Link 
            to={to} 
            className="text-white hover:text-teal-200 transition-all duration-200 text-sm block py-1.5 hover:translate-x-1 font-medium"
        >
            {children}
        </Link>
    </li>
);

const SocialIcon: React.FC<{ href: string; ariaLabel: string; children: React.ReactNode }> = ({ href, ariaLabel, children }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg text-white hover:text-teal-200"
    >
        {children}
    </a>
);

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const footerRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(footerRef as React.RefObject<Element>, { threshold: 0.1 });
    
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setIsSubmitting(false);
        setEmail('');

        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <footer ref={footerRef} className="relative overflow-hidden">
            {/* Multi-layer Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b6459] via-[#0d7a6d] to-[#0a5249]"></div>
            <div 
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>
            
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-t from-black/10 to-transparent"></div>

            <div className="relative z-10 text-white">
                {/* Main Content */}
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                            {/* Column 1: Logo & Info */}
                            <div className="lg:col-span-2">
                                <Link to="/" className="inline-block mb-5">
                                    <LernenLogo />
                                </Link>
                                <p className="text-sm text-white leading-relaxed mb-6 max-w-md">
                                    {t('footer.description')}
                                </p>
                                
                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                        <FaShieldAlt className="text-teal-300" size={14} />
                                        <span className="text-xs text-white font-medium">{t('footer.secure')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                        <FaAward className="text-teal-300" size={14} />
                                        <span className="text-xs text-white font-medium">{t('footer.verified')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                        <FaCheckCircle className="text-teal-300" size={14} />
                                        <span className="text-xs text-white font-medium">{t('footer.trusted')}</span>
                                    </div>
                                </div>

                                {/* Social Icons */}
                                <div className="flex gap-3">
                                    <SocialIcon href="https://facebook.com" ariaLabel="Facebook">
                                        <FaFacebook size={18} />
                                    </SocialIcon>
                                    <SocialIcon href="https://twitter.com" ariaLabel="Twitter">
                                        <FaTwitter size={18} />
                                    </SocialIcon>
                                    <SocialIcon href="https://linkedin.com" ariaLabel="LinkedIn">
                                        <FaLinkedin size={18} />
                                    </SocialIcon>
                                    <SocialIcon href="https://instagram.com" ariaLabel="Instagram">
                                        <FaInstagram size={18} />
                                    </SocialIcon>
                                </div>
                            </div>

                            {/* Column 2: For Student */}
                            <div>
                                <h4 className="font-bold text-base mb-5 text-white">{t('footer.forStudents')}</h4>
                                <ul className="space-y-2.5">
                                    <FooterLink to="/find-tutors">{t('footer.findTutor')}</FooterLink>
                                    <FooterLink to="/profile/my-bookings">{t('footer.myBookings')}</FooterLink>
                                    <FooterLink to="/profile/my-learning">{t('footer.myLearning')}</FooterLink>
                                    <FooterLink to="/profile/favourites">{t('footer.favourites')}</FooterLink>
                                </ul>
                            </div>

                            {/* Column 3: For Tutors */}
                            <div>
                                <h4 className="font-bold text-base mb-5 text-white">{t('footer.forTutors')}</h4>
                                <ul className="space-y-2.5">
                                    <FooterLink to="/become-a-tutor">{t('footer.becomeTutor')}</FooterLink>
                                    <FooterLink to="/dashboard">{t('footer.tutorDashboard')}</FooterLink>
                                    <FooterLink to="/dashboard/payouts">{t('footer.payouts')}</FooterLink>
                                    <FooterLink to="/dashboard/schedule">{t('footer.schedule')}</FooterLink>
                                </ul>
                            </div>
                            
                            {/* Column 4: Newsletter */}
                            <div>
                                <h4 className="font-bold text-base mb-5 text-white">{t('footer.stayUpdated')}</h4>
                                <p className="text-xs text-white mb-4">
                                    {t('footer.newsletterDescription')}
                                </p>
                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('footer.enterEmail')}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-white/50 text-sm transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isSubmitted}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitted ? (
                                            <>
                                                <FaCheckCircle size={16} />
                                                <span>{t('footer.subscribed')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('footer.subscribe')}</span>
                                                <FiArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-5">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-white text-center md:text-left">
                                {t('footer.copyright', { year: new Date().getFullYear() })}
                            </p>
                            <div className="flex gap-6 text-xs text-white">
                                <Link to="/privacy" className="hover:text-teal-200 transition-colors">{t('footer.privacyPolicy')}</Link>
                                <Link to="/terms" className="hover:text-teal-200 transition-colors">{t('footer.termsOfService')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
