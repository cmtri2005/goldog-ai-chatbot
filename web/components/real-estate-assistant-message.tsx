"use client";

import { GPSIcon } from "./icons";

export function RealEstateAssistantMessage({
  text,
  onShowMap,
}: {
  text: string;
  onShowMap: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 text-white">
      <p className="text-sm text-foreground">{text}</p>
      <button
        onClick={onShowMap}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-fit"
      >
        <GPSIcon size={16} />
        <span>Xem bản đồ</span>
      </button>
    </div>
  );
}
