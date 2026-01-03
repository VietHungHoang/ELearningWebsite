import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/translate.pipe';

export type ConfirmDialogType = 'danger' | 'warning' | 'info' | 'success';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
        <!-- Confirmation Modal -->
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
                        <button [class]="'inline-block py-[10px] px-[30px] text-white transition-all rounded-md border ltr:mr-[10px] rtl:ml-[10px] ' + getCancelButtonClass()" type="button" (click)="onCancel()">
                            {{ cancelText }}
                        </button>
                        <button [class]="'inline-block py-[10px] px-[30px] text-white transition-all rounded-md border ' + getConfirmButtonClass()" type="button" (click)="onConfirm()">
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
    @Input() title: string = 'Xác Nhận';
    @Input() message: string = 'Bạn có chắc chắn muốn thực hiện hành động này?';
    @Input() cancelText: string = 'Hủy';
    @Input() confirmText: string = 'Xác Nhận';
    @Input() type: ConfirmDialogType = 'info';

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }

    getConfirmButtonClass(): string {
        switch (this.type) {
            case 'danger':
                return 'bg-danger-500 hover:bg-danger-400 border-danger-500 hover:border-danger-400';
            case 'warning':
                return 'bg-warning-500 hover:bg-warning-400 border-warning-500 hover:border-warning-400';
            case 'success':
                return 'bg-success-600 hover:bg-success-700 border-success-600 hover:border-success-700';
            case 'info':
            default:
                return 'bg-success-600 hover:bg-success-700 border-success-600 hover:border-success-700';
        }
    }

    getCancelButtonClass(): string {
        return 'bg-gray-300 hover:bg-gray-200 border-gray-400 hover:border-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300';
    }
}
