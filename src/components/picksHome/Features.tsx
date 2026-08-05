import { TrendingUp, Network, Ticket, Shield, Bell, BarChart3, type LucideIcon } from 'lucide-react';
import { FEATURES, type FeatureItem } from './placeholderData';

const ICONS: Record<FeatureItem['iconKey'], LucideIcon> = {
  'trending-up': TrendingUp,
  network: Network,
  ticket: Ticket,
  shield: Shield,
  bell: Bell,
  'bar-chart': BarChart3,
};

export default function Features() {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Built for serious bettors</h2>
          <p className="mt-4 text-lg text-gray-600">Everything you need to find, size, and track +EV bets.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.iconKey];
            return (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-sharpside-green">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
