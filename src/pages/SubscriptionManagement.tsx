export default function SubscriptionManagement() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Management
          </h1>
          <p className="text-xl text-gray-600">
            Manage your Sharpside Sports subscription through our secure payment processor
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Manage Your Subscription
            </h2>
            <p className="text-gray-600">
              All subscription management is handled through our secure payment processor, Winible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How to Access Your Subscription
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Your subscription is managed through the Winible dashboard</p>
                  <p>• This is the same platform you used during checkout</p>
                  <p>• All billing and subscription changes are handled securely through Winible</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What You Can Do
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• View your current subscription status</p>
                  <p>• Update payment information</p>
                  <p>• Cancel your subscription</p>
                  <p>• Download invoices and receipts</p>
                  <p>• Change your subscription plan</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Need Help?
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you need assistance with your subscription or have any questions, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">Email Support:</p>
                    <a 
                      href="mailto:info@sharpsidesports.com" 
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      info@sharpsidesports.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Important Notes
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Cancellations take effect at the end of your current billing period</p>
                  <p>• You'll continue to have access until your current period ends</p>
                  <p>• Refunds are handled on a case-by-case basis</p>
                  <p>• All subscription changes are processed through Winible</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-900">
                  Secure Payment Processing
                </h3>
                <p className="text-blue-700 mt-1">
                  Your payment information is securely processed by Winible, our trusted payment processor. 
                  We never store your payment details on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Subscription Renewal and Cancellation Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Subscription Renewal & Cancellation Policy
            </h2>
            <p className="text-gray-600">
              Important information about automatic renewals and cancellation procedures
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Automatic Renewal
                  </h3>
                  <p className="text-yellow-700 mt-1">
                    <strong>Packages renew automatically at the end of each subscription period (recurring).</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Subscribed BEFORE 11/2/24
                </h3>
                <div className="space-y-3 text-red-800">
                  <p className="font-medium">Cancellation Process:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Email us at <a href="mailto:info@sharpsidesports.com" className="text-red-600 hover:text-red-700 font-medium">info@sharpsidesports.com</a></li>
                    <li>Request cancellation PRIOR to your renewal date</li>
                    <li>We will cancel the subscription on your behalf</li>
                    <li><strong>21-day notice required</strong> for monthly, season long, and annual subscriptions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">
                  Subscribed AFTER 11/2/24
                </h3>
                <div className="space-y-3 text-green-800">
                  <p className="font-medium">Self-Service Management:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Manage your subscription through your account on Winible.com</li>
                    <li>Access your payment processor dashboard directly</li>
                    <li>Cancel, modify, or update your subscription anytime</li>
                    <li>No email required - full self-service control</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Important Reminders
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>• <strong>21-day notice required</strong> for cancellations on monthly, season long, and annual subscriptions</p>
                <p>• Cancellations take effect at the end of your current billing period</p>
                <p>• You'll continue to have access until your current period ends</p>
                <p>• For urgent cancellations, contact support immediately</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="mailto:info@sharpsidesports.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 