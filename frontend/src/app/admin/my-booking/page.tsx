import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
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

export default function AdminBookingsPage() {
  return (
    <SidebarProvider>
      <AdminSidebar />
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
                  <BreadcrumbPage>Admin dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bookings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-250">
          <div className="rounded-xl bg-muted/50 p-4">
            <div>
              <h2 className="text-lg font-semibold">Booking Management</h2>
              <p className="text-sm text-muted-foreground">Total bookings: 2</p>
            </div>
            <div>
              <input type="text" name="" id="" />
            </div>
          </div>
          <div className="grid auto-rows-4 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Pending</h3>
              </div>
              <span>0</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Confirmed</h3>
              </div>
              <span>0</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>In Progress</h3>
              </div>
              <span>1</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Completed</h3>
              </div>
              <span>0</span>
            </div>
          </div>

          <div className="min-h-[60vh] rounded-xl bg-muted/50 p-4">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full border-b border-gray-300 bg-white">
              <thead>
                <tr className="">
                  <th className="border-b px-4 py-2 text-left">Event Name</th>
                  <th className="border-b px-4 py-2 text-left">Type</th>
                  <th className="border-b px-4 py-2 text-left">Theme</th>
                  <th className="border-b px-4 py-2 text-left">Date</th>
                  <th className="border-b px-4 py-2 text-left">Venue</th>
                  <th className="border-b px-4 py-2 text-left">Guests</th>
                  <th className="border-b px-4 py-2 text-left">Budget</th>
                  <th className="border-b px-4 py-2 text-left">Status</th>
                  <th className="border-b px-4 py-2 text-left">Payment</th>
                  <th className="border-b px-4 py-2 text-left">Progress</th>
                  <th className="border-b px-4 py-2 text-left">action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2">Johnson Wedding</td>
                  <td className="border-b px-4 py-2">Wedding</td>
                  <td className="border-b px-4 py-2">Classic Elegant</td>
                  <td className="border-b px-4 py-2">2026-02-14</td>
                  <td className="border-b px-4 py-2">Grand Hotel Ballroom</td>
                  <td className="border-b px-4 py-2">200</td>
                  <td className="border-b px-4 py-2">$50,000</td>
                  <td className="border-b px-4 py-2">in-progress</td>
                  <td className="border-b px-4 py-2">partial</td>
                  <td className="border-b px-4 py-2">	60%</td>
                </tr>
                 <tr>
                  <td className="border-b px-4 py-2">Anniversary Celebration</td>
                  <td className="border-b px-4 py-2">Anniversary</td>
                  <td className="border-b px-4 py-2">Romantic Garden</td>
                  <td className="border-b px-4 py-2">2025-11-15</td>
                  <td className="border-b px-4 py-2">Rose Garden Restaurant</td>
                  <td className="border-b px-4 py-2">50</td>
                  <td className="border-b px-4 py-2">$15,000</td>
                  <td className="border-b px-4 py-2">completed</td>
                  <td className="border-b px-4 py-2">completed</td>
                  <td className="border-b px-4 py-2">100%</td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
