import React, { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// import header and footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// import add theme model
import { AddThemeModel } from "./popupmodals/AddThemeModel";

// this is api variable
const API_URL = import.meta.env.VITE_BACKEND_URL;

// this is used for show the data from the mongodb via fetch request
const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

// this is used for update the data
const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/admin/deleteEventTheme/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return await res.json();
};

const updateUser = async ({ id, themeName, themeType, themePrice }) => {
  try {
    const res = await fetch(`${API_URL}/admin/updateEventTheme/${id}`, {
      method: "PUT",
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

    if (!res.ok) {
      throw new Error("Failed to update theme");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const AddTheme = () => {
  const [openThemeModel, setOpenThemeModel] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (AddThemeModel) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [AddThemeModel]);

  const queryClient = useQueryClient();

  const closeAddThemeModel = () => {
    setOpenThemeModel((oldState) => false);
  };

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["EventThemesDetails"],
    queryFn: async () => {
      const res = await fetcher(`${API_URL}/admin/getAllEventTheme`);
      return Array.isArray(res) ? res : [];
    },
  });

  // this is delete usemutation
  const themeDeleteMutation = useMutation({
    mutationFn: (themeId) => deleteUser(themeId),

    onMutate: () => {
      toast.loading("Deleting theme...", { id: "delete-theme" });
    },

    onSuccess: () => {
      toast.success("Theme deleted successfully", { id: "delete-theme" });
      queryClient.invalidateQueries(["EventThemesDetails"]);
    },

    onError: () => {
      toast.error("Failed to delete theme", { id: "delete-theme" });
    },
  });

  // this is update mutation
  const themeUpdateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Theme updated");
      queryClient.invalidateQueries(["EventThemesDetails"]);
      setEditRow(null);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex justify-between">
            <div>
              <h3>Theme Management</h3>
              <span>total theme: {data.length}</span>
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
          <div className="overflow-x-auto p-5 bg-white rounded-xl shadow">
            <table className="min-w-full">
              {/* TABLE HEADER */}
              <thead className=" sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 border-b font-semibold">
                    Theme Name
                  </th>
                  <th className="text-left px-4 py-3 border-b font-semibold">
                    Theme Type
                  </th>
                  <th className="text-left px-4 py-3 border-b font-semibold">
                    Theme Price
                  </th>
                  <th className="text-center px-4 py-3 border-b font-semibold">
                    Update
                  </th>
                  <th className="text-center px-4 py-3 border-b font-semibold">
                    Delete
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {/* LOADING STATE */}
                {isLoading && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Loading themes...
                    </td>
                  </tr>
                )}

                {/* EMPTY STATE */}
                {!isLoading && data.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No themes found
                    </td>
                  </tr>
                )}

                {/* DATA ROWS */}
                {!isLoading &&
                  data.map((theme, index) => (
                    <tr key={theme._id}>
                      <td className="px-4 py-3 border-b">
                        <input
                          type="text"
                          value={
                            editRow?._id === theme._id
                              ? editRow.themeName
                              : theme.themeName
                          }
                          onChange={(e) =>
                            setEditRow((prev) => ({
                              ...(prev?._id === theme._id ? prev : theme),
                              themeName: e.target.value,
                            }))
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border-b">
                        <input
                          type="text"
                          value={
                            editRow?._id === theme._id
                              ? editRow.themeType
                              : theme.themeType
                          }
                          onChange={(e) =>
                            setEditRow((prev) => ({
                              ...(prev?._id === theme._id ? prev : theme),
                              themeType: e.target.value,
                            }))
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border-b font-medium">
                        <input
                          type="text"
                          value={
                            editRow?._id === theme._id
                              ? editRow.themePrice
                              : theme.themePrice
                          }
                          onChange={(e) =>
                            setEditRow((prev) => ({
                              ...(prev?._id === theme._id ? prev : theme),
                              themePrice: e.target.value,
                            }))
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border-b text-center">
                        <button
                          disabled={editRow?._id !== theme._id}
                          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black px-4 py-1 rounded-lg"
                          onClick={() =>
                            themeUpdateMutation.mutate({
                              id: editRow._id,
                              themeName: editRow.themeName,
                              themeType: editRow.themeType,
                              themePrice: editRow.themePrice,
                            })
                          }
                          // className="bg-yellow-400 disabled:opacity-50"
                        >
                          Update
                        </button>
                      </td>

                      <td className="px-4 py-3 border-b text-center">
                        <button
                          onClick={() => themeDeleteMutation.mutate(theme._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddTheme;
