import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Plus, 
  Edit, 
  Download, 
  Copy, 
  Trash2, 
  Lock, 
  FolderOpen, 
  Search,
  ArrowLeft,
  Filter
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

const MyResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const { userPlan } = useUserPlan();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchResumes();
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    filterResumes();
  }, [resumes, searchTerm, selectedTemplate]);

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

  const filterResumes = () => {
    let filtered = resumes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resume => 
        resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.data?.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.data?.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by template
    if (selectedTemplate !== 'all') {
      filtered = filtered.filter(resume => resume.template_id === selectedTemplate);
    }

    setFilteredResumes(filtered);
  };

  const canEdit = () => {
    return userPlan?.isActive && userPlan?.planType === 'pro';
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

  const getUniqueTemplates = () => {
    const templates = [...new Set(resumes.map(r => r.template_id))];
    return templates.map(id => ({ id, name: getTemplateName(id) }));
  };

  const handleView = (resume: Resume) => {
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
      
      fetchResumes();
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
      
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              My Resumes
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and organize your professional resumes
              {!canEdit() && (
                <span className="text-amber-600"> • Pro plan required for editing</span>
              )}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/form-selection')}
            className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          /* Empty State */
          <Card className="shadow-lg border-slate-200 dark:border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FolderOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                No resumes yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
                Create your first professional resume to get started. Our AI-powered builder 
                will help you craft the perfect resume in minutes.
              </p>
              <Button 
                onClick={() => navigate('/form-selection')}
                size="lg"
                className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-background text-foreground"
                >
                  <option value="all">All Templates</option>
                  {getUniqueTemplates().map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {filteredResumes.length} of {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Resume Grid */}
            {filteredResumes.length === 0 ? (
              <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-12 h-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No matching resumes
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume) => (
                  <Card key={resume.id} className="shadow-lg border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2 text-slate-900 dark:text-slate-100">
                            {resume.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {getTemplateName(resume.template_id)}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(resume.updated_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Preview of resume content */}
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {resume.data?.personalInfo?.firstName || 'Untitled'} {resume.data?.personalInfo?.lastName || ''}
                          {resume.data?.personalInfo?.title && (
                            <div className="font-medium text-slate-700 dark:text-slate-300">
                              {resume.data.personalInfo.title}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
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
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
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
                                  className="bg-red-600 text-white hover:bg-red-700"
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
          </>
        )}

        {/* Upgrade banner for non-pro users */}
        {!canEdit() && resumes.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Unlock Full Editing Power
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Upgrade to Pro to edit, duplicate, and create unlimited resumes
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyResumes;
