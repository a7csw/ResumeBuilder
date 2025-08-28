import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, FileText, AlertTriangle, Shield, CreditCard, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { initPageSEO } from "@/lib/seo";

const TermsConditions = () => {
  useEffect(() => {
    initPageSEO('termsConditions');
  }, []);

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
              <FileText className="w-4 h-4" />
              Legal Terms
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Terms & Conditions
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
                <FileText className="w-6 h-6" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  Welcome to NOVAECV. These Terms & Conditions ("Terms") govern your use of our AI-powered resume builder service. By accessing or using our service, you agree to be bound by these Terms.
                </p>
                <p>
                  <strong>Service Owner:</strong> This service is owned and operated by Abdulrahman Rafid Sabri Al-Faiadi, an individual developer (not a registered company).
                </p>
                <p>
                  <strong>Service Description:</strong> NOVAECV is an AI-powered resume builder that generates professional resumes using OpenAI's artificial intelligence technology.
                </p>
                <p>
                  <strong>Website:</strong> <a href="https://resume-builder-eight-kappa.vercel.app/" className="text-blue-600 dark:text-blue-400 hover:underline">https://resume-builder-eight-kappa.vercel.app/</a>
                </p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                2. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>By using NOVAECV, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our service.</p>
                <p>These Terms constitute a legally binding agreement between you and the service owner regarding your use of NOVAECV.</p>
              </div>
            </section>

            {/* Service Description */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Bot className="w-6 h-6" />
                3. Service Description
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>AI-Powered Resume Builder:</strong> NOVAECV uses OpenAI's artificial intelligence technology to generate professional resumes based on the information you provide.</p>
                <p><strong>Service Features:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI-generated resume content</li>
                  <li>Professional resume templates</li>
                  <li>ATS-optimized formatting</li>
                  <li>Multiple export formats (PDF, DOCX)</li>
                  <li>User account management</li>
                </ul>
                <p><strong>Service Availability:</strong> We strive to maintain service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance or technical issues.</p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                4. User Responsibilities
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Data Accuracy:</strong> You are responsible for the accuracy and truthfulness of all information you input into our service. We are not responsible for any consequences resulting from inaccurate or false information.</p>
                <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <p><strong>Acceptable Use:</strong> You agree to use our service only for lawful purposes and in accordance with these Terms. You may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the service to create false or misleading resumes</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Share your account with others</li>
                  <li>Use automated tools to access the service</li>
                </ul>
              </div>
            </section>

            {/* AI Technology and Limitations */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                5. AI Technology and Limitations
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>AI-Generated Content:</strong> Our service uses OpenAI's artificial intelligence to generate resume content. While we strive for quality, AI-generated content may have limitations and should be reviewed before use.</p>
                <p><strong>Content Review:</strong> You are responsible for reviewing, editing, and verifying all AI-generated content before using it in job applications or other professional contexts.</p>
                <p><strong>No Guarantees:</strong> We do not guarantee that AI-generated resumes will result in job offers, interviews, or career success. The effectiveness of resumes depends on various factors beyond our control.</p>
                <p><strong>AI Limitations:</strong> AI technology may occasionally produce errors, inconsistencies, or inappropriate content. You should always review and customize the generated content.</p>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                6. Payment Terms
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Payment Processing:</strong> All payments are processed securely by Paddle, a trusted third-party payment provider. We do not directly handle or store your payment information.</p>
                <p><strong>Subscription Plans:</strong> We offer various subscription plans with different features and pricing. All fees are charged in advance and are non-refundable except as outlined in our Refund Policy.</p>
                <p><strong>Price Changes:</strong> We reserve the right to change our pricing at any time. Price changes will be communicated in advance, and continued use constitutes acceptance of new pricing.</p>
                <p><strong>Failed Payments:</strong> Failed payments may result in service suspension or account termination. You are responsible for ensuring valid payment methods are maintained.</p>
              </div>
            </section>

            {/* Refund Policy */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                7. Refund Policy
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>General Policy:</strong> Refunds are generally not provided once a resume has been successfully generated. However, refunds may be considered in exceptional circumstances.</p>
                <p><strong>Refund Eligibility:</strong> Refunds may be considered only if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No resume was generated or exported</li>
                  <li>Clear evidence of technical failure is provided</li>
                  <li>The AI-generated content was demonstrably faulty and unusable</li>
                  <li>The request is made within a reasonable timeframe</li>
                </ul>
                <p><strong>Refund Process:</strong> Refund requests are reviewed at the sole discretion of the service owner. All refunds are processed through Paddle in accordance with their policies.</p>
                <p><strong>No Guaranteed Refunds:</strong> Refunds are not guaranteed and are approved on a case-by-case basis. This is a small, individual-run project with manual review processes.</p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                8. Intellectual Property
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Your Content:</strong> You retain ownership of your resume content and personal information. You grant us a limited license to process your content for service delivery.</p>
                <p><strong>Our Content:</strong> NOVAECV retains ownership of:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The platform, software, and underlying technology</li>
                  <li>Resume templates and design elements</li>
                  <li>Website content and branding</li>
                  <li>Documentation and help materials</li>
                </ul>
                <p><strong>AI-Generated Content:</strong> AI-generated content is based on your input and is provided for your use. However, the underlying AI technology and algorithms remain the property of OpenAI.</p>
              </div>
            </section>

            {/* Service Changes and Discontinuation */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                9. Service Changes and Discontinuation
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Service Modifications:</strong> We reserve the right to modify, suspend, or discontinue any part of our service at any time without prior notice.</p>
                <p><strong>Feature Changes:</strong> Features, functionality, and service offerings may be added, removed, or modified at our discretion.</p>
                <p><strong>Service Discontinuation:</strong> In the event of service discontinuation, we will provide reasonable notice and may offer data export options where feasible.</p>
                <p><strong>No Liability:</strong> We shall not be liable for any damages resulting from service changes, modifications, or discontinuation.</p>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                10. Disclaimers
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Service "As Is":</strong> Our service is provided "as is" without warranties of any kind, either express or implied.</p>
                <p><strong>No Guarantees:</strong> We do not guarantee:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Uninterrupted or error-free service</li>
                  <li>Accuracy of AI-generated content</li>
                  <li>Job placement or career success</li>
                  <li>Compatibility with all devices or browsers</li>
                  <li>Results from using our service</li>
                </ul>
                <p><strong>Third-Party Services:</strong> We are not responsible for the performance, reliability, or availability of third-party services (OpenAI, Paddle, etc.).</p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                11. Limitation of Liability
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>To the maximum extent permitted by law, NOVAECV and its owner shall not be liable for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages resulting from service interruptions</li>
                  <li>Losses due to AI-generated content accuracy</li>
                  <li>Third-party actions or content</li>
                </ul>
                <p>Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.</p>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                12. Termination
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Termination by You:</strong> You may terminate your account at any time by contacting us or using the account deletion feature.</p>
                <p><strong>Termination by Us:</strong> We may terminate or suspend your account for violations of these Terms, fraudulent activity, or non-payment.</p>
                <p><strong>Effect of Termination:</strong> Upon termination, your right to use the service ceases immediately. We may delete your account data in accordance with our Privacy Policy.</p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                13. Governing Law
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
                <p>Any disputes arising from these Terms or your use of the service shall be resolved through appropriate legal channels.</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                14. Changes to Terms
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.</p>
                <p>We will notify users of significant changes via email or website notifications. Your continued use of the service after changes constitutes acceptance of the updated Terms.</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                15. Contact Information
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>For questions about these Terms & Conditions, please contact us:</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></p>
                    <p><strong>Service Owner:</strong> Abdulrahman Rafid Sabri Al-Faiadi</p>
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
              By using NOVAECV, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
