"use client";

import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { ChatRealEstate } from "@/components/chat-real-estate";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <ChatRealEstate
      id={id}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType="public"
      isReadonly={false}
    />
  );
}