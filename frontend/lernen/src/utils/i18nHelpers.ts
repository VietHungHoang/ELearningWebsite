import type { Category, Subject } from '../types/common';

/**
 * Get the display name for a category based on current language
 * @param category - Category object with nameVi and nameEn
 * @param language - Current language ('vi' or 'en')
 * @returns Display name in the selected language
 */
export const getCategoryName = (category: Category, language: string): string => {
    return language === 'vi' ? category.nameVi : category.nameEn;
};

/**
 * Get the display name for a subject based on current language
 * @param subject - Subject object with nameVi and nameEn
 * @param language - Current language ('vi' or 'en')
 * @returns Display name in the selected language
 */
export const getSubjectName = (subject: Subject, language: string): string => {
    return language === 'vi' ? subject.nameVi : subject.nameEn;
};
