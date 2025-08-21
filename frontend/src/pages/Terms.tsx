import NavigationHeader from "@/components/NavigationHeader";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ResumeBuilder, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Service Description</h2>
          <p>
            ResumeBuilder is a web-based platform that allows users to create, edit, and export professional resumes using our templates and AI-enhancement features.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            Users must provide accurate and complete registration information. You are responsible for safeguarding your account credentials and for all activities under your account.
          </p>

          <h2>4. Subscription Plans</h2>
          <p>
            We offer multiple subscription tiers with different features and pricing. All payments are processed securely through Lemon Squeezy. Subscription fees are non-refundable except as outlined in our Refund Policy.
          </p>

          <h2>5. AI Features</h2>
          <p>
            Our AI-powered features are provided to enhance your resume content. While we strive for accuracy, users should review and verify all AI-generated content before use.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            Users retain ownership of their resume content. ResumeBuilder retains ownership of the platform, templates, and underlying technology.
          </p>

          <h2>7. Usage Limits</h2>
          <p>
            Different subscription plans have different usage limits for AI features and exports. Fair usage policies apply to prevent abuse.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>
            Users may not use our service for illegal purposes, to create misleading content, or to violate any applicable laws or regulations.
          </p>

          <h2>9. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            ResumeBuilder shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the service ceases immediately.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at legal@resumebuilder.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;