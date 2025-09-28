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
const ResumeForm = lazy(() => import("./pages/ResumeFormSimple"));
const AIGeneration = lazy(() => import("./pages/AIGeneration"));
const ResumePreview = lazy(() => import("./pages/ResumePreview"));
const ResumeGenerated = lazy(() => import("./pages/ResumeGenerated"));
const PlanSelection = lazy(() => import("./pages/PlanSelection"));
const LemonSqueezyCheckout = lazy(() => import("./pages/LemonSqueezyCheckout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Status = lazy(() => import("./pages/Status"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
  </div>
);

// Route wrapper with individual error boundaries
const RouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
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
            <Routes>
              <Route path="/" element={<RouteWrapper><Index /></RouteWrapper>} />
              <Route path="/auth" element={<RouteWrapper><Auth /></RouteWrapper>} />
              <Route path="/form-selection" element={<RouteWrapper><FormSelection /></RouteWrapper>} />
              <Route path="/form/:type" element={<RouteWrapper><ResumeForm /></RouteWrapper>} />
              <Route path="/ai-generation" element={<RouteWrapper><AIGeneration /></RouteWrapper>} />
              <Route path="/resume-preview" element={<RouteWrapper><ResumePreview /></RouteWrapper>} />
              <Route path="/plan-selection" element={<RouteWrapper><PlanSelection /></RouteWrapper>} />
              <Route path="/checkout/lemonsqueezy" element={<RouteWrapper><LemonSqueezyCheckout /></RouteWrapper>} />
              <Route path="/checkout/success" element={<RouteWrapper><CheckoutSuccess /></RouteWrapper>} />
              <Route path="/resume-generated" element={<RouteWrapper><ResumeGenerated /></RouteWrapper>} />
              <Route path="/profile" element={<RouteWrapper><Profile /></RouteWrapper>} />
              <Route path="/my-resumes" element={<RouteWrapper><MyResumes /></RouteWrapper>} />
              <Route path="/reset-password" element={<RouteWrapper><ResetPassword /></RouteWrapper>} />
              <Route path="/status" element={<RouteWrapper><Status /></RouteWrapper>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<RouteWrapper><NotFound /></RouteWrapper>} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
