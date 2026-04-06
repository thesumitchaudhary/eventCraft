import React, { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { TextInput, Input, Button } from "@mantine/core";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const createTheme = async ({ themeName, themeType, themePrice }) => {
  try {
    const res = await fetch(`${API_URL}/admin/addEventTheme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        themeName,
        themeType,
        themePrice,
      }),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const AddThemeModel = ({ closeAddThemeModel }) => {
  const [themeName, setThemeName] = useState("");
  const [themeType, setThemeType] = useState("");
  const [themePrice, setThemePrice] = useState("");

  const [focusedThemeName, setFocusedThemeName] = useState(false);
  const [focusedThemeType, setFocusedThemeType] = useState(false);
  const [focusedThemePrice, setFocusedThemePrice] = useState(false);

  const floatingThemeName = focusedThemeName || themeName?.length > 0;
  const floatingThemeType = focusedThemeType || themeType?.length > 0;
  const floatingThemePrice = focusedThemePrice || themePrice?.length > 0;

  const themeMutation = useMutation({
    mutationFn: () => createTheme({ themeName, themeType, themePrice }),
    onSuccess: (data) => {
      console.log("success");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md"></div>
      {/* Modal Box */}
      <div className="w-[1000px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col">
        <div className="fixed top-35 left-100 min-w-sm max-w-xl border border-gray-400 bg-white rounded-2xl p-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="2xl font-bold">Add New Event Theme</h1>
              <p>Create a new Theme for Events</p>
            </div>
            <button onClick={closeAddThemeModel}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-10 my-5">
            <div>
              <TextInput
                label="Theme Name"
                placeholder={focusedThemeName ? "Enter Event Name" : ""}
                value={themeName}
                onChange={(e) => setThemeName(e.currentTarget.value)}
                onFocus={() => setFocusedThemeName(true)}
                onBlur={() => setFocusedThemeName(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingThemeName
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Theme Type"
                placeholder={focusedThemeType ? "Enter Event Type" : ""}
                value={themeType}
                onChange={(e) => setThemeType(e.currentTarget.value)}
                onFocus={() => setFocusedThemeType(true)}
                onBlur={() => setFocusedThemeType(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingThemeType
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Theme Price"
                placeholder={focusedThemePrice ? "Enter Event Price" : ""}
                value={themePrice}
                onChange={(e) => setThemePrice(e.currentTarget.value)}
                onFocus={() => setFocusedThemePrice(true)}
                onBlur={() => setFocusedThemePrice(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingThemePrice
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <Button
                onClick={(e) => themeMutation.mutate()}
                variant="filled"
                color="rgba(0, 0, 0, 1)"
                className="w-full"
              >
                Add Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
