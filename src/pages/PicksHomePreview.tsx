import { useCallback } from 'react';
import PicksLayout from '../components/picksHome/PicksLayout.js';
import { usePageSeo } from '../hooks/usePageSeo.js';
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

export default function PicksHomePreview() {
  const handleCtaClick = useCallback(() => {
    window.location.href = FREE_TRIAL_CHECKOUT_URL;
  }, []);

  usePageSeo({
    title: 'NFL Betting Picks & Player Prop Models | SharpSide Sports',
    description:
      'NFL betting picks backed by a transparent, data-driven model. Reception, touchdown, and passing player props projections compared against sportsbook lines — see projected profit live with our calculator and browse a publicly tracked record.',
    keywords: 'nfl betting, nfl betting picks, nfl player props, sports betting picks',
    canonicalPath: '/picks-preview',
  });

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
