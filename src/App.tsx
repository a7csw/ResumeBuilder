import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import TestModeBanner from "@/components/TestModeBanner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FormSelection from "./pages/FormSelection";
import ResumeForm from "./pages/ResumeForm";
import PlanSelection from "./pages/PlanSelection";
import AIGeneration from "./pages/AIGeneration";
import ResumePreview from "./pages/ResumePreview";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import MyResumes from "./pages/MyResumes";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import Status from "./pages/Status";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="resume-builder-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TestModeBanner />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/form-selection" element={<FormSelection />} />
            <Route path="/form/:type" element={<ResumeForm />} />
            <Route path="/plan-selection" element={<PlanSelection />} />
            <Route path="/ai-generation" element={<AIGeneration />} />
            <Route path="/resume-preview" element={<ResumePreview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/subscription-details" element={<SubscriptionDetails />} />
            <Route path="/my-resumes" element={<MyResumes />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/status" element={<Status />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
