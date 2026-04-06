import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocLayout } from "@/components/DocLayout";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ProductOverview from "./pages/ProductOverview";
import SetupGuide from "./pages/SetupGuide";
import ApiEndpointPage from "./pages/ApiEndpointPage";
import IntegrationPage from "./pages/IntegrationPage";
import Changelog from "./pages/Changelog";
import PreCallAuth from "./pages/PreCallAuth";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<DocLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/products/:productId" element={<ProductOverview />} />
            <Route path="/products/:productId/guide" element={<SetupGuide />} />
            <Route path="/products/:productId/api/:endpointId" element={<ApiEndpointPage />} />
            <Route path="/integrations/:integrationId" element={<IntegrationPage />} />
            <Route path="/pre-call-auth" element={<PreCallAuth />} />
            <Route path="/changelog" element={<Changelog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
