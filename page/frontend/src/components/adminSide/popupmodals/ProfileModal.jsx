import React, { useState, useContext, useEffect, useRef } from "react";
import { TextInput, Button } from "@mantine/core";
import { X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

// this is for use context
import { Context } from "../../../context/Context";

const upadateAdmin = async ({id, firstname, lastname, email, phone, profileImage, removeProfileImage}) => {
  try {
    const res = await fetch(`http://localhost:4041/api/admin/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        profileImage,
        removeProfileImage,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message || "Request Failed");
    }

    return body;
  } catch (error) {
    console.log(error);
  }
};

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const ProfileModal = ({ closeProfileModel }) => {
  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    phone,
    setPhone,
  } = useContext(Context);

  const [focusedFirstname, setFocusedFirstname] = useState(false);
  const [focusedLastname, setFocusedLastname] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPhone, setFocusedPhone] = useState(false);

  const floatingFirstname = focusedFirstname || firstname?.length > 0;
  const floatingLastname = focusedLastname || lastname?.length > 0;
  const floatingPhone = focusedPhone || phone?.length > 0;
  const floatingEmail = focusedEmail || email?.length > 0;

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["adminInformation"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/me"),
  });

  // console.log(data?.admin?.userId._id);

  // this is for update admin which is attached user model details
  const updateAdminMutation = useMutation({
    mutationFn: ({ id, firstname, lastname, email, phone, profileImage, removeProfileImage }) =>
      upadateAdmin({ id, firstname, lastname, email, phone, profileImage, removeProfileImage }),
    onSuccess: async (data) => {
      console.log(data);
      await refetch();
      closeProfileModel(); // Close modal
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const user = data?.admin?.userId;
    const admin = data?.admin;

    if (!user && !admin) return;

    setFirstname(user?.firstname ?? "");
    setLastname(user?.lastname ?? "");
    setPhone(admin?.phone ?? "");
    setEmail(user?.email ?? "");
    setImage(user?.profileImageUrl ?? user?.profileImage ?? null);
  }, [data, setFirstname, setLastname, setPhone, setEmail]);

  // this is for the proile picture upload
 const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setCameraError("");
    setIsVideoReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported in this browser.");
      return;
    }

    if (
      !window.isSecureContext &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setCameraError("Camera requires HTTPS or localhost.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      if (err?.name === "NotAllowedError") {
        setCameraError(
          "Camera permission blocked. Allow camera access in browser settings.",
        );
        return;
      }

      if (err?.name === "NotFoundError") {
        setCameraError("No camera device was found on this system.");
        return;
      }

      if (err?.name === "NotReadableError") {
        setCameraError(
          "Camera is already in use by another app. Close it and try again.",
        );
        return;
      }

      setCameraError("Unable to start camera. Please try again.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setIsVideoReady(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    const frameWidth = video.videoWidth || 320;
    const frameHeight = video.videoHeight || 240;

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Wait a second for camera to initialize, then capture.");
      return;
    }

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);

    stopCamera();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (!isCameraOpen || !stream || !videoRef.current) return;

    const videoElement = videoRef.current;
    videoElement.srcObject = stream;
    videoElement.play().catch(() => null);
  }, [isCameraOpen, stream]);

  return (
    <>
      <div className="z-1">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeProfileModel}
        />

        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-full bg-white rounded-2xl p-4 z-50 max-h-[90vh] flex flex-col">
          <div className="flex justify-between">
            <div>
              <h1>Update Profile</h1>
              <span>Update your account information</span>
            </div>
            <button onClick={closeProfileModel}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
            <div className=" p-4">
              <div className="bg-white rounded-2xl p-5">
                {/* Preview */}
                <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile preview"
                      className="object-cover w-full h-full"
                    />
                  ) : isCameraOpen ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      onLoadedMetadata={() => setIsVideoReady(true)}
                      onCanPlay={() => setIsVideoReady(true)}
                      className="w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">
                      No Image Selected
                    </span>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {cameraError && (
                  <p className="mt-2 text-xs text-red-600">{cameraError}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  {!isCameraOpen && !image && (
                    <>
                      <label className="flex-1 cursor-pointer bg-gray-200 text-center py-2 rounded-lg hover:bg-gray-300">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUpload}
                        />
                      </label>

                      <button
                        onClick={startCamera}
                        className="flex-1 bg-black text-white py-2 rounded-lg hover:opacity-90"
                      >
                        Camera
                      </button>
                    </>
                  )}

                  {isCameraOpen && (
                    <>
                      <button
                        onClick={takePhoto}
                        disabled={!isVideoReady}
                        title={
                          isVideoReady
                            ? "Capture photo"
                            : "Camera is loading..."
                        }
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Capture
                      </button>

                      <button
                        onClick={stopCamera}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {image && (
                    <>
                      <button
                        onClick={() => setImage(null)}
                        className="flex-1 bg-gray-300 py-2 rounded-lg"
                      >
                        Retake
                      </button>

                      <button 
                        onClick={() => updateAdminMutation.mutate({
                          id: data?.admin?.userId._id,
                          firstname,
                          lastname,
                          email,
                          phone,
                          profileImage: image,
                          removeProfileImage: false,
                        })}
                        disabled={updateAdminMutation.isPending}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                      >
                        {updateAdminMutation.isPending ? "Uploading..." : "Upload"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <TextInput
                label="First Name"
                placeholder={focusedFirstname ? "e.g. Johnson Wedding" : ""}
                value={firstname ?? ""}
                onChange={(e) => setFirstname(e.currentTarget.value)}
                onFocus={() => setFocusedFirstname(true)}
                onBlur={() => setFocusedFirstname(false)}
                classNames={{
                  root: "relative mt-5",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingFirstname
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Last Name"
                placeholder={focusedLastname ? "e.g. Johnson Wedding" : ""}
                value={lastname ?? ""}
                onChange={(e) => setLastname(e.currentTarget.value)}
                onFocus={() => setFocusedLastname(true)}
                onBlur={() => setFocusedLastname(false)}
                classNames={{
                  root: "relative mt-5",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingLastname
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Phone"
                placeholder={focusedPhone ? "e.g. Johnson Wedding" : ""}
                value={phone ?? ""}
                onChange={(e) => setPhone(e.currentTarget.value)}
                onFocus={() => setFocusedPhone(true)}
                onBlur={() => setFocusedPhone(false)}
                classNames={{
                  root: "relative mt-5",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingPhone ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                disabled
                label="Email"
                placeholder={focusedEmail ? "e.g. Johnson Wedding" : ""}
                value={email ?? ""}
                onChange={(e) => setEmail(e.currentTarget.value)}
                onFocus={() => setFocusedEmail(true)}
                onBlur={() => setFocusedEmail(false)}
                classNames={{
                  root: "relative mt-5",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingEmail ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
            <div>
              <Button onClick={() => updateAdminMutation.mutate({
                id:data?.admin?.userId._id,
                firstname,
                lastname,
                email,
                phone,
              })} className="w-full" variant="filled" color="#000">
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
