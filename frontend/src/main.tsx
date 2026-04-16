import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);