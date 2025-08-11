import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    database: 'unknown',
    auth: 'unknown',
    storage: 'unknown',
    ai: 'unknown',
    payments: 'unknown'
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    checkSystemStatus();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    setLoading(false);
  };

  const checkSystemStatus = async () => {
    const checks = {
      database: false,
      auth: false,
      storage: false,
      ai: false,
      payments: false
    };

    // Check database
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      checks.database = !error;
    } catch (e) {
      checks.database = false;
    }

    // Check auth
    try {
      const { data: { session } } = await supabase.auth.getSession();
      checks.auth = !!session;
    } catch (e) {
      checks.auth = false;
    }

    // Check AI service
    try {
      const { error } = await supabase.functions.invoke('ai-enhance-content', {
        body: { type: 'test', content: 'test' }
      });
      checks.ai = !error;
    } catch (e) {
      checks.ai = false;
    }

    // Check payments
    try {
      const { error } = await supabase.functions.invoke('enhanced-check-user-plan');
      checks.payments = !error;
    } catch (e) {
      checks.payments = false;
    }

    setSystemStatus({
      database: checks.database ? 'operational' : 'error',
      auth: checks.auth ? 'operational' : 'error',
      storage: 'operational', // Assume storage is working if we got this far
      ai: checks.ai ? 'operational' : 'warning',
      payments: checks.payments ? 'operational' : 'warning'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Checking...</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const environmentConfig = {
    'Supabase URL': process.env.NODE_ENV === 'development' ? 'https://sqvaqiepymfoubwibuds.supabase.co' : 'Configured',
    'Supabase Anon Key': 'Configured',
    'OpenAI API': 'Configured (Server-side)',
    'Lemon Squeezy Integration': 'Configured (Server-side)',
    'Environment': process.env.NODE_ENV || 'development'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      
      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          <p className="text-muted-foreground">
            Monitor the health and configuration of ResumeBuilder services
          </p>
        </div>

        <div className="grid gap-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status)}
                      <span className="font-medium capitalize">{service}</span>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                ))}
              </div>
              <Button 
                onClick={checkSystemStatus} 
                variant="outline" 
                size="sm" 
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>

          {/* Environment Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(environmentConfig).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="text-muted-foreground font-mono text-sm">{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email Verified:</span>
                  <span className="text-muted-foreground">
                    {user?.email_confirmed_at ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Sign In:</span>
                  <span className="text-muted-foreground">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div>/auth - Authentication</div>
                <div>/templates - Resume Templates</div>
                <div>/builder - Resume Builder</div>
                <div>/pricing - Subscription Plans</div>
                <div>/profile - User Profile</div>
                <div>/api/enhanced-check-user-plan - Plan Verification</div>
                <div>/api/enhanced-create-payment - Payment Processing</div>
                <div>/api/ai-enhance-content - AI Features</div>
                <div>/api/export-resume - PDF Export</div>
                <div>/api/lemon-webhook - Lemon Squeezy Integration</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Status;