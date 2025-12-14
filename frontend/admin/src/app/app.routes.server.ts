import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/course-management/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/user-management/instructor-detail/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/user-management/learner-detail/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/finance-page/transactions/:id',
    renderMode: RenderMode.Server
  }
];
