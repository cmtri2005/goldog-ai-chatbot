import type { UsageData } from "tokenlens/helpers";

// Server-merged usage: TokenLens summary + optional modelId
export type AppUsage = UsageData & { modelId?: string };
