import PricingPlans from '../components/subscription/PricingPlans.js';
import AICaddiePerformance from '../components/subscription/AICaddiePerformance.js';
import SimulationExplanation from '../components/subscription/features/SimulationExplanation.js';
import Testimonials from '../components/subscription/Testimonials.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Subscription() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            YOU WILL <span className="text-sharpside-green">WIN</span> WITH US
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premier golf analytics and DFS tools to help you beat the book.
          </p>
          <div className="max-w-6xl mx-auto mt-8">
            <Slider
              infinite
              speed={8000}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay
              autoplaySpeed={0}
              cssEase="linear"
              arrows={false}
              pauseOnHover={false}
            >
              {[
                "https://files.constantcontact.com/f381eaf7701/3d5899b6-9dc3-4243-b876-0c74f5d684f1.jpg",
                "https://files.constantcontact.com/f381eaf7701/fa3ef930-b24b-49f7-95e8-3f2592334e3c.png",
                "https://files.constantcontact.com/f381eaf7701/e0a02cf4-954b-4466-a8ae-9b62df0e96ae.png",
                "https://files.constantcontact.com/f381eaf7701/26641f76-b696-4419-8c8e-129c531c3f3a.jpg",
                "https://files.constantcontact.com/f381eaf7701/6dbe17a6-89ba-4166-82d1-b7605a04fcd4.jpg",
                "https://files.constantcontact.com/f381eaf7701/c1d91390-97d8-4a08-8dc3-18dcac190227.jpg",
                "https://files.constantcontact.com/f381eaf7701/ec4ec042-f164-4ec0-8cd3-349000637c8e.jpg",
                "https://files.constantcontact.com/f381eaf7701/06c2239d-a1d3-4f6a-8108-5ea73d402866.jpg"
              ].map((src, idx) => (
                <div key={idx} className="flex justify-center px-2">
                  <img
                    src={src}
                    alt={`Promo ${idx + 1}`}
                    className="w-[300px] h-[175px] object-cover rounded shadow border border-white"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="mt-12">
          <PricingPlans />
        </div>

        <SimulationExplanation />

        <div className="mt-16">
          <AICaddiePerformance />
          <Testimonials />
        </div>
      </div>
    </div>
  );
}