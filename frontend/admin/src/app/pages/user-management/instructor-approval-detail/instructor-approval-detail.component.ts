import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { InstructorRequestDetail } from '../../../types/approval';
import { TutorSubject, CareerEntry } from '../../../types/instructor';
import { FilterByCareerTypePipe } from '../../../shared/pipes/filter-by-career-type.pipe';
import { LocaleUtilsService } from '../../../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-instructor-approval-detail',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule, FilterByCareerTypePipe],
    templateUrl: './instructor-approval-detail.component.html',
    styleUrl: './instructor-approval-detail.component.scss'
})
export class InstructorApprovalDetailComponent implements OnInit, OnDestroy {
    Math = Math;
    instructorId: string = '';
    instructor: InstructorRequestDetail | null = null;
    availabilityDays: any[] = [];
    isLoading = true;
    errorMessage = '';
    private destroy$ = new Subject<void>();



    // Popover management
    openPopover: string | null = null;
    popoverData: any[] = [];

    // Career tab management
    activeCareerTab: 'EDUCATION' | 'EXPERIENCE' = 'EDUCATION';

    // Dialog states
    showApproveDialog = false;
    showRejectDialog = false;
    showEditRequestDialog = false;

    // Loading states
    isApproving = false;
    isRejecting = false;
    isRequestingEdit = false;

    // Approve dialog
    selectedLevels: string[] = [];
    levelOptions = [
        { id: 'beginner', code: 'BEG', label: 'Begin Instructor', icon: 'school', description: 'Less than 1 year' },
        { id: 'junior', code: 'JNR', label: 'Junior Instructor', icon: 'person', description: '1-3 years' },
        { id: 'senior', code: 'SNR', label: 'Senior Instructor', icon: 'workspace_premium', description: 'Above 3 years' },
        { id: 'master', code: 'MST', label: 'Master Instructor', icon: 'stars', description: 'Expert level' },
        { id: 'professional', code: 'PRO', label: 'Professional Instructor', icon: 'military_tech', description: 'Professional certified' }
    ];

    // Reject dialog
    rejectReason = '';
    customRejectReason = '';
    rejectionReasons = [
        'Thiếu chứng chỉ cần thiết',
        'Thông tin không đầy đủ',
        'Kinh nghiệm chưa đủ',
        'Không đáp ứng yêu cầu',
        'Khác'
    ];

    // Edit request dialog
    editRequestReason = '';
    customEditReason = '';
    editRequestReasons = [
        'Cần bổ sung thông tin cá nhân',
        'Ảnh đại diện cần thay đổi',
        'Chứng chỉ cần cập nhật',
        'Thông tin kinh nghiệm cần chỉnh sửa',
        'Thông tin chuyên môn cần điều chỉnh',
        'Khác'
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private localeUtils: LocaleUtilsService
    ) {}

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



    loadInstructor(): void {
        this.isLoading = true;
        this.userService.getInstructorRequestDetailObservable(this.instructorId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (instructorRequest: any) => {
                    this.instructor = instructorRequest || null;
                    this.sortLanguages();
                    if (!this.instructor) {
                        this.errorMessage = 'Instructor request not found';
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    console.error('Error loading instructor request:', error);
                    this.errorMessage = 'Failed to load instructor request details';
                    this.isLoading = false;
                }
            });
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



    getTimezoneName(timezone: string | undefined): string {
        if (!timezone) return 'Not Specified';
        const tz = this.localeUtils.getTimezoneByName(timezone);
        return tz ? `${tz.name} (${tz.offset})` : timezone;
    }



    getCountryName(countryCode: string | undefined): string {
        if (!countryCode || countryCode.trim() === '') return 'Not Specified';
        const country = this.localeUtils.getCountryByCode(countryCode);
        return country ? country.name.common : countryCode;
    }



    // Approve Dialog Methods
    openApproveDialog(): void {
        this.showApproveDialog = true;
        this.selectedLevels = [];
    }

    closeApproveDialog(): void {
        this.showApproveDialog = false;
        this.selectedLevels = [];
    }

    toggleLevel(levelId: string): void {
        const index = this.selectedLevels.indexOf(levelId);
        if (index >= 0) {
            this.selectedLevels.splice(index, 1);
        } else {
            this.selectedLevels.push(levelId);
        }
    }

    confirmApprove(): void {
        if (this.instructor && this.selectedLevels.length > 0) {
            this.isApproving = true;
            // Convert level IDs to codes before sending to backend
            const levelCodes = this.selectedLevels.map(levelId => {
                const level = this.levelOptions.find(l => l.id === levelId);
                return level ? level.code : levelId;
            });

            this.userService.approveInstructorRequest(this.instructor.id, levelCodes).subscribe(success => {
                this.isApproving = false;
                this.closeApproveDialog();
                if (success) {
                    console.log('Instructor request approved successfully!');
                    // Use setTimeout to ensure navigation happens after dialog is closed
                    setTimeout(() => {
                        this.router.navigate(['/dashboard/user-management/instructor-approval']);
                    }, 100);
                } else {
                    console.error('Failed to approve instructor request');
                }
            });
        }
    }

    // Reject Dialog Methods
    openRejectDialog(): void {
        this.showRejectDialog = true;
        this.rejectReason = '';
        this.customRejectReason = '';
    }

    closeRejectDialog(): void {
        this.showRejectDialog = false;
        this.rejectReason = '';
        this.customRejectReason = '';
    }

    confirmReject(): void {
        const finalReason = this.rejectReason === 'Khác' ? this.customRejectReason : this.rejectReason;
        if (this.instructor && finalReason.trim()) {
            this.isRejecting = true;
            this.userService.rejectInstructorRequest(this.instructor.id, finalReason).subscribe(success => {
                this.isRejecting = false;
                this.closeRejectDialog();
                if (success) {
                    console.log('Instructor request rejected.');
                    // Use setTimeout to ensure navigation happens after dialog is closed
                    setTimeout(() => {
                        this.router.navigate(['/dashboard/user-management/instructor-approval']);
                    }, 100);
                } else {
                    console.error('Failed to reject instructor request');
                }
            });
        }
    }

    // Edit Request Dialog Methods
    openEditRequestDialog(): void {
        this.showEditRequestDialog = true;
        this.editRequestReason = '';
        this.customEditReason = '';
    }

    closeEditRequestDialog(): void {
        this.showEditRequestDialog = false;
        this.editRequestReason = '';
        this.customEditReason = '';
    }

    confirmEditRequest(): void {
        const finalReason = this.editRequestReason === 'Khác' ? this.customEditReason : this.editRequestReason;
        if (this.instructor && finalReason.trim()) {
            this.isRequestingEdit = true;
            this.userService.requestEditInstructorRequest(this.instructor.id, finalReason).subscribe(success => {
                this.isRequestingEdit = false;
                this.closeEditRequestDialog();
                if (success) {
                    console.log('Edit request sent to instructor.');
                    // Use setTimeout to ensure navigation happens after dialog is closed
                    setTimeout(() => {
                        this.router.navigate(['/dashboard/user-management/instructor-approval']);
                    }, 100);
                } else {
                    console.log('Failed to send edit request. Please try again.');
                }
            });
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

