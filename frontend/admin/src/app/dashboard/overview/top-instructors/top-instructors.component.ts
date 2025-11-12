import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Instructor {
    rank: number;
    name: string;
    rating: number;
    revenue: string;
    hours: number;
    students: number;
    image: string;
}

@Component({
    selector: 'app-top-instructors',
    imports: [CommonModule],
    templateUrl: './top-instructors.component.html',
    styleUrl: './top-instructors.component.scss'
})
export class TopInstructorsComponent {

    isCardHeaderOpen = false;

    // Pagination properties
    currentPage = 1;
    itemsPerPage = 5;
    totalItems = 0;

    instructors: Instructor[] = [
        {
            rank: 1,
            name: 'Nguyễn Văn A',
            rating: 4.9,
            revenue: '150.000.000đ',
            hours: 150,
            students: 20,
            image: 'images/users/user13.jpg'
        },
        {
            rank: 2,
            name: 'Trần Thị B',
            rating: 4.8,
            revenue: '120.000.000đ',
            hours: 100,
            students: 35,
            image: 'images/users/user16.jpg'
        },
        {
            rank: 3,
            name: 'Lê Văn C',
            rating: 4.5,
            revenue: '90.000.000đ',
            hours: 180,
            students: 10,
            image: 'images/users/user17.jpg'
        },
        {
            rank: 4,
            name: 'Phạm Thị D',
            rating: 4.2,
            revenue: '85.000.000đ',
            hours: 95,
            students: 15,
            image: 'images/users/user18.jpg'
        },
        {
            rank: 5,
            name: 'Hoàng Văn E',
            rating: 4.0,
            revenue: '75.000.000đ',
            hours: 80,
            students: 12,
            image: 'images/users/user19.jpg'
        },
        {
            rank: 6,
            name: 'Nguyễn Thị F',
            rating: 3.8,
            revenue: '65.000.000đ',
            hours: 70,
            students: 8,
            image: 'images/users/user20.jpg'
        }
    ];

    constructor() {
        this.totalItems = this.instructors.length;
    }

    get paginatedInstructors(): Instructor[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.instructors.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    get startItem(): number {
        return (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    get endItem(): number {
        const end = this.currentPage * this.itemsPerPage;
        return end > this.totalItems ? this.totalItems : end;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    toggleCardHeaderMenu() {
        this.isCardHeaderOpen = !this.isCardHeaderOpen;
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isCardHeaderOpen = false;
        }
    }

}
