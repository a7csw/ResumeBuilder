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
import { FileText, ArrowLeft, User, Sparkles, PenTool, GraduationCap, Crown, Download, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EnhancedResumeBuilder from "@/components/EnhancedResumeBuilder";
import TemplateSpecificForm from "@/components/TemplateSpecificForm";
import TemplatePreview from "@/components/TemplatePreview";
import SecurePreviewOverlay from "@/components/premium/SecurePreviewOverlay";
import PremiumFeatureWrapper from "@/components/premium/PremiumFeatureWrapper";
import { useEnhancedUserPlan } from "@/hooks/useEnhancedUserPlan";

const EnhancedBuilder = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "classic";
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"student" | "professional" | "freelancer">("professional");
  const [buildingMode, setBuildingMode] = useState<"manual" | "ai">("manual");
  const { userPlan, canUseFeature, canAccessTemplate, getUpgradeMessage } = useEnhancedUserPlan();
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

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('Resumes')
        .upsert({
          user_id: user.id,
          template_id: templateId,
          title: `${resumeData.personalInfo.firstName || 'Untitled'} Resume`,
          // Note: We would store resumeData in a separate sections table or as JSON
        });

      if (error) throw error;

      toast({
        title: "Draft Saved",
        description: "Your resume progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      toast({
        title: "Generating Export",
        description: `Preparing your resume in ${format.toUpperCase()} format...`,
      });

      const { data, error } = await supabase.functions.invoke('export-resume', {
        body: {
          resumeData,
          templateId,
          format,
          userType
        }
      });

      if (error) throw error;

      // Handle the export response (download link or file)
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }

      toast({
        title: "Export Complete",
        description: `Your resume has been exported successfully in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPremiumTemplate = ["modern", "creative", "technical", "graduate", "internship", "executive", "tech-lead", "innovator", "consultant"].includes(templateId);
  const hasTemplateAccess = canAccessTemplate(templateId);
  const isLocked = !hasTemplateAccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader 
        showBackButton 
        backTo="/templates" 
        showSaveButton 
        onSave={handleSave}
      />

      {/* Configuration Section */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          
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
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="freelancer">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Freelancer
                    </div>
                  </SelectItem>
                  <SelectItem value="professional">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Professional
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
              <PremiumFeatureWrapper
                feature="ai"
                requiredPlan="ai"
                fallback={
                  <div className="text-center p-2">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">AI features require upgrade</p>
                  </div>
                }
              >
                <Tabs value={buildingMode} onValueChange={(value: any) => setBuildingMode(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual" className="text-xs">
                      <PenTool className="h-3 w-3 mr-1" />
                      Manual
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Enhanced
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </PremiumFeatureWrapper>
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
              <div className={`px-3 py-2 rounded-md text-sm ${userPlan.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'}`}>
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

          <Card className="animate-fade-in-up delay-300 hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm">AI Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Used</span>
                  <span>{userPlan.aiCallsUsed} / {userPlan.aiCallsLimit || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${userPlan.aiCallsLimit ? (userPlan.aiCallsUsed / userPlan.aiCallsLimit) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up delay-400 hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <PremiumFeatureWrapper
                feature="export"
                requiredPlan="basic"
                className="flex-1"
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  className="w-full text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </PremiumFeatureWrapper>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSave}
                className="flex-1 text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Template Access Warning */}
        {!hasTemplateAccess && (
          <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-orange-500" />
              <div>
                <h3 className="font-semibold text-orange-900">Premium Template Access Required</h3>
                <p className="text-sm text-orange-700">
                  This template requires {isPremiumTemplate ? 'AI or Pro' : 'Basic'} plan access. 
                  Upgrade to unlock full template features and export capabilities.
                </p>
              </div>
              <Button asChild size="sm" className="ml-auto">
                <Link to="/pricing">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Resume Builder */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            <EnhancedResumeBuilder 
              userType={userType}
              buildingMode={buildingMode}
              canUseAI={canUseFeature('ai')}
              canExportPDF={canUseFeature('export')}
              resumeData={resumeData}
              setResumeData={setResumeData}
              userPlan={userPlan}
            />
            
            {/* Template-Specific Form */}
            <TemplateSpecificForm
              templateId={templateId}
              resumeData={resumeData}
              setResumeData={setResumeData}
              canUseAI={canUseFeature('ai')}
            />
          </div>

          {/* Template Preview */}
          <div className="sticky top-24 relative" id="template-preview-wrapper">
            <div className={isLocked ? 'blur-xl grayscale opacity-95 transition-smooth' : 'transition-smooth'}>
              <TemplatePreview 
                resumeData={resumeData}
                userType={userType}
                templateId={templateId}
              />
            </div>
            
            <div className="absolute inset-0">
              <SecurePreviewOverlay
                requiredPlanLabel={isPremiumTemplate ? 'AI or Pro Plan' : 'Basic Plan'}
                watermarkText="ResumeBuilder Pro"
                onUpgrade={() => navigate('/pricing')}
                templateName={templateId}
                isPremium={isLocked}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBuilder;