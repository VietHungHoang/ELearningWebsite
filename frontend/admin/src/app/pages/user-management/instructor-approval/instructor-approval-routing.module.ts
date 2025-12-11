import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorApprovalComponent } from './instructor-approval.component';
import { InstructorApprovalDetailComponent } from '../instructor-approval-detail/instructor-approval-detail.component';

const routes: Routes = [
    {
        path: '',
        component: InstructorApprovalComponent
    },
    {
        path: 'profile/:id',
        component: InstructorApprovalDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InstructorApprovalRoutingModule {}
