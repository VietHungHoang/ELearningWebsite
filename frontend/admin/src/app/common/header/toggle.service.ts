import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
    private readonly themeKey = 'trezo_theme';
    private readonly directionKey = 'trezo_direction';
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);  
    }

    initializeTheme() {
        if (this.isBrowser) {
            // Force light mode - remove dark mode completely
            localStorage.removeItem(this.themeKey);
            const savedDirection = localStorage.getItem(this.directionKey) || 'ltr';

            this.applyTheme('light');
            this.applyDirection(savedDirection);
        }
    }

    toggleTheme() {
        // Disabled - always use light mode
        return;
    }

    toggleDirection() {
        if (!this.isBrowser) return;

        const currentDirection = localStorage.getItem(this.directionKey) === 'rtl' ? 'ltr' : 'rtl';
        this.applyDirection(currentDirection);
        localStorage.setItem(this.directionKey, currentDirection);
    }

    private applyTheme(theme: string) {
        if (this.isBrowser) {
            const htmlElement = document.documentElement;
            // Always force light mode - remove dark class if exists
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
        }
    }

    private applyDirection(direction: string) {
        if (this.isBrowser) {
            document.documentElement.setAttribute('dir', direction);
        }
    }
}