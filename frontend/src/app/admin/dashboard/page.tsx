import { AdminSidebar } from "@/components/admin-sidebar";
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
import { Users, Calendar, CircleUser, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
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
                  <BreadcrumbLink href="#">Admin dashboard</BreadcrumbLink>
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
          <div className="grid auto-rows-4 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <Users className="h-4 w-4" />
                <h3>Total Customers</h3>
              </div>
              <span>248</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <Calendar className="h-4 w-4" />
                <h3>Active Bookings</h3>
              </div>
              <span>17</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <CircleUser className="h-4 w-4" />
                <h3>Total Employees</h3>
              </div>
              <span>17</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <DollarSign className="h-4 w-4" />
                <h3>Total Revenue</h3>
              </div>
              <span>$128,000</span>
            </div>
          </div>

          <div className="grid auto-rows-4 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-muted/50 p-5">
              <div>
                <h4>Task Distribution</h4>
                <p>Overview of task status</p>
                <div className="grid grid-cols-3 my-3">
                  <div>
                    <span> 1 </span>
                    <span>pending</span>
                  </div>
                  <div>
                    <span> 1 </span>
                    <span>in progress</span>
                  </div>
                  <div>
                    <span> 1 </span>
                    <span>completed</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div>
                <h4>Revenue Summary</h4>
                <p>Payment status overview</p>
                <div className="grid grid-rows-3 gap-3 mt-3">
                  <div className="flex justify-between">
                    <p>pending</p>
                    <p> 1 </p>
                  </div>
                  <div className="flex justify-between">
                    <p>in progress</p>
                    <p> 1 </p>
                  </div>
                  <div className="flex justify-between">
                    <p>completed</p>
                    <p> 1 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-5 md:min-h-min">
            <div>
              <h4> Recent Bookings</h4>
              <p>Latest event bookings</p>
            </div>
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Event Name</th>
                  <th className="px-4 py-2 text-left">Type</th>			
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status From Admin</th>
                  <th className="px-4 py-2 text-left">Status From Work</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-3021</td>
                  <td className="px-4 py-2">Johnson Wedding</td>
                  <td className="px-4 py-2">Riya Patel</td>
                  <td className="px-4 py-2">In review</td>
                  <td className="px-4 py-2">45%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
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
