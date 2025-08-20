import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Crown, Star } from "lucide-react";

interface Profile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface ProfileHeaderProps {
  user: any;
  userPlan: any;
}

const ProfileHeader = ({ user, userPlan }: ProfileHeaderProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic Plan';
      case 'pro': return 'Professional Plan';
      case 'free': return 'Free Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="w-4 h-4" />;
      case 'basic': return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gradient-to-r from-slate-600 to-gray-600 text-white';
      case 'basic': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <Avatar className="w-24 h-24 ring-4 ring-slate-200 dark:ring-slate-700">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="bg-gradient-to-br from-slate-600 to-gray-600 text-white text-2xl font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name and Plan */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {getDisplayName()}
        </h1>
        
        <div className="flex justify-center">
          <Badge className={`px-4 py-2 text-sm font-medium ${getPlanColor(userPlan?.plan || 'free')}`}>
            {getPlanIcon(userPlan?.plan || 'free')}
            <span className="ml-2">{getPlanDisplayName(userPlan?.plan || 'free')}</span>
          </Badge>
        </div>

        {/* Member Since */}
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Member since {new Date(user?.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      {userPlan?.isActive && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium dark:bg-green-900/20 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Active Subscription
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
