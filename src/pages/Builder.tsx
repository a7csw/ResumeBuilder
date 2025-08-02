import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, User, Sparkles, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ResumeBuilder from "@/components/ResumeBuilder";
import ResumePreview from "@/components/ResumePreview";
import ProfileDropdown from "@/components/ProfileDropdown";

const Builder = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"student" | "professional" | "freelancer">("professional");
  const [buildingMode, setBuildingMode] = useState<"manual" | "ai">("manual");
  const [hasPaidPlan, setHasPaidPlan] = useState(false); // This would come from your subscription logic
  const [resumeData, setResumeData] = useState<any>({});
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
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors hover-lift">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          <div className="flex items-center space-x-2 ml-6">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold">ResumeAI</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" className="btn-magic hover-glow">
              Save Draft
            </Button>
            <ThemeToggle />
            {user && <ProfileDropdown user={user} />}
          </div>
        </div>
      </header>

      {/* Configuration Section */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <TabsTrigger value="ai" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up delay-200 hover-tilt">
            <CardHeader>
              <CardTitle className="text-sm">Plan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`px-3 py-2 rounded-md text-sm ${hasPaidPlan ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                {hasPaidPlan ? "Premium Plan" : "Free Plan"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Resume Builder */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            <ResumeBuilder 
              userType={userType}
              buildingMode={buildingMode}
              hasPaidPlan={hasPaidPlan}
            />
          </div>

          {/* Resume Preview */}
          <div className="sticky top-24">
            <ResumePreview 
              resumeData={resumeData}
              userType={userType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;