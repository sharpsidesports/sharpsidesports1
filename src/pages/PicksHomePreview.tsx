import { useCallback, useEffect } from 'react';
import PicksLayout from '../components/picksHome/PicksLayout.js';
import { FREE_TRIAL_CHECKOUT_URL } from '../components/picksHome/PicksNavigation.js';
import Hero from '../components/picksHome/Hero.js';
import CalculatorTeaser from '../components/picksHome/CalculatorTeaser.js';
import ProfitCalculator from '../components/picksHome/ProfitCalculator.js';
import TrackRecord from '../components/picksHome/TrackRecord.js';
import Articles from '../components/picksHome/Articles.js';
import HowItWorks from '../components/picksHome/HowItWorks.js';
import Pricing from '../components/picksHome/Pricing.js';
import FAQ from '../components/picksHome/FAQ.js';
import FinalCTA from '../components/picksHome/FinalCTA.js';
import FadeInSection from '../components/picksHome/FadeInSection.js';

const PAGE_TITLE = 'Data-Driven Sports Betting Picks & Models | SharpSide Sports';
const PAGE_DESCRIPTION =
  'Positive-EV sports betting picks backed by a transparent, data-driven model. See projected profit live with our calculator, browse a publicly tracked record, and start a free trial.';

export default function PicksHomePreview() {
  const handleCtaClick = useCallback(() => {
    window.location.href = FREE_TRIAL_CHECKOUT_URL;
  }, []);

  useEffect(() => {
    document.title = PAGE_TITLE;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', PAGE_DESCRIPTION);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', PAGE_TITLE);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', PAGE_DESCRIPTION);
    }

    // PLACEHOLDER OG image — replace with a real branded social share image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', 'https://sharpsidesports.com/og-image-placeholder.png');
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', PAGE_TITLE);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', PAGE_DESCRIPTION);
    }

    return () => {
      document.title = 'sharpside golf';
    };
  }, []);

  return (
    <PicksLayout>
      <Hero onCtaClick={handleCtaClick} />

      <FadeInSection className="-mt-6 mb-6 sm:-mt-10 sm:mb-10">
        <CalculatorTeaser />
      </FadeInSection>

      <FadeInSection>
        <ProfitCalculator />
      </FadeInSection>

      <FadeInSection>
        <TrackRecord />
      </FadeInSection>

      <FadeInSection>
        <Articles />
      </FadeInSection>

      <FadeInSection>
        <HowItWorks />
      </FadeInSection>

      <FadeInSection>
        <Pricing />
      </FadeInSection>

      <FadeInSection>
        <FAQ />
      </FadeInSection>

      <FadeInSection>
        <FinalCTA onCtaClick={handleCtaClick} />
      </FadeInSection>
    </PicksLayout>
  );
}
