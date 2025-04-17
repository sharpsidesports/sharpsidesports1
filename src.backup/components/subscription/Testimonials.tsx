import { testimonials } from '../../data/mockData/testimonials';
import TestimonialCard from './TestimonialCard';

export default function Testimonials() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg mt-8">
      <h2 className="text-xl font-semibold text-green-400 mb-8">WHAT OUR MEMBERS SAY</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}