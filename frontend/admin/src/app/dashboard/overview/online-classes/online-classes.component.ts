import { Component } from '@angular/core';
import { OnlineClassesService } from './online-classes.service';

@Component({
  selector: 'app-online-classes',
  standalone: true,
  imports: [],
  templateUrl: './online-classes.component.html',
  styleUrl: './online-classes.component.scss'
})
export class OnlineClassesComponent {

  constructor(
    private onlineClassesService: OnlineClassesService
  ) {}

  ngOnInit(): void {
    this.onlineClassesService.loadChart();
  }

}
