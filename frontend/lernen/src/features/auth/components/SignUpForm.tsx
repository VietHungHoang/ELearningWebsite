import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import type { StartSignUpRequest, UserRole } from "../../../types/api";

interface SignUpFormProps {
    onSubmit: (data: StartSignUpRequest) => void;
    loading?: boolean;
    role?: UserRole;
    error?: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, loading = false, role = "student", error = null }) => {
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
            newErrors.fullname = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!termsAgreed) {
            newErrors.terms = "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
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
        <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <h2 className="text-2xl font-bold text-[#0b6459]">
                    Sign up as a {role === "tutor" ? "Tutor" : "Student"}
                </h2>
                <p className="text-gray-600 mt-2">
                    {role === "tutor"
                        ? "Start your teaching journey today."
                        : "Start your learning journey today."}
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="full-name" className="text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="full-name"
                            name="fullname"
                            type="text"
                            autoComplete="name"
                            required
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm ${
                                errors.fullname ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Your full name"
                        />
                        {errors.fullname && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email-address"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Email address"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <label
                        htmlFor="terms"
                        className="flex items-center cursor-pointer select-none group"
                    >
                        <div className="relative">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="peer sr-only"
                                checked={termsAgreed}
                                onChange={() => setTermsAgreed(!termsAgreed)}
                                required
                            />
                            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-sm transition-colors duration-200 group-hover:border-gray-400 peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-[#0b6459]/50 peer-checked:bg-[#0b6459] peer-checked:border-[#0b6459]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <svg
                                    className="w-2.5 h-2.5"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.5 4L3.5 6L8.5 1"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <span className="ml-2 block text-sm text-gray-900">
                            I agree to the{" "}
                            <a href="#" className="font-medium text-[#0b6459] hover:text-[#084c43]">
                                Terms and Conditions
                            </a>
                        </span>
                    </label>
                    {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={!termsAgreed || loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-[#0b6459] hover:text-[#084c43]">
                        Sign in
                    </Link>
                </p>

                <div className="mt-5 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="mt-5">
                    <button
                        type="button"
                        className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors"
                    >
                        <FcGoogle />
                        <span className="ml-3">Sign up with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
