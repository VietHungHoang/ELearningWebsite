import { Component } from '@angular/core';
import { TotalStudentsService } from './total-students.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-total-students',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './total-students.component.html',
  styleUrl: './total-students.component.scss'
})
export class TotalStudentsComponent {

  constructor(
    private totalStudentsService: TotalStudentsService
  ) {}

  ngOnInit(): void {
    this.totalStudentsService.loadChart();
  }

}
