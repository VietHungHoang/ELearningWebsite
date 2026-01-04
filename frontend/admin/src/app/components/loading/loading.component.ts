import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
        <div class="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center py-[50px]">
            <i class="material-symbols-outlined !text-[48px] animate-spin text-primary-500 dark:text-primary-400 mb-[15px] block">
                autorenew
            </i>
            <p class="text-gray-500 dark:text-gray-400">
                {{ message || ('common.loading' | translate) }}
            </p>
        </div>
    `,
    styles: [`
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `]
})
export class LoadingComponent {
    @Input() message?: string;
}

