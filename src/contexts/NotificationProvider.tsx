import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { NotificationContext } from "./NotificationContext";

import { socket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

interface Props {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: Props) {
  const { user } = useAuth();

  const [unreadCount, setUnreadCount] =
    useState<number>(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }


    let active = true;

    async function initializeNotifications() {
      try {
        /*
         * Recupera a quantidade persistida
         * no banco.
         */
        const response =
          await api.get<{
            unread: number;
          }>(
            "/notifications/unread-count"
          );

        if (!active) {
          return;
        }

        setUnreadCount(
          response.data.unread
        );

        /*
         * O AuthProvider já é responsável
         * pela autenticação/conexão do socket.
         *
         * Aqui apenas registramos o listener.
         */
        if (!socket.connected) {
          console.warn(
            "Socket ainda não está conectado ao iniciar notificações."
          );
        }

        /*
         * O backend emite:
         *
         * notification:new
         */
        socket.on(
          "notification:new",
          handleNewNotification
        );
      } catch (error) {
        console.error(
          "Erro ao iniciar notificações:",
          error
        );
      }
    }

    function handleNewNotification() {
      if (!active) {
        return;
      }

      console.log(
        "🔔 Nova notificação recebida em tempo real."
      );

      setUnreadCount(
        (current) => current + 1
      );
    }

    initializeNotifications();

    return () => {
      active = false;

      socket.off(
        "notification:new",
        handleNewNotification
      );
    };
  }, [user]);

  function increment() {
    setUnreadCount(
      (current) => current + 1
    );
  }

  async function reset() {
    try {
      setUnreadCount(0);

      await api.patch(
        "/notifications/read-all"
      );
    } catch (error) {
      console.error(
        "Erro ao marcar notificações como lidas:",
        error
      );
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        reset,
        increment,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}