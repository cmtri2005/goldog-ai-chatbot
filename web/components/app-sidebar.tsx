"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { PlusIcon, TrashIcon } from "@/components/icons";
import {
  SidebarHistory,
  getChatHistoryPaginationKey,
} from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Image from "next/image";
import LogoWhite from "@/public/images/logos/goldog/LandscapeWhite.webp";
import LogoBlack from "@/public/images/logos/goldog/LandscapeBlack.webp";
import { useTheme } from "next-themes";

export function AppSidebar({ user }: { user: any | undefined }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { setOpenMobile } = useSidebar();
  const { mutate } = useSWRConfig();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleDeleteAll = () => {
    const deletePromise = fetch("/api/history", {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting all chats...",
      success: () => {
        mutate(unstable_serialize(getChatHistoryPaginationKey));
        router.push("/");
        setShowDeleteAllDialog(false);
        return "All chats deleted successfully";
      },
      error: "Failed to delete all chats",
    });
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex flex-row items-start justify-between">
              <Link
                className="flex flex-col hover:bg-muted/50 gap-2 px-2 py-1 rounded-md"
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                <Image
                  src={theme === "dark" ? LogoWhite : LogoBlack}
                  alt="Goldog Logo"
                  width={90}
                  height={30}
                />
                <span className="cursor-pointer rounded-md font-semibold text-primary">
                  Realty Chatbot
                </span>
              </Link>
              <div className="flex flex-row gap-1">
                {user && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-8 p-1 md:h-fit md:p-2"
                        onClick={() => setShowDeleteAllDialog(true)}
                        type="button"
                        variant="ghost"
                      >
                        <TrashIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="hidden md:block">
                      Xóa tất cả cuộc trò chuyện
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-8 p-1 md:h-fit md:p-2"
                      onClick={() => {
                        setOpenMobile(false);
                        router.push("/");
                        router.refresh();
                      }}
                      type="button"
                      variant="ghost"
                    >
                      <PlusIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end" className="hidden md:block">
                    Bắt đầu cuộc trò chuyện mới
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* <SidebarHistory user={user} /> */}
          <div className="flex items-center align-center gap-2 absolute bottom-16 left-1/2 -translate-x-1/2 flex-col">
            <p className="text-xs text-muted-foreground mt-2">Phát triển bởi</p>
            <Link
              href="https://goldog.vn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {theme === "dark" ? (
                <Image
                  src={LogoWhite}
                  alt="Goldog Logo"
                  width={60}
                  height={20}
                  className="mb-1"
                />
              ) : (
                <Image
                  src={LogoBlack}
                  alt="Goldog Logo"
                  width={60}
                  height={20}
                  className="mb-1"
                />
              )}
            </Link>
          </div>
        </SidebarContent>
        <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
      </Sidebar>

      <AlertDialog
        onOpenChange={setShowDeleteAllDialog}
        open={showDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chats and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
