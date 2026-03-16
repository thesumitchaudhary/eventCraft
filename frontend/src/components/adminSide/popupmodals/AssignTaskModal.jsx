import React, { useState } from "react";
import { X } from "lucide-react";
import { Select, TextInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body;
};

const assignTask = async ({
  eventId,
  taskTitle,
  taskDescription,
  assignTo,
  priority,
  selectDate,
}) => {
  const res = await fetch(`${API_URL}/admin/createTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventId,
      taskTitle,
      taskDescription,
      assignTo,
      priority,
      selectDate,
    }),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "There was a problem");
  }

  return body;
};

const AssignTaskModal = ({ closeTaskModal }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState(null);
  const [priority, setPriority] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const [focusedselectedEventId, setFocusedselectedEventId] = useState(false);
  const [focusedTaskTitle, setFocusedTaskTitle] = useState(false);
  const [focusedDescription, setFocusedDescription] = useState(false);
  const [focusedAssignTo, setFocusedAssignTo] = useState(false);
  const [focusedPriority, setFocusedPriority] = useState(false);
  const [focusedDueDate, setFocusedDueDate] = useState(false);

  const floatingselectedEventId = focusedselectedEventId || !!selectedEventId;
  const floatingTaskTitle = focusedTaskTitle || taskTitle.length > 0;
  const floatingDescription = focusedDescription || description.length > 0;
  const floatingAssignTo = focusedAssignTo || !!assignTo;
  const floatingPriority = focusedPriority || !!priority;
  const floatingDueDate = focusedDueDate || !!dueDate;

  const taskMutation = useMutation({
    mutationFn: () =>
      assignTask({
        eventId: selectedEventId,
        taskTitle: taskTitle.trim(),
        taskDescription: description.trim(),
        assignTo,
        priority: priority || "Medium",
        selectDate: dueDate ? new Date(dueDate).toISOString() : null,
      }),
    onSuccess: (data) => {
      console.log("Success", data);
    },
    onError: (error) => {
      console.log("Error", error.message);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () => fetcher(`http://localhost:4041/api/admin/showBookedEvent`),
  });

  // console.log(
  //   data?.customers.flatMap((customer) =>
  //     customer?.events.map((data) => data._id),
  //   ),
  // );

  const { data: empData } = useQuery({
    queryKey: ["showemployee"],
    queryFn: () => fetcher(`http://localhost:4041/api/employee/findEmployee`),
  });

  // console.log(empData?.users?.map((employee) => employee.firstname));
  // console.log(empData?.details?.map((details) => details.phone ));

  const selectedEvent =
    data?.customers
      ?.flatMap((customer) => customer?.events ?? [])
      ?.find((event) => event?._id === selectedEventId) ?? null;

  return (
    <div>
      <div
        className="fixed left-0 right-0 bottom-0 top-0 bg-gray-200/60"
        onClick={closeTaskModal}
      />
      <div className="fixed top-15 left-100 w-md border border-gray-400 bg-white rounded-2xl p-2 max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex justify-between">
          <div>
            <h1>Assign New Task</h1>
            <span className="text-sm">
              Create and assign a task to an employee for an event
            </span>
          </div>
          <button type="button" onClick={closeTaskModal}>
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5">
          <div className="flex flex-col">
            <Select
              value={selectedEventId}
              onChange={setSelectedEventId}
              label="Related Event"
              placeholder={focusedselectedEventId ? "Select Event" : ""}
              data={
                data?.customers.flatMap((customer) =>
                  customer?.events.map((data) => ({
                    value: data._id,
                    label: data.eventName,
                  })),
                ) ?? []
              }
              onFocus={() => setFocusedselectedEventId(true)}
              onBlur={() => setFocusedselectedEventId(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingselectedEventId
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
            <div>
              {selectedEvent && (
                <div className="mt-4 p-3 border bg-blue-100 rounded">
                  <h4 className="text-md font-medium text-blue-800">
                    Event Details
                  </h4>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Event Name</span>
                      <span className="text-sm text-black font-medium">
                        {selectedEvent.eventName}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Type</span>
                      <span className="text-sm text-black font-medium">
                        {selectedEvent.eventType}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Theme:</span>
                      <span className="text-sm text-black font-medium">
                        {selectedEvent.theme}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Date:</span>
                      <span className="text-sm text-black font-medium">
                        {new Date(selectedEvent.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Venue:</span>
                      <span className="text-sm text-black font-medium">
                        {selectedEvent.venue}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Guest:</span>
                      <span className="text-sm text-black font-medium">
                        {selectedEvent.guestCount}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Budget:</span>
                      <span className="text-sm text-black font-medium">
                        ${selectedEvent?.totalAmount}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">progress:</span>
                      <span className="text-sm text-black font-medium">0%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <TextInput
              label="Task Title"
              placeholder={focusedTaskTitle ? "e.g. Johnson Wedding" : ""}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.currentTarget.value)}
              onFocus={() => setFocusedTaskTitle(true)}
              onBlur={() => setFocusedTaskTitle(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingTaskTitle
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>

          <div className="flex flex-col">
            <TextInput
              label="Description"
              placeholder={focusedDescription ? "e.g. Task details" : ""}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              onFocus={() => setFocusedDescription(true)}
              onBlur={() => setFocusedDescription(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingDescription
                    ? "-translate-y-5 text-xs text-gray-900"
                    : ""
                }`,
              }}
            />
          </div>

          <div className="flex flex-col">
            <Select
              value={assignTo}
              onChange={setAssignTo}
              label="Assign To"
              placeholder={focusedAssignTo ? "Select Employee" : ""}
              data={
                Array.isArray(empData?.users)
                  ? empData.users.map((employee) => ({
                      value: String(employee?._id ?? ""),
                      label:
                        `${employee?.firstname ?? ""} ${employee?.lastname ?? ""}`.trim(),
                    }))
                  : []
              }
              onFocus={() => setFocusedAssignTo(true)}
              onBlur={() => setFocusedAssignTo(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingAssignTo ? "-translate-y-5 text-xs text-gray-900" : ""
                }`,
              }}
            />
          </div>

          <div className="flex flex-col">
            <Select
              value={priority}
              onChange={setPriority}
              label="Priority"
              placeholder={focusedPriority ? "Select Priority" : ""}
              data={["Low", "Medium", "High"]}
              onFocus={() => setFocusedPriority(true)}
              onBlur={() => setFocusedPriority(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingPriority ? "-translate-y-5 text-xs text-gray-900" : ""
                }`,
              }}
            />
          </div>

          <div className="flex flex-col">
            <DateInput
              clearable
              value={dueDate}
              onChange={setDueDate}
              label="Select Date"
              placeholder={focusedDueDate ? "yyyy-mm-dd" : ""}
              onFocus={() => setFocusedDueDate(true)}
              onBlur={() => setFocusedDueDate(false)}
              classNames={{
                root: "relative mt-3",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 pointer-events-none text-sm text-gray-400 transition-all duration-150 ${
                  floatingDueDate
                    ? "-translate-y-5 text-xs text-gray-900"
                    : "top-2"
                }`,
              }}
            />
          </div>

          <div>
            <Button
              onClick={() => taskMutation.mutate()}
              type="button"
              variant="filled"
              className="w-full border"
              color="#000"
            >
              Assign Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
