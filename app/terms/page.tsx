import Link from "next/link";

export default function Terms() {
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
          <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: March 2026</p>
          <p className="text-gray-600 text-base leading-relaxed mt-2">
            Welcome to Launcher AI. By accessing or using our website and services, you agree to the following terms.
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm text-gray-700 leading-relaxed">

          {/* 1 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">1. Overview</h2>
            <p>Launcher AI provides tools that analyze product pages and generate launch strategy suggestions for founders and builders.</p>
            <p>By accessing or using Launcher AI, you agree to comply with these Terms of Service and all applicable laws.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 2 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">2. Use of the Service</h2>
            <p>You agree to use Launcher AI only for lawful purposes.</p>
            <p>You may not:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Use the service in a way that violates any laws or regulations",
                "Attempt to interfere with the platform or its infrastructure",
                "Attempt to gain unauthorized access to systems or data",
                "Abuse, scrape, or overload the service",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>We reserve the right to suspend or terminate access if misuse is detected.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 3 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">3. Generated Insights</h2>
            <p>Launcher AI generates recommendations, suggestions, and analysis based on the information you provide.</p>
            <p>These outputs:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Are generated automatically",
                "May not always be accurate or complete",
                "Should not be considered professional business, financial, or legal advice",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>You are responsible for how you use the information provided.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 4 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">4. Payments</h2>
            <p>Some features of Launcher AI may require payment.</p>
            <p>If you purchase access:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Payments are processed securely through third-party providers such as Stripe",
                "Prices are displayed before purchase",
                "Access is granted after successful payment",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>Unless otherwise stated, purchases are non-refundable.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 5 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">5. Intellectual Property</h2>
            <p>All content, software, branding, and design associated with Launcher AI are the property of Launcher AI and Newbury AI.</p>
            <p>You may not copy, redistribute, resell, or reverse engineer any part of the service without permission.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 6 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">6. Service Availability</h2>
            <p>We aim to keep Launcher AI available and reliable, but we do not guarantee uninterrupted access. Features may be updated, modified, or removed at any time.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 7 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">7. Limitation of Liability</h2>
            <p>Launcher AI is provided &quot;as is&quot;.</p>
            <p>To the fullest extent permitted by law, Launcher AI and Newbury AI are not liable for:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Business losses",
                "Lost revenue",
                "Lost opportunities",
                "Decisions made based on generated recommendations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 8 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">8. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Continued use of Launcher AI after changes means you accept the updated terms.</p>
          </section>

          <div className="h-px bg-gray-100" />

          {/* 9 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-black">9. Contact</h2>
            <p>If you have questions about these Terms, you can contact us:</p>
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
