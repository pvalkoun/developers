import { Outlet } from "react-router-dom";
import BackToTop from "@/components/BackToTop";
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
        if (ep) {
          crumbs.push({ label: ep.category || "API Reference", path: `/products/${parts[1]}` });
          crumbs.push({ label: ep.name, path: `/products/${parts[1]}/api/${parts[3]}` });
        }
      }
    }
  } else if (parts[0] === "integrations" && parts[1]) {
    const ig = getIntegration(parts[1]);
    crumbs.push({ label: "Integrations", path: "/" });
    if (ig) crumbs.push({ label: ig.platform, path: `/integrations/${parts[1]}` });
  } else if (parts[0] === "pre-call-auth") {
    crumbs.push({ label: "Call Authentication", path: "/pre-call-auth" });
  } else if (parts[0] === "resources" && parts[1] === "analytics") {
    crumbs.push({ label: "Resources", path: "/" });
    crumbs.push({ label: "Analytics", path: "/resources/analytics" });
  } else if (parts[0] === "resources" && parts[1] === "webhooks") {
    crumbs.push({ label: "Resources", path: "/" });
    crumbs.push({ label: "Webhooks", path: "/resources/webhooks" });
    if (parts[2] === "guide") {
      crumbs.push({ label: "Setup Guide", path: "/resources/webhooks/guide" });
    } else if (parts[2] === "api" && parts[3]) {
      crumbs.push({ label: "API Reference", path: "/resources/webhooks" });
      crumbs.push({ label: parts[3].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), path: `/resources/webhooks/api/${parts[3]}` });
    }
  } else if (parts[0] === "changelog") {
    crumbs.push({ label: "Resources", path: "/" });
    crumbs.push({ label: "Changelog", path: "/changelog" });
    if (parts[1] === "subscribe") {
      crumbs.push({ label: "Subscribe", path: "/changelog/subscribe" });
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
          <BackToTop />
        </div>
      </div>
    </SidebarProvider>
  );
}
