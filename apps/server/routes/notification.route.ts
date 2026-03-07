import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import notificationController from "../controller/notification.controller";
const notificationRouter = Router();

notificationRouter.post("/create-notification",authMiddleware,notificationController.createNotification);

notificationRouter.get("/get-all-notifications",authMiddleware,notificationController.getAllNotifications);

notificationRouter.put("/mark-notification-as-read/:notificationId",authMiddleware,notificationController.markNotificationAsRead);

notificationRouter.put("/mark-all-notifications-as-read",authMiddleware,notificationController.markAllNotificationsAsRead);

export default notificationRouter;
