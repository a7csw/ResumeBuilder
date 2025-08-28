import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, Shield, Eye, Lock, Database, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-gray-100/30 dark:from-slate-800/30 dark:to-gray-800/30"></div>
      
      <div className="relative z-10 container px-6 py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
              <Shield className="w-4 h-4" />
              Privacy & Data Protection
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Privacy Policy
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            {/* Back to Home Button */}
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Eye className="w-6 h-6" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  Welcome to NOVAECV ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered resume builder service.
                </p>
                <p>
                  <strong>Service Information:</strong> NOVAECV is an AI-powered resume builder platform hosted at <a href="https://resume-builder-eight-kappa.vercel.app/" className="text-blue-600 dark:text-blue-400 hover:underline">https://resume-builder-eight-kappa.vercel.app/</a>
                </p>
                <p>
                  <strong>Data Controller:</strong> This service is operated by Abdulrahman Rafid Sabri Al-Faiadi, an individual developer. For privacy-related inquiries, please contact us at <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a>
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Database className="w-6 h-6" />
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Personal Information:</strong> We collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Name and Surname:</strong> To personalize your experience and resume content</li>
                  <li><strong>Email Address:</strong> For account creation, communication, and service delivery</li>
                  <li><strong>Password:</strong> For account security (encrypted and securely stored)</li>
                  <li><strong>Resume Content:</strong> The information you input to generate your resume</li>
                </ul>
                
                <p><strong>Payment Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Payment Metadata:</strong> We collect payment-related metadata (transaction IDs, amounts, dates)</li>
                  <li><strong>No Direct Payment Processing:</strong> We do NOT collect, store, or process credit card information, billing addresses, or other sensitive payment details</li>
                  <li><strong>Third-Party Payment Processing:</strong> All payment processing is handled securely by Paddle, a trusted third-party payment provider</li>
                </ul>

                <p><strong>Technical Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Usage analytics and service performance data</li>
                  <li>Browser type and version</li>
                  <li>Operating system information</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                3. How We Use Your Information
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Delivery:</strong> To provide our AI-powered resume building service</li>
                  <li><strong>Account Management:</strong> To create and manage your user account</li>
                  <li><strong>AI Processing:</strong> To generate resume content using OpenAI APIs</li>
                  <li><strong>Communication:</strong> To send you important service updates and notifications</li>
                  <li><strong>Payment Processing:</strong> To process payments through Paddle</li>
                  <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our service</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Lock className="w-6 h-6" />
                4. Data Storage and Security
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Data Storage:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Supabase:</strong> All data is securely stored using Supabase, a trusted cloud database provider</li>
                  <li><strong>Encryption:</strong> Data is encrypted both in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Strict access controls are implemented to protect your data</li>
                </ul>

                <p><strong>Security Measures:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Industry-standard encryption protocols</li>
                  <li>Regular security audits and updates</li>
                  <li>Secure API endpoints with authentication</li>
                  <li>Monitoring for suspicious activities</li>
                </ul>

                <p><strong>Third-Party Services:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>OpenAI:</strong> Resume content generation (data is processed according to OpenAI's privacy policy)</li>
                  <li><strong>Paddle:</strong> Payment processing (payment data is handled according to Paddle's privacy policy)</li>
                  <li><strong>Supabase:</strong> Data storage and authentication</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing and Disclosure */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                5. Data Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third-party services (OpenAI, Paddle, Supabase) as necessary to provide our service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In the event of a business transfer or acquisition</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                6. Your Rights
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Objection:</strong> Object to processing of your data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p>To exercise these rights, please contact us at <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                7. Data Retention
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We retain your personal information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services</li>
                </ul>
                <p>When you delete your account, we will delete your personal information within 30 days, except where retention is required by law.</p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                8. International Data Transfers
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standard contractual clauses</li>
                  <li>Adequacy decisions</li>
                  <li>Other appropriate safeguards as required by law</li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                9. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintain your session and preferences</li>
                  <li>Analyze service usage and performance</li>
                  <li>Improve user experience</li>
                  <li>Provide security features</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                10. Children's Privacy
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                11. Changes to This Policy
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending you an email notification</li>
                  <li>Displaying a notice on our service</li>
                </ul>
                <p>Your continued use of our service after changes become effective constitutes acceptance of the updated policy.</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                12. Contact Information
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></p>
                    <p><strong>Service:</strong> NOVAECV</p>
                    <p><strong>Website:</strong> <a href="https://resume-builder-eight-kappa.vercel.app/" className="text-blue-600 dark:text-blue-400 hover:underline">https://resume-builder-eight-kappa.vercel.app/</a></p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This Privacy Policy is effective as of the date listed above and complies with GDPR, CCPA, and other applicable privacy laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
