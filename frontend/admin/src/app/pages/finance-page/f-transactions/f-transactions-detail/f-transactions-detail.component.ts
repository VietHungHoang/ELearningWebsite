import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-f-transactions-detail',
    imports: [RouterLink, CommonModule],
    templateUrl: './f-transactions-detail.component.html',
    styleUrl: './f-transactions-detail.component.scss'
})
export class FTransactionsDetailComponent implements OnInit {
    transactionId: string | null = null;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {

        this.route.params.subscribe(params => {
            this.transactionId = params['id'];
        });
    }
}
