import { Hono } from "hono";
import projectController from "../controllers/project.controller";

const projectRoute = new Hono();

projectRoute.get("/", projectController.listProjects)
projectRoute.get("/:id", projectController.getProjectById)
projectRoute.post("/:id", projectController.updateProject)
projectRoute.post("/", projectController.createProject)
projectRoute.delete("/:id", projectController.deleteProject)

export default projectRoute