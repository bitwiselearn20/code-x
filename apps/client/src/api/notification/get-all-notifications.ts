import axiosInstance from "@/utils/axiosInstance";

export const getAllNotifications = async () => {
  const res = await axiosInstance.get(
    "/api/v1/notification/get-all-notifications"
  );

  return res.data.data;
};