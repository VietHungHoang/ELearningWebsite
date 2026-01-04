import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (isVisible) {
            <div class="fixed top-[20px] right-[20px] z-[9999] transition-all duration-300" 
                 [class.opacity-0]="!isVisible"
                 [class.opacity-100]="isVisible">
                <div [class]="'min-w-[300px] max-w-[500px] p-[16px] rounded-lg shadow-lg border flex items-start gap-[12px] ' + getToastClass()">
                    <i [class]="'material-symbols-outlined text-xl ' + getIconClass()">
                        {{ getIcon() }}
                    </i>
                    <div class="flex-1">
                        <p class="font-medium text-sm mb-[4px]">{{ title }}</p>
                        <p class="text-sm opacity-90">{{ message }}</p>
                    </div>
                    <button 
                        type="button"
                        class="text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
                        (click)="dismiss()">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>
        }
    `,
    styles: [``]
})
export class ToastComponent {
    @Input() isVisible = false;
    @Input() type: ToastType = 'info';
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() duration: number = 3000; // Auto dismiss after 3 seconds

    private timeoutId: any;

    ngOnInit(): void {
        if (this.duration > 0) {
            this.timeoutId = setTimeout(() => {
                this.dismiss();
            }, this.duration);
        }
    }

    ngOnDestroy(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    dismiss(): void {
        this.isVisible = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getToastClass(): string {
        switch (this.type) {
            case 'success':
                return 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800';
            case 'error':
                return 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-800';
            case 'warning':
                return 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-800';
            case 'info':
            default:
                return 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800';
        }
    }

    getIconClass(): string {
        return '';
    }

    getIcon(): string {
        switch (this.type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'info';
        }
    }
}

