"use client";

import type { UseChatHelpers } from "@/lib/chat-types";
import { motion } from "framer-motion";
import { memo } from "react";
import type { ChatMessage, VisibilityType } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  // Suggested actions: ask about real estate prices in districts of Ho Chi Minh City
  const suggestedActions = [
    "Giá bất động sản hiện tại ở Quận 1, TP.HCM là bao nhiêu?",
    "Giá nhà trung bình ở Quận 3, TP. Hồ Chí Minh?",
    "Giá đất nền ở Quận 7, TP. HCM hiện nay như thế nào?",
    "Giá căn hộ 2 phòng ngủ ở Quận Phú Nhuận?",
    "Giá cho thuê căn hộ ở Quận Tân Bình?",
    "Giá nhà ở Quận Bình Thạnh, TP. HCM?",
    "Giá bất động sản khu vực Quận 2 (Thảo Điền) ra sao?",
    "Giá căn hộ mới xây ở Thủ Đức (Trước đây Quận 9) hiện tại?",
  ];

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="h-full w-full whitespace-normal p-3 text-center border border-primary/40"
            onClick={(suggestion) => {
              window.history.replaceState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestion }],
              });
            }}
            suggestion={suggestedAction}
          >
            {suggestedAction}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
