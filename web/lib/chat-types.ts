// Custom chat types replacing @ai-sdk/react
export type ChatStatus = "idle" | "ready" | "streaming" | "error" | "submitted";

export interface UseChatHelpers<T = any> {
  messages: T[];
  setMessages: (messages: T[] | ((messages: T[]) => T[])) => void;
  sendMessage: (message: any) => Promise<void>;
  status: ChatStatus;
  stop: () => Promise<void>;
  regenerate: () => Promise<void>;
  resumeStream: () => Promise<void>;
}
