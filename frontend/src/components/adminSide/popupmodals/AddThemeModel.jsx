import React, { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@mantine/core";
import { Button } from "@mantine/core";

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

  const themeMutation = useMutation({
    mutationFn: () => createTheme({ themeName, themeType, themePrice }),
    onSuccess: (data) => {
      console.log("success", data);
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
            <h1>Add Event</h1>
            <button onClick={closeAddThemeModel}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-10 my-5">
            <Input
              type="text"
              placeholder="Enter Event Name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Event Type"
              value={themeType}
              onChange={(e) => setThemeType(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Event Price"
              value={themePrice}
              onChange={(e) => setThemePrice(e.target.value)}
            />
            <Button
              onClick={(e) => themeMutation.mutate()}
              variant="filled"
              color="rgba(0, 0, 0, 1)"
            >
              Add Theme
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
