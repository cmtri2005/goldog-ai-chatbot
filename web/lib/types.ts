import { z } from "zod";
import type { AppUsage } from "./usage";

export type VisibilityType = "private" | "public";

export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

export type Document = {
  id: string;
  createdAt: Date;
  title: string;
  content: string | null;
  kind: "realEstate";
  userId: string;
};

export type DBMessage = {
  id: string;
  chatId: string;
  role: string;
  parts: any;
  attachments: any;
  createdAt: Date;
};

export type Chat = {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: "public" | "private";
  lastContext: AppUsage | null;
};

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<any>;
  metadata?: MessageMetadata;
};

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
