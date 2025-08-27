import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
              Legal Information
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Terms of Service
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
          <div className="space-y-12">
            {/* Introduction */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                1. Introduction
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  Welcome to NovaECV, an AI-powered resume builder platform designed to help you create professional, ATS-optimized resumes. By accessing and using our service, you agree to be bound by these Terms of Service.
                </p>
                <p>
                  These terms govern your use of NovaECV's website, mobile applications, and services. Please read them carefully before using our platform. If you do not agree to these terms, please do not use our service.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                2. Eligibility
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  To use NovaECV, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <p>
                  We reserve the right to refuse service to anyone for any reason at our discretion.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                3. User Responsibilities
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  As a user of NovaECV, you are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and truthful information in your resumes</li>
                  <li>Reviewing and verifying AI-generated content before use</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Prohibited Activities:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Creating false or misleading resumes</li>
                  <li>Sharing account credentials with others</li>
                  <li>Using the service for illegal purposes</li>
                  <li>Attempting to reverse engineer our technology</li>
                  <li>Violating intellectual property rights</li>
                </ul>
              </div>
            </section>

            {/* Subscription & Payment Terms */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                4. Subscription & Payment Terms
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  NovaECV offers the following subscription plans:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Basic Plan</h3>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">$5</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">One-time payment for 10-day access</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Pro Plan</h3>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">$11/month</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Recurring subscription with unlimited access</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <p><strong>Payment Processing:</strong> All payments are processed securely through Paddle.</p>
                  <p><strong>Billing:</strong> Pro subscriptions automatically renew unless cancelled.</p>
                  <p><strong>Refunds:</strong> Subject to our Refund Policy. No refunds for used services.</p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                5. Intellectual Property
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Your Content:</strong> You retain ownership of your resume content and personal information. You grant us a limited license to process and store your content for service delivery.</p>
                <p><strong>Our Content:</strong> NovaECV retains ownership of:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The platform, software, and underlying technology</li>
                  <li>Resume templates and design elements</li>
                  <li>AI models and algorithms</li>
                  <li>Branding, logos, and marketing materials</li>
                </ul>
                <p>You may not copy, modify, distribute, or create derivative works of our intellectual property without written permission.</p>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                6. Termination
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We may terminate or suspend your account at any time for violations of these terms. Grounds for termination include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or abusive behavior</li>
                  <li>Non-payment of subscription fees</li>
                  <li>Extended periods of inactivity</li>
                </ul>
                <p>Upon termination, your right to use the service ceases immediately. We may delete your account data in accordance with our Privacy Policy.</p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                7. Governing Law
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where NovaECV operates, without regard to conflict of law principles.</p>
                <p>Any disputes arising from these terms or your use of the service shall be resolved in the courts of that jurisdiction.</p>
                <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                8. Contact
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>For questions about these Terms of Service, please contact us:</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@novaecv.com</p>
                    <p><strong>Support:</strong> support@novaecv.com</p>
                    <p><strong>Response Time:</strong> Within 24-48 hours</p>
                    <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By using NovaECV, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;