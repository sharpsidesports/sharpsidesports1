import React from 'react';
import { Testimonial } from '../../types/testimonials';
import TournamentWins from './tournament/WinsCard';
import SuccessCard from './fantasy/SuccessCard';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <img 
          src={testimonial.image} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-white font-medium">{testimonial.name}</h3>
        </div>
      </div>
      
      <p className="text-gray-300 flex-grow">
        "{testimonial.quote}"
      </p>
      
      {testimonial.tournamentWins && (
        <TournamentWins wins={testimonial.tournamentWins} />
      )}

      {testimonial.fantasySuccess && (
        <SuccessCard success={testimonial.fantasySuccess} />
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-green-400 font-bold">
          {testimonial.winAmount}
        </p>
        <p className="text-gray-400 text-sm">
          won on {testimonial.platform}
        </p>
      </div>
    </div>
  );
}