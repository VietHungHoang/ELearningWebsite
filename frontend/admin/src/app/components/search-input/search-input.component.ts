import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <form class="relative" [ngClass]="width">
            <label class="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i class="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
                type="text"
                [placeholder]="placeholder"
                [(ngModel)]="searchValue"
                (ngModelChange)="onSearchInput($event)"
                (keyup.enter)="onSearch()"
                class="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                name="search"
            >
        </form>
    `,
    styles: [``]
})
export class SearchInputComponent implements OnDestroy {
    @Input() placeholder = 'Search by name...';
    @Input() width = 'sm:w-[265px]';
    @Input() debounceTime = 300;

    @Output() search = new EventEmitter<string>();
    @Output() clear = new EventEmitter<void>();

    searchValue = '';
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor() {

    }

    onSearchInput(value: string): void {
        this.searchValue = value;

    }

    onSearch(): void {
        this.search.emit(this.searchValue);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    clearSearch(): void {
        this.searchValue = '';
        this.clear.emit();
    }
}
