import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Menu, X, User, LogOut, Crown, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useScrollManager } from "@/hooks/useScrollManager";

interface NavigationHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  showSaveButton?: boolean;
  onSave?: () => void;
}

const NavigationHeader = ({ 
  showBackButton = false, 
  backTo = "/", 
  showSaveButton = false, 
  onSave 
}: NavigationHeaderProps) => {
  const { user, signOut, loading } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent background scrolling when mobile menu is open
  useScrollManager(mobileMenuOpen);

  const navigationItems = [
    { href: "/form-selection", label: "Create Resume", requireAuth: false },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getSubscriptionBadge = () => {
    if (!subscriptionStatus?.has_access) return null;
    
    const planNames = {
      single: 'Single',
      '10days': '10 Days',
      monthly: 'Monthly'
    };
    
    return (
      <Badge variant="outline" className="ml-2 text-xs">
        {planNames[subscriptionStatus.plan_type as keyof typeof planNames] || subscriptionStatus.plan_type}
      </Badge>
    );
  };

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Link 
              to={backTo} 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors hover-lift"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
          )}
          
          <Link to="/" className="flex items-center space-x-2 animate-scale-in hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                NOV
              </span>
              <span className="text-slate-400 dark:text-slate-500">A</span>
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                E
              </span>
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                CV
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto mr-6 space-x-6">
          {navigationItems
            .filter(item => !item.requireAuth || user)
            .map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActiveRoute(item.href) 
                  ? "text-foreground border-b-2 border-primary" 
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center space-x-4">
          {showSaveButton && onSave && (
            <Button 
              onClick={onSave}
              variant="outline" 
              size="sm" 
              className="btn-magic hover-glow"
            >
              Save Draft
            </Button>
          )}
          
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Navigate through the application
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors p-2 rounded-md ${
                        isActiveRoute(item.href) 
                          ? "text-foreground bg-primary/10" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* Hidden user section - free version doesn't need auth */}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;