import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Search, 
  Calendar, 
  Download, 
  Edit, 
  Trash2, 
  Crown, 
  Sparkles, 
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useSubscriptionAccess from '@/hooks/useSubscriptionAccess';
import { getSubscriptionService } from '@/lib/supabase-subscriptions';

interface Resume {
  id: string;
  title: string;
  content: any;
  template_type: string;
  is_exported: boolean;
  export_count: number;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { accessStatus, canGenerateResume, subscriptionDisplay, refreshAccess } = useSubscriptionAccess();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;

      try {
        const subscriptionService = getSubscriptionService(toast);
        const userResumes = await subscriptionService.getUserResumes();
        setResumes(userResumes);
        setFilteredResumes(userResumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast({
          title: "Error",
          description: "Failed to load your resumes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user, toast]);

  // Filter resumes based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredResumes(resumes);
    } else {
      const filtered = resumes.filter(resume =>
        resume.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResumes(filtered);
    }
  }, [searchTerm, resumes]);

  const handleCreateResume = () => {
    // Free version - no restrictions
    navigate('/form-selection');
  };

  const handleEditResume = (resumeId: string) => {
    navigate(`/resume/edit/${resumeId}`);
  };

  const handleDeleteResume = async (resumeId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('user_resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setResumes(prev => prev.filter(r => r.id !== resumeId));
      toast({
        title: "Resume deleted",
        description: `"${title}" has been deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Delete failed",
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

  const getSubscriptionStatusBadge = () => {
    if (!accessStatus) return null;

    const { status, product_name } = accessStatus;

    if (status === 'none') {
      return (
        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
          No Plan
        </Badge>
      );
    }

    if (status === 'expired') {
      return (
        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
          Expired
        </Badge>
      );
    }

    const planColors = {
      single_resume: 'border-blue-200 text-blue-700 bg-blue-50',
      '10day_access': 'border-purple-200 text-purple-700 bg-purple-50',
      monthly_subscription: 'border-yellow-200 text-yellow-700 bg-yellow-50'
    };

    return (
      <Badge variant="outline" className={planColors[accessStatus.product_id as keyof typeof planColors] || 'border-green-200 text-green-700 bg-green-50'}>
        {product_name || 'Active Plan'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-6xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      <div className="container px-4 sm:px-6 py-8 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your resumes and track your career progress
          </p>
        </div>

        {/* Free Version Status Card */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-white to-primary/5 dark:from-slate-800 dark:to-primary/10 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Free & Unlimited
                      </h3>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Active
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Create unlimited resumes with AI - completely free!
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {/* Resumes Created */}
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {resumes.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Resumes Created
                  </div>
                </div>

                {/* Access Level */}
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    ∞
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Unlimited Access
                  </div>
                </div>
              </div>

              {/* Free version - no upsell needed */}
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search your resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button 
            onClick={handleCreateResume}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Resume
          </Button>
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2 border-slate-300 dark:border-slate-600">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {searchTerm ? 'No resumes found' : 'No resumes yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {searchTerm 
                  ? `No resumes match "${searchTerm}". Try a different search term.`
                  : 'Create your first professional resume to get started with your job search.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateResume}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Resume
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card 
                key={resume.id} 
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {resume.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {resume.template_type}
                        </Badge>
                        {resume.is_exported && (
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            Exported
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(resume.updated_at)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditResume(resume.id)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteResume(resume.id, resume.title)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {resumes.length > 0 && (
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <Card className="text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-2">{resumes.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Total Resumes</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {resumes.filter(r => r.is_exported).length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Exported</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {resumes.reduce((sum, r) => sum + r.export_count, 0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Total Downloads</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
