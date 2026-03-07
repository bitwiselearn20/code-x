import axiosInstance from "@/utils/axiosInstance";

export const markNotificationAsRead = async (notificationId: string) => {
  const res = await axiosInstance.put(
    `/api/v1/notification/mark-notification-as-read/${notificationId}`
  );

  return res.data.data;
};