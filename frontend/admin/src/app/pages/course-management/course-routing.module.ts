import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./course-management.component').then(m => m.CourseManagementComponent),
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', loadComponent: () => import('./course-list/course-list.component').then(m => m.CourseListComponent) },
      { path: 'categories', loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent) },
      { path: 'approval', loadComponent: () => import('./course-approval/course-approval.component').then(m => m.CourseApprovalComponent) },
      { path: ':id', loadComponent: () => import('./course-details/course-details.component').then(m => m.CourseDetailsComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
