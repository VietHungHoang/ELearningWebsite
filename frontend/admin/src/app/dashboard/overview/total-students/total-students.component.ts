import { Component } from '@angular/core';
import { TotalStudentsService } from './total-students.service';

@Component({
  selector: 'app-total-students',
  standalone: true,
  imports: [],
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
