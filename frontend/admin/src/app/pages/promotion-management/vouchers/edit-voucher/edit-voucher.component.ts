import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from '../../../../services/voucher.service';
import { TranslatePipe } from '../../../../i18n/translate.pipe';
import { I18nService } from '../../../../i18n/i18n.service';

@Component({
  selector: 'app-edit-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './edit-voucher.component.html',
  styleUrl: './edit-voucher.component.scss'
})
export class EditVoucherComponent implements OnInit {
  voucherForm!: FormGroup;
  voucherId: string = '';
  isLoading = false;
  message: { type: 'success' | 'error', text: string } | null = null;

  // Student Segment Management
  studentSegments: { id: string; label: string; value: string }[] = [];
  isAddingSegment = false;
  newSegmentLabel = '';
  isSegmentDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private voucherService: VoucherService,
    private i18nService: I18nService
  ) {
    this.initStudentSegments();
  }

  ngOnInit(): void {
    // Update segments when language changes
    this.i18nService.currentLanguage$();
    this.initStudentSegments();
    
    this.route.params.subscribe(params => {
      this.voucherId = params['id'];
      console.log('[EditVoucherComponent] Route params:', params);
      console.log('[EditVoucherComponent] Voucher ID from route:', this.voucherId);
      this.initForm();
      this.loadVoucher();
    });
  }

  initStudentSegments(): void {
    this.studentSegments = [
      { id: 'all', label: this.i18nService.translate('voucherManagement.editVoucher.studentSegments.allStudents'), value: 'all' },
      { id: 'top-spenders', label: this.i18nService.translate('voucherManagement.editVoucher.studentSegments.topSpenders'), value: 'top-spenders' },
      { id: 'new-students', label: this.i18nService.translate('voucherManagement.editVoucher.studentSegments.newStudents'), value: 'new-students' },
      { id: 'no-spending-1month', label: this.i18nService.translate('voucherManagement.editVoucher.studentSegments.noSpending1Month'), value: 'no-spending-1month' }
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

  loadVoucher(): void {
    this.isLoading = true;
    console.log('[EditVoucherComponent] Loading voucher with ID:', this.voucherId);
    this.voucherService.getVoucher(this.voucherId).subscribe({
      next: (voucher) => {
        this.isLoading = false;
        console.log('[EditVoucherComponent] Voucher loaded:', voucher);
        
        // Parse dates if they're in string format
        let startDate = voucher.startDate || '';
        let endDate = voucher.endDate || '';
        
        // If dates are in format like "11/11 - 15/11", try to extract and convert
        if (voucher.date && voucher.date.includes(' - ') && !startDate) {
          const dateParts = voucher.date.split(' - ');
          if (dateParts.length === 2) {
            // Parse dates from format "dd/MM" or "dd/MM/yyyy" to "yyyy-MM-dd"
            startDate = this.parseDateString(dateParts[0].trim());
            endDate = this.parseDateString(dateParts[1].trim());
            console.log('[EditVoucherComponent] Parsed dates from date string:', { startDate, endDate });
          }
        } else if (startDate && !this.isValidDateInput(startDate)) {
          // If startDate exists but not in correct format, convert it
          startDate = this.parseDateString(startDate);
        } else if (endDate && !this.isValidDateInput(endDate)) {
          // If endDate exists but not in correct format, convert it
          endDate = this.parseDateString(endDate);
        }

        this.voucherForm.patchValue({
          code: voucher.code,
          description: voucher.description || '',
          discountType: voucher.discountType || 'percentage',
          discountValue: voucher.discountValue || this.extractDiscountValue(voucher.value),
          maxDiscount: voucher.maxDiscount || this.extractMaxDiscount(voucher.value),
          productType: voucher.productType || 'course',
          targetAudience: voucher.targetAudience || 'all',
          minOrderValue: voucher.minOrderValue || '',
          totalUsageLimit: voucher.totalUsageLimit || this.extractTotalUsageLimit(voucher.usage),
          usagePerUser: voucher.usagePerUser || '',
          startDate: startDate,
          endDate: endDate,
          isUnlimited: voucher.isUnlimited || (voucher.date && voucher.date.includes('Unlimited'))
        });
        console.log('[EditVoucherComponent] Form patched with values');
      },
      error: (error) => {
        this.isLoading = false;
        this.message = { type: 'error', text: this.i18nService.translate('voucherManagement.editVoucher.messages.loadError') };
        console.error('Error loading voucher:', error);
      }
    });
  }

  /**
   * Parse date string from various formats to yyyy-MM-dd
   * Supports: "dd/MM", "dd/MM/yyyy", "MM/dd/yyyy", etc.
   */
  private parseDateString(dateStr: string): string {
    if (!dateStr || dateStr.trim() === '') return '';
    
    // If already in yyyy-MM-dd format, return as is
    if (this.isValidDateInput(dateStr)) {
      return dateStr;
    }
    
    try {
      // Try to parse "dd/MM" or "dd/MM/yyyy" format (assuming current year if year missing)
      const parts = dateStr.split('/');
      if (parts.length >= 2) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parts.length === 3 ? parseInt(parts[2], 10) : new Date().getFullYear();
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          // Create date and format to yyyy-MM-dd
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            const yearStr = date.getFullYear().toString();
            const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
            const dayStr = date.getDate().toString().padStart(2, '0');
            return `${yearStr}-${monthStr}-${dayStr}`;
          }
        }
      }
    } catch (e) {
      console.warn('[EditVoucherComponent] Failed to parse date:', dateStr, e);
    }
    
    return '';
  }

  /**
   * Check if date string is in valid format for input type="date" (yyyy-MM-dd)
   */
  private isValidDateInput(dateStr: string): boolean {
    if (!dateStr) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateStr);
  }

  private extractDiscountValue(value: string): string {
    // Extract discount value from string like "30% off" or "100,000 VND off"
    if (value.includes('%')) {
      const match = value.match(/(\d+)%/);
      return match ? match[1] : '';
    } else if (value.includes('VND') || value.includes('đ')) {
      const match = value.match(/([\d,]+)/);
      return match ? match[1].replace(/,/g, '') : '';
    }
    return '';
  }

  private extractMaxDiscount(value: string): string {
    // Extract max discount from string like "30% off (Max 200k)"
    const match = value.match(/Max\s+([\d,]+[kK]?)/i);
    if (match) {
      let max = match[1].replace(/,/g, '');
      if (max.toLowerCase().endsWith('k')) {
        max = (parseInt(max) * 1000).toString();
      }
      return max;
    }
    return '';
  }

  private extractTotalUsageLimit(usage: string): string {
    // Extract total usage limit from string like "150/500"
    const match = usage.match(/\/(\d+)/);
    return match ? match[1] : '';
  }

  generateRandomCode(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.voucherForm.patchValue({ code });
  }

  updateVoucher(): void {
    if (this.voucherForm.valid) {
      this.isLoading = true;
      this.message = null;

      this.voucherService.updateVoucher(this.voucherId, this.voucherForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = { type: 'success', text: this.i18nService.translate('voucherManagement.editVoucher.messages.updateSuccess') };

          setTimeout(() => {
            this.router.navigate(['/dashboard/promotion/vouchers']);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message = { type: 'error', text: this.i18nService.translate('voucherManagement.editVoucher.messages.updateError') };
          console.error('Error updating voucher:', error);
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
        this.message = { type: 'error', text: this.i18nService.translate('voucherManagement.editVoucher.messages.segmentExists') };
      }
    }
  }

  getSelectedSegmentLabel(): string {
    const selectedValue = this.voucherForm.get('targetAudience')?.value;
    const segment = this.studentSegments.find(s => s.value === selectedValue);
    return segment ? segment.label : this.i18nService.translate('voucherManagement.editVoucher.fields.selectStudentSegment');
  }
}
