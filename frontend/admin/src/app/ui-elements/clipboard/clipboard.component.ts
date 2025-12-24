import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CutValueComponent } from './cut-value/cut-value.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-clipboard',
    imports: [RouterLink, NgClass, FormsModule, CutValueComponent],
    templateUrl: './clipboard.component.html',
    styleUrl: './clipboard.component.scss'
})
export class ClipboardComponent {

    copyText: string = '#annual90conference2025'; 
    copied: boolean = false; 
    buttonText: string = 'Copy'; 
    copyToClipboard(input: HTMLInputElement): void {
        if (!input) return;

        input.select();
        input.setSelectionRange(0, 99999); 
        navigator.clipboard
        .writeText(input.value)
        .then(() => {
            this.copied = true; 
            this.buttonText = ''; 
            setTimeout(() => {
                this.copied = false; 
                this.buttonText = 'Copy'; 
            }, 2000);
        })
        .catch((err) => {
            console.error('Error copying text: ', err);
        });
    }

}