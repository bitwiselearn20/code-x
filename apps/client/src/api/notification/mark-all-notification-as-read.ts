import axiosInstance from "@/utils/axiosInstance";

export const markAllNotificationsAsRead = async () => {
  const res = await axiosInstance.put(
    "/api/v1/notification/mark-all-notifications-as-read"
  );

  return res.data.data;
};