import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/services/socket";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/contexts/useNotification";

interface Message {
  id: string;
  content: string;
  senderType: "dentist" | "patient";
  createdAt: string;
  dentistId: string;
  patientId: string;
}

export default function Messages() {
  const { user } = useAuth();
  const { reset } = useNotification();
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const patientIdFromUrl = searchParams.get("patientId");

  useEffect(() => {
    if (!user) return;
    const authUser = user;

    async function init() {
      await reset();

      let dentistId: string;
      let patientId: string;

      if (authUser.role === "dentist") {
        if (!patientIdFromUrl) return;
        dentistId = authUser.id;
        patientId = patientIdFromUrl;
      } else {
        const res = await api.get<{ dentistId: string }>("/patients/me");
        dentistId = res.data.dentistId;
        patientId = authUser.id;
      }

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join", {
        room: `conversation:${dentistId}:${patientId}`,
      });

      const res = await api.get<Message[]>("/messages", {
        params: { patientId },
      });

      setMessages(res.data);
    }

    init();

    socket.on("new_message", (msg: Message) => {
      if (msg.senderType !== authUser.role) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [user, patientIdFromUrl, reset]);

  async function handleSend() {
    if (!user) return;
    const authUser = user;

    if (!content.trim()) return;

    let receiverId: string;

    if (authUser.role === "dentist") {
      if (!patientIdFromUrl) return;
      receiverId = patientIdFromUrl;
    } else {
      const res = await api.get<{ dentistId: string }>("/patients/me");
      receiverId = res.data.dentistId;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content,
        senderType: authUser.role,
        createdAt: new Date().toISOString(),
        dentistId:
          authUser.role === "dentist" ? authUser.id : receiverId,
        patientId:
          authUser.role === "patient" ? authUser.id : receiverId,
      },
    ]);

    setContent("");

    await api.post("/messages/send", {
      content,
      receiverId,
    });
  }

  if (!user) return null;

  return (
    // 🔵 BACKGROUND PADRÃO DA APLICAÇÃO
    <div className="min-h-[calc(100vh-70px)] bg-[#5067AA] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* CHAT */}
        <Card className="p-4 h-[520px] overflow-y-auto space-y-3 bg-white shadow-lg text-base">
          {messages.map((msg) => {
            const isMine = msg.senderType === user.role;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs text-base ${
                    isMine
                      ? "bg-[#F3E8D2] text-black"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </Card>

        {/* INPUT */}
        <div className="flex gap-2">
          <Input
            className="text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite sua mensagem..."
          />

          <Button
            onClick={handleSend}
            className="bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-base"
          >
            Enviar
          </Button>
        </div>

      </div>
    </div>
  );
}
