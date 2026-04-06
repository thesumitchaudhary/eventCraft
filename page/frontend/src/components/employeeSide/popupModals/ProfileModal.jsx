import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { X } from "lucide-react";
import { TextInput, Button } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";

// this is for use context
import { Context } from "../../../context/Context";

// this is for update employee which is attached in user
const updateEmployee = async ({
  id,
  firstname,
  lastname,
  email,
  phone,
  profileImage,
  removeProfileImage,
}) => {
  try {
    const res = await fetch(`http://localhost:4041/api/employee/user/${id}`, {
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

// this is for fetch details
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const ProfileModal = ({ closeProfileModal }) => {
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

  // fetch user details
  const { data } = useQuery({
    queryKey: ["employeeDetails"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/me"),
  });

  // console.log(data);
  // console.log(data?.employee?.userId?._id)

  // this for update user
  const updateEmployeeProfilMutation = useMutation({
    mutationFn: ({
      id,
      firstname,
      lastname,
      email,
      phone,
      profileImage,
      removeProfileImage,
    }) =>
      updateEmployee({
        id,
        firstname,
        lastname,
        email,
        phone,
        profileImage,
        removeProfileImage,
      }),
    onSuccess: () => {
      console.log("updated successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const user = data?.employee?.userId ?? null;
    const admin = data?.employee ?? null;

    setFirstname(user.firstname ?? "");
    setLastname(user.lastname ?? "");
    setEmail(user.email ?? "");
    setPhone(admin.phone ?? "");
  }, [data, setFirstname, setLastname, setEmail, setPhone]);

  // this is for the proile picture upload
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [showStoredImage, setShowStoredImage] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const existingProfileImage = data?.employee?.userId?.profileImageUrl || null;
  const previewImage = image || (showStoredImage ? existingProfileImage : null);
  const hasPendingUpload = Boolean(image) && String(image).startsWith("data:image/");

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
        audio: false,
      });

      streamRef.current = mediaStream;
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

      if (err?.name === "AbortError") {
        setCameraError("Camera startup was interrupted. Try opening it again.");
        return;
      }

      setCameraError("Unable to start camera. Please try again.");
    }
  };

  const stopCamera = useCallback(() => {
    const activeStream = streamRef.current;

    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    setStream(null);
    setIsCameraOpen(false);
    setIsVideoReady(false);
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setCameraError("Camera frame is still loading. Try capture again.");
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
    if (!ctx) {
      setCameraError("Unable to process camera image. Please try again.");
      return;
    }

    ctx.drawImage(video, 0, 0, frameWidth, frameHeight);

    const dataUrl = canvas.toDataURL("image/png");
    setShowStoredImage(false);
    setImage(dataUrl);

    stopCamera();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCameraError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCameraError("Image is too large. Max size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCameraError("");
      setShowStoredImage(false);
      setImage(String(reader.result || ""));
    };
    reader.onerror = () => {
      setCameraError("Unable to read selected image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = () => {
    const userId = data?.employee?.userId?._id;

    if (!userId) {
      setCameraError("User data is not ready yet. Please try again.");
      return;
    }

    if (!image || !String(image).startsWith("data:image/")) {
      setCameraError("Please capture or select an image before upload.");
      return;
    }

    updateEmployeeProfilMutation.mutate({
      id: userId,
      profileImage: image,
    });
  };

  const handleRetake = () => {
    setCameraError("");
    setImage(null);
    setShowStoredImage(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (!isCameraOpen || !stream || !videoRef.current) return;

    const videoElement = videoRef.current;
    videoElement.srcObject = stream;

    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        setCameraError(
          "Unable to start video preview. Check browser camera permissions.",
        );
      });
    }

    return () => {
      videoElement.srcObject = null;
    };
  }, [isCameraOpen, stream]);

  return (
    <div className="z-10">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closeProfileModal}
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-full max-h-[90vh] bg-white rounded-2xl p-6 z-50 shadow-lg flex flex-col overflow-hidden"
      >
        <div className="flex justify-between">
          <div>
            <h4>Update Profile</h4>
            <p>Update your account information</p>
          </div>
          <button
            onClick={closeProfileModal}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
          <div className="p-4">
            <div className="bg-white rounded-2xl p-5">
              <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
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

              <div className="flex gap-3 mt-4">
                {!isCameraOpen && !previewImage && (
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
                        isVideoReady ? "Capture photo" : "Camera is loading..."
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

                {previewImage && (
                  <>
                    <button
                      onClick={handleRetake}
                      className={`bg-gray-300 py-2 rounded-lg ${
                        hasPendingUpload ? "flex-1" : "w-full"
                      }`}
                    >
                      Retake
                    </button>

                    {hasPendingUpload && (
                      <button
                        onClick={uploadProfileImage}
                        disabled={updateEmployeeProfilMutation.isPending}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-60"
                      >
                        {updateEmployeeProfilMutation.isPending
                          ? "Uploading..."
                          : "Upload"}
                      </button>
                    )}
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
                    : "-translate-y-5 text-xs text-gray-900"
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
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingLastname
                    ? "-translate-y-5 text-xs text-gray-900"
                    : "-translate-y-5 text-xs text-gray-900"
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
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingPhone
                    ? "-translate-y-5 text-xs text-gray-900"
                    : "-translate-y-5 text-xs text-gray-900"
                }`,
              }}
            />
          </div>

          <div>
            <TextInput
              disabled
              label="Email @ReadOnly"
              placeholder={focusedEmail ? "e.g. Johnson Wedding" : ""}
              value={email ?? ""}
              onChange={(e) => setEmail(e.currentTarget.value)}
              onFocus={() => setFocusedEmail(true)}
              onBlur={() => setFocusedEmail(false)}
              classNames={{
                root: "relative mt-1",
                input:
                  "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                  floatingEmail
                    ? "-translate-y-5 text-xs text-gray-900"
                    : "-translate-y-5 text-xs text-gray-900"
                }`,
              }}
            />
          </div>

          <div>
            <Button
              onClick={() =>
                updateEmployeeProfilMutation.mutate({
                  id: data?.employee?.userId?._id,
                  firstname,
                  lastname,
                  email,
                  phone,
                })
              }
              disabled={updateEmployeeProfilMutation.isPending}
              variant="filled"
              color="#000"
              className="border p-1 w-full rounded-md bg-black text-white font-medium"
            >
              {updateEmployeeProfilMutation.isPending
                ? "Saving..."
                : "Update Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
