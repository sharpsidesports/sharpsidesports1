import React from 'react';
import { Testimonial } from '../../types/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, quote, winAmount, platform } = testimonial;

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-white font-semibold">{name}</h3>
        <p className="text-green-400 text-sm">{platform}</p>
      </div>
      <p className="text-gray-300 text-sm italic flex-grow">"{quote}"</p>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-green-400 font-semibold">
          Won {winAmount}
        </p>
      </div>
    </div>
  );
} 