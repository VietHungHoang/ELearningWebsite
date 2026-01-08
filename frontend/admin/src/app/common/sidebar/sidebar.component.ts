import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { CategoryService } from '../../services/category.service';

interface MenuItem {
    title: string;
    subItems?: MenuItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [NgScrollbarModule, RouterLinkActive, RouterLink, NgClass, TranslatePipe],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    constructor(
        private router: Router,
        private categoryService: CategoryService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        // Không load subjects ở đây, để subject-list component tự load khi cần
    }

    // Toggle/close sidebar
    toggleSidebar(): void {
        this.renderer.addClass(document.body, 'sidebar-hidden');
    }

    openSectionIndex: number = -1;
    openSectionIndex2: number = -1;
    openSectionIndex3: number = -1;
    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
        }
    }
    toggleSection2(index: number): void {
        if (this.openSectionIndex2 === index) {
            this.openSectionIndex2 = -1;
        } else {
            this.openSectionIndex2 = index;
        }
    }
    toggleSection3(index: number): void {
        if (this.openSectionIndex3 === index) {
            this.openSectionIndex3 = -1;
        } else {
            this.openSectionIndex3 = index;
        }
    }
    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }
    isSectionOpen2(index: number): boolean {
        return this.openSectionIndex2 === index;
    }
    isSectionOpen3(index: number): boolean {
        return this.openSectionIndex3 === index;
    }

    navigateToCourseManagement(): void {
        this.router.navigate(['/dashboard/category-subject-management/subjects']);
    }

}
