import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavigationHeader from "@/components/NavigationHeader";
import { FileText, Save, User, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuilderLayout from "@/components/builder/BuilderLayout";
import LivePreview from "@/components/builder/LivePreview";
import SecurePreviewOverlay from "@/components/premium/SecurePreviewOverlay";
import ModeSelector from "@/components/ModeSelector";
import DynamicForm from "@/components/DynamicForm";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useDownloadPdf } from "@/lib/useDownloadPdf";
import { getTemplateConfig, getPremiumTemplates } from "@/lib/templateConfigs";

const NewBuilder = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "classic";
  const resumeId = searchParams.get("resumeId");
  const isViewMode = searchParams.get("mode") === "view";
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [userType, setUserType] = useState<"student" | "professional" | "freelancer">("professional");
  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const { userPlan, canUseAI, canExportPDF } = useUserPlan();
  const { downloadPdf, isDownloading } = useDownloadPdf();
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
    certifications: [],
    research: [],
    awards: [],
    volunteer: [],
    languages: []
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const config = getTemplateConfig(templateId);
  const premiumTemplateIds = new Set(getPremiumTemplates().map(t => t.id));
  const isPremium = premiumTemplateIds.has(templateId);
  const isLocked = !userPlan.isActive || (userPlan.plan === 'basic' && isPremium);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Load existing resume if resumeId is provided
      if (resumeId) {
        await loadExistingResume(resumeId);
      } else if (!searchParams.get("template")) {
        // Show mode selector for new resumes without template
        setShowModeSelector(true);
      }
      
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
  }, [navigate, resumeId, searchParams]);

  const loadExistingResume = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setResumeData(data.data || {});
        setResumeTitle(data.title);
        // Update URL to match template from loaded resume
        if (data.template_id !== templateId) {
          navigate(`/builder?template=${data.template_id}&resumeId=${id}${isViewMode ? '&mode=view' : ''}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const resumeRecord = {
        title: resumeTitle,
        template_id: templateId,
        data: resumeData,
        user_id: user.id
      };

      if (resumeId) {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update(resumeRecord)
          .eq('id', resumeId);
        
        if (error) throw error;
      } else {
        // Create new resume
        const { data, error } = await supabase
          .from('resumes')
          .insert(resumeRecord)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update URL to include the new resume ID
        navigate(`/builder?template=${templateId}&resumeId=${data.id}`, { replace: true });
      }

      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    await downloadPdf(resumeData, templateId);
  };

  const handleModeSelect = (mode: 'student' | 'professional' | 'freelancer') => {
    setUserType(mode);
    setShowModeSelector(false);
    
    // Redirect to template selection if no template is selected
    if (!searchParams.get("template")) {
      navigate(`/templates?userType=${mode}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showModeSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <NavigationHeader showBackButton backTo="/" />
        <div className="container py-12">
          <ModeSelector 
            onModeSelect={handleModeSelect} 
            selectedMode={userType}
          />
        </div>
      </div>
    );
  }

  const leftPanel = (
    <>
      {/* Header Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Enter resume title..."
                disabled={isViewMode}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleSave} 
              disabled={saving || isViewMode}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>

            <Button 
              onClick={() => navigate('/templates')}
              variant="outline"
              size="sm"
            >
              Change Template
            </Button>

            <Button 
              onClick={() => setShowModeSelector(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              {userType === 'student' ? 'Student' : 
               userType === 'professional' ? 'Professional' : 'Freelancer'} Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Status */}
      <Card className="mb-6">
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

      {/* Dynamic Form */}
      <DynamicForm
        config={config}
        resumeData={resumeData}
        setResumeData={setResumeData}
        userType={userType}
        canUseAI={canUseAI() && !isViewMode}
        isViewMode={isViewMode}
      />
    </>
  );

  const rightPanel = (
    <LivePreview
      templateId={templateId}
      resumeData={resumeData}
      userType={userType}
      isLocked={isLocked}
      overlayComponent={
        <SecurePreviewOverlay
          requiredPlanLabel={!userPlan.isActive ? (isPremium ? 'AI (Premium) or Monthly' : 'Basic') : (isPremium ? 'AI (Premium) or Monthly' : 'Basic')}
          watermarkText="ResumeBuilder Pro"
          onUpgrade={() => { window.location.href = '/pricing'; }}
          templateName={config.name}
          isPremium={isLocked}
        />
      }
    />
  );

  return (
    <>
      <NavigationHeader 
        showBackButton 
        backTo={resumeId ? "/profile" : "/"} 
        showSaveButton={false}
      />
      <BuilderLayout 
        leftPanel={leftPanel}
        rightPanel={rightPanel}
      />
    </>
  );
};

export default NewBuilder;