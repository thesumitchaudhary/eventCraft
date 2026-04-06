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
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

export default function AdminThemePage() {
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);

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
                  <BreadcrumbPage>Theme Catalog</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-250">
          <div className="rounded-xl flex justify-between bg-muted/50 p-4">
            <div>
              <h2 className="text-lg font-semibold">Task Management</h2>
            </div>
            <div>
              <Button
                variant="outline"
                className="flex bg-black text-white hover:bg-black hover:text-white"
                onClick={() => setIsAssignTaskOpen(true)}
              >
                <ClipboardList /> Assign Task
              </Button>
            </div>
          </div>

          <div className="min-h-[60vh] rounded-xl bg-muted/50 p-4">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full border-b border-gray-300 bg-white">
                <thead>
                  <tr className="">
                    <th className="border-b px-4 py-2 text-left">Task</th>
                    <th className="border-b px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="border-b px-4 py-2 text-left">
                      Related Event
                    </th>
                    <th className="border-b px-4 py-2 text-left">
                      Assigned To
                    </th>
                    <th className="border-b px-4 py-2 text-left">Priority</th>
                    <th className="border-b px-4 py-2 text-left">Status</th>
                    <th className="border-b px-4 py-2 text-left">Due Date</th>
                    <th className="border-b px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b px-4 py-2">
                      Setup Wedding Venue Decorations
                    </td>
                    <td className="border-b px-4 py-2">
                      Arrange floral decorations for the Johnson wedding at
                      Grand Hotel
                    </td>
                    <td className="border-b px-4 py-2">
                      Johnson Wedding <span>Wedding</span>
                    </td>
                    <td className="border-b px-4 py-2">Sarah Johnson</td>
                    <td className="border-b px-4 py-2">high</td>
                    <td className="border-b px-4 py-2">pending</td>
                    <td className="border-b px-4 py-2">2026-03-25</td>
                    <td className="border-b px-4 py-2">2026-03-15</td>
                  </tr>
              
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isAssignTaskOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsAssignTaskOpen(false)}
          >
            <div
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Assign Task</h2>
                  <p className="text-sm text-muted-foreground">
                    Create a task and assign it to an employee.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAssignTaskOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsAssignTaskOpen(false);
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Task Title</label>
                    <Input placeholder="Setup venue decorations" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Describe the task details"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related Event</label>
                    <Input placeholder="Johnson Wedding" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign To</label>
                    <Input placeholder="Sarah Johnson" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Input placeholder="High" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAssignTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black hover:text-white">
                    Save Task
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
