// src/components/ui/NotificationToast.tsx
"use client";

import React from "react";
import {
  useNotificationStore,
  NotificationType,
} from "@/lib/providers/useNotificationStore";
// Assuming we have icons (we'll use simple text for placeholders)

const NotificationToast: React.FC = () => {
  const { message, type, isVisible, hideNotification } = useNotificationStore();

  if (!isVisible || !message) return null;

  const colorMap: Record<NotificationType, string> = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    warning: "bg-yellow-500 border-yellow-700",
    info: "bg-blue-500 border-blue-700",
  };

  const iconMap: Record<NotificationType, string> = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };

  return (
    <div
      className={`fixed right-4 top-4 p-4 rounded-lg text-white shadow-xl flex items-center space-x-3 z-[100] transition-all duration-300 transform 
                  ${colorMap[type]} 
                  ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
      role="alert"
    >
      <span className="font-extrabold text-xl">{iconMap[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        onClick={hideNotification}
        className="ml-4 p-1 rounded-full hover:bg-white/20 transition"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationToast;
