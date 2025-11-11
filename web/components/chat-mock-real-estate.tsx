"use client";

import { useState, useRef, lazy, Suspense } from "react";
import { ChatHeader } from "@/components/chat-header";
import { generateUUID } from "@/lib/utils";
import { Messages } from "./messages";
import type { ChatMessage, VisibilityType } from "@/lib/types";
import {
  filterRealEstate,
  type RealEstateProperty,
} from "@/lib/ai/tools/get-real-estate";
import { SuggestedActions } from "./suggested-actions";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "./ui/button";

// Lazy load MockRealEstateDisplay
const MockRealEstateDisplay = lazy(() =>
  import("./mock-real-estate-display").then((mod) => ({
    default: mod.MockRealEstateDisplay,
  }))
);

export function ChatMockRealEstate({
  id,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
}: {
  id: string;
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentModelId, setCurrentModelId] = useState(initialChatModel);
  const [status, setStatus] = useState<"ready" | "submitted">("ready");
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: "user",
      parts: [{ type: "text", text: input }],
    } as ChatMessage;

    setMessages((prev) => [...prev, userMessage]);
    setStatus("submitted");

    // Simulate sending real estate data
    setTimeout(() => {
      // Get real estate data
      const result = filterRealEstate({
        type: "all",
      });

      // Show map with properties
      setProperties(result.properties);
      setIsMapVisible(true);

      // Add AI response message
      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Tôi đã tìm thấy ${result.properties.length} dự án bất động sản cho bạn. Kiểm tra bản đồ ở phía bên phải để xem các dự án với chi tiết, địa điểm và giá cả của chúng.`,
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          showMapButton: true,
        },
      } as ChatMessage;

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("ready");
      setInput("");
    }, 2000);
  };

  const sendMessage = async (userMessage: string) => {
    const message: ChatMessage = {
      id: generateUUID(),
      role: "user",
      parts: [{ type: "text", text: userMessage }],
    } as ChatMessage;

    setMessages((prev) => [...prev, message]);
    setStatus("submitted");
    setInput("");

    setTimeout(() => {
      const result = filterRealEstate({
        type: "all",
      });

      setProperties(result.properties);
      setIsMapVisible(true);

      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Tôi đã tìm thấy ${result.properties.length} dự án bất động sản cho bạn. Kiểm tra bản đồ ở phía bên phải để xem các dự án với chi tiết, địa điểm và giá cả của chúng.`,
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          showMapButton: true,
        },
      } as ChatMessage;

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("ready");
    }, 2000);
  };

  return (
    <>
      <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
        <ChatHeader
          chatId={id}
          isReadonly={isReadonly}
          selectedVisibilityType={initialVisibilityType}
        />

        <Messages
          chatId={id}
          isArtifactVisible={isMapVisible}
          isReadonly={isReadonly}
          messages={messages}
          onShowRealEstateMap={() => setIsMapVisible(true)}
          regenerate={async () => {}}
          selectedModelId={currentModelId}
          setMessages={setMessages}
          status={status}
          votes={undefined}
        />

        {messages.length === 0 && (
          <div className="mx-auto max-w-4xl px-2 py-4 md:px-4">
            <SuggestedActions
              chatId={id}
              sendMessage={async (message) => {
                if (
                  message?.parts?.[0]?.type === "text" &&
                  "text" in message.parts[0]
                ) {
                  await sendMessage(message.parts[0].text);
                }
              }}
              selectedVisibilityType={initialVisibilityType}
            />
          </div>
        )}

        <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
          {!isReadonly && (
            <MockInput
              input={input}
              setInput={setInput}
              onSubmit={handleSendMessage}
              status={status}
            />
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <MockRealEstateDisplay
          properties={properties}
          isVisible={isMapVisible}
          onClose={() => setIsMapVisible(false)}
        />
      </Suspense>
    </>
  );
}

function MockInput({
  input,
  setInput,
  onSubmit,
  status,
}: {
  input: string;
  setInput: (text: string) => void;
  onSubmit: () => void;
  status: "ready" | "submitted";
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative flex w-full flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
      >
        <div className="flex flex-row items-start gap-1 sm:gap-2">
          <textarea
            ref={textareaRef}
            autoFocus
            className="grow resize-none border-0! border-none! bg-transparent text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
            disabled={status === "submitted"}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "44px";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Hãy hỏi tôi bất cứ điều gì về bất động sản..."
            rows={1}
            style={{ minHeight: "44px", maxHeight: "200px" }}
            value={input}
          />
        </div>
        <div className="flex flex-row justify-end gap-2 border-t border-border pt-2 mt-2">
          <p className="text-xs text-muted-foreground mr-auto">
            Nhấn Enter để gửi, Shift + Enter để xuống dòng
          </p>
          {status === "submitted" ? (
            <Button
              type="button"
              disabled
              className="size-8 rounded-full bg-muted text-muted-foreground transition-colors duration-200"
            >
              <span className="text-xs">...</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input.trim()}
              className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center"
            >
              <ArrowUpIcon size={14} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
