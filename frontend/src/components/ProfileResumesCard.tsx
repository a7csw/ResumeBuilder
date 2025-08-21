import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus, Edit, Download, ArrowRight, Lock, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

interface ProfileResumesCardProps {
  userPlan: any;
}

const ProfileResumesCard = ({ userPlan }: ProfileResumesCardProps) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3); // Show only the 3 most recent

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    return userPlan?.isActive && userPlan?.plan === 'pro';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemplateName = (templateId: string) => {
    const names: Record<string, string> = {
      classic: "Classic",
      modern: "Modern", 
      creative: "Creative",
      technical: "Technical",
      student: "Student",
      graduate: "Graduate",
      internship: "Internship",
      minimal: "Minimal"
    };
    return names[templateId] || templateId;
  };

  const handleCreateResume = () => {
    navigate('/form-selection');
  };

  const handleViewAll = () => {
    navigate('/my-resumes');
  };

  const handleEditResume = (resume: Resume) => {
    if (!canEdit()) {
      toast({
        title: "Upgrade Required",
        description: "Pro plan required to edit resumes.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/builder?template=${resume.template_id}&resumeId=${resume.id}`);
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-slate-200 dark:border-slate-700 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-200/30 to-gray-200/30 dark:from-slate-700/30 dark:to-gray-700/30 rounded-full blur-3xl"></div>
      
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <FileText className="h-5 w-5" />
            My Resumes
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6 relative">
        {resumes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                No resumes yet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create your first professional resume to get started
              </p>
            </div>
            <Button 
              onClick={handleCreateResume}
              className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Resume
            </Button>
          </div>
        ) : (
          /* Resume List */
          <div className="space-y-4">
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div 
                  key={resume.id} 
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {resume.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {getTemplateName(resume.template_id)}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Updated {formatDate(resume.updated_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditResume(resume)}
                      disabled={!canEdit()}
                      className="h-8 w-8 p-0"
                    >
                      {!canEdit() ? (
                        <Lock className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Edit className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button 
                onClick={handleCreateResume}
                variant="outline"
                className="w-full justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
              
              <Button 
                onClick={handleViewAll}
                variant="ghost"
                className="w-full justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                View All Resumes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {!canEdit() && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    Pro plan required for editing
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileResumesCard;
