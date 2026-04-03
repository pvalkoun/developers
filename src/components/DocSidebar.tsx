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
import { Home, Shield, Palette, BookOpen, Code2, Plug, ChevronLeft } from "lucide-react";
import { products } from "@/data/productData";
import { getEndpointsForProduct, getCategories } from "@/data/apiData";
import { getIntegrationsForProduct } from "@/data/integrationData";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";

export function DocSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const pathParts = location.pathname.split("/");
  const productId = pathParts[2] as "scp" | "bcd" | undefined;
  const product = products.find(p => p.id === productId);

  // Home-level sidebar
  if (!product) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <NavLink to="/" className="flex items-center gap-2 text-sidebar-foreground font-bold text-lg">
              <span className="text-sidebar-primary">TCS</span>
              <span>Developer Docs</span>
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
        </SidebarContent>
      </Sidebar>
    );
  }

  // Product-level sidebar
  const endpoints = getEndpointsForProduct(productId!);
  const categories = getCategories(productId!);
  const integ = getIntegrationsForProduct(productId!);

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
              <span className="font-bold text-sidebar-foreground">{product.name}</span>
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

        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>API Reference</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map(cat => (
                <div key={cat}>
                  {!collapsed && <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold mt-2">{cat}</div>}
                  {endpoints.filter(ep => ep.category === cat).map(ep => (
                    <SidebarMenuItem key={ep.id}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={`/products/${productId}/api/${ep.id}`}
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                          className="flex items-center gap-2"
                        >
                          {!collapsed && (
                            <>
                              <MethodBadge method={ep.method} />
                              <span className="text-xs truncate">{ep.name}</span>
                            </>
                          )}
                          {collapsed && <Code2 className="h-4 w-4" />}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {integ.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Integrations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {integ.map(ig => (
                  <SidebarMenuItem key={ig.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/products/${productId}/integrations/${ig.id}`}
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <Plug className="h-4 w-4 mr-2" />
                        {!collapsed && <span>{ig.platform}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
