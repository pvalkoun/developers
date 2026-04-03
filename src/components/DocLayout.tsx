import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DocSidebar } from "@/components/DocSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { products } from "@/data/productData";
import { getEndpointById } from "@/data/apiData";
import { getIntegration } from "@/data/integrationData";

function useBreadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [{ label: "Home", path: "/" }];

  if (parts[0] === "products" && parts[1]) {
    const product = products.find(p => p.id === parts[1]);
    if (product) {
      crumbs.push({ label: product.name, path: `/products/${parts[1]}` });

      if (parts[2] === "guide") {
        crumbs.push({ label: "Setup Guide", path: `/products/${parts[1]}/guide` });
      } else if (parts[2] === "api" && parts[3]) {
        const ep = getEndpointById(parts[3]);
        crumbs.push({ label: "API Reference", path: `/products/${parts[1]}/api/${parts[3]}` });
        if (ep) crumbs.push({ label: ep.name, path: `/products/${parts[1]}/api/${parts[3]}` });
      } else if (parts[2] === "integrations" && parts[3]) {
        const ig = getIntegration(parts[3]);
        crumbs.push({ label: "Integrations", path: `/products/${parts[1]}/integrations/${parts[3]}` });
        if (ig) crumbs.push({ label: ig.platform, path: `/products/${parts[1]}/integrations/${parts[3]}` });
      }
    }
  }

  return crumbs;
}

export function DocLayout() {
  const crumbs = useBreadcrumbs();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DocSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <BreadcrumbItem key={crumb.path}>
                    {i < crumbs.length - 1 ? (
                      <>
                        <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-5xl">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
