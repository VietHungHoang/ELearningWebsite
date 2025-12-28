import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./course-management.component').then(m => m.CourseManagementComponent),
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent) },
      { path: 'subjects', loadComponent: () => import('./subject-list/subject-list.component').then(m => m.SubjectListComponent) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
