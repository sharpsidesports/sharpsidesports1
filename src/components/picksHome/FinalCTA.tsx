interface FinalCTAProps {
  onCtaClick: () => void;
}

// Final conversion banner + standard betting disclaimer. The site-wide
// Footer (links, contact, copyright) already renders below every page via
// App.tsx, so this section intentionally only adds the CTA banner and the
// gambling disclaimer rather than duplicating those global footer links.
export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gray-900 px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Start finding your edge today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
          Try it free — no credit card required to see this week&apos;s picks.
        </p>
        <button
          onClick={onCtaClick}
          className="mt-8 inline-flex items-center rounded-lg bg-sharpside-green px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Start Free Trial
        </button>
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-gray-400">
        Gambling involves financial risk and may not be suitable for all individuals. Please gamble responsibly
        and only wager what you can afford to lose. If you or someone you know has a gambling problem, call the
        National Problem Gambling Helpline at 1-800-522-4700. You must be 21 years of age or older (or the legal
        betting age in your jurisdiction) to use this service. This site does not accept wagers; it provides
        informational picks and analysis only. Past performance, including all figures shown on this page, does
        not guarantee future results.
      </p>
    </section>
  );
}
