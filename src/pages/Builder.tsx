import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import NavigationHeader from "@/components/NavigationHeader";
import { FileText, ArrowLeft, User, Sparkles, PenTool, GraduationCap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EnhancedResumeBuilder from "@/components/EnhancedResumeBuilder";
import TemplatePreview from "@/components/TemplatePreview";
import SecurePreviewOverlay from "@/components/SecurePreviewOverlay";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useUserPlan } from "@/hooks/useUserPlan";

const Builder = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "classic";
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"student" | "professional" | "freelancer">("professional");
  const [buildingMode, setBuildingMode] = useState<"manual" | "ai">("manual");
  const { userPlan, canUseAI, canExportPDF } = useUserPlan();
  const [resumeData, setResumeData] = useState<any>({
    personalInfo: { 
      firstName: "", 
      lastName: "", 
      title: "", 
      email: "", 
      phone: "", 
      location: "", 
      linkedin: "", 
      website: "", 
      industry: "" 
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  const navigate = useNavigate();
  const { toast } = useToast();

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
        backTo="/" 
        showSaveButton 
        onSave={() => {
          toast({
            title: "Draft Saved",
            description: "Your resume progress has been saved successfully.",
          });
        }}
      />

      {/* Configuration Section */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          <Card className="animate-fade-in-up hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm">User Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="professional">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Professional
                    </div>
                  </SelectItem>
                  <SelectItem value="freelancer">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Freelancer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up delay-100 hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm">Building Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={buildingMode} onValueChange={(value: any) => setBuildingMode(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual" className="text-xs">
                    <PenTool className="h-3 w-3 mr-1" />
                    Manual
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai" 
                    className="text-xs"
                    disabled={!canUseAI()}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {!canUseAI() && (
                <p className="text-xs text-muted-foreground mt-2">
                  AI features require AI or Pro plan
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up delay-200 hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Plan Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`px-3 py-2 rounded-md text-sm ${userPlan.plan !== 'free' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                {userPlan.plan === 'free' ? 'Free Plan' : 
                 userPlan.plan === 'basic' ? 'Basic Plan' :
                 userPlan.plan === 'ai' ? 'AI Plan' : 'Pro Plan'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userPlan.plan === 'free' ? 'Preview only' : 
                 userPlan.plan === 'pro' ? 'All features unlocked' : 'Limited features'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Resume Builder */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            <EnhancedResumeBuilder 
              userType={userType}
              buildingMode={buildingMode}
              canUseAI={canUseAI()}
              canExportPDF={canExportPDF()}
              resumeData={resumeData}
              setResumeData={setResumeData}
              userPlan={userPlan}
            />
          </div>

          {/* Template Preview */}
          <div className="sticky top-24 relative" id="template-preview-wrapper">
            {/* Blur and overlay when locked */}
            {(() => {
              const premiumTemplates = new Set(["modern","creative","technical","graduate","internship"]);
              const isPremium = premiumTemplates.has(templateId);
              const isLocked = !userPlan.isActive || (userPlan.plan === 'basic' && isPremium);
              const required = !userPlan.isActive ? (isPremium ? 'AI (Premium) or Monthly' : 'Basic') : (isPremium ? 'AI (Premium) or Monthly' : 'Basic');
              return (
                <>
                  <div className={isLocked ? 'blur-xl grayscale opacity-95 transition-smooth' : 'transition-smooth'}>
                    <TemplatePreview 
                      resumeData={resumeData}
                      userType={userType}
                      templateId={templateId}
                    />
                  </div>
                  <div className="absolute inset-0">
                    {/* @ts-ignore - component exists */}
                    <SecurePreviewOverlay
                      locked={isLocked}
                      requiredPlanLabel={required}
                      watermarkText="ResumeBuilder"
                      onUpgrade={() => { window.location.href = '/pricing'; }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;