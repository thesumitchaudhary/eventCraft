import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error("Request Failed");
  }

  return body;
};

export default function AdminThemePage() {
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["allTaskDetails"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/findEmployee"),
  });

  const users = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : [];
  const details = Array.isArray(data?.details) ? data.details : [];

  // merge users + details (match by userId if available, else by index)
  const employees = users.map((user, index) => {
    const detail =
      details.find((d) => d.userId === user._id || d.user?._id === user._id) ||
      details[index] ||
      {};

    return { ...user, ...detail };
  });

  const taskRows = employees.flatMap((employee) =>
    (employee?.tasks || []).map((task, idx) => ({
      rowKey: `${employee._id || employee.userId || "emp"}-${task?._id || idx}`,
      taskTitle: task?.taskTitle || "-",
      taskDescription: task?.taskDescription || "-",
      assignedTo:
        `${employee?.firstname || ""} ${employee?.lastname || ""}`.trim() ||
        "-",
      priority: task?.priority || "-",
      status: task?.status || "-",
      dueDate: task?.selectDate,
      createdAt: task?.createdAt,
    })),
  );

  const formatDate = (value) => {
    const d = value ? new Date(value) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : "-";
  };

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
              <table className="w-full table-fixed border-collapse">
                <thead className="  text-sm uppercase tracking-wide">
                  <tr className="border-b-2 border-black  text-left">
                    <th className="w-[22%] px-4 py-3 text-left">Task</th>
                    <th className="w-[28%] px-4 py-3 text-left">Description</th>
                    <th className="w-[14%] px-4 py-3 text-left">Assigned To</th>
                    <th className="w-[10%] px-4 py-3 text-left">Priority</th>
                    <th className="w-[10%] px-4 py-3 text-left">Status</th>
                    <th className="w-[8%] px-4 py-3 text-left">Due Date</th>
                    <th className="w-[8%] px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {taskRows.map((row) => (
                    <tr
                      key={row.rowKey}
                      className="border-b border-black hover:bg-gray-50 transition"
                    >
                      {/* Task */}
                      <td className="px-4 py-3 font-medium text-gray-800 truncate">
                        {row.taskTitle}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-sm text-gray-600 line-clamp-2">
                        {row.taskDescription}
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap capitalize">
                        {row.assignedTo}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full
                ${
                  row.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : row.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-600"
                }`}
                        >
                          {row.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-2 py-3">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-900 text-white">
                          {row.status}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(row.dueDate)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}
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
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-black hover:text-white"
                  >
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
