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
import { getChatResponse } from "@/app/api/chat/chat";

// Lazy load MockRealEstateDisplay
const MockRealEstateDisplay = lazy(() =>
  import("./real-estate-display").then((mod) => ({
    default: mod.MockRealEstateDisplay,
  }))
);

export function ChatRealEstate({
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
  const [sessionId, setSessionId] = useState<string>(id);
  const [userId, setUserId] = useState<string>(() => {
    // Get or create user_id from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_id");
      if (stored) return stored;
      const newUserId = `user_${generateUUID().slice(0, 8)}`;
      localStorage.setItem("user_id", newUserId);
      return newUserId;
    }
    return `user_${generateUUID().slice(0, 8)}`;
  });

  /* Helper to map backend result to frontend property */
  const mapToRealEstateProperty = (item: any): RealEstateProperty => {
    const address = item.address?.[0] || {};
    return {
      id: generateUUID(),
      lat: address.latitude || 0,
      lng: address.longitude || 0,
      type: item.propertyType || "Nhà ở",
      name: item.title || "Bất động sản",
      imageUrl: item.images?.[0] || "https://images.unsplash.com/photo-1600596542815-2a4d9f87b304?q=80&w=1000&auto=format&fit=crop",
      location: `${address.street || ""}, ${address.ward || ""}, ${address.district || ""}, ${address.city || ""}`.replace(/^, | , /g, ""),
      price: item.price || 0,
      area: item.area || 0,
      description: item.description || "",
      typeDisplay: item.propertyType || "Nhà ở",
      legalStatus: item.legalStatus,
      transactionType: item.transactionType,
      direction: item.direction,
      images: item.images || [],
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userInputText = input.trim();

    // Add user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: "user",
      parts: [{ type: "text", text: userInputText }],
    } as ChatMessage;

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setStatus("submitted");
    setInput("");

    try {
      // Call backend API
      const response = await getChatResponse({
        user_input: userInputText,
        session_id: sessionId,
        user_id: userId,
      });

      // Update session_id if returned from backend
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Handle Real Estate Data from Backend
      const hasRealEstateData = response.result && response.result.length > 0;

      if (hasRealEstateData) {
        const mappedProperties = response.result!.map(mapToRealEstateProperty);
        setProperties(mappedProperties);
        setIsMapVisible(true);
      }

      // Add AI response message
      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: response.response,
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          showMapButton: hasRealEstateData,
        },
      } as ChatMessage;

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
      setStatus("ready");

    } catch (error) {
      console.error("Error calling chat API:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
        },
      } as ChatMessage;

      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
      setStatus("ready");
    }
  };

  const sendMessage = async (userMessage: string) => {
    const message: ChatMessage = {
      id: generateUUID(),
      role: "user",
      parts: [{ type: "text", text: userMessage }],
    } as ChatMessage;

    setMessages((prev: ChatMessage[]) => [...prev, message]);
    setStatus("submitted");
    setInput("");

    try {
      // Call backend API
      const response = await getChatResponse({
        user_input: userMessage,
        session_id: sessionId,
        user_id: userId,
      });

      // Update session_id if returned from backend
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Handle Real Estate Data from Backend
      const hasRealEstateData = response.result && response.result.length > 0;

      if (hasRealEstateData) {
        const mappedProperties = response.result!.map(mapToRealEstateProperty);
        setProperties(mappedProperties);
        setIsMapVisible(true);
      }

      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: response.response,
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
          showMapButton: hasRealEstateData,
        },
      } as ChatMessage;

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
      setStatus("ready");

    } catch (error) {
      console.error("Error calling chat API:", error);

      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          },
        ],
        metadata: {
          createdAt: new Date().toISOString(),
        },
      } as ChatMessage;

      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
      setStatus("ready");
    }
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
          regenerate={async () => { }}
          selectedModelId={currentModelId}
          setMessages={setMessages}
          status={status}
          votes={undefined}
        />

        {messages.length === 0 && (
          <div className="mx-auto max-w-4xl px-2 py-4 md:px-4">
            <SuggestedActions
              chatId={id}
              sendMessage={async (message: ChatMessage) => {
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
            <ChatInput
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

function ChatInput({
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
