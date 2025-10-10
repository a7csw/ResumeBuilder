import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import TestModeBanner from "@/components/TestModeBanner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";

// Load main page immediately, lazy load others
import Index from "./pages/Index";

// Lazy load all other pages for better performance
const Auth = lazy(() => import("./pages/Auth"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
// Removed old PricingPage - using PlanSelection instead
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FormSelection = lazy(() => import("./pages/FormSelection"));
const ResumeForm = lazy(() => import("./pages/ResumeFormSimple"));
const AIGeneration = lazy(() => import("./pages/AIGeneration"));
const ResumePreview = lazy(() => import("./pages/ResumePreview"));
const ResumeGenerated = lazy(() => import("./pages/ResumeGenerated"));
const PlanSelection = lazy(() => import("./pages/PlanSelection"));
const GumroadSuccess = lazy(() => import("./pages/GumroadSuccess"));
const Success = lazy(() => import("./pages/Success"));
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
            <AuthProvider>
              <TestModeBanner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<RouteWrapper><Index /></RouteWrapper>} />
                
                {/* Auth routes - redirect to dashboard if already authenticated */}
                <Route path="/auth" element={
                  <ProtectedRoute requireAuth={false}>
                    <RouteWrapper><AuthPage /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/auth/legacy" element={
                  <ProtectedRoute requireAuth={false}>
                    <RouteWrapper><Auth /></RouteWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Pricing - accessible to all but shows different content based on auth */}
                <Route path="/pricing" element={<RouteWrapper><PlanSelection /></RouteWrapper>} />
                
                {/* Post-purchase success - requires auth */}
                <Route path="/gumroad/success" element={
                  <ProtectedRoute>
                    <RouteWrapper><GumroadSuccess /></RouteWrapper>
                  </ProtectedRoute>
                } />
                
                {/* New Gumroad success redirect */}
                <Route path="/success" element={<RouteWrapper><Success /></RouteWrapper>} />
                
                {/* Protected routes - require authentication */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <RouteWrapper><Dashboard /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/form-selection" element={
                  <ProtectedRoute>
                    <RouteWrapper><FormSelection /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/form/:type" element={
                  <ProtectedRoute>
                    <RouteWrapper><ResumeForm /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/ai-generation" element={
                  <ProtectedRoute>
                    <RouteWrapper><AIGeneration /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/resume-preview" element={
                  <ProtectedRoute>
                    <RouteWrapper><ResumePreview /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/plan-selection" element={
                  <ProtectedRoute>
                    <RouteWrapper><PlanSelection /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/resume-generated" element={
                  <ProtectedRoute>
                    <RouteWrapper><ResumeGenerated /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <RouteWrapper><Profile /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/my-resumes" element={
                  <ProtectedRoute>
                    <RouteWrapper><MyResumes /></RouteWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/reset-password" element={<RouteWrapper><ResetPassword /></RouteWrapper>} />
                <Route path="/status" element={<RouteWrapper><Status /></RouteWrapper>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<RouteWrapper><NotFound /></RouteWrapper>} />
              </Routes>
            </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
