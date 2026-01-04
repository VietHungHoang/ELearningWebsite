import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorApprovalComponent } from './tutor-approval.component';
import { TutorApprovalDetailComponent } from '../instructor-approval-detail/instructor-approval-detail.component';

const routes: Routes = [
    {
        path: '',
        component: TutorApprovalComponent
    },
    {
        path: 'profile/:id',
        component: TutorApprovalDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TutorApprovalRoutingModule {}
