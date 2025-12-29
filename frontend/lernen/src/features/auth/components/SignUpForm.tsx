import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import type { StartSignUpRequest, UserRole } from "../../../types/api";
import Toast from "../../../components/ui/Toast";

interface SignUpFormProps {
    onSubmit: (data: StartSignUpRequest) => void;
    loading?: boolean;
    role?: UserRole;
    error?: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, loading = false, role = "student", error = null }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Show toast when error prop changes
    useEffect(() => {
        if (error) {
            setToastMessage(error);
        }
    }, [error]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullname.trim()) {
            newErrors.fullname = t('auth.signup.fullNameRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('auth.signup.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('auth.signup.emailInvalid');
        }

        setErrors(newErrors);

        // Show first error in toast
        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            setToastMessage(firstError);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                email: formData.email,
                fullname: formData.fullname,
                role: role
            });
        }
    };

    return (
        <>
            {/* Toast notification */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="error"
                    onClose={() => setToastMessage(null)}
                />
            )}
            <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-bold text-[#0b6459]">
                        {role === "tutor" ? t('auth.signup.signUpAsTutor') : t('auth.signup.signUpAsStudent')}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {role === "tutor" ? t('auth.signup.tutorJourney') : t('auth.signup.studentJourney')}
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="full-name" className="text-sm font-medium text-gray-700">
                                {t('auth.signup.fullName')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="full-name"
                                name="fullname"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm ${errors.fullname ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={t('auth.signup.fullNamePlaceholder')}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email-address"
                                className="text-sm font-medium text-gray-700"
                            >
                                {t('auth.signup.emailAddress')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={t('auth.signup.emailPlaceholder')}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
                            </button>
                        </div>

                        {/* Terms Agreement Text */}
                        <p className="mt-2 text-center text-xs text-gray-500">
                            {t('auth.signup.termsAgreement')}{' '}
                            <Link to="/terms" className="text-[#0b6459] hover:underline">{t('auth.signup.termsOfUse')}</Link>
                            {' '}{t('auth.signup.and')}{' '}
                            <Link to="/privacy" className="text-[#0b6459] hover:underline">{t('auth.signup.privacyPolicy')}</Link>
                            {t('auth.signup.endTerms')}
                        </p>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-600">
                        {t('auth.signup.alreadyHaveAccount')}{" "}
                        <Link to="/login" className="font-medium text-[#0b6459] hover:text-[#084c43]">
                            {t('auth.signup.signIn')}
                        </Link>
                    </p>

                    <div className="mt-5 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">{t('auth.signup.orSeparator')}</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="mt-5">
                        <button
                            type="button"
                            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors"
                        >
                            <FcGoogle />
                            <span className="ml-3">{t('auth.signup.signUpWithGoogle')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpForm;
