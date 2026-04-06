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
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminThemePage() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

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
                  <BreadcrumbPage>Employees</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between">
            <div>
              <h3>Employee Management</h3>
            </div>
            <div>
              <Button
                variant="outline"
                className="bg-black text-white hover:bg-black hover:text-white"
                onClick={() => setIsAddEmployeeOpen(true)}
              >
                <Plus /> Add Employee
              </Button>
            </div>
          </div>
          <div className="grid auto-rows-4 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Total Employees</h3>
              </div>
              <span>248</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Active Tasks</h3>
              </div>
              <span>17</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-5">
              <div className="flex gap-1">
                <h3>Completed Tasks</h3>
              </div>
              <span>17</span>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-5 md:min-h-min">
            <table className="w-full bg-white hover:bg-black hover:text-white">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Designation</th>
                  <th className="px-4 py-2 text-left">Joining Date</th>
                  <th className="px-4 py-2 text-left">Assigned Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-3021</td>
                  <td className="px-4 py-2">Johnson Wedding</td>
                  <td className="px-4 py-2">Riya Patel</td>
                  <td className="px-4 py-2">In review</td>
                  <td className="px-4 py-2">45%</td>
                  <td className="px-4 py-2">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                  <td className="px-4 py-2">2</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                  <td className="px-4 py-2">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                  <td className="px-4 py-2">4</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">ORD-2984</td>
                  <td className="px-4 py-2">Corporate Summit</td>
                  <td className="px-4 py-2">Arun Mehta</td>
                  <td className="px-4 py-2">Approved</td>
                  <td className="px-4 py-2">100%</td>
                  <td className="px-4 py-2">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {isAddEmployeeOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsAddEmployeeOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Add Employee</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter employee details to create a new profile.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddEmployeeOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsAddEmployeeOpen(false);
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 234 567 890" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Designation</label>
                    <Input placeholder="Event Manager" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddEmployeeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black">
                    Add Employee
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
