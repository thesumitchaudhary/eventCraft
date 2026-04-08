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
import { Clock4, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type TaskPriority = "Low" | "Medium" | "High";

interface EventSummary {
  eventName?: string;
  progress?: number;
}

interface EmployeeTask {
  _id: string;
  taskTitle: string;
  taskDescription: string;
  priority: TaskPriority;
  status: string;
  createdAt: string;
  selectDate: string;
  eventId?: EventSummary;
}

interface EmployeeTasksResponse {
  employee?: {
    tasks?: EmployeeTask[];
  };
  message?: string;
}

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "include" });

  const body = (await res.json()) as EmployeeTasksResponse;

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body as T;
};

export default function AdminDashboardPage() {
  const { data } = useQuery<EmployeeTasksResponse, Error>({
    queryKey: ["showSigninEmployeeAndItAssignTasks"],
    queryFn: () =>
      fetcher<EmployeeTasksResponse>(
        "http://localhost:4041/api/employee/myTask",
      ),
  });

  const tasks = data?.employee?.tasks ?? [];

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
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-50 p-5 rounded-2xl grid grid-rows-2"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h4 className="text-lg ">{task.taskTitle}</h4>
                    <div className="flex gap-5">
                      <span className="text-sm px-3 p-1 rounded-full">
                        {task.priority === "Medium" ? (
                          <span className="bg-[#fef9c2] text-[#90550b] p-1 px-5 rounded-md">
                            Medium
                          </span>
                        ) : task.priority === "High" ? (
                          <span className="text-red-500 bg-red-200  p-1 px-5 rounded-md">
                            High
                          </span>
                        ) : (
                          <span className="bg-[#dbfce7] text-[#157441]  p-1 px-5 rounded-md">
                            Low
                          </span>
                        )}
                      </span>
                      <span className="flex gap-1 text-xs bg-black text-white px-3 py-1 rounded-xl">
                        <Clock4 className="h-4 w-4" /> {task.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400">
                    {/* Arrange floral decorations for the Johnson wedding at Grand
                   Hotel */}
                    {task.taskDescription}
                  </p>
                </div>

                <div className="p-4 bg-purple-100 rounded-md border border-purple-500">
                  <div>
                    <span>Event Details</span>
                  </div>
                  <div>
                    <p className="grid grid-cols-2">
                      <span className="text-gray-600">
                        Event:{" "}
                        <span className="text-black ">
                          {task?.eventId?.eventName}
                        </span>
                      </span>
                      <span className="text-gray-600">
                        Progress:{" "}
                        <span className="text-blackl">
                          {task?.eventId?.progress}%
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 mt-7">
                  <div>
                    <p>Created</p>
                    <p className="font-bold text-xs">
                      {/* 2026-01-15 */}
                      {new Date(task?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>Due Date</p>
                    <p className="font-bold text-xs">
                      {/* 2026-01-25 */}
                      {new Date(task?.selectDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>Priority</p>
                    <p className="font-bold text-xs">
                      {task.priority === "Medium" ? (
                        <span>Medium</span>
                      ) : task.priority === "High" ? (
                        <span>High</span>
                      ) : (
                        <span>Low</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-4 bg-gray-100 p-2 rounded-2xl">
                  <span className="text-gray-600 font-bold text-xs">
                    Work Updates:
                  </span>
                  <span className="text-gray-400">
                    Floral arrangements ordered. Setting up stage decorations.
                  </span>
                </div>
                <div className="my-5 flex justify-end">
                  <button
                    //  onClick={() => openTaskUpdateModal(task)}
                    className="flex p-2 rounded-2xl bg-black text-white"
                  >
                    <Upload />
                    <span>update Statues</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
