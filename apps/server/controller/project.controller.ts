import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { projectPayload } from "../utils/type";
import cloudinaryService from "../service/Cloudinary.service";

class ProjectController {
  async createProject(req: Request<{}, {}, projectPayload>, res: Response) {
    try {
      const data = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const title = data.title?.trim();
      const description = data.description?.trim();
      const projectUrl = data.projectUrl?.trim();
      const repositoryUrl = data.repositoryUrl?.trim();

      if (!title || !description) {
        return res
          .status(400)
          .json(apiResponse(400, "Title and description are required", null));
      }

      const skills = data.skills?.map((skill) => skill.trim());

      // TODO: Upload file to cloudinary.
      let coverImageUrl = "";

      const newProject = await prismaClient.projects.create({
        data: {
          title,
          description,
          projectUrl,
          coverImage: coverImageUrl,
          repositoryUrl,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          endDate: data.endDate ? new Date(data.endDate) : new Date(),
          isOngoing: data.isOngoing,
          visibility: data.visibility,
          publishStatus: data.publishStatus,
          publishTime: data.publishTime
            ? new Date(data.publishTime)
            : new Date(),
          skills,
          ownerId: userId,
        },
      });

      return res
        .status(201)
        .json(apiResponse(201, "Project Created!!", newProject));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async updateProject(req: Request<{ id: string }, {}, projectPayload>, res: Response,) {
    try {
      const id = req.params.id.trim();
      const data = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const existingProject = await prismaClient.projects.findUnique({
        where: { id },
      });

      if (!existingProject) {
        return res
          .status(404)
          .json(apiResponse(404, "Project not found", null));
      }

      if (existingProject.ownerId !== userId) {
        return res.status(403).json(apiResponse(403, "Forbidden", null));
      }

      const updatedProject = await prismaClient.projects.update({
        where: { id },
        data: {
          title: data.title?.trim() ?? existingProject.title,
          description: data.description?.trim() ?? existingProject.description,
          projectUrl: data.projectUrl?.trim() ?? existingProject.projectUrl,
          repositoryUrl:
            data.repositoryUrl?.trim() ?? existingProject.repositoryUrl,
          startDate: data.startDate
            ? new Date(data.startDate)
            : existingProject.startDate,
          endDate: data.endDate
            ? new Date(data.endDate)
            : existingProject.endDate,
          isOngoing: data.isOngoing ?? existingProject.isOngoing,
          visibility: data.visibility ?? existingProject.visibility,
          publishStatus: data.publishStatus ?? existingProject.publishStatus,
          publishTime: data.publishTime
            ? new Date(data.publishTime)
            : existingProject.publishTime,
          skills: data.skills
            ? data.skills.map((s) => s.trim())
            : existingProject.skills,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Project Updated!!", updatedProject));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

    async updateCoverImage(req: Request<{ id: string }>, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;
      if(!userId) throw new Error("User id not found");
      const projectId = req.params.id.trim();

      // Verify project ownership
      const existingProject = await prismaClient.projects.findUnique({
        where: { id: projectId },
      });

      if (!existingProject) {
        return res.status(404).json(apiResponse(404, "Project not found", null));
      }

      if (existingProject.ownerId !== userId) {
        return res.status(403).json(apiResponse(403, "Forbidden", null));
      }

      const uniqueFileName = `${file.originalname}-Cover-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Cover-Image", uniqueFileName);

      if(!fileLink) throw new Error("Upload failed");

      const updatedCover = await prismaClient.projects.update({
        where:{
          id: projectId,
        },
        data:{
          coverImage: fileLink,
        }
      });

      if(!updatedCover) throw new Error("Unable to update Cover Image");

      return res.status(200).json(
        apiResponse(200, "Updated Cover Image", updatedCover),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async deleteProject(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id.trim();
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const project = await prismaClient.projects.findUnique({
        where: { id },
        include: { projectMedias: true, tags: true },
      });

      if (!project) {
        return res
          .status(404)
          .json(apiResponse(404, "Project not found", null));
      }

      if (project.ownerId !== userId) {
        return res.status(403).json(apiResponse(403, "Forbidden", null));
      }

      await prismaClient.projects.delete({
        where: { id },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Project Deleted Successfully", null));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async getProjectById(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id.trim();

      const project = await prismaClient.projects.findUnique({
        where: { id },
      });

      if (!project) {
        return res
          .status(404)
          .json(apiResponse(404, "Project not found", null));
      }

      return res.status(200).json(apiResponse(200, "Success", project));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async getAllUserProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const projects = await prismaClient.projects.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(apiResponse(200, "Success", projects));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async getUserProjectsByBatch(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(apiResponse(401, "Unauthorized", null));
    }

    // Parse query params
    const offset = parseInt(req.query.offset as string) || 0;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 10, 50);

    const projects = await prismaClient.projects.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: pageSize,
    });

    return res.status(200).json(apiResponse(200, "Success", projects));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json(apiResponse(500, error.message, null));
  }
}
}

export default new ProjectController();
