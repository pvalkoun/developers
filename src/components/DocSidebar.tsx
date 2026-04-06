import { useState } from "react";
import { downloadOpenApiSpec } from "@/lib/openApiExport";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Shield, Palette, BookOpen, Code2, Plug, ChevronLeft, ChevronDown, ChevronRight, Download, ClipboardList, Phone } from "lucide-react";
import { products } from "@/data/productData";
import { getEndpointsForProduct, getCategories } from "@/data/apiData";
import { getIntegrationsForProduct } from "@/data/integrationData";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import tuLogo from "@/assets/tu-icon.png";

export function DocSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const pathParts = location.pathname.split("/");
  const productId = pathParts[2] as "scp" | "bcd" | undefined;
  const product = products.find(p => p.id === productId);
  const isIntegrationsSection = pathParts[3] === "integrations";

  // Home-level sidebar
  if (!product && !isIntegrationsSection) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <NavLink to="/" className="flex items-center gap-2">
              <img src={tuLogo} alt="TransUnion" className="h-6 w-6" />
              <span className="text-sidebar-foreground font-semibold text-sm">Developer Docs</span>
            </NavLink>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Home className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Home</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/changelog" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Changelog</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Products</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/products/scp" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Shield className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Spoofed Call Protection</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/products/bcd" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Palette className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Branded Call Display</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Collapsible>
            <SidebarGroup>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer">
                <span className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  {!collapsed && <span>Integrations</span>}
                </span>
                {!collapsed && <ChevronRight className="h-3 w-3 transition-transform [[data-state=open]>&]:rotate-90" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/integrations/twilio" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium" className="pl-8 text-xs">
                          <Plug className="h-3.5 w-3.5 mr-2" />
                          {!collapsed && <span>Twilio</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/integrations/genesys" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium" className="pl-8 text-xs">
                          <Plug className="h-3.5 w-3.5 mr-2" />
                          {!collapsed && <span>Genesys Cloud CX</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Integrations section sidebar
  if (isIntegrationsSection || location.pathname.startsWith("/integrations/")) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="mb-2 -ml-2 text-sidebar-foreground hover:text-sidebar-primary text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                All Products
              </Button>
              <div className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-sidebar-primary" />
                <span className="font-bold text-sidebar-foreground">Integrations</span>
              </div>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platforms</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/integrations/twilio" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Plug className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Twilio</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/integrations/genesys" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <Plug className="h-4 w-4 mr-2" />
                      {!collapsed && <span>Genesys Cloud CX</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Product-level sidebar
  const endpoints = getEndpointsForProduct(productId!);
  const categories = getCategories(productId!);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-2 -ml-2 text-sidebar-foreground hover:text-sidebar-primary text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              All Products
            </Button>
            <div className="flex items-center gap-2">
              {productId === "scp" ? <Shield className="h-5 w-5 text-sidebar-primary" /> : <Palette className="h-5 w-5 text-sidebar-primary" />}
              <span className="font-bold text-sidebar-foreground">{product!.name}</span>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to={`/products/${productId}`} end activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Introduction</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to={`/products/${productId}/guide`} activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Setup Guide</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <ApiCategoryAccordion
          categories={categories}
          endpoints={endpoints}
          productId={productId!}
          collapsed={collapsed}
          currentPath={location.pathname}
        />

        <SidebarGroup>
          <SidebarGroupLabel>Export</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={downloadOpenApiSpec}>
                  <Download className="h-4 w-4 mr-2" />
                  {!collapsed && <span>Download OpenAPI Spec</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ApiCategoryAccordion({
  categories,
  endpoints,
  productId,
  collapsed,
  currentPath,
}: {
  categories: string[];
  endpoints: { id: string; name: string; method: string; category: string }[];
  productId: string;
  collapsed: boolean;
  currentPath: string;
}) {
  const activeCategory = categories.find(cat =>
    endpoints.filter(ep => ep.category === cat).some(ep => currentPath.includes(ep.id))
  );
  const [openCategory, setOpenCategory] = useState<string | null>(activeCategory || null);

  const handleToggle = (cat: string) => {
    setOpenCategory(prev => (prev === cat ? null : cat));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>API Reference</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {categories.map(cat => {
            const catEndpoints = endpoints.filter(ep => ep.category === cat);
            const isOpen = openCategory === cat;

            if (collapsed) {
              return catEndpoints.map(ep => (
                <SidebarMenuItem key={ep.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/products/${productId}/api/${ep.id}`}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      className="flex items-center gap-2 pl-6"
                    >
                      <Code2 className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ));
            }

            return (
              <div key={cat}>
                <button
                  onClick={() => handleToggle(cat)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold mt-2 hover:text-sidebar-foreground/80 cursor-pointer"
                >
                  <span>{cat}</span>
                  {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {isOpen && catEndpoints.map(ep => (
                  <SidebarMenuItem key={ep.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/products/${productId}/api/${ep.id}`}
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        className="flex items-center gap-2 pl-6"
                      >
                        <MethodBadge method={ep.method} />
                        <span className="text-xs truncate">{ep.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
