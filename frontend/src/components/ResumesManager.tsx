import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileText, Edit, Download, Copy, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useDownloadPdf } from "@/lib/useDownloadPdf";
import { bypassPayments } from "@/lib/env";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

const ResumesManager = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPlan } = useUserPlan();
  const { downloadPdf, isDownloading } = useDownloadPdf();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    return bypassPayments() || (userPlan.isActive && userPlan.plan === 'pro');
  };

  const handleView = (resume: Resume) => {
    // Navigate to a read-only view or open in builder as read-only
    navigate(`/builder?template=${resume.template_id}&resumeId=${resume.id}&mode=view`);
  };

  const handleEdit = (resume: Resume) => {
    if (!canEdit()) {
      toast({
        title: "Upgrade Required",
        description: "Pro plan required to edit resumes. You can view and download only.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/builder?template=${resume.template_id}&resumeId=${resume.id}`);
  };

  const handleDownload = async (resume: Resume) => {
    await downloadPdf(resume.data, resume.template_id);
  };

  const handleDuplicate = async (resume: Resume) => {
    if (!canEdit()) {
      toast({
        title: "Upgrade Required",
        description: "Pro plan required to duplicate resumes.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('resumes')
        .insert({
          title: `${resume.title} (Copy)`,
          template_id: resume.template_id,
          data: resume.data,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Resume Duplicated",
        description: "Resume has been successfully duplicated.",
      });
      
      fetchResumes(); // Refresh the list
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;

      toast({
        title: "Resume Deleted",
        description: "Resume has been successfully deleted.",
      });
      
      fetchResumes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Resumes</h2>
          <p className="text-muted-foreground">
            Manage your saved resumes
            {!bypassPayments() && !canEdit() && (
              <span className="text-orange-600"> • Pro plan required for editing</span>
            )}
          </p>
        </div>
        <Button onClick={() => navigate('/builder')} className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first resume to get started
            </p>
            <Button onClick={() => navigate('/builder')}>
              Create Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{resume.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {getTemplateName(resume.template_id)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(resume.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Preview of resume content */}
                  <div className="text-sm text-muted-foreground">
                    {resume.data?.personalInfo?.firstName || 'Untitled'} {resume.data?.personalInfo?.lastName || ''}
                    {resume.data?.personalInfo?.title && (
                      <div>{resume.data.personalInfo.title}</div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(resume)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(resume)}
                      disabled={!canEdit()}
                      className="flex items-center gap-1"
                    >
                      {!canEdit() ? <Lock className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(resume)}
                      disabled={isDownloading}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(resume)}
                      disabled={!canEdit()}
                      className="flex items-center gap-1"
                    >
                      {!canEdit() ? <Lock className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(resume.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesManager;