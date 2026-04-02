import React from "react";
import { CircleCheck, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// import header and footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// import LiveModal
import LiveIcon from "./components/LiveIcon";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const Completed = () => {
  const { data } = useQuery({
    queryKey: ["showSigninEmployee"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/myTask"),
  });

  const completedTasks = data?.employee?.tasks?.filter(
    (task) => task.status === "completed",
  );

  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          {!completedTasks || completedTasks.length === 0 ? (
            <div className="bg-gray-50 p-40 rounded-2xl grid place-items-center">
              <div>
                <CircleCheck className="text-green-500 h-20 w-30" />
                No completed tasks!
              </div>
            </div>
          ) : (
            <div>
              {completedTasks.map((task) => {
                return (
                  <div className="bg-green-50 p-5 border border-green-300 rounded-2xl">
                    <div className="flex justify-between">
                      <div>
                        <h4>{task.title}</h4>
                      </div>
                      <div className="bg-green-300 max-w-max px-3 p-1 rounded-2xl flex gap-1">
                        <CircleCheck className="fill-green-300 text-green-400" />
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span>{task.description}</span>
                    </div>
                    <div className="grid grid-rows-2 mt-4 bg-white p-2 rounded-2xl">
                      <h5 className="text-2xs font-bold">Completion Notes:</h5>
                      <span className="text-gray-600">
                        {task.completionNotes}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Completed;
