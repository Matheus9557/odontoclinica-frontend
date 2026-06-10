import { ReactNode, useEffect, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import { socket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

interface Props {
  children: ReactNode;
}

export function NotificationProvider({ children }: Props) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const authUser = user; // 🔒 trava como não-null

    async function init() {
      try {
        // 🔁 busca persistido no banco
        const res = await api.get<{ unread: number }>(
          "/notifications/unread-count"
        );

        setUnreadCount(res.data.unread);

        // 🔌 conecta socket
        if (!socket.connected) {
          socket.connect();
        }

        // 🔔 registra usuário na sala dele
        socket.emit("register_user", authUser.id);

        // 🔔 recebe notificação em tempo real
        socket.on("notification:new_message", () => {
          console.log("🔔 Notificação recebida em tempo real!");
          setUnreadCount((prev) => prev + 1);
        });
      } catch (err) {
        console.error("Erro ao iniciar notificações:", err);
      }
    }

    init();

    return () => {
      socket.off("notification:new_message");
    };
  }, [user]);

  function increment() {
    setUnreadCount((prev) => prev + 1);
  }

  async function reset() {
    setUnreadCount(0);

    // marca todas como lidas no backend
    await api.patch("/notifications/read-all");
  }

  return (
    <NotificationContext.Provider
      value={{ unreadCount, reset, increment }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
