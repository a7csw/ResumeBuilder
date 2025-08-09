import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft } from "lucide-react";
import EditableProfile from "@/components/EditableProfile";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center">
          <Link to="/builder" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Back to builder</span>
          </Link>
          <div className="flex items-center space-x-2 ml-6">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold">ResumeForge</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8 max-w-4xl">
        <EditableProfile user={user} />
        <div className="mt-6">
          <Button
            onClick={async () => {
              try {
                const { data, error } = await supabase.functions.invoke('customer-portal');
                if (error) throw error;
                window.open(data.url, '_blank');
              } catch (e) {
                console.error(e);
                alert('Unable to open customer portal.');
              }
            }}
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;