import { createBrowserRouter } from "react-router-dom";
import instructorRoutes from "./tutor.routes";

const routes = [
    ...instructorRoutes, 
]

export const router = createBrowserRouter(routes);

