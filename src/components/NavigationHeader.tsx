import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { FileText, ArrowLeft, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { paymentsDisabled } from "@/lib/flags";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navigationItems = [
    { href: "/templates", label: "Templates", requiresAuth: false },
    // Hide pricing in test mode
    ...(paymentsDisabled() ? [] : [{ href: "/pricing", label: "Pricing", requiresAuth: false }]),
    { href: "/profile", label: "Profile", requiresAuth: true },
  ];

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
          
          <Link to="/" className="flex items-center space-x-2 animate-scale-in">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ResumeBuilder</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto mr-6 space-x-6">
          {navigationItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            return (
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
            );
          })}
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

          {/* User Section */}
          {loading ? (
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
          ) : user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Button asChild className="transition-smooth hover:scale-105">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;