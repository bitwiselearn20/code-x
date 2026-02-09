import type { Response } from "express";
import apiResponse from "../utils/apiResponse";

class UserController {
  async updateUserInfo(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeUpload(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfilePicUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfileBannerUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getFullProfile(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addExperience(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateExperience(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
