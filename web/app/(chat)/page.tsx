"use client";

import { ChatMockRealEstate } from "@/components/chat-mock-real-estate";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  const id = generateUUID();

  return (
    <ChatMockRealEstate
      id={id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType="private"
      isReadonly={false}
      key={id}
    />
  );
}
