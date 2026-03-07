import axiosInstance from "@/utils/axiosInstance";

interface CreateNotificationPayload {
  from: string;
  to: string;
  message: string;
}

export const createNotification = async (
  payload: CreateNotificationPayload
) => {
  const res = await axiosInstance.post(
    "/api/v1/notification/create-notification",
    payload
  );

  return res.data.data;
};