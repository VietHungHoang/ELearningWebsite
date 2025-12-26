import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-working-schedule',
    imports: [CarouselModule, NgClass],
    templateUrl: './working-schedule.component.html',
    styleUrl: './working-schedule.component.scss'
})
export class WorkingScheduleComponent {

    upcomingEventsSlides: OwlOptions = {
        items: 1,
		nav: false,
		loop: true,
		margin: 25,
		dots: true,
		autoplay: true,
		smartSpeed: 500,
		autoplayHoverPause: true,
		navText: [
			"<i class='ri-arrow-left-line'></i>",
			"<i class='ri-arrow-right-line'></i>"
		]
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    currentMonth!: number;
    currentYear!: number;
    currentDay!: number; 
    today!: { year: number; month: number; day: number }; 
    weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    daysInMonth: (number | null)[] = []; 
    ngOnInit() {
        const today = new Date();
        this.currentMonth = today.getMonth(); 
        this.currentYear = today.getFullYear();
        this.currentDay = today.getDate(); 
        this.today = {
            year: this.currentYear,
            month: this.currentMonth,
            day: this.currentDay
        };
        this.generateCalendar();
    }
    generateCalendar() {
        this.daysInMonth = [];
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const numberOfDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            this.daysInMonth.push(null); 
        }
        for (let i = 1; i <= numberOfDays; i++) {
            this.daysInMonth.push(i);
        }
    }
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.generateCalendar();
    }
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.generateCalendar();
    }
    isToday(day: number | null): boolean {
        if (day === null) return false;
        return (
            this.today.year === this.currentYear &&
            this.today.month === this.currentMonth &&
            this.today.day === day
        );
    }

}