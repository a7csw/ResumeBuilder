import NavigationHeader from "@/components/NavigationHeader";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            We collect information you provide directly to us, such as:
          </p>
          <ul>
            <li>Name, email address, and contact information when you create an account</li>
            <li>Resume content, including work experience, education, and skills</li>
            <li>Payment information processed securely through Stripe</li>
            <li>Communication preferences and feedback</li>
          </ul>

          <h3>Usage Information</h3>
          <p>
            We automatically collect certain information about your use of our service:
          </p>
          <ul>
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage patterns and feature interactions</li>
            <li>Performance data and error logs</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates and notifications</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:
          </p>
          <ul>
            <li>With service providers who help us operate our platform (e.g., Stripe for payments, Supabase for data storage)</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with a business transaction such as a merger or acquisition</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure payment processing through PCI-compliant providers</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have the following rights:
          </p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your account and data</li>
            <li>Data portability</li>
            <li>Opt-out of certain communications</li>
          </ul>

          <h2>7. Cookies and Analytics</h2>
          <p>
            We use cookies and similar technologies to enhance your experience and analyze usage patterns. You can control cookie settings through your browser preferences.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            Our service integrates with third-party providers:
          </p>
          <ul>
            <li>Supabase for database and authentication services</li>
            <li>Stripe for payment processing</li>
            <li>OpenAI for AI-powered features</li>
          </ul>
          <p>
            These services have their own privacy policies governing the use of your information.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@resumebuilder.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;