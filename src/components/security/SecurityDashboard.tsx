import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Activity, Scan } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityScanResult {
  success: boolean;
  riskScore: number;
  scanResults: {
    suspiciousPatterns: SecurityCategory;
    recentEvents: SecurityCategory;
    dataAccessPatterns: SecurityCategory;
    planIntegrity: SecurityCategory;
  };
  recommendations: string[];
}

interface SecurityCategory {
  category: string;
  issues: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

const SecurityDashboard: React.FC = () => {
  const [scanResults, setScanResults] = useState<SecurityScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastScanDate, setLastScanDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const runSecurityScan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-security-scan');
      
      if (error) throw error;
      
      setScanResults(data);
      setLastScanDate(new Date());
      
      toast({
        title: "Security scan completed",
        description: `Risk score: ${data.riskScore}/100`,
        variant: data.riskScore > 50 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Security scan failed:', error);
      toast({
        title: "Security scan failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score < 20) return "default";
    if (score < 50) return "secondary"; 
    return "destructive";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-destructive';
      case 'MEDIUM': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your account security and detect potential threats
          </p>
        </div>
        
        <Button 
          onClick={runSecurityScan}
          disabled={loading}
          className="btn-magic"
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Scan className="w-4 h-4 mr-2" />
              Run Security Scan
            </>
          )}
        </Button>
      </div>

      {lastScanDate && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Last security scan: {lastScanDate.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {scanResults && (
        <div className="grid gap-6">
          {/* Risk Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Overall Security Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {scanResults.riskScore}/100
                </div>
                <Badge variant={getRiskBadgeVariant(scanResults.riskScore)}>
                  {scanResults.riskScore < 20 ? 'Low Risk' : 
                   scanResults.riskScore < 50 ? 'Medium Risk' : 'High Risk'}
                </Badge>
              </div>
              
              <div className="mt-4 w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    scanResults.riskScore < 20 ? 'bg-green-500' :
                    scanResults.riskScore < 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(scanResults.riskScore, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Categories */}
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(scanResults.scanResults).map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.category}</span>
                    <Badge 
                      variant={category.severity === 'HIGH' ? 'destructive' : 
                              category.severity === 'MEDIUM' ? 'secondary' : 'default'}
                    >
                      {category.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {category.issues.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No issues detected</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {category.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${getSeverityColor(category.severity)}`} />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          {scanResults.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>
                  Follow these steps to improve your account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!scanResults && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security Scan</h3>
            <p className="text-muted-foreground text-center mb-4">
              Run a comprehensive security scan to check for potential threats and vulnerabilities
            </p>
            <Button onClick={runSecurityScan} className="btn-magic">
              <Scan className="w-4 h-4 mr-2" />
              Start Security Scan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityDashboard;