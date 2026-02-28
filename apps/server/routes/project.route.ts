import { Router } from "express";
const projectRouter = Router();
import projectController from "../controller/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

projectRouter.post(
  "/create-project",
  authMiddleware,
  projectController.createProject,
);
projectRouter.put(
  "/update-project/:id",
  authMiddleware,
  projectController.updateProject,
);
projectRouter.put(
  "/update-cover-image/:id",
  authMiddleware,
  upload.single("coverImage"),
  projectController.updateCoverImage,
);
projectRouter.delete(
  "/delete-project/:id",
  authMiddleware,
  projectController.deleteProject,
);
projectRouter.get(
  "/get-project/:id",
  authMiddleware,
  projectController.getProjectById,
);
projectRouter.get(
  "/get-all-projects",
  authMiddleware,
  projectController.getAllUserProjects,
);
projectRouter.get(
  "/get-all-projects-by-batch",
  authMiddleware,
  projectController.getUserProjectsByBatch,
);

export default projectRouter;
