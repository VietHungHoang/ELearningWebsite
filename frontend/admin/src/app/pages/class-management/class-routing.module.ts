import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassManagementComponent } from './class-management.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassDetailsComponent } from './class-details/class-details.component';
import { ReviewManagementComponent } from './review-management/review-management.component';

const routes: Routes = [
  {
    path: '',
    component: ClassManagementComponent,
    children: [
      { path: '', component: ClassListComponent },
      { path: 'review-management', component: ReviewManagementComponent },
      { path: ':id', component: ClassDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule {}
