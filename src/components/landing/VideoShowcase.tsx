import React, { useState } from 'react';

interface FeatureImage {
  title: string;
  description: string;
  imageSrc: string;
  features: string[];
}

const features: FeatureImage[] = [
  {
    title: 'Expert Betting Picks',
    description: 'Get access to professional betting picks and insights everyday that will help you profit.',
    imageSrc: 'https://files.constantcontact.com/f381eaf7701/18be7f91-9a7b-475b-96db-48018ac7c8f5.png',
    features: [
      'Professional betting picks',
      'Daily insights',
      'Profit-focused analysis'
    ]
  },
  {
    title: 'Model Projections',
    description: 'Access to all of our proprietary models that will give you the edge, in every sport we model',
    imageSrc: 'https://files.constantcontact.com/f381eaf7701/2d143453-422a-47eb-9a85-805adda3b256.png',
    features: [
      'Proprietary models',
      'Multi-sport coverage',
      'Edge-focused analysis'
    ]
  },
  {
    title: '+EV Tools',
    description: 'Use state of the art betting tools that can give you the edge you need to grow your bankroll.',
    imageSrc: 'https://files.constantcontact.com/f381eaf7701/f1173c9a-1267-4e77-b6fd-caf91ec57a5e.png',
    features: [
      'Advanced betting tools',
      'Bankroll growth focus',
      'Edge identification'
    ]
  }
];

function ImagePlayer({ feature }: { feature: FeatureImage }) {
  return (
    <div className="relative">
      <img
        src={feature.imageSrc}
        alt={feature.title}
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
      />
    </div>
  );
}

export default function VideoShowcase() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            What You Get
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"
            >
              {/* Content Section */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-4 mb-8 lg:mb-0">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center">
                      <span className="text-green-500">✓</span>
                      <span className="ml-3 text-gray-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Section */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <ImagePlayer feature={feature} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 