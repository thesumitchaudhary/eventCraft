import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

export default function AdminThemePage() {
  return (
    <SidebarProvider>
      <AdminSidebar />
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
                  <BreadcrumbLink href="#">Admin dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h4 className="font-semibold">Royal Classic</h4>
              <span className="text-sm text-muted-foreground">Wedding</span>
              <h3 className="mt-2 text-lg font-semibold">$7,500</h3>
              <span className="text-sm text-muted-foreground">Premium package</span>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h4 className="font-semibold">Minimal Corporate</h4>
              <span className="text-sm text-muted-foreground">Corporate</span>
              <h3 className="mt-2 text-lg font-semibold">$5,200</h3>
              <span className="text-sm text-muted-foreground">Business events</span>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h4 className="font-semibold">Bloom Garden</h4>
              <span className="text-sm text-muted-foreground">Engagement</span>
              <h3 className="mt-2 text-lg font-semibold">$4,300</h3>
              <span className="text-sm text-muted-foreground">Outdoor setup</span>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h4 className="font-semibold">Twinkle Kids</h4>
              <span className="text-sm text-muted-foreground">Birthday</span>
              <h3 className="mt-2 text-lg font-semibold">$2,100</h3>
              <span className="text-sm text-muted-foreground">Starter package</span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
