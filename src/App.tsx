import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import TestModeBanner from "@/components/TestModeBanner";
import { lazy, Suspense } from "react";

// Load main page immediately, lazy load others
import Index from "./pages/Index";

// Lazy load all other pages for better performance
const Auth = lazy(() => import("./pages/Auth"));
const FormSelection = lazy(() => import("./pages/FormSelection"));
const ResumeForm = lazy(() => import("./pages/ResumeForm"));
const PlanSelection = lazy(() => import("./pages/PlanSelection"));
const AIGeneration = lazy(() => import("./pages/AIGeneration"));
const ResumePreview = lazy(() => import("./pages/ResumePreview"));
const Profile = lazy(() => import("./pages/Profile"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const SubscriptionDetails = lazy(() => import("./pages/SubscriptionDetails"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Status = lazy(() => import("./pages/Status"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
