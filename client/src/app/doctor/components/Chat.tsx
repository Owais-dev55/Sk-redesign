"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { API_BASE_URL } from "@/constants/constants";
import { io } from "socket.io-client";
import { FiSend, FiUser, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

const socket = io(`${API_BASE_URL}`);

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
  read?: boolean;
}

interface ChatProps {
  currentUserId: string;
  receiverId: string;
}

export default function Chat({ currentUserId, receiverId }: ChatProps) {
  const [receiverInfo, setReceiverInfo] = useState<{
    name: string;
    image?: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("join", currentUserId);
    socket.emit("join", receiverId);

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/messages/${currentUserId}/${receiverId}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch old messages", err);
      }
    };

    fetchMessages();
  }, [currentUserId, receiverId]);

  // useEffect(() => {
  //   const container = endRef.current?.parentElement;
  //   if (!container) return;

  //   const isNearBottom =
  //     container.scrollHeight - container.scrollTop - container.clientHeight <
  //     50;

  //   if (isNearBottom) {
  //     endRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg: Message = {
      senderId: currentUserId,
      receiverId,
      content: message,
    };

    socket.emit("send_message", newMsg);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${receiverId}`);
        const data = await res.json();
        setReceiverInfo({
          name: data.name,
          image: data.image,
        });
      } catch (err) {
        console.error("Failed to fetch receiver name", err);
      }
    };

    fetchReceiverName();
  }, [receiverId]);

  useEffect(() => {
    socket.on("messages_read", ({ readerId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === readerId ? { ...msg, read: true } : msg
        )
      );
    });

    return () => {
      socket.off("messages_read");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Image
                src={receiverInfo?.image || "/icon-7797704_1280.png"}
                alt={receiverInfo?.image || "Receiver avatar"}
                fill
                className="rounded-full"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {receiverInfo?.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FiUser className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600">
              Start your consultation
            </p>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Send a message to begin your secure clinical conversation
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.senderId === currentUserId;
            const showTime =
              i === 0 ||
              (messages[i - 1] &&
                new Date(msg.timestamp || "").getTime() -
                  new Date(messages[i - 1].timestamp || "").getTime() >
                  300000);

            return (
              <div key={i}>
                {showTime && msg.timestamp && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                <div
                  className={`flex mb-1 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl relative ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-br-md ml-auto"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {msg.timestamp && (
                        <div
                          className={`text-xs mt-1 ${
                            isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {isOwn && i === messages.length - 1 && (
                            <span className="text-xs text-blue-200 ml-2 block text-right">
                              {msg.read ? "Seen" : "Sent"}
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        className={`absolute top-0 w-3 h-3 ${
                          isOwn
                            ? "bg-blue-500 -right-1 rounded-br-full"
                            : "bg-white -left-1 rounded-bl-full border-l border-b border-gray-100"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className=" overflow-y-hidden w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-500 text-sm"
              placeholder="Type a message..."
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "120px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[44px] h-[44px] ${
              message.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
