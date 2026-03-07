"use client";

import { useState, useEffect } from "react";
import { X, CheckCheck } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { getAllNotifications } from "@/api/notification/get-all-notifications";
import { markNotificationAsRead } from "@/api/notification/mark-notification-as-read";
import { markAllNotificationsAsRead } from "@/api/notification/mark-all-notification-as-read";

interface Notification {
  id: string;
  message: string;
  from: string;
  to: string;
  recieptStatus: "SEEN" | "UNSEEN";
  createdAt: string;

  senderName: string;
  senderAvatar: string;
}

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  setHasUnreadNotifications: (value: boolean) => void;
}

export default function NotificationModal({
  open,
  onClose,
  setHasUnreadNotifications,
}: NotificationModalProps) {
  const Colors = useColors();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  useEffect(() => {
    const unread = notifications.some((n) => n.recieptStatus === "UNSEEN");
    setHasUnreadNotifications(unread);
  }, [notifications]);

  if (!open) return null;

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const data = await getAllNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);

      toast.success("Notification marked as read");

      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      toast.success("All notifications marked as read");

      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notifications");
    }
  };

  const unreadCount = notifications.filter(
    (n) => n.recieptStatus === "UNSEEN",
  ).length;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute right-6 top-26 z-50">
        {/* Dropdown Panel */}
        <div
          className={`w-110 max-h-[75vh] rounded-xl shadow-xl overflow-hidden ${Colors.background.secondary} ${Colors.border.fadedThin}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 ${Colors.border.fadedThinBottom}`}
          >
            <div className="flex items-center gap-2">
              <h2 className={`text-sm font-semibold ${Colors.text.primary}`}>
                Notifications
              </h2>

              {unreadCount > 0 && (
                <span
                  className={`text-xs ${Colors.background.special} text-black px-2 py-0.5 rounded-full`}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className={`text-xs flex items-center gap-1 ${Colors.text.primary} hover:${Colors.text.secondary} hover:cursor-pointer`}
              >
                <CheckCheck size={15} />
                Mark all
              </button>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-red-500 hover:cursor-pointer hover:bg-neutral-800 transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Skeleton Loading */}
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex gap-3 px-4 py-3 ${Colors.border.fadedThinBottom}`}
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-700 animate-pulse"></div>

                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 w-3/4 bg-neutral-700 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <div className="p-6 text-center text-sm text-neutral-400">
                No notifications yet
              </div>
            )}

            {/* Real Notifications */}
            {/* Real Notifications */}
            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
        flex gap-3 px-5 py-4 transition
        ${notification.recieptStatus === "UNSEEN" ? "bg-neutral-800/40" : ""}
        hover:bg-neutral-800/60
        ${Colors.border.fadedThinBottom}
      `}
                >
                  {/* Avatar */}
                  <img
                    src={notification.senderAvatar}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  {/* Content */}
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="text-sm">
                      <span className={`font-semibold ${Colors.text.primary}`}>
                        {notification.senderName}
                      </span>
                      <span className={`ml-1 ${Colors.text.secondary}`}>
                        {notification.message}
                      </span>
                    </div>

                    <span className="text-xs text-neutral-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Mark as read double tick */}
                  {notification.recieptStatus === "UNSEEN" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className={`flex items-center justify-center ${Colors.text.special} hover:cursor-pointer transition`}
                    >
                      <CheckCheck size={21} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
