import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { ArrowLeft, RefreshCw, AlertTriangle, CreditCard, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { initPageSEO } from "@/lib/seo";

const RefundPolicy = () => {
  useEffect(() => {
    initPageSEO('refundPolicy');
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
              <RefreshCw className="w-4 h-4" />
              Refund Information
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Refund Policy
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
                <RefreshCw className="w-6 h-6" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  This Refund Policy outlines the terms and conditions for refunds on NOVAECV, our AI-powered resume builder service. Please read this policy carefully before making a purchase.
                </p>
                <p>
                  <strong>Service Information:</strong> NOVAECV is operated by Abdulrahman Rafid Sabri Al-Faiadi, an individual developer. This is a small, individual-run project with manual review processes for refund requests.
                </p>
                <p>
                  <strong>Payment Processing:</strong> All payments and refunds are processed through Paddle, a trusted third-party payment provider, in accordance with their policies.
                </p>
              </div>
            </section>

            {/* General Refund Policy */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                2. General Refund Policy
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Primary Rule:</strong> Refunds are generally <strong>NOT provided</strong> once a resume has been successfully generated and exported from our service.</p>
                <p><strong>Service Delivery:</strong> Our service is considered delivered when:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A resume has been successfully generated using our AI technology</li>
                  <li>The resume has been exported or downloaded in any format (PDF, DOCX)</li>
                  <li>AI features have been utilized to enhance the resume content</li>
                </ul>
                <p><strong>No Refund Guarantee:</strong> Refunds are not guaranteed and are approved at the sole discretion of the service owner.</p>
              </div>
            </section>

            {/* Refund Eligibility */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                3. Refund Eligibility
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Refunds may be considered ONLY in the following circumstances:</strong></p>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Eligible for Refund:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>No Resume Generated:</strong> If no resume was successfully created or exported</li>
                    <li><strong>Technical Failure:</strong> Clear evidence of technical failure preventing service delivery</li>
                    <li><strong>AI Content Fault:</strong> Demonstrable proof that AI-generated content was faulty and unusable</li>
                    <li><strong>Service Unavailability:</strong> Extended service outages preventing use of the service</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                  <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">NOT Eligible for Refund:</h3>
                  <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                    <li><strong>Resume Generated:</strong> Any successful resume generation or export</li>
                    <li><strong>AI Features Used:</strong> Utilization of AI enhancement features</li>
                    <li><strong>Change of Mind:</strong> Simply changing your mind after purchase</li>
                    <li><strong>Job Application Results:</strong> Failure to get interviews or job offers</li>
                    <li><strong>Content Accuracy:</strong> Minor errors or formatting preferences</li>
                    <li><strong>Account Sharing:</strong> Unauthorized account sharing or usage</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Process */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                4. Refund Process
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>How to Request a Refund:</strong></p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Contact Us:</strong> Email your refund request to <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></li>
                  <li><strong>Provide Details:</strong> Include your account email, purchase details, and reason for refund</li>
                  <li><strong>Evidence:</strong> Provide clear evidence supporting your refund claim</li>
                  <li><strong>Review Period:</strong> Allow 5-10 business days for manual review</li>
                </ol>

                <p><strong>Required Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account email address used for purchase</li>
                  <li>Purchase date and transaction ID</li>
                  <li>Detailed reason for refund request</li>
                  <li>Screenshots or evidence supporting your claim</li>
                </ul>

                <p><strong>Review Process:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All refund requests are manually reviewed by the service owner</li>
                  <li>Decisions are made at the sole discretion of the service owner</li>
                  <li>Review process may take 5-10 business days</li>
                  <li>You will be notified of the decision via email</li>
                </ul>
              </div>
            </section>

            {/* Paddle Integration */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                5. Paddle Integration
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Payment Processing:</strong> All payments and refunds are processed through Paddle, following their 14-day refund policy and terms of service.</p>
                <p><strong>Refund Processing:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Approved refunds are processed through Paddle</li>
                  <li>Processing time: 5-10 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Paddle processing fees are not refundable</li>
                </ul>
                <p><strong>Paddle's 14-Day Policy:</strong> This policy aligns with Paddle's standard 14-day refund window for digital products, subject to our specific eligibility criteria.</p>
              </div>
            </section>

            {/* Processing Timeline */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Clock className="w-6 h-6" />
                6. Processing Timeline
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Review Period</h3>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">5-10 days</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manual review by service owner</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Refund Processing</h3>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">5-10 days</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Via Paddle payment processor</p>
                  </div>
                </div>
                <p><strong>Total Timeline:</strong> 10-20 business days from request to refund completion (if approved).</p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                7. Dispute Resolution
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Appeal Process:</strong> If your refund request is denied, you may appeal the decision within 30 days by providing additional documentation or evidence.</p>
                <p><strong>Final Decision:</strong> The service owner's decision on refund requests is final and binding.</p>
                <p><strong>Alternative Resolution:</strong> For unresolved disputes, you may contact Paddle's customer support or your payment provider.</p>
                <p><strong>Legal Rights:</strong> This policy does not affect your statutory rights under applicable consumer protection laws.</p>
              </div>
            </section>

            {/* Special Circumstances */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                8. Special Circumstances
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p><strong>Service Interruptions:</strong> In case of extended service outages (more than 24 hours), we may offer service credits or extended access periods.</p>
                <p><strong>Technical Issues:</strong> For demonstrable technical failures preventing service use, refunds may be considered on a case-by-case basis.</p>
                <p><strong>Account Issues:</strong> If account access issues prevent service use, we will work to resolve the issue before considering refunds.</p>
                <p><strong>Force Majeure:</strong> Refunds may be affected by circumstances beyond our control (natural disasters, technical failures, etc.).</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                9. Contact Information
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>For refund requests or questions about this policy, please contact us:</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:alfaiadiabood@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alfaiadiabood@gmail.com</a></p>
                    <p><strong>Service:</strong> NOVAECV</p>
                    <p><strong>Service Owner:</strong> Abdulrahman Rafid Sabri Al-Faiadi</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                    <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <p><strong>Important Note:</strong> This is a small, individual-run project. Please be patient with response times and understand that all refund decisions are made manually.</p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
                10. Policy Updates
              </h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>We reserve the right to update this Refund Policy at any time. Changes will be effective immediately upon posting on our website.</p>
                <p>We will notify users of significant changes via email or website notifications. Continued use of our service after changes constitutes acceptance of the updated policy.</p>
                <p>For the most current version of this policy, please refer to our website.</p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This Refund Policy is effective as of the date listed above and aligns with Paddle's 14-day refund policy for digital products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
