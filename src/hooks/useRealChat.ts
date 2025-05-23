// hooks/useWebSocketChat.ts
import { type Client as StompClient, type IMessage, Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { baseUrlStock } from "~/APIs/axios";

interface Message {
  chatId: number | string;
  id: number | string;
  content: string;
  creationTime: string;
  creatorName: string;
  imageUrl?: string;
}

interface UseWebSocketChatProps {
  userId: string | null;
  initialMessages: Message[];
  onNewMessage?: () => void;
}

export const useWebSocketChat = ({ userId, initialMessages, onNewMessage }: UseWebSocketChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<StompClient | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token || !userId) {
      return;
    }

    const stompClient = new Client({
      brokerURL: `${baseUrlStock}?token=${token}`,
      debug: function (str: string) {
        console.log("[STOMP Debug]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("WebSocket Connected Successfully");
      setIsConnected(true);
      
      stompClient.subscribe(`/direct-chat/${userId}`, (message: IMessage) => {
        try {
          const newMessage: Message = JSON.parse(message.body);
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            return messageExists ? prevMessages : [...prevMessages, newMessage];
          });
          onNewMessage?.();
        } catch (parseError) {
          console.error("Error parsing incoming message:", parseError);
        }
      });
    };

    stompClient.onStompError = frame => {
      console.error("Broker reported error:", frame.headers.message);
      setIsConnected(false);
    };

    stompClient.onWebSocketError = event => {
      console.error("WebSocket connection error:", event);
      setIsConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    };
  }, [userId, onNewMessage]);

  const sendMessage = async (messagePayload: { chatId: string | number; content: string; imageUrl?: string }) => {
    if (!stompClientRef.current?.connected) {
      return false;
    }

    try {
      stompClientRef.current.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(messagePayload),
      });
      return true;
    } catch (error) {
      console.error("Message sending failed:", error);
      return false;
    }
  };

  return {
    messages,
    isConnected,
    sendMessage,
  };
};
