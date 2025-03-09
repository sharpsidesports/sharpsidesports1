import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Caddie',
    price: 'Free',
    interval: '',
    description: 'Perfect for casual golf bettors looking to improve their picks',
    features: [
      'Basic matchup analysis',
      'Course fit tool',
      'Historical performance data',
      'Basic strokes gained metrics',
      'Email support'
    ],
    buttonText: 'Get Started',
    tier: 'free',
    popular: false
  },
  {
    name: 'Pro',
    price: 'Free',
    interval: '',
    description: 'Advanced analytics for serious golf bettors',
    features: [
      'Everything in Caddie, plus:',
      'Advanced AI predictions',
      'Fantasy golf optimizer',
      'Custom model creation',
      'Proximity analysis',
      'Priority support',
      'Real-time odds integration'
    ],
    buttonText: 'Get Started',
    tier: 'pro',
    popular: true
  },
  {
    name: 'Sharps',
    price: 'Free',
    interval: '',
    description: 'Enterprise-grade tools for professional bettors',
    features: [
      'Everything in Pro, plus:',
      'API access',
      'Custom data exports',
      'Early odds access',
      'Dedicated account manager',
      'Private Discord channel',
      'Custom integrations'
    ],
    buttonText: 'Get Started',
    tier: 'enterprise',
    popular: false
  }
];

export default function PricingPlans() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border ${
              plan.popular 
                ? 'border-green-600 shadow-lg' 
                : 'border-gray-200'
            } p-8`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold leading-7">{plan.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <div className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                {plan.interval && (
                  <span className="text-base text-gray-500">{plan.interval}</span>
                )}
              </div>
            </div>

            <ul className="mb-6 space-y-4 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm leading-6 text-gray-600">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                plan.popular
                  ? 'bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600'
                  : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}