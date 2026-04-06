// import { AppSidebar } from "../../../components/admin-sidebar";
import { AppSidebar } from "../../../components/app-siderbar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Customer dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Total Bookings</h3>
              <span>2</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Upcoming Events</h3>
              <span>0</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Total Spent</h3>
              <span>$40,000</span>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-5">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Theme</th>
                  <th className="px-4 py-2 text-left">status</th>
                  <th className="px-4 py-2 text-left">Progress</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Johnson Wedding</td>
                  <td className="px-4 py-2">2026-02-14</td>
                  <td className="px-4 py-2">Classic Elegant</td>
                  <td className="px-4 py-2">in-progress</td>
                  <td className="px-4 py-2">60%</td>
                </tr>
                 <tr className="border-b">
                  <td className="px-4 py-2">Anniversary Celebration</td>
                  <td className="px-4 py-2">2025-11-15</td>
                  <td className="px-4 py-2">Romantic Garden</td>
                  <td className="px-4 py-2">completed</td>
                  <td className="px-4 py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
