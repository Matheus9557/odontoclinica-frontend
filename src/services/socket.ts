import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_API_URL ??
  "https://odontoclinica-api.onrender.com";

export const socket = io(socketUrl, {
  autoConnect: false,
  withCredentials: true,
});

export function connectSocket(
  token: string,
  user: {
    id: string;
    role: "dentist" | "patient";
  }
) {
  socket.auth = {
    token,
  };

  if (socket.connected) {
    socket.emit("join", {
      userId: user.id,
      role: user.role,
    });

    return;
  }

  socket.once("connect", () => {
    socket.emit("join", {
      userId: user.id,
      role: user.role,
    });
  });

  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
  socket.auth = {};
}