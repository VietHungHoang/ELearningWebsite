import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToggleService } from './toggle.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    isSidebarVisible = true;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public toggleService: ToggleService,
        private renderer: Renderer2
    ) {}

    ngOnInit(): void {

        this.toggleService.initializeTheme();
    }

    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    toggleDirection() {
        this.toggleService.toggleDirection();
    }

    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;

        if (this.isSidebarVisible) {
            this.renderer.removeClass(document.body, 'sidebar-hidden');
        } else {
            this.renderer.addClass(document.body, 'sidebar-hidden');
        }
    }

    buttonStates: { [key: string]: boolean } = {
        connectedAppsMenuBtn: false,
        languageMenuButton: false,
        currencyMenuButton: false,
        notificationsMenuBtn: false,
        profileMenuBtn: false,
        settingsMenuBtn: false
    };
    toggleClass(buttonId: string) {

        const isCurrentlyActive = this.buttonStates[buttonId];

        for (const key in this.buttonStates) {
            this.buttonStates[key] = false;
        }

        this.buttonStates[buttonId] = !isCurrentlyActive;
    }

    isFullscreen: boolean = false;
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {

            document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
            document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));
            document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this));
            document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this));
        }
    }
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
        }
    }
    openFullscreen() {
        if (isPlatformBrowser(this.platformId)) {
            const element = document.documentElement as HTMLElement & {
                mozRequestFullScreen?: () => Promise<void>;
                webkitRequestFullscreen?: () => Promise<void>;
                msRequestFullscreen?: () => Promise<void>;
            };
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }
    closeFullscreen() {
        if (isPlatformBrowser(this.platformId)) {
            const doc = document as Document & {
                mozCancelFullScreen?: () => Promise<void>;
                webkitExitFullscreen?: () => Promise<void>;
                msExitFullscreen?: () => Promise<void>;
            };
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
        }
    }
    onFullscreenChange() {
        if (isPlatformBrowser(this.platformId)) {
            const doc = document as Document & {
                webkitFullscreenElement?: Element;
                mozFullScreenElement?: Element;
                msFullscreenElement?: Element;
            };
            this.isFullscreen = !!(document.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
        }
    }

}
