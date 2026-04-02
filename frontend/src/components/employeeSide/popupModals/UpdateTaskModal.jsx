import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Select, TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4041/api";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};


const statusMap = {
  Pending: "pending",
  "In Progress": "in-progress",
  Completed: "completed",
};

const fileToBase64 = (inputFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const payload = result.includes(",") ? result.split(",")[1] : result;
      resolve(payload);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(inputFile);
  });

const UpdateTaskModal = ({ closeUpdateModal, task }) => {
  const [status, setStatus] = useState("");
  const [workUpdate, setWorkUpdate] = useState("");
  const [submitError, setSubmitError] = useState("");

  // floating states
  const [focusedStatus, setFocusedStatus] = useState(false);
  const [focusedWorkUpdate, setFocusedWorkUpdate] = useState(false);
  const [focusedFile, setFocusedFile] = useState(false);

  const floatingStatus = focusedStatus || status?.length > 0;
  const floatingWorkUpdate = focusedWorkUpdate || workUpdate?.length > 0;


  // file
  const [file, setFile] = useState(null);
  const floatingFile = focusedFile || file;

  // progress
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);

  const updateProgress = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    let value = ((clientX - rect.left) / rect.width) * 100;

    if (value <= 0) value = 0;
    if (value >= 100) value = 100;

    setProgress(value);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    updateProgress(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    updateProgress(e.clientX);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const getEmployeeId = () => {
    if (!task) return "";

    if (typeof task.assignTo === "string") return task.assignTo;
    if (task.assignTo && typeof task.assignTo === "object") {
      return task.assignTo._id || "";
    }

    if (typeof task.employeeId === "string") return task.employeeId;
    if (task.employeeId && typeof task.employeeId === "object") {
      return task.employeeId._id || "";
    }

    return "";
  };

  const createWorkUpdateMutation = useMutation({
    mutationFn: async () => {
      const taskId = task?._id;
      const employeeId = getEmployeeId();
      const normalizedStatus = statusMap[status] || "pending";
      const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!employeeId) {
        throw new Error("Employee ID is missing for this task");
      }

      let key = "";
      let fileName = "";
      let contentType = "";

      if (file) {
        fileName = file.name;
        contentType = file.type || "application/octet-stream";

        try {
          const uploadUrlRes = await fetch(`${API_BASE}/employee/work-updates/upload-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ fileName, contentType }),
          });

          const uploadUrlData = await uploadUrlRes.json().catch(() => ({}));
          if (!uploadUrlRes.ok) {
            throw new Error(uploadUrlData?.error || "Failed to generate upload URL");
          }

          key = uploadUrlData?.key || "";

          const s3UploadRes = await fetch(uploadUrlData.uploadURL, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: file,
          });

          if (!s3UploadRes.ok) {
            throw new Error("Failed to upload file to S3");
          }
        } catch (uploadErr) {
          const fileBase64 = await fileToBase64(file);

          const proxyRes = await fetch(`${API_BASE}/employee/work-updates/upload-file`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              fileName,
              contentType,
              fileBase64,
            }),
          });

          const proxyData = await proxyRes.json().catch(() => ({}));
          if (!proxyRes.ok) {
            throw new Error(proxyData?.error || uploadErr?.message || "File upload failed");
          }

          key = proxyData?.key || key;
          fileName = proxyData?.fileName || fileName;
          contentType = proxyData?.contentType || contentType;
        }
      }

      const createRes = await fetch(`${API_BASE}/employee/work-updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          taskId,
          employeeId,
          status: normalizedStatus,
          progress: roundedProgress,
          note: workUpdate,
          key,
          fileName,
          contentType,
        }),
      });

      const created = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(created?.error || "Failed to create work update");
      }

      return created;
    },
    onSuccess: () => {
      closeUpdateModal();
    },
    onError: (err) => {
      const message = err?.message || "Failed to submit update";
      setSubmitError(message === "Failed to fetch" ? "Upload blocked by network/CORS. Please retry." : message);
    },
  });

  const handleSubmit = () => {
    setSubmitError("");
    createWorkUpdateMutation.mutate();
  };

  return (
    <div className="z-10">
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closeUpdateModal}
      />

      {/* modal */}
      <div
        className="fixed top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        max-w-xl w-full
        bg-white rounded-2xl p-6 z-50 shadow-lg"
      >
        {/* header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Update Task Status
            </h3>
            <p className="text-sm text-gray-500">
              {task?.taskTitle || "Update assigned task"}
            </p>
          </div>

          <button
            onClick={closeUpdateModal}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* form */}
        <div className="space-y-6">
          {/* Select */}
          <Select
            value={status}
            onChange={setStatus}
            label="Select Status"
            placeholder={focusedStatus ? "Select Status" : ""}
            data={["Pending", "In Progress", "Completed"]}
            onFocus={() => setFocusedStatus(true)}
            onBlur={() => setFocusedStatus(false)}
            classNames={{
              root: "relative",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-2 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 pointer-events-none text-sm text-gray-400 transition-all ${
                floatingStatus ? "-translate-y-5 text-xs text-gray-900" : ""
              }`,
            }}
          />

          {/* Work Update */}
          <TextInput
            label="Work Update"
            placeholder={
              focusedWorkUpdate
                ? "Floral arrangements ordered. Setting up stage decorations."
                : ""
            }
            value={workUpdate}
            onChange={(e) => setWorkUpdate(e.currentTarget.value)}
            onFocus={() => setFocusedWorkUpdate(true)}
            onBlur={() => setFocusedWorkUpdate(false)}
            classNames={{
              root: "relative",
              input:
                "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-2 focus:outline-none focus:border-gray-900",
              label: `absolute left-0 top-2 pointer-events-none text-sm text-gray-400 transition-all ${
                floatingWorkUpdate ? "-translate-y-5 text-xs text-gray-900" : ""
              }`,
            }}
          />

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Event Progress</span>
              <span className="font-medium">{Math.floor(progress)}%</span>
            </div>

            <div
              ref={barRef}
              className="w-full h-3 bg-gray-200 rounded-full relative cursor-pointer"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="bg-black h-3 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border border-black rounded-full shadow-sm"></span>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              onFocus={() => setFocusedFile(true)}
              onBlur={() => setFocusedFile(false)}
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 px-0 pt-5 pb-2 focus:outline-none focus:border-black"
            />

            <label
              className={`absolute left-0 top-2 text-sm text-gray-400 transition-all ${
                floatingFile ? "-translate-y-5 text-xs text-gray-900" : ""
              }`}
            >
              Upload Work Evidence
            </label>
          </div>
        </div>

        {submitError && (
          <p className="mt-4 text-sm text-red-600">{submitError}</p>
        )}

        {/* button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={createWorkUpdateMutation.isPending}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-70"
          >
            {createWorkUpdateMutation.isPending ? "Uploading..." : "Update Work"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
