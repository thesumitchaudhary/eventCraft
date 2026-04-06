import { AppSidebar } from "../../../components/app-siderbar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const bookings = [
  {
    id: "BK-1021",
    event: "Annual Meetup",
    date: "2026-04-10",
    status: "Confirmed",
    amount: "$120",
  },
  {
    id: "BK-1022",
    event: "Product Workshop",
    date: "2026-04-18",
    status: "Pending",
    amount: "$80",
  },
  {
    id: "BK-1023",
    event: "Team Conference",
    date: "2026-05-02",
    status: "Cancelled",
    amount: "$0",
  },
]

export default function MyBookingPage() {
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

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 p-4">
            <h2 className="text-lg font-semibold">My Bookings</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all your event bookings.
            </p>
          </div>

          <div className="min-h-[60vh] rounded-xl bg-muted/50 p-4">
            <table className="w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Booking ID</th>
                  <th className="border px-4 py-2 text-left">Event</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="border px-4 py-2">{booking.id}</td>
                    <td className="border px-4 py-2">{booking.event}</td>
                    <td className="border px-4 py-2">{booking.date}</td>
                    <td className="border px-4 py-2">{booking.status}</td>
                    <td className="border px-4 py-2">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
