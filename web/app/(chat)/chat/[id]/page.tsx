"use client";

import { ChatMockRealEstate } from "@/components/chat-mock-real-estate";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <ChatMockRealEstate
      id={id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType={"public"}
      isReadonly={false}
    />
  );
}
