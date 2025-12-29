import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { VoucherService } from '../../../../services/voucher.service';
import { TranslatePipe } from '../../../../i18n/translate.pipe';
import { I18nService } from '../../../../i18n/i18n.service';

@Component({
  selector: 'app-create-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './create-voucher.component.html',
  styleUrl: './create-voucher.component.scss'
})
export class CreateVoucherComponent implements OnInit {
  voucherForm!: FormGroup;
  isLoading = false;
  message: { type: 'success' | 'error', text: string } | null = null;

  // Student Segment Management
  studentSegments: { id: string; label: string; value: string }[] = [];
  isAddingSegment = false;
  newSegmentLabel = '';
  isSegmentDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private voucherService: VoucherService,
    private router: Router,
    private i18nService: I18nService
  ) {
    this.initStudentSegments();
  }

  ngOnInit(): void {
    this.initForm();
    // Update segments when language changes
    this.i18nService.currentLanguage$();
    this.initStudentSegments();
  }

  initStudentSegments(): void {
    this.studentSegments = [
      { id: 'all', label: this.i18nService.translate('voucherManagement.createVoucher.studentSegments.allStudents'), value: 'all' },
      { id: 'top-spenders', label: this.i18nService.translate('voucherManagement.createVoucher.studentSegments.topSpenders'), value: 'top-spenders' },
      { id: 'new-students', label: this.i18nService.translate('voucherManagement.createVoucher.studentSegments.newStudents'), value: 'new-students' },
      { id: 'no-spending-1month', label: this.i18nService.translate('voucherManagement.createVoucher.studentSegments.noSpending1Month'), value: 'no-spending-1month' }
    ];
  }

  initForm(): void {
    this.voucherForm = this.fb.group({
      code: ['', Validators.required],
      description: [''],
      discountType: ['percentage', Validators.required],
      discountValue: ['', [Validators.required, this.discountValueValidator.bind(this)]],
      maxDiscount: [''],
      productType: ['course', Validators.required],
      targetAudience: ['all', Validators.required], // New field
      minOrderValue: ['', [Validators.min(1)]],
      totalUsageLimit: ['', [Validators.min(1)]],
      usagePerUser: ['', [Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isUnlimited: [false]
    });

    this.voucherForm.get('discountType')?.valueChanges.subscribe(() => {
      this.voucherForm.get('discountValue')?.updateValueAndValidity();
    });
  }

  discountValueValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const discountType = this.voucherForm?.get('discountType')?.value;
    const value = parseFloat(control.value);

    if (isNaN(value) || value <= 0) {
      return { invalidDiscountValue: true };
    }

    if (discountType === 'percentage' && (value < 1 || value > 100)) {
      return { invalidPercentage: true };
    }

    return null;
  }

  generateRandomCode(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.voucherForm.patchValue({ code });
  }

  saveVoucher(): void {
    if (this.voucherForm.valid) {
      this.isLoading = true;
      this.message = null;

      this.voucherService.createVoucher(this.voucherForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = { type: 'success', text: this.i18nService.translate('voucherManagement.createVoucher.messages.createSuccess') };

          setTimeout(() => {
            this.router.navigate(['/dashboard/promotion/vouchers']);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message = { type: 'error', text: this.i18nService.translate('voucherManagement.createVoucher.messages.createError') };
          console.error('Error creating voucher:', error);
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  showValidationErrors(): void {
    const errors: string[] = [];

    Object.keys(this.voucherForm.controls).forEach(key => {
      const control = this.voucherForm.get(key);
      if (control && control.errors) {
        if (control.errors['required']) {
          const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          errors.push(`${fieldName} is required`);
        }
        if (control.errors['invalidDiscountValue']) {
          errors.push('Discount value must be greater than 0');
        }
        if (control.errors['invalidPercentage']) {
          errors.push('Percentage must be between 1 and 100');
        }
        if (control.errors['min']) {
          errors.push(`${key} must be at least ${control.errors['min'].min}`);
        }
      }
    });

    this.message = {
      type: 'error',
      text: errors.length > 0 ? errors.join('. ') : 'Please fill in all required fields correctly.'
    };
  }

  toggleSegmentDropdown(): void {
    this.isSegmentDropdownOpen = !this.isSegmentDropdownOpen;
  }

  selectSegment(value: string): void {
    this.voucherForm.patchValue({ targetAudience: value });
    this.isSegmentDropdownOpen = false;
  }

  toggleAddSegmentMode(): void {
    this.isAddingSegment = !this.isAddingSegment;
    this.newSegmentLabel = '';
  }

  addNewSegment(): void {
    if (this.newSegmentLabel.trim()) {
      const newId = this.newSegmentLabel.toLowerCase().replace(/\s+/g, '-');

      // Check if segment already exists
      if (!this.studentSegments.some(s => s.value === newId)) {
        this.studentSegments.push({
          id: newId,
          label: this.newSegmentLabel,
          value: newId
        });

        // Select the newly added segment
        this.voucherForm.patchValue({ targetAudience: newId });

        // Reset the form
        this.isAddingSegment = false;
        this.newSegmentLabel = '';
        this.isSegmentDropdownOpen = false;
      } else {
        this.message = { type: 'error', text: this.i18nService.translate('voucherManagement.createVoucher.messages.segmentExists') };
      }
    }
  }

  getSelectedSegmentLabel(): string {
    const selectedValue = this.voucherForm.get('targetAudience')?.value;
    const segment = this.studentSegments.find(s => s.value === selectedValue);
    return segment ? segment.label : this.i18nService.translate('voucherManagement.createVoucher.fields.selectStudentSegment');
  }
}
