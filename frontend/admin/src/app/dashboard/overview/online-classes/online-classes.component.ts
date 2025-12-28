import { Component } from '@angular/core';
import { OnlineClassesService } from './online-classes.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-online-classes',
  standalone: true,
  imports: [TranslatePipe],
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
