import { AppSidebar } from "../../../components/app-siderbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";

const INDEX_BACKEND_API_URL = import.meta.env.VITE_INDEX_BACKEND_URL;

// this is for the show booked events
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    throw new Error("There was a problem");
  }

  return res.json();
};

export default function MyBookingPage() {
  const { data } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetcher(`${INDEX_BACKEND_API_URL}/my-booking`),
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Customer dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Bookings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

          <div className="min-h-[60vh] rounded-xl p-4">
            <div className="left-4 p-2 my-4 rounded-xl max-w-250 flex flex-col gap-10">
              {data?.events?.map((booking) => (
                <div
                  key={booking._id}
                  className="mb-4 bg-muted/50 p-3 rounded-xl"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-bold text-xl">{booking.eventName}</h2>
                      <p>Wedding - Classic Elegant</p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <span className=" bg-black max-h-max max-w-max px-3 text-xs rounded-md text-white">
                        in-progress
                      </span>
                      <span className="bg-[#dbeafe] max-h-max max-w-max px-4 text-xs rounded-md text-[#193cba]">
                        partial
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 my-3">
                    <div>
                      <span>Date</span>
                      <p>{new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span>Venue</span>
                      <h3>{booking.venue}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 my-3">
                    <div>
                      <span>Guest Count</span>
                      <h3>{booking.guestCount} guests</h3>
                    </div>
                    <div>
                      <span>Budgets</span>
                      <p>{booking.totalAmount}</p>
                    </div>
                  </div>
                  <div className="">
                    <div className="relative">
                      <p>Event Progress</p>
                      <p className="">{booking.progress}%</p>
                      <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${booking.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-4" />
                  <div className="flex justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Payment</span>
                      <span className="font-semibold text-sm">
                        ${booking.totalPaid} / {booking.totalAmount}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenPaymentModal(booking?._id)}
                      className="bg-black rounded-xl p-2"
                    >
                      <span className="text-white">Make Payment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
