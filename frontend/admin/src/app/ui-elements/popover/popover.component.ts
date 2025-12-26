import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomPopoverComponent } from './bottom-popover/bottom-popover.component';

@Component({
    selector: 'app-popover',
    imports: [RouterLink, BottomPopoverComponent],
    templateUrl: './popover.component.html',
    styleUrl: './popover.component.scss'
})
export class PopoverComponent {

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