import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInformation from "@/components/ProfileInformation";
import ProfileSubscriptionCard from "@/components/ProfileSubscriptionCard";
import ProfileResumesCard from "@/components/ProfileResumesCard";
import { useNavigate } from "react-router-dom";
import { useUserPlan } from "@/hooks/useUserPlan";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userPlan, isLoading: planLoading } = useUserPlan();
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

  if (loading || planLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* Main Content - Centered Layout */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} userPlan={userPlan} />
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Information */}
            <ProfileInformation user={user} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <ProfileSubscriptionCard userPlan={userPlan} />
            
            {/* My Resumes Card */}
            <ProfileResumesCard userPlan={userPlan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;