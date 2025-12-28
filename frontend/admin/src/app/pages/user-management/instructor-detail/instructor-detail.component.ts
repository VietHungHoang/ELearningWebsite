import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Tutor, TutorDetail } from '../../../services/user.service';
import { TutorSubject, CareerEntry } from '../../../types/instructor';
import { ClassService, GroupClass } from '../../../services/class.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterByCareerTypePipe } from '../../../shared/pipes/filter-by-career-type.pipe';
import { LocaleUtilsService } from '../../../shared/utils';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-instructor-detail',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule, TruncatePipe, FilterByCareerTypePipe, TranslatePipe],
    templateUrl: './instructor-detail.component.html',
    styleUrl: './instructor-detail.component.scss'
})
export class InstructorDetailComponent implements OnInit, OnDestroy {
    Math = Math;
    instructorId: string = '';
    instructor: TutorDetail | null = null;
    instructorClasses: GroupClass[] = [];
    availabilityDays: any[] = [];
    isLoading = true;
    errorMessage = '';
    private destroy$ = new Subject<void>();

    isEditing = false;
    editedValues: { [key: string]: any } = {};
    subjectsEditText: string = '';
    timezoneSearchText: string = '';
    countrySearchText: string = '';
    selectedAvatarFile: File | null = null;
    avatarPreviewUrl: string | null = null;

    // Timezone, Country, and Language options
    timezoneOptions: any[] = [];
    countryOptions: any[] = [];
    languageOptions: any[] = [];
    instructorLevelOptions: any[] = [];

    // Popover management
    openPopover: string | null = null;
    popoverData: any[] = [];

