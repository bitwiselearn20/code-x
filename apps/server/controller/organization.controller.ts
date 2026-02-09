import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";

class OrganizationController {
  async OrgProfilePicUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async OrgProfileBannerUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateOrganizationInfo(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addInterviewer(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateInterviewerDetail(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeInterviewer(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async InterviewerProfilePicUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async InterviewerProfileBannerUpdate(req: Request, res: Response) {
    try {
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new OrganizationController();
