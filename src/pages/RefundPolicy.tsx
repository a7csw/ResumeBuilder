import NavigationHeader from "@/components/NavigationHeader";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />
      
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Refund Eligibility</h2>
          <p>
            We offer refunds under specific conditions to ensure fair usage of our service. Refunds are available for one-time purchases (Basic and AI plans) only if:
          </p>
          <ul>
            <li>You have not downloaded or exported any resume files</li>
            <li>You have not completed and generated a final resume export</li>
            <li>The refund request is made within 7 days of purchase</li>
            <li>No AI enhancement features have been used</li>
          </ul>

          <h2>2. Non-Refundable Services</h2>
          <p>
            The following are not eligible for refunds:
          </p>
          <ul>
            <li>Pro subscription payments (monthly recurring)</li>
            <li>Purchases where files have been downloaded or exported</li>
            <li>Purchases where AI features have been actively used</li>
            <li>Purchases older than 7 days</li>
            <li>Partial refunds for unused subscription time</li>
          </ul>

          <h2>3. Subscription Cancellations</h2>
          <p>
            For Pro subscriptions:
          </p>
          <ul>
            <li>You can cancel your subscription at any time</li>
            <li>Cancellation prevents future billing but does not provide refunds for the current period</li>
            <li>You retain access to Pro features until the end of your current billing period</li>
            <li>No partial refunds are provided for early cancellation</li>
          </ul>

          <h2>4. Automatic Refund Prevention</h2>
          <p>
            Our system automatically tracks usage to prevent refund fraud:
          </p>
          <ul>
            <li>First export timestamp is recorded</li>
            <li>AI feature usage is monitored</li>
            <li>File download history is maintained</li>
            <li>Form completion progress is tracked</li>
          </ul>

          <h2>5. How to Request a Refund</h2>
          <p>
            To request a refund:
          </p>
          <ol>
            <li>Contact our support team at support@resumebuilder.com</li>
            <li>Include your account email and purchase details</li>
            <li>Provide a reason for the refund request</li>
            <li>Allow 5-7 business days for processing</li>
          </ol>

          <h2>6. Refund Processing</h2>
          <p>
            Approved refunds will be processed as follows:
          </p>
          <ul>
            <li>Refunds are issued to the original payment method</li>
            <li>Processing time: 5-10 business days</li>
            <li>Stripe processing fees are not refundable</li>
            <li>Your account access will be immediately downgraded</li>
          </ul>

          <h2>7. Dispute Resolution</h2>
          <p>
            If you disagree with a refund decision:
          </p>
          <ul>
            <li>You may appeal the decision within 30 days</li>
            <li>Provide additional documentation if available</li>
            <li>Final decisions will be made within 10 business days</li>
          </ul>

          <h2>8. Chargeback Protection</h2>
          <p>
            Before initiating a chargeback with your bank or credit card company:
          </p>
          <ul>
            <li>Please contact our support team first</li>
            <li>Most issues can be resolved quickly without chargebacks</li>
            <li>Chargebacks may result in account suspension</li>
          </ul>

          <h2>9. Service Interruptions</h2>
          <p>
            In case of extended service outages (more than 24 hours):
          </p>
          <ul>
            <li>Pro subscribers may receive service credits</li>
            <li>One-time plan users may receive extended access</li>
            <li>Compensation is determined case-by-case</li>
          </ul>

          <h2>10. Fair Usage Policy</h2>
          <p>
            We reserve the right to deny refunds for:
          </p>
          <ul>
            <li>Repeated refund requests</li>
            <li>Suspected abuse of the refund policy</li>
            <li>Violation of our Terms of Service</li>
            <li>Fraudulent activity</li>
          </ul>

          <h2>11. European Union Rights</h2>
          <p>
            For EU customers, you have the right to withdraw from digital content purchases within 14 days, unless you have started downloading or using the content.
          </p>

          <h2>12. Policy Changes</h2>
          <p>
            We may update this refund policy. Changes will be posted on this page with an updated revision date. Continued use of our service constitutes acceptance of any changes.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            For refund requests or questions about this policy:
          </p>
          <ul>
            <li>Email: support@resumebuilder.com</li>
            <li>Response time: Within 24 hours</li>
            <li>Business hours: Monday-Friday, 9 AM - 6 PM EST</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;