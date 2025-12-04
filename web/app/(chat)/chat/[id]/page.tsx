"use client";

import { ChatMockRealEstate } from "@/components/chat-mock-real-estate";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatResponse } from "@/app/api/chat/chat";
import { ChatRealEstate } from "@/components/chat-real-estate";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <ChatRealEstate
      id={id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType={"public"}
      isReadonly={false}
    />
  );
}

