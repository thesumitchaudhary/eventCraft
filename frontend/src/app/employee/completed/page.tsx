import { EmployeeSidebar } from "@/components/employee-sidebar";
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
      <EmployeeSidebar />
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
                  <BreadcrumbLink href="#">Employee dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Tasks</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Total Customers</h3>
              <span>248</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Open Orders</h3>
              <span>17</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-10">
              <h3>Revenue This Month</h3>
              <span>$128,000</span>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-5 md:min-h-min">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Order</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Assigned Manager</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Progress</th>
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
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
