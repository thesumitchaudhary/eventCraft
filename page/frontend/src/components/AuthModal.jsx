import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";

import SignupForm from "./SignupForm";
import SigninForm from "./SigninForm";

const AuthModal = ({ setOpen, defaultMode="signin" }) => {
  const [mode, setMode] = useState(defaultMode);
  const modalRef = useRef(null);
  const safeSetOpen = typeof setOpen === "function" ? setOpen : () => {};

  useEffect(() =>{
    setMode(defaultMode)
  },[defaultMode])

  // OPEN animation
  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      {
        y: 24,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      },
    );
  }, []);

  // CLOSE animation (outside click)
  const closeModal = () => {
    gsap.to(modalRef.current, {
      y: -24,
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      ease: "power3.in",
      onComplete: () => safeSetOpen(false),
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={closeModal} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-white w-full max-w-[450px] p-4 rounded-xl shadow-lg"
        >
          <div>
            <div className="flex justify-between">
              <div>
                <h1 className="font-semibold">Welcome to Eventify</h1>
                <p className="text-sm">
                  Sign in to your account or create a new one
                </p>
              </div>
              <button onClick={() => safeSetOpen(false)}>
                <X />
              </button>
            </div>
            <div className="flex gap-4 bg-gray-200 rounded-xl justify-between p-2 mb-4">
              <button
                className={`flex-1 py-1 rounded-lg ${
                  mode === "signup" ? "bg-white shadow" : ""
                }`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>

              <button
                className={`flex-1 py-1 rounded-lg ${
                  mode === "signin" ? "bg-white shadow" : ""
                }`}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
            </div>
          </div>

          {mode === "signup" ? <SignupForm /> : <SigninForm />}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
