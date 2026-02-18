import React, { useState } from "react";
import { Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// import header and footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// import add theme model
import { AddThemeModel } from "./popupmodals/AddThemeModel";

// this is api variable
const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

const AddTheme = () => {
  const [openThemeModel, setOpenThemeModel] = useState(false);

  const closeAddThemeModel = () => {
    setOpenThemeModel((oldState) => false);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["EventThemesDetails"],
    queryFn: () => fetcher(`${API_URL}/admin/getAllEventTheme`),
  });

  console.log("API Data:", data);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex justify-between">
            <div>
              <h3>Theme Management</h3>
              <span>total theme:40</span>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <button
                  onClick={(e) => setOpenThemeModel((oldState) => true)}
                  className="flex bg-black rounded-2xl p-3 text-white"
                >
                  <Palette /> Create Themes
                </button>
                {openThemeModel && (
                  <AddThemeModel closeAddThemeModel={closeAddThemeModel} />
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search Theme"
                  className="border border-gray-400"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-10 rounded-2xl">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : !data || data.length === 0 ? (
              <p>No themes available</p>
            ) : (
              <div className="flex flex-cols gap-4">
                {data.map((theme) => (
                  <div key={theme._id} className="grid grid-rows-3 gap-y-2 border border-gray-300 p-5 rounded-2xl">
                    <h4>{theme.themeName}</h4>
                    <span>{theme.themeType}</span>
                    <span>₹{theme.themePrice}</span>
                    <span>Base theme price</span>
                    <div className="flex gap-4">
                    <button className="border py-1 px-2 rounded-xl bg-yellow-400">update</button>
                    <button className="border py-1 px-2 rounded-xl bg-red-600">delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddTheme;
