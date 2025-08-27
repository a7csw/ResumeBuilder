import NavigationHeader from "@/components/NavigationHeader";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using PathStarter ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service. These terms apply to all users of the Service, including students, freelancers, and professionals.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            PathStarter is an AI-powered resume builder platform that provides users with professional resume templates, AI-enhanced content generation, and export capabilities. Our service is designed to serve various user types:
          </p>
          <ul>
            <li><strong>Students:</strong> Entry-level resumes with academic focus and internship experiences</li>
            <li><strong>Freelancers:</strong> Portfolio-style resumes highlighting project work and client achievements</li>
            <li><strong>Professionals:</strong> Advanced resumes with career progression and leadership experience</li>
          </ul>
          <p>
            The Service includes AI-powered content enhancement, professional templates, ATS optimization, and multiple export formats (PDF, DOCX).
          </p>

          <h2>3. User Conduct</h2>
          <p>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul>
            <li>Use the Service to create false, misleading, or fraudulent resumes</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the Service to harass, abuse, or harm others</li>
            <li>Share your account credentials with others</li>
            <li>Use automated tools to access the Service</li>
            <li>Attempt to reverse engineer or copy our technology</li>
          </ul>

          <h2>4. Subscription & Billing via Paddle</h2>
          <p>
            PathStarter offers subscription plans processed securely through Paddle, our payment processor:
          </p>
          <ul>
            <li><strong>Basic Plan:</strong> One-time payment of $5 for 10-day access</li>
            <li><strong>Pro Plan:</strong> Monthly subscription of $11 with recurring billing</li>
          </ul>
          <p>
            <strong>Billing Terms:</strong>
          </p>
          <ul>
            <li>All payments are processed securely through Paddle</li>
            <li>Subscription fees are charged in advance</li>
            <li>Pro subscriptions automatically renew unless cancelled</li>
            <li>Price changes will be communicated 30 days in advance</li>
            <li>Failed payments may result in service suspension</li>
            <li>Refunds are subject to our Refund Policy</li>
          </ul>

          <h2>5. Refund Policy</h2>
          <p>
            Our refund policy is designed to ensure fair usage while protecting against abuse:
          </p>
          <ul>
            <li><strong>Basic Plan:</strong> Refundable within 7 days if no exports or AI features used</li>
            <li><strong>Pro Plan:</strong> No refunds for monthly subscriptions; cancel anytime</li>
            <li>No refunds for used services or downloaded content</li>
            <li>Service credits may be provided for extended outages</li>
          </ul>
          <p>
            For detailed refund information, please see our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>.
          </p>

          <h2>6. Account Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violations of these terms. Grounds for termination include:
          </p>
          <ul>
            <li>Violation of these Terms of Service</li>
            <li>Fraudulent or abusive behavior</li>
            <li>Non-payment of subscription fees</li>
            <li>Extended periods of inactivity</li>
            <li>Legal or regulatory requirements</li>
          </ul>
          <p>
            Upon termination, your right to use the Service ceases immediately. We may delete your account data in accordance with our Privacy Policy.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            <strong>Your Content:</strong> You retain ownership of your resume content and personal information. You grant us a limited license to process and store your content for service delivery.
          </p>
          <p>
            <strong>Our Content:</strong> PathStarter retains ownership of:
          </p>
          <ul>
            <li>The platform, software, and underlying technology</li>
            <li>Resume templates and design elements</li>
            <li>AI models and algorithms</li>
            <li>Branding, logos, and marketing materials</li>
            <li>Documentation and help content</li>
          </ul>
          <p>
            You may not copy, modify, distribute, or create derivative works of our intellectual property without written permission.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, PathStarter shall not be liable for:
          </p>
          <ul>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages resulting from service interruptions</li>
            <li>Losses due to AI-generated content accuracy</li>
            <li>Third-party actions or content</li>
          </ul>
          <p>
            Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
          </p>

          <h2>9. Disclaimers</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. We do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted or error-free service</li>
            <li>Accuracy of AI-generated content</li>
            <li>Compatibility with all devices or browsers</li>
            <li>Job placement or career success</li>
            <li>ATS optimization results</li>
          </ul>

          <h2>10. Privacy & Data Protection</h2>
          <p>
            Your privacy is important to us. We collect, use, and protect your information as described in our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. By using the Service, you consent to our data practices.
          </p>
          <p>
            We implement appropriate security measures to protect your data, but no method of transmission over the internet is 100% secure.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where PathStarter operates, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. We will notify users of significant changes via:
          </p>
          <ul>
            <li>Email notification to registered users</li>
            <li>In-app notifications</li>
            <li>Updated revision date on this page</li>
          </ul>
          <p>
            Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>

          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue in full force and effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.
          </p>

          <h2>14. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and PathStarter regarding the Service. They supersede all prior agreements and understandings.
          </p>

          <h2>15. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> legal@pathstarter.com</li>
            <li><strong>Support:</strong> support@pathstarter.com</li>
            <li><strong>Response Time:</strong> Within 24-48 hours</li>
            <li><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</li>
          </ul>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-0">
              <strong>Note:</strong> These terms are specific to PathStarter and may differ from other resume builder services. Please read them carefully before using our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
