export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Chế độ thông thường",
    description: "Giúp bạn tìm kiếm thông tin bất động sản nhanh chóng và chính xác",
  },
  {
    id: "chat-model-reasoning",
    name: "Chế độ nâng cao",
    description:
      "Giúp bạn phân tích và đánh giá các lựa chọn bất động sản phù hợp với nhu cầu của bạn",
  },
];
