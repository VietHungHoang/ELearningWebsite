import { Component } from '@angular/core';

@Component({
    selector: 'app-bottom-tooltip',
    imports: [],
    templateUrl: './bottom-tooltip.component.html',
    styleUrl: './bottom-tooltip.component.scss'
})
export class BottomTooltipComponent {

    tooltipVisible = false;  
    tooltipText: string = ''; 

    showTooltip(): void {
        this.tooltipText = 'Hey, Hello World!';  
        this.tooltipVisible = true;  
    }

    hideTooltip(): void {
        this.tooltipVisible = false;  
    }

}