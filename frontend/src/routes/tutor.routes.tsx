import CreateCoursePage from "../pages/tutor/CreateCoursePage";
import InstructorDashboardPage from "../pages/tutor/InstructorDashboardPage";

const prefix = "/instructor";

const instructorRoutes = [
  { path: `${prefix}/dashboard`, element: <InstructorDashboardPage /> },
  { path: `${prefix}/courses/create`, element: <CreateCoursePage />},
];

export default instructorRoutes;