import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore] = await Promise.all([cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={{ id: "", type: "guest" }} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
