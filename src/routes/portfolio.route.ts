import { Hono } from "hono";
import portfolioController from "../controllers/portfolio.controller";

const portfolioRoute = new Hono();

portfolioRoute.get("/", portfolioController.getAll)
portfolioRoute.post("/update", portfolioController.updateDetail)

// education
portfolioRoute.post("/education/create", portfolioController.addEducation)
portfolioRoute.post("/education/:id/update", portfolioController.updateEducation)
portfolioRoute.delete("/education/:id", portfolioController.deleteEducation)

// experience
portfolioRoute.post("/experience/create", portfolioController.addExperience)
portfolioRoute.post("/experience/:id/update", portfolioController.updateExperience)
portfolioRoute.delete("/experience/:id", portfolioController.deleteExperience)

// skills
portfolioRoute.post("/skills/create", portfolioController.addSkill)
portfolioRoute.post("/skills/:id/update", portfolioController.updateSkill)
portfolioRoute.delete("/skills/:id", portfolioController.deleteSkill)

// services
portfolioRoute.post("/services/create", portfolioController.addServices)
portfolioRoute.post("/services/:id/update", portfolioController.updateServices)
portfolioRoute.delete("/services/:id", portfolioController.deleteServices)

export default portfolioRoute