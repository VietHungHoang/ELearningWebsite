import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../components/ui/Toast';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import commonUtils from '../../../../utils/commonUtils';
import type { Country } from '../../../../types/common';

const StudentPersonalDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const { setBreadcrumb } = useBreadcrumb();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const countries = commonUtils.getAllCountries();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        country: { code: '', name: '', flag: '' } as Country,
        bio: ''
    });

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.student.personalDetails.title') || 'Personal Details' }
        ]);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        const loadStudentData = () => {
            try {
                setLoading(true);
                if (state.user) {
                    // Load data from auth context and localStorage
                    setFormData({
                        fullName: state.user.fullName || state.user.name || '',
                        email: state.user.email || '',
                        country: { code: '', name: '', flag: '' },
                        bio: ''
                    });
                }
            } catch (error) {
                console.error('Error loading student data:', error);
                setToast({ message: t('dashboard.student.personalDetails.fetchError') || 'Failed to load data', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadStudentData();
    }, [state.user, t]);

    const handleSave = async () => {
        try {
            setSaving(true);
            if (!state.user?.id) {
                setToast({ message: t('dashboard.student.personalDetails.saveError') || 'User not found', type: 'error' });
                return;
            }

            // TODO: Implement update student API call
            // const response = await studentService.updateStudent(state.user.id, formData);
            
            setToast({ message: t('dashboard.student.personalDetails.saveSuccess') || 'Profile updated successfully', type: 'success' });
        } catch (error) {
            console.error('Error saving student data:', error);
            setToast({ message: t('dashboard.student.personalDetails.saveError') || 'Failed to save', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const inputStyles = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#0b6459] hover:border-gray-300 transition-all duration-300 ease-in-out";

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                    <p className="text-gray-500 mt-4">{t('dashboard.student.personalDetails.loading') || 'Loading...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">
                    {t('dashboard.student.personalDetails.title') || 'Personal Details'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    {t('dashboard.student.personalDetails.description') || 'Update your personal information'}
                </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <form className="space-y-0">
                    {/* Full Name */}
                    <div className="flex items-center py-8 border-b border-gray-200 px-6">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">
                                {t('dashboard.student.personalDetails.fullName') || 'Full Name'} <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={inputStyles}
                                placeholder={t('dashboard.student.personalDetails.fullNamePlaceholder') || 'Enter your full name'}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center py-8 border-b border-gray-200 px-6">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">
                                {t('dashboard.student.personalDetails.email') || 'Email'} <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-1 pl-4">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={inputStyles}
                                placeholder={t('dashboard.student.personalDetails.emailPlaceholder') || 'Enter your email'}
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="flex items-center py-8 border-b border-gray-200 px-6">
                        <div className="w-48 text-left">
                            <label className="text-sm font-medium text-gray-700">
                                {t('dashboard.student.personalDetails.country') || 'Country'}
                            </label>
                        </div>
                        <div className="flex-1 pl-4">
                            <CustomDropdown
                                options={countries.map(c => `${c.flag} ${c.name}`)}
                                selectedValue={formData.country.name ? `${formData.country.flag} ${formData.country.name}` : ''}
                                placeholder={t('dashboard.student.personalDetails.countryPlaceholder') || 'Select country'}
                                onSelect={(value: string) => {
                                    const selectedCountry = countries.find(c => `${c.flag} ${c.name}` === value);
                                    if (selectedCountry) {
                                        setFormData({ ...formData, country: selectedCountry });
                                    }
                                }}
                                dropdownId="country-dropdown"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex items-start py-8 px-6">
                        <div className="w-48 text-left pt-2">
                            <label className="text-sm font-medium text-gray-700">
                                {t('dashboard.student.personalDetails.bio') || 'Bio'}
                            </label>
                        </div>
                        <div className="flex-1 pl-4">
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className={`${inputStyles} min-h-[100px] resize-y`}
                                placeholder={t('dashboard.student.personalDetails.bioPlaceholder') || 'Tell us about yourself...'}
                                rows={4}
                            />
                        </div>
                    </div>
                </form>

                {/* Save Button */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {saving
                                ? (t('dashboard.student.personalDetails.saving') || 'Saving...')
                                : (t('dashboard.student.personalDetails.save') || 'Save Changes')
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPersonalDetailsPage;

