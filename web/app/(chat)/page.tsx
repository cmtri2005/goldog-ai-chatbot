"use client";

import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { ChatRealEstate } from "@/components/chat-real-estate";
import { generateUUID } from "@/lib/utils";

export default function Page() {
  const id = generateUUID();

  return (
    <ChatRealEstate
      id={id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType="public"
      isReadonly={false}
    />
  );
}
