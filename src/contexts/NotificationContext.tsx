import { createContext } from "react";

export interface NotificationContextData {
  unreadCount: number;
  increment: () => void;
  reset: () => void;
}

export const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData
);
