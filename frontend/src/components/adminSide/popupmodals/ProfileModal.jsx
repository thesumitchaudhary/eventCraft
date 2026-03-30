import React, { useState, useContext, useEffect } from "react";
import { TextInput, Button } from "@mantine/core";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// this is for use context
import { Context } from "../../../context/Context";

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

  const { data } = useQuery({
    queryKey: ["adminInformation"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/me"),
  });

  console.log(data?.admin);

  useEffect(() => {
    const user = data?.admin?.userId;
    const admin = data?.admin;

    if (!user && !admin) return;

    setFirstname(user?.firstname ?? "");
    setLastname(user?.lastname ?? "");
    setPhone(admin?.phone ?? "");
    setEmail(user?.email ?? "");
  }, [data, setFirstname, setLastname, setPhone, setEmail]);

  return (
    <>
      <div className="z-1">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeProfileModel}
        />

        <div
          className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                max-w-xl w-full
                bg-white rounded-2xl p-4 z-50"
        >
          <div className="flex justify-between">
            <div>
              <h1>Update Profile</h1>
              <span>Update your account information</span>
            </div>
            <button onClick={closeProfileModel}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-2">
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
              <Button className="w-full" variant="filled" color="#000">
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
