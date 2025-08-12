import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import EditableProfile from "@/components/EditableProfile";
import SubscriptionManager from "@/components/SubscriptionManager";
import ResumesManager from "@/components/ResumesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

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
      <NavigationHeader 
        showBackButton 
        backTo="/builder" 
        showThemeToggle
      />
      
      <div className="container py-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="max-w-2xl">
              <EditableProfile user={user} />
            </div>
          </TabsContent>
          
          <TabsContent value="resumes" className="mt-6">
            <ResumesManager />
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-6">
            <div className="max-w-2xl">
              <SubscriptionManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;