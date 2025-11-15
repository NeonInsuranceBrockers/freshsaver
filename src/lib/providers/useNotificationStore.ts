import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationState {
  message: string | null;
  type: NotificationType;
  isVisible: boolean;
}

interface NotificationActions {
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>((set) => ({
  message: null,
  type: "info",
  isVisible: false,

  showNotification: (message, type) => {
    set({
      message,
      type,
      isVisible: true,
    });

    // Auto-hide the notification after 5 seconds
    setTimeout(() => {
      set((state) =>
        state.message === message ? { isVisible: false } : state
      );
    }, 5000);
  },

  hideNotification: () => set({ isVisible: false, message: null }),
}));
