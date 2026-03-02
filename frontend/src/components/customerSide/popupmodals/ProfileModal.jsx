import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { TextInput, Button } from "@mantine/core";

// this come from context.jsx file
import { Context } from "../../../context/Context";

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
};
const ProfileModal = ({ closeProfileModal }) => {
  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    address,
    setAddress,
    phone,
    setPhone,
  } = useContext(Context);

  const [focusedFirstname, setFocusedFirstname] = useState(false);
  const [focusedLastname, setFocusedLastname] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPhone, setFocusedPhone] = useState(false);
  const [focusedAddress, setFocusedAddress] = useState(false);

  const floatingFirstname = focusedFirstname || firstname?.length > 0;
  const floatingLastname = focusedLastname || lastname?.length > 0;
  const floatingEmail = focusedEmail || email?.length > 0;
  const floatingPhone = focusedPhone || phone?.length > 0;
  const floatingAddress = focusedAddress || address?.length > 0;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["theuserdetail"],
    queryFn: () => fetcher("http://localhost:4041/api/customer/me"),
  });

  useEffect(() => {
    if (data?.data) {
      setFirstname(data.data.firstName ?? "");
      setLastname(data.data.lastName ?? "");
      setPhone(data.data.phone ?? "");
      setAddress(data.data.address ?? "");
      setEmail(data.data.email ?? "");
    }
  }, [data, setFirstname, setLastname, setEmail, setPhone, setAddress]);

  return (
    <>
      <div>
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeProfileModal}
        />

        <div
          className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                max-w-xl w-full
                bg-white rounded-2xl p-4 z-50"
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Update Profile</h1>
              <p>Update your account information</p>
            </div>
            <button onClick={closeProfileModal}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <TextInput
                label="First Name"
                placeholder={focusedFirstname ? "e.g. Johnson Wedding" : ""}
                value={data?.data?.firstName}
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
                value={lastname}
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
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Phone"
                placeholder={focusedPhone ? "e.g. Johnson Wedding" : ""}
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                onFocus={() => setFocusedPhone(true)}
                onBlur={() => setFocusedPhone(false)}
                classNames={{
                  root: "relative mt-1",
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
                label="Address"
                placeholder={focusedAddress ? "e.g. Johnson Wedding" : ""}
                value={address}
                onChange={(e) => setAddress(e.currentTarget.value)}
                onFocus={() => setFocusedAddress(true)}
                onBlur={() => setFocusedAddress(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingAddress
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                disabled
                label="Email @ReadOnly"
                placeholder={focusedEmail ? "e.g. Johnson Wedding" : ""}
                value={"chaudharysumit9325@gmail.com"}
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
                varient="filled"
                color="#000"
                className="border p-1 w-full rounded-md bg-black text-white font-medium"
              >
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
