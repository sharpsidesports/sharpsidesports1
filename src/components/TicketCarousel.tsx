import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ticketImages = [
  'https://files.constantcontact.com/f381eaf7701/6dbe17a6-89ba-4166-82d1-b7605a04fcd4.jpg',
  'https://files.constantcontact.com/f381eaf7701/07ddaaba-6c9f-4550-86c1-cb816fe819a5.jpg',
  'https://files.constantcontact.com/f381eaf7701/26641f76-b696-4419-8c8e-129c531c3f3a.jpg',
  'https://files.constantcontact.com/f381eaf7701/3d5899b6-9dc3-4243-b876-0c74f5d684f1.jpg',
  'https://files.constantcontact.com/f381eaf7701/d8255f1c-b462-44b0-94b4-7b9ee4c41192.png',
  'https://files.constantcontact.com/f381eaf7701/aef70e1d-1fe4-4a0e-aee9-f0c62a3dde9e.jpg',
  'https://files.constantcontact.com/f381eaf7701/6a02a36b-13e0-4e7c-80e9-97a3b0aa306f.jpg',
];

export default function TicketCarousel() {
  const settings = {
    infinite: true,
    speed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false,
    draggable: false,
    swipe: false,
    touchMove: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <div className="w-full flex flex-col items-center py-6">
      <div className="w-full max-w-xs md:max-w-xl">
        {/* @ts-ignore */}
        <Slider {...settings}>
          {ticketImages.map((src, idx) => (
            <div key={idx} className="mx-1 w-20 md:w-40 flex justify-center items-center bg-white p-1 md:p-2">
              <img src={src} alt={`Ticket ${idx + 1}`} className="object-contain h-12 md:h-28" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="mt-6 text-center">
        <span className="text-green-600 text-xs md:text-lg font-bold tracking-wide uppercase">
          THE BEST GOLF BETTORS ON THE PLANET
        </span>
      </div>
    </div>
  );
} 