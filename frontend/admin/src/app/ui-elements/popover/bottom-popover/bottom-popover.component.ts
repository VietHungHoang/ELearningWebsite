import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-bottom-popover',
    imports: [],
    templateUrl: './bottom-popover.component.html',
    styleUrl: './bottom-popover.component.scss'
})
export class BottomPopoverComponent {

    popoverVisible = false;  
    popoverText: string = ''; 

    togglePopover(event: MouseEvent, text: string): void {

        event.stopPropagation();
        this.popoverText = text;  
        this.popoverVisible = !this.popoverVisible;  
    }

    @HostListener('document:click', ['$event'])
    closePopover(event: MouseEvent): void {
        const button = document.querySelector('.custom-popover') as HTMLElement;
        if (!button.contains(event.target as Node)) {
            this.popoverVisible = false; 
        }
    }

}