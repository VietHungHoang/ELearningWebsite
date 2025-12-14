import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
        <!-- Delete Confirmation Modal -->
        <div class="add-new-popup z-[999] fixed transition-all inset-0 overflow-x-hidden overflow-y-auto lg:py-[20px]" [class.active]="isOpen">
            <div class="popup-dialog flex transition-all max-w-[450px] min-h-full items-center mx-auto">
                <div class="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                    <div class="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                        <div class="trezo-card-title">
                            <h5 class="!mb-0">
                                {{ title }}
                            </h5>
                        </div>
                        <div class="trezo-card-subtitle">
                            <button type="button" class="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500" (click)="onCancel()">
                                <i class="ri-close-fill"></i>
                            </button>
                        </div>
                    </div>
                    <div class="trezo-card-content pb-[20px] md:pb-[25px] text-center">
                        <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
                            {{ message }}
                        </p>
                    </div>
                    <div class="trezo-card-footer flex items-center justify-end -mx-[20px] md:-mx-[25px] px-[20px] md:px-[25px] pt-[20px] md:pt-[25px] border-t border-gray-100 dark:border-[#172036]">
                        <button class="inline-block py-[10px] px-[30px] bg-primary-300 text-white transition-all hover:bg-primary-200 rounded-md border border-primary-400 hover:border-primary-300" type="button" (click)="onCancel()">
                            {{ cancelText }}
                        </button>
                        <button class="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 ltr:ml-[10px] rtl:mr-[10px]" type="button" (click)="onConfirm()">
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class ConfirmDialogComponent {
    @Input() isOpen = false;
    @Input() title = 'Xác Nhận';
    @Input() message = 'Bạn có chắc chắn muốn thực hiện hành động này?';
    @Input() cancelText = 'Hủy';
    @Input() confirmText = 'Xóa';

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }

}