    // Career tab management
    activeCareerTab: 'EDUCATION' | 'EXPERIENCE' = 'EDUCATION';



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private classService: ClassService,
        private localeUtils: LocaleUtilsService
    ) {
        // Timezone options: "Asia/Bangkok (UTC+7)"
        this.timezoneOptions = this.localeUtils.getAllTimezones().map(tz => ({
            label: `${tz.name} (${tz.offset})`,
            value: tz.name
        }));
        // Country options: giữ nguyên structure {name, code, flag}
        this.countryOptions = this.localeUtils.getAllCountries();
        // Language options: giữ nguyên structure {code, name}
        this.languageOptions = this.localeUtils.getAllLanguages();
        this.instructorLevelOptions = [
            { value: 'beginner', label: 'Beginner (Less than 1 year)' },
            { value: 'junior', label: 'Junior (1-3 years)' },
            { value: 'senior', label: 'Senior (Above 3 years)' },
            { value: 'master', label: 'Master' },
            { value: 'professional', label: 'Professional' }
        ];
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.instructorId = params.get('id') || '';
                if (this.instructorId) {
                    this.loadInstructor();
                } else {
                    this.errorMessage = 'No instructor ID provided';
                    this.isLoading = false;
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getExperienceEntries(): CareerEntry[] {
        return this.instructor?.careerEntries?.filter(entry => entry.type === 'EXPERIENCE') || [];
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        // Đóng popover khi click bên ngoài
        const target = event.target as HTMLElement;
        if (this.openPopover && !target.closest('.relative')) {
            this.closePopover();
        }
    }

    loadInstructor(): void {
        this.isLoading = true;
        this.userService.getTutorDetail(this.instructorId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (instructor: TutorDetail | undefined) => {
                    this.instructor = instructor || null;
                    this.sortLanguages();
                    if (this.instructor) {
                        this.loadInstructorCourses();
                    } else {
                        this.errorMessage = 'Instructor not found';
                        this.isLoading = false;
                    }
                },
                error: (error: any) => {
                    console.error('Error loading instructor:', error);
                    this.errorMessage = 'Failed to load instructor details';
                    this.isLoading = false;
                }
            });
    }

    loadInstructorCourses(): void {
        this.classService.classes$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (classes) => {
                    this.instructorClasses = classes.filter(classItem =>
                        classItem.instructor_id === this.instructorId
                    );
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading instructor classes:', error);
                    this.isLoading = false;
                }
            });
    }

    getTotalStudents(): number {
        return this.instructorClasses.reduce((total, classItem) => total + classItem.enrollment_count, 0);
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;

        if (this.isEditing && this.instructor) {
            this.initializeEditedValues();
            this.selectedAvatarFile = null;
            this.avatarPreviewUrl = null;
        }
    }

    onAvatarSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('Image size must be less than 5MB');
            return;
        }

        this.selectedAvatarFile = file;

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            this.avatarPreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    saveNameAndAvatar(): void {
        if (!this.instructor) return;

        const updateData: Partial<TutorDetail> = {
            name: this.editedValues['name']?.trim() || this.instructor.name
        };

        // TODO: Upload avatar if selected
        if (this.selectedAvatarFile) {
            // Call API to upload avatar
            // For now, just update the preview
            updateData.avatarUrl = this.avatarPreviewUrl || this.instructor.avatarUrl;
        }

        // Call service to update instructor
        this.userService.updateInstructor(this.instructorId, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedInstructor) => {
                    if (updatedInstructor) {
                        this.instructor = updatedInstructor;
                        this.isEditing = false;
                        this.selectedAvatarFile = null;
                        this.avatarPreviewUrl = null;
                        console.log('✅ Instructor name and avatar updated successfully');
                    }
                },
                error: (error) => {
                    console.error('❌ Error updating instructor:', error);
                    alert('Failed to update instructor');
                }
            });
    }

    private initializeEditedValues(): void {
        if (!this.instructor) return;

        this.editedValues = {
            name: this.instructor.name || '',
            email: this.instructor.email || '',
            experience: this.instructor.experience || 0,
            countryCode: this.instructor.countryCode || '',
            timezone: this.instructor.timezone || '',
            gender: this.instructor.gender || '',
            subjects: (this.instructor.subjects && Array.isArray(this.instructor.subjects))
                ? this.instructor.subjects.map(s => s.subjectName)
                : [],
            joinDate: this.instructor.joinDate || '',
            languages: (this.instructor.languages && Array.isArray(this.instructor.languages))
                ? [...this.instructor.languages]
                : [],
            instructorLevel: (this.instructor.instructorLevel && Array.isArray(this.instructor.instructorLevel))
                ? [...this.instructor.instructorLevel]
                : [],
            headline: this.instructor.headline || '',
            introduction: this.instructor.introduction || '',
            videoUrl: this.instructor.videoUrl || '',
            totalStudents: this.instructor.totalStudents || 0,
            totalReviews: this.instructor.totalReviews || 0,
            totalHours: this.instructor.totalHours || 0,
            // Parse social links as comma-separated platforms or URLs
            socialLinks: (this.instructor.socialLinks && Array.isArray(this.instructor.socialLinks))
                ? [...this.instructor.socialLinks]
                : [],
            currentSessionFee: this.instructor.currentSessionFee || 0,
            initialPrice: this.instructor.initialPrice || 0
        };
    }

    saveAllFields(): void {
        if (!this.instructor) return;

        // Chuẩn bị dữ liệu cập nhật
        const updateData: Partial<TutorDetail> = {
            name: this.editedValues['name']?.trim() || '',
            email: this.editedValues['email']?.trim() || '',
            experience: parseInt(this.editedValues['experience'], 10) || 0,
            countryCode: this.editedValues['countryCode']?.trim() || '',
            timezone: this.editedValues['timezone']?.trim() || '',
            gender: this.editedValues['gender']?.trim() || '',
            // Handle subjects as array
            subjects: (this.editedValues['subjects'] && Array.isArray(this.editedValues['subjects']))
                ? this.editedValues['subjects']
                    .map((subject: string) => {
                        const trimmed = typeof subject === 'string' ? subject.trim() : subject;
                        return { categoryId: '', subjectName: trimmed };
                    })
                    .filter((s: TutorSubject) => s.subjectName.length > 0)
                : [],
            joinDate: this.editedValues['joinDate']?.trim() || '',
            // Handle languages as array
            languages: (this.editedValues['languages'] && Array.isArray(this.editedValues['languages']))
                ? this.editedValues['languages']
                    .map((lang: any) => {
                        if (typeof lang === 'object' && lang.languageCode) {
                            return {
                                languageCode: lang.languageCode,
                                isNative: lang.isNative || false
                            };
                        }
                        return null;
                    })
                    .filter((l) => l !== null)
                : [],
            // Parse instructorLevel array
            instructorLevel: (this.editedValues['instructorLevel'] && Array.isArray(this.editedValues['instructorLevel']))
                ? this.editedValues['instructorLevel'].filter((level: string) => level.length > 0)
                : [],
            headline: this.editedValues['headline']?.trim() || '',
            introduction: this.editedValues['introduction']?.trim() || '',
            videoUrl: this.editedValues['videoUrl']?.trim() || '',
            totalStudents: parseInt(this.editedValues['totalStudents'], 10) || 0,
            totalReviews: parseInt(this.editedValues['totalReviews'], 10) || 0,
            totalHours: parseInt(this.editedValues['totalHours'], 10) || 0,
            // Parse social links (format: "platform:url; platform:url")
            socialLinks: (this.editedValues['socialLinks'] && Array.isArray(this.editedValues['socialLinks']))
                ? this.editedValues['socialLinks']
                    .map((social: any, index: number) => ({
                        id: social.id || `social-${index}`,
                        platform: social.platform?.trim() || '',
                        url: social.url?.trim() || ''
                    }))
                    .filter((s: any) => s.platform.length > 0 && s.url.length > 0)
                : [],
            currentSessionFee: parseFloat(this.editedValues['currentSessionFee']) || 0,
            initialPrice: parseFloat(this.editedValues['initialPrice']) || 0
        };

        // Gửi API request để cập nhật
        this.isLoading = true;
        this.userService.updateInstructor(this.instructorId, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedInstructor) => {
                    if (updatedInstructor) {
                        // Cập nhật component data
                        this.instructor = updatedInstructor;
                        this.isEditing = false;
                        this.editedValues = {};
                        this.isLoading = false;
                        console.log('✅ Instructor updated successfully');
                    } else {
                        this.errorMessage = 'Failed to update instructor';
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    console.error('❌ Error updating instructor:', error);
                    this.errorMessage = 'Failed to update instructor';
                    this.isLoading = false;
                }
            });
    }

    cancelEdit(): void {
        this.isEditing = false;
        this.editedValues = {};
    }

    getLevelLabel(levels?: string[]): string {
        if (!levels || !Array.isArray(levels) || levels.length === 0) return 'Not Set';

        const levelLabels: { [key: string]: string } = {
            'beginner': 'Begin Instructor (Less than 1 year)',
            'junior': 'Junior Instructor (1-3 years)',
            'senior': 'Senior Instructor (above 3 years)',
            'master': 'Master Instructor',
            'professional': 'Professional Instructor'
        };

        const labels = levels
            .map(level => levelLabels[level.toLowerCase()] || level)
            .filter(label => label && label.length > 0);
        return labels.length > 0 ? labels.join(', ') : 'Not Set';
    }

    getLevelLabelByCodes(levelCodes?: string[]): string {
        if (!levelCodes || !Array.isArray(levelCodes) || levelCodes.length === 0) return 'Not Set';

        const codeToLabel: { [key: string]: string } = {
            'BEG': 'Begin Instructor (Less than 1 year)',
            'JNR': 'Junior Instructor (1-3 years)',
            'SNR': 'Senior Instructor (above 3 years)',
            'MST': 'Master Instructor',
            'PRO': 'Professional Instructor'
        };

        const labels = levelCodes
            .map(code => codeToLabel[code] || code)
            .filter(label => label && label.length > 0);
        return labels.length > 0 ? labels.join(', ') : 'Not Set';
    }

    getLanguagesDisplay(): string {
        if (!this.instructor?.languages || !Array.isArray(this.instructor.languages) || this.instructor.languages.length === 0) {
            return 'N/A';
        }
        return this.instructor.languages
            .map(l => l.languageCode)
            .join(', ');
    }

    getSubjectsDisplay(): string {
        if (!this.instructor?.subjects || !Array.isArray(this.instructor.subjects) || this.instructor.subjects.length === 0) {
            return 'N/A';
        }
        return this.instructor.subjects
            .map(s => s.subjectName)
            .join(', ');
    }



    trackByDayIndex(index: number): number {
        return index;
    }

    trackByIndex(index: number): number {
        return index;
    }

    previewCertification(fileUrl: string): void {
        window.open(fileUrl, '_blank');
    }

    downloadCertification(fileUrl: string, fileName: string): void {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'certificate';
        link.click();
    }

    // Schedule methods
    getScheduleHours(): number[] {
        const hours = [];
        for (let i = 7; i <= 24; i++) {
            hours.push(i);
        }
        return hours;
    }

    getDayName(day: string | number): string {
        const dayNames: { [key: string]: string } = {
            '0': 'Sun',
            '1': 'Mon',
            '2': 'Tue',
            '3': 'Wed',
            '4': 'Thu',
            '5': 'Fri',
            '6': 'Sat',
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat',
            'sunday': 'Sun'
        };
        return dayNames[String(day)] || String(day);
    }

    getScheduleDays(): string[] {
        return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    }

    getScheduleForDay(day: string): string[] {
        if (!this.instructor?.availableSchedule) return [];
        return this.instructor.availableSchedule[day as keyof typeof this.instructor.availableSchedule] || [];
    }

    isHourAvailable(day: string, hour: number): boolean {
        const slots = this.getScheduleForDay(day);
        const hourStr = `${hour}:00`;
        return slots.some(slot => slot.startsWith(hourStr) || slot === hourStr);
    }

    getHourDisplay(hour: number): string {
        if (hour === 24) return '0:00';
        return `${hour}:00`;
    }

    // Popover methods for array fields
    openArrayPopover(fieldName: string, items: any[], displayKey?: string | ((item: any) => string)): void {
        this.openPopover = fieldName;
        this.popoverData = items;
    }

    closePopover(): void {
        this.openPopover = null;
        this.popoverData = [];
    }

    getDisplayText(item: any, displayKey?: string | ((item: any) => string)): string {
        if (!displayKey) return String(item);
        if (typeof displayKey === 'function') return displayKey(item);
        return item[displayKey] || String(item);
    }

    getLanguageDisplayText(lang: any): string {
        const langName = this.localeUtils.getLanguageName(lang.languageCode);
        const nativeText = lang.isNative ? ' (native)' : '';
        return `${langName}${nativeText}`;
    }

    getSubjectDisplayText(subject: any): string {
        return subject.subjectName;
    }

    getLevelDisplayText(level: string): string {
        const levelMap: { [key: string]: string } = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'senior': 'Senior',
            'master': 'Master',
            'doctor': 'Doctor',
            'professional': 'Professional',
            'expert': 'Expert'
        };
        return levelMap[level.toLowerCase()] || level;
    }

    formatClassType(classType?: string): string {
        if (!classType) return 'N/A';
        const classTypeMap: { [key: string]: string } = {
            'ONE_ON_ONE': '1-1',
            'SMALL_GROUP': '1-n',
            'LARGE_GROUP': '1-n'
        };
        return classTypeMap[classType] || classType;
    }

    toggleArrayValue(array: any[], value: any): void {
        if (!array) return;
        const index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        } else {
            array.push(value);
        }
    }

    toggleLanguage(langCode: string): void {
        if (!this.editedValues['languages']) {
            this.editedValues['languages'] = [];
        }
        const languages = this.editedValues['languages'];
        const index = languages.findIndex((l: any) =>
            (typeof l === 'string' ? l === langCode : l.languageCode === langCode)
        );
        if (index > -1) {
            languages.splice(index, 1);
        } else {
            // Add with basic isNative false
            languages.push({
                languageCode: langCode,
                isNative: false
            });
        }
    }

    toggleSubject(subjectName: string): void {
        if (!this.editedValues['subjects']) {
            this.editedValues['subjects'] = [];
        }
        const subjects = this.editedValues['subjects'];
        const index = subjects.findIndex((s: any) =>
            (typeof s === 'string' ? s === subjectName : s.subjectName === subjectName)
        );
        if (index > -1) {
            subjects.splice(index, 1);
        } else {
            // Add as string for now (can be enhanced to TutorSubject object)
            subjects.push(subjectName);
        }
    }

    addSubjectsFromText(): void {
        if (!this.subjectsEditText.trim()) return;

        if (!this.editedValues['subjects']) {
            this.editedValues['subjects'] = [];
        }

        // Split by newline or comma and add each subject
        const newSubjects = this.subjectsEditText
            .split(/[\n,]+/)
            .map((s: string) => s.trim())
            .filter((s: string) => s && !this.editedValues['subjects'].includes(s));

        this.editedValues['subjects'].push(...newSubjects);
        this.subjectsEditText = '';
    }

    isLanguageSelected(langCode: string): boolean {
        if (!this.editedValues['languages'] || !Array.isArray(this.editedValues['languages'])) {
            return false;
        }
        return this.editedValues['languages'].some((l: any) =>
            typeof l === 'object' && l.languageCode === langCode
        );
    }

    isSubjectSelected(subjectName: string): boolean {
        if (!this.editedValues['subjects'] || !Array.isArray(this.editedValues['subjects'])) {
            return false;
        }
        return this.editedValues['subjects'].some((s: any) =>
            (typeof s === 'string' ? s === subjectName : s === subjectName)
        );
    }

    getTimezoneName(timezone: string | undefined): string {
        if (!timezone) return 'Not Specified';
        const tz = this.localeUtils.getTimezoneByName(timezone);
        return tz ? `${tz.name} (${tz.offset})` : timezone;
    }

    getFilteredTimezones(): any[] {
        if (!this.timezoneSearchText.trim()) {
            return this.timezoneOptions;
        }
        const searchLower = this.timezoneSearchText.toLowerCase();
        return this.timezoneOptions.filter((tz: any) =>
            tz.label.toLowerCase().includes(searchLower) ||
            tz.value.toLowerCase().includes(searchLower)
        );
    }

    selectTimezone(value: string): void {
        this.editedValues['timezone'] = value;
        this.timezoneSearchText = '';
    }

    getCountryName(countryCode: string | undefined): string {
        if (!countryCode || countryCode.trim() === '') return 'Not Specified';
        const country = this.localeUtils.getCountryByCode(countryCode);
        return country ? country.name.common : countryCode;
    }

    getFilteredCountries(): any[] {
        if (!this.countrySearchText.trim()) {
            return this.countryOptions;
        }
        const searchLower = this.countrySearchText.toLowerCase();
        return this.countryOptions.filter((country: any) =>
            country.code.toLowerCase().includes(searchLower) ||
            country.name.toLowerCase().includes(searchLower)
        );
    }

    selectCountry(code: string): void {
        this.editedValues['countryCode'] = code;
        this.countrySearchText = '';
    }

    addSocialLink(): void {
        if (!this.editedValues['socialLinks']) {
            this.editedValues['socialLinks'] = [];
        }
        this.editedValues['socialLinks'].push({
            id: `social-${Date.now()}`,
            platform: '',
            url: ''
        });
    }

    removeSocialLink(index: number): void {
        if (this.editedValues['socialLinks'] && Array.isArray(this.editedValues['socialLinks'])) {
            this.editedValues['socialLinks'].splice(index, 1);
        }
    }

    private sortLanguages(): void {
        if (this.instructor && this.instructor.languages) {
            this.instructor.languages.sort((a, b) => {
                if (a.isNative && !b.isNative) return -1;
                if (!a.isNative && b.isNative) return 1;
                return 0;
            });
        }
    }
}

