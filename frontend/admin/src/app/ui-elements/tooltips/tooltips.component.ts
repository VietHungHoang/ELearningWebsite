import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomTooltipComponent } from './bottom-tooltip/bottom-tooltip.component';

@Component({
    selector: 'app-tooltips',
    imports: [RouterLink, BottomTooltipComponent],
    templateUrl: './tooltips.component.html',
    styleUrl: './tooltips.component.scss'
})
export class TooltipsComponent {

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