import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Launcher AI
        </Link>
        <Link
          href="/onboarding"
          className="bg-black text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Build My Launch Plan
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: March 2026</p>
          <p className="text-gray-600 text-base leading-relaxed mt-2">
            This Privacy Policy explains how Launcher AI collects, uses, and protects information when you use our service.
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm text-gray-700 leading-relaxed">

          {/* 1 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">1. Information We Collect</h2>
            <p>When you use Launcher AI, we may collect:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Product links you submit",
                "Responses to onboarding questions",
                "Account information such as your email address",
                "Basic usage data such as page visits and interactions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>This information helps us generate personalized launch plans and improve the platform.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 2 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">2. How We Use Information</h2>
            <p>We use collected information to:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Generate launch strategies and recommendations",
                "Personalize your dashboard experience",
                "Improve the accuracy and usefulness of the platform",
                "Maintain and operate the service",
                "Provide customer support if needed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>We do not sell your personal information.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 3 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">3. Third-Party Services</h2>
            <p>Launcher AI relies on trusted third-party services to operate the platform, including services for:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Hosting and infrastructure",
                "Analytics",
                "Payment processing (such as Stripe)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>These services may process limited information necessary to operate the platform.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 4 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">4. Data Security</h2>
            <p>We take reasonable steps to protect your information using modern security practices. However, no internet system can guarantee complete security.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 5 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">5. Data Retention</h2>
            <p>We retain information only as long as necessary to operate and improve the service.</p>
            <p>You may request deletion of your data by contacting us.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 6 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">6. Children&apos;s Privacy</h2>
            <p>Launcher AI is not intended for children under the age of 13, and we do not knowingly collect personal information from children.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 7 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Continued use of Launcher AI after changes means you accept the updated policy.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 8 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">8. Contact</h2>
            <p>If you have questions about this Privacy Policy, contact us:</p>
            <ul className="flex flex-col gap-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                Support: <a href="mailto:support@newburyai.com" className="text-black underline underline-offset-2 hover:text-gray-600 transition-colors">support@newburyai.com</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                Business inquiries: <a href="mailto:hello@newburyai.com" className="text-black underline underline-offset-2 hover:text-gray-600 transition-colors">hello@newburyai.com</a>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
