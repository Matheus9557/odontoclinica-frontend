import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import { api } from "@/services/api";
import {
  connectSocket,
  socket,
} from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/contexts/useNotification";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/components/ui/bubble";

interface Message {
  id: string;
  content: string;
  senderType: "dentist" | "patient";
  createdAt: string;
  dentistId: string;
  patientId: string;
}

interface PatientResponse {
  dentistId: string;
}

function normalizeMessage(
  message: Message
): Message {
  return {
    ...message,
    senderType:
      String(message.senderType).toLowerCase() as
        | "dentist"
        | "patient",
  };
}

function formatMessageTime(
  date: string
): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function Messages() {
  const { user, token } = useAuth();
  const { reset } = useNotification();

  const [searchParams] =
    useSearchParams();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);

  const [
    conversationId,
    setConversationId,
  ] = useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const patientIdFromUrl =
    searchParams.get("patientId");

  /*
   * Mantém o scroll sempre na última mensagem.
   */
  const scrollToBottom =
    useCallback(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      });
    }, []);

  /*
   * Adiciona uma mensagem somente se ela
   * ainda não existir no estado.
   *
   * Isso evita duplicação caso a mensagem
   * seja recebida pelo Socket depois do POST.
   */
  const addMessage = useCallback(
    (message: Message) => {
      const normalizedMessage =
        normalizeMessage(message);

      setMessages((current) => {
        const alreadyExists =
          current.some(
            (item) =>
              item.id ===
              normalizedMessage.id
          );

        if (alreadyExists) {
          return current;
        }

        return [
          ...current,
          normalizedMessage,
        ];
      });
    },
    []
  );

  /*
   * Inicialização da conversa.
   */
  useEffect(() => {
  if (!user || !token) {
    return;
  }

  const authUser = user;
  const authToken = token;

  let active = true;
  let currentConversationId:
    | string
    | null = null;

  async function initializeChat() {
    try {
      await reset();

      let dentistId: string;
      let patientId: string;

      if (
        authUser.role === "dentist"
      ) {
        if (!patientIdFromUrl) {
          return;
        }

        dentistId =
          authUser.id;

        patientId =
          patientIdFromUrl;
      } else {
        const response =
          await api.get<PatientResponse>(
            "/patients/me"
          );

        dentistId =
          response.data.dentistId;

        patientId =
          authUser.id;
      }

      currentConversationId =
        `conversation:${dentistId}:${patientId}`;

      if (!active) {
        return;
      }

      setConversationId(
        currentConversationId
      );

      if (!socket.connected) {
        connectSocket(
          authToken,
          authUser
        );
      }

      socket.emit(
        "conversation:join",
        currentConversationId
      );

      const response =
        await api.get<Message[]>(
          "/messages",
          {
            params: {
              patientId,
            },
          }
        );

      if (!active) {
        return;
      }

      setMessages(
        response.data.map(
          normalizeMessage
        )
      );

      scrollToBottom();
    } catch (error) {
      console.error(
        "Erro ao inicializar conversa:",
        error
      );
    }
  }


    initializeChat();

    /*
     * O backend emite:
     *
     * message:new
     *
     * para todos os usuários presentes
     * na sala da conversa.
     */
    function handleNewMessage(
      message: Message
    ) {
      if (!active) {
        return;
      }

      /*
       * Só processa mensagens da conversa
       * atualmente aberta.
       */
      if (
        currentConversationId &&
        message.dentistId &&
        message.patientId
      ) {
        const messageConversation =
          `conversation:${message.dentistId}:${message.patientId}`;

        if (
          messageConversation !==
          currentConversationId
        ) {
          return;
        }
      }

      addMessage(message);
      scrollToBottom();
    }

    socket.on(
      "message:new",
      handleNewMessage
    );

    return () => {
      active = false;

      /*
       * Sai da sala da conversa atual.
       */
      if (currentConversationId) {
        socket.emit(
          "conversation:leave",
          currentConversationId
        );
      }

      socket.off(
        "message:new",
        handleNewMessage
      );
    };
  }, [
    user,
    token,
    patientIdFromUrl,
    reset,
    addMessage,
    scrollToBottom,
  ]);

  /*
   * Envia uma mensagem.
   */
  async function handleSend() {
    if (
      !user ||
      !content.trim() ||
      isSending
    ) {
      return;
    }

    const messageContent =
      content.trim();

    let receiverId: string;

    try {
      setIsSending(true);

      /*
       * DENTISTA → PACIENTE
       */
      if (
        user.role === "dentist"
      ) {
        if (!patientIdFromUrl) {
          return;
        }

        receiverId =
          patientIdFromUrl;
      }

      /*
       * PACIENTE → DENTISTA
       */
      else {
        const response =
          await api.get<PatientResponse>(
            "/patients/me"
          );

        receiverId =
          response.data.dentistId;
      }

      /*
       * O backend salva a mensagem e
       * em seguida emite "message:new".
       *
       * Portanto, não adicionamos uma
       * mensagem artificial aqui.
       */
      await api.post(
        "/messages/send",
        {
          content: messageContent,
          receiverId,
        }
      );

      setContent("");
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem:",
        error
      );

      alert(
        "Não foi possível enviar a mensagem."
      );
    } finally {
      setIsSending(false);
    }
  }

  /*
   * Permite enviar com Enter.
   */
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSend();
    }
  }

  if (!user) {
    return null;
  }

  /*
   * Dentista precisa ter um paciente
   * selecionado para abrir a conversa.
   */
  if (
    user.role === "dentist" &&
    !patientIdFromUrl
  ) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-card text-card-foreground border-border">
            <p className="text-muted-foreground">
              Selecione um paciente para
              iniciar uma conversa.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-70px)] bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* CABEÇALHO */}

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mensagens
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Comunicação segura entre paciente
            e dentista.
          </p>
        </div>

        {/* CHAT */}

        <Card className="bg-card text-card-foreground border-border shadow-lg overflow-hidden">

          <div className="h-[520px] overflow-y-auto px-4 py-5 sm:px-6">

            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  Nenhuma mensagem ainda.
                  Envie a primeira mensagem.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {messages.map(
                  (message, index) => {
                    const isMine =
                      message.senderType ===
                      user.role;

                    const previousMessage =
                      messages[index - 1];

                    const isSameSender =
                      previousMessage &&
                      previousMessage.senderType ===
                        message.senderType;

                    return (
                      <BubbleGroup
                        key={message.id}
                        className={
                          isSameSender
                            ? "gap-1"
                            : "gap-2"
                        }
                      >

                        <Bubble
                          align={
                            isMine
                              ? "end"
                              : "start"
                          }
                          variant={
                            isMine
                              ? "default"
                              : "muted"
                          }
                        >
                          <BubbleContent
                            className="text-base"
                          >
                            {message.content}
                          </BubbleContent>
                        </Bubble>

                        <div
                          className={`text-xs text-muted-foreground ${
                            isMine
                              ? "text-right pr-2"
                              : "text-left pl-2"
                          }`}
                        >
                          {formatMessageTime(
                            message.createdAt
                          )}
                        </div>

                      </BubbleGroup>
                    );
                  }
                )}

                <div
                  ref={messagesEndRef}
                />

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="border-t border-border bg-card p-4">

            <div className="flex gap-2">

              <Input
                className="text-base bg-background"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                disabled={isSending}
              />

              <Button
                onClick={() =>
                  void handleSend()
                }
                disabled={
                  isSending ||
                  !content.trim() ||
                  !conversationId
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSending
                  ? "Enviando..."
                  : "Enviar"}
              </Button>

            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Pressione Enter para enviar.
            </p>

          </div>

        </Card>

      </div>
    </main>
  );
}