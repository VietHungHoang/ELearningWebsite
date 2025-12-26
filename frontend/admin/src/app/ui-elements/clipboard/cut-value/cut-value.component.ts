import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cut-value',
    imports: [NgClass, FormsModule],
    templateUrl: './cut-value.component.html',
    styleUrl: './cut-value.component.scss'
})
export class CutValueComponent {

    copyText: string = '#annual90conference2025'; 
    copied: boolean = false; 
    buttonText: string = 'Cut'; 

    cutToClipboard(input: HTMLInputElement): void {
        if (!input) return;

        input.select();
        input.setSelectionRange(0, 99999); 

        navigator.clipboard
        .writeText(input.value)
        .then(() => {

            input.value = ''; 
            this.copyText = ''; 
            this.copied = true; 
            this.buttonText = ''; 

            setTimeout(() => {
                this.copied = false; 
                this.buttonText = 'Cut'; 
            }, 2000);
        })
        .catch((err) => {
            console.error('Error cutting text: ', err);
        });
    }

}