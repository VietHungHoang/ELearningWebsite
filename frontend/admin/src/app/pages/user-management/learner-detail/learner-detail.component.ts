import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, StudentDetail } from '../../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { LocaleUtilsService } from '../../../shared/utils';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { I18nService } from '../../../i18n/i18n.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-learner-detail',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule, TruncatePipe, TranslatePipe, CurrencyFormatPipe],
    providers: [UserService],
    templateUrl: './learner-detail.component.html',
    styleUrl: './learner-detail.component.scss'
})
export class LearnerDetailComponent implements OnInit, OnDestroy {
    learnerId: string = '';
    learner: StudentDetail | null = null;
    isLoading = true;
    errorMessage = '';
    private destroy$ = new Subject<void>();
    Object = Object;

    isEditing = false;

    editedValues: { [key: string]: any } = {};

    // Country dropdown properties
    countryOptions: any[] = [];
    countrySearchText: string = '';
    openPopover: string | null = null;

    // Avatar upload properties
    selectedAvatarFile: File | null = null;
    avatarPreviewUrl: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private localeUtils: LocaleUtilsService,
        public i18nService: I18nService
    ) {}

    ngOnInit() {
        this.countryOptions = this.localeUtils.getAllCountries();

        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.learnerId = params.get('id') || '';
                if (this.learnerId) {
                    this.loadLearner();
                } else {
                    this.errorMessage = 'No learner ID provided';
                    this.isLoading = false;
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadLearner(): void {
        this.isLoading = true;
        this.userService.getStudentDetail(this.learnerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (learner: StudentDetail | undefined) => {
                    this.learner = learner || null;
                    if (!this.learner) {
                        this.errorMessage = 'Learner not found';
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    console.error('Error loading learner:', error);
                    this.errorMessage = 'Failed to load learner details';
                    this.isLoading = false;
                }
            });
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;

        if (this.isEditing && this.learner) {
            this.initializeEditedValues();
        }
    }

    private initializeEditedValues(): void {
        if (!this.learner) return;

        this.editedValues = {
            fullname: this.learner.fullname,
            avatar: this.learner.avatar || '',
            email: this.learner.email,
            phone: this.learner.phone,
            bio: this.learner.bio,
            dateOfBirth: this.learner.dateOfBirth,
            address: this.learner.address,
            city: this.learner.city,
            country: this.learner.country || '',
            joinDate: this.learner.joinDate,
            learningGoals: this.learner.learningGoals,
            strengths: this.learner.strengths,
            weaknesses: this.learner.weaknesses
        };
    }

    saveAllFields(): void {
        if (!this.learner) return;

        this.learner.fullname = this.editedValues['fullname'];
        this.learner.avatar = this.avatarPreviewUrl || this.learner.avatar;
        this.learner.email = this.editedValues['email'];
        this.learner.phone = this.editedValues['phone'];
        this.learner.bio = this.editedValues['bio'];
        this.learner.dateOfBirth = this.editedValues['dateOfBirth'];
        this.learner.address = this.editedValues['address'];
        this.learner.city = this.editedValues['city'];
        this.learner.country = this.editedValues['country'];
        this.learner.joinDate = this.editedValues['joinDate'];
        this.learner.learningGoals = this.editedValues['learningGoals'];
        this.learner.strengths = this.editedValues['strengths'];
        this.learner.weaknesses = this.editedValues['weaknesses'];

        // Reset avatar upload state
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = null;

        this.isEditing = false;
    }

    cancelEdit(): void {
        this.isEditing = false;
        this.editedValues = {};
        // Reset avatar upload state
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = null;
    }

    // Avatar upload methods
    onAvatarSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB.');
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
    }

    // Country dropdown methods
    getCountryName(countryCode: string | undefined): string {
        if (!countryCode || countryCode.trim() === '') return 'Not Specified';
        const country = this.countryOptions.find(c => c.code === countryCode);
        return country ? country.name : countryCode;
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
        this.editedValues['country'] = code;
        this.countrySearchText = '';
        this.closePopover();
    }

    openArrayPopover(popoverId: string, data: any[]): void {
        this.openPopover = popoverId;
        this.countrySearchText = '';
    }

    closePopover(): void {
        this.openPopover = null;
        this.countrySearchText = '';
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.popover-container') && !target.closest('.popover-trigger')) {
            this.closePopover();
        }
    }
}
