import { Routes } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { AppsComponent } from './apps/apps.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { EventsGridComponent } from './pages/events-page/events-grid/events-grid.component';
import { EventsListComponent } from './pages/events-page/events-list/events-list.component';
import { EventDetailsComponent } from './pages/events-page/event-details/event-details.component';
import { CreateAnEventComponent } from './pages/events-page/create-an-event/create-an-event.component';
import { EditAnEventComponent } from './pages/events-page/edit-an-event/edit-an-event.component';
import { StarterComponent } from './starter/starter.component';
import { IconsComponent } from './icons/icons.component';
import { MaterialSymbolsComponent } from './icons/material-symbols/material-symbols.component';
import { RemixiconComponent } from './icons/remixicon/remixicon.component';
import { UiElementsComponent } from './ui-elements/ui-elements.component';
import { AlertsComponent } from './ui-elements/alerts/alerts.component';
import { AvatarsComponent } from './ui-elements/avatars/avatars.component';
import { AccordionComponent } from './ui-elements/accordion/accordion.component';
import { BadgesComponent } from './ui-elements/badges/badges.component';
import { ButtonsComponent } from './ui-elements/buttons/buttons.component';
import { BreadcrumbComponent } from './ui-elements/breadcrumb/breadcrumb.component';
import { ClipboardComponent } from './ui-elements/clipboard/clipboard.component';
import { DropdownsComponent } from './ui-elements/dropdowns/dropdowns.component';
import { ImagesComponent } from './ui-elements/images/images.component';
import { ModalComponent } from './ui-elements/modal/modal.component';
import { PaginationComponent } from './ui-elements/pagination/pagination.component';
import { TooltipsComponent } from './ui-elements/tooltips/tooltips.component';
import { PopoverComponent } from './ui-elements/popover/popover.component';
import { ProgressComponent } from './ui-elements/progress/progress.component';
import { TabsComponent } from './ui-elements/tabs/tabs.component';
import { TypographyComponent } from './ui-elements/typography/typography.component';
import { VideosComponent } from './ui-elements/videos/videos.component';
import { ChartsComponent } from './charts/charts.component';
import { LineChartsComponent } from './charts/line-charts/line-charts.component';
import { AreaChartsComponent } from './charts/area-charts/area-charts.component';
import { ColumnChartsComponent } from './charts/column-charts/column-charts.component';
import { MixedChartsComponent } from './charts/mixed-charts/mixed-charts.component';
import { RadialbarChartsComponent } from './charts/radialbar-charts/radialbar-charts.component';
import { RadarChartsComponent } from './charts/radar-charts/radar-charts.component';
import { PieChartsComponent } from './charts/pie-charts/pie-charts.component';
import { PolarChartsComponent } from './charts/polar-charts/polar-charts.component';
import { MoreChartsComponent } from './charts/more-charts/more-charts.component';
import { TablesComponent } from './tables/tables.component';
import { FormsComponent } from './forms/forms.component';
import { InputSelectComponent } from './forms/input-select/input-select.component';
import { CheckboxesRadiosComponent } from './forms/checkboxes-radios/checkboxes-radios.component';
import { RichTextEditorComponent } from './forms/rich-text-editor/rich-text-editor.component';
import { FileUploaderComponent } from './forms/file-uploader/file-uploader.component';
import { TimelinePageComponent } from './pages/timeline-page/timeline-page.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { PaymentMethodComponent } from './settings/payment-method/payment-method.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FinancePageComponent } from './pages/finance-page/finance-page.component';
import { FRevenueDashboardComponent } from './pages/finance-page/f-revenue-dashboard/f-revenue-dashboard.component';
import { FTransactionsComponent } from './pages/finance-page/f-transactions/f-transactions.component';
import { FTransactionsDetailComponent } from './pages/finance-page/f-transactions/f-transactions-detail/f-transactions-detail.component';
import { FPayoutComponent } from './pages/finance-page/f-payout/f-payout.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { PromotionManagementComponent } from './pages/promotion-management/promotion-management.component';
import { VouchersComponent } from './pages/promotion-management/vouchers/vouchers.component';
import { CreateVoucherComponent } from './pages/promotion-management/vouchers/create-voucher/create-voucher.component';
import { EditVoucherComponent } from './pages/promotion-management/vouchers/edit-voucher/edit-voucher.component';
export const routes: Routes = [
        { path: '', redirectTo: 'dashboard/overview', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: OverviewComponent},
            {
                path: 'apps',
                component: AppsComponent,
                children: []
            },
            {
                path: 'course-management',
                loadChildren: () => import('./pages/course-management/course-routing.module').then(m => m.CourseRoutingModule)
            },
            {
                path: 'class-management',
                loadChildren: () => import('./pages/class-management/class-routing.module').then(m => m.ClassRoutingModule)
            },
            {
                path: 'user-management',
                component: UserManagementComponent,
                children: [
                    {path: '', redirectTo: 'instructor-list', pathMatch: 'full'},
                    {path: 'instructors', redirectTo: 'instructor-list', pathMatch: 'full'},
                    {path: 'instructor-list', loadChildren: () => import('./pages/user-management/instructor-list/instructor-list.module').then(m => m.InstructorListModule)},
                    {path: 'instructor-detail/:id', loadChildren: () => import('./pages/user-management/instructor-detail/instructor-detail.module').then(m => m.InstructorDetailModule)},
                    {path: 'instructor-approval', loadChildren: () => import('./pages/user-management/instructor-approval/instructor-approval.module').then(m => m.InstructorApprovalModule)},
                    {path: 'learners', redirectTo: 'learner-list', pathMatch: 'full'},
                    {path: 'learner-list', loadChildren: () => import('./pages/user-management/learner-list/learner-list.module').then(m => m.LearnerListModule)},
                    {path: 'learner-detail/:id', loadChildren: () => import('./pages/user-management/learner-detail/learner-detail.module').then(m => m.LearnerDetailModule)}
                ]
            },
            {
                path: 'finance-page',
                component: FinancePageComponent,
                children: [
                    {path: '', redirectTo: 'revenue-dashboard', pathMatch: 'full'},
                    {path: 'revenue-dashboard', component: FRevenueDashboardComponent},
                    {path: 'transactions', component: FTransactionsComponent},
                    {path: 'transactions/:id', component: FTransactionsDetailComponent},
                    {path: 'payout', component: FPayoutComponent}
                ]
            },
            {
                path: 'promotion',
                component: PromotionManagementComponent,
                children: [
                    {path: '', redirectTo: 'vouchers', pathMatch: 'full'},
                    {path: 'vouchers', component: VouchersComponent},
                    {path: 'vouchers/create', component: CreateVoucherComponent},
                    {path: 'vouchers/edit/:id', component: EditVoucherComponent}
                ]
            },
            {
                path: 'events',
                component: EventsPageComponent,
                children: [
                    {path: '', component: EventsGridComponent},
                    {path: 'events-list', component: EventsListComponent},
                    {path: 'event-details', component: EventDetailsComponent},
                    {path: 'create-an-event', component: CreateAnEventComponent},
                    {path: 'edit-an-event', component: EditAnEventComponent}
                ]
            },
            {path: 'starter', component: StarterComponent},
            {
                path: 'icons',
                component: IconsComponent,
                children: [
                    {path: '', component: MaterialSymbolsComponent},
                    {path: 'remixicon', component: RemixiconComponent}
                ]
            },
            {
                path: 'ui-kit',
                component: UiElementsComponent,
                children: [
                    {path: '', component: AlertsComponent},
                    {path: 'avatars', component: AvatarsComponent},
                    {path: 'accordion', component: AccordionComponent},
                    {path: 'badges', component: BadgesComponent},
                    {path: 'buttons', component: ButtonsComponent},
                    {path: 'breadcrumb', component: BreadcrumbComponent},
                    {path: 'clipboard', component: ClipboardComponent},
                    {path: 'dropdowns', component: DropdownsComponent},
                    {path: 'images', component: ImagesComponent},
                    {path: 'modal', component: ModalComponent},
                    {path: 'pagination', component: PaginationComponent},
                    {path: 'tooltips', component: TooltipsComponent},
                    {path: 'popover', component: PopoverComponent},
                    {path: 'progress', component: ProgressComponent},
                    {path: 'tabs', component: TabsComponent},
                    {path: 'typography', component: TypographyComponent},
                    {path: 'videos', component: VideosComponent}
                ]
            },
            {
                path: 'charts',
                component: ChartsComponent,
                children: [
                    {path: '', component: LineChartsComponent},
                    {path: 'area', component: AreaChartsComponent},
                    {path: 'column', component: ColumnChartsComponent},
                    {path: 'mixed', component: MixedChartsComponent},
                    {path: 'radialbar', component: RadialbarChartsComponent},
                    {path: 'radar', component: RadarChartsComponent},
                    {path: 'pie', component: PieChartsComponent},
                    {path: 'polar', component: PolarChartsComponent},
                    {path: 'more', component: MoreChartsComponent}
                ]
            },
            {path: 'tables', component: TablesComponent},
            {
                path: 'forms',
                component: FormsComponent,
                children: [
                    {path: '', component: InputSelectComponent},
                    {path: 'checkboxes-radios', component: CheckboxesRadiosComponent},
                    {path: 'rich-text-editor', component: RichTextEditorComponent},
                    {path: 'file-uploader', component: FileUploaderComponent}
                ]
            },
            {path: 'timeline', component: TimelinePageComponent},
            {path: 'pricing', component: PricingPageComponent},
            {path: 'search', component: SearchPageComponent},
            {path: 'internal-error', component: InternalErrorComponent},
            {
                path: 'settings',
                component: SettingsComponent,
                children: [
                    {path: '', redirectTo: 'change-password', pathMatch: 'full'},
                    {path: 'change-password', component: ChangePasswordComponent},
                    {path: 'payment-method', component: PaymentMethodComponent}
                ]
            }
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'logout', component: LogoutComponent}
        ]
    },
    {path: 'coming-soon', component: ComingSoonComponent},

    {path: '**', component: NotFoundComponent} 
];
