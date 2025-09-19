import InstructorDashboardPage from "../pages/tutor/InstructorDashboardPage";

const prefix = "/instructor";

const instructorRoutes = [
  { path: `${prefix}/dashboard`, element: <InstructorDashboardPage /> },
];

export default instructorRoutes;