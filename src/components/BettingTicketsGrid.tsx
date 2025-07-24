import React from 'react';

const bettingTicketImages = [
  'https://files.constantcontact.com/f381eaf7701/e0a02cf4-954b-4466-a8ae-9b62df0e96ae.png',
  'https://files.constantcontact.com/f381eaf7701/9bf54dc6-90a3-4b85-8405-85e4eb76a126.jpg',
  'https://files.constantcontact.com/f381eaf7701/fa3ef930-b24b-49f7-95e8-3f2592334e3c.png',
  'https://files.constantcontact.com/f381eaf7701/e790ca71-7b1a-4b6d-b048-cfbeaee7482f.jpg',
  'https://files.constantcontact.com/f381eaf7701/6312c4c2-93ac-4f12-a636-c396b21b92f9.jpg',
  'https://files.constantcontact.com/f381eaf7701/be0bd423-4f07-4e40-afe2-77211769f2fd.jpg',
  'https://files.constantcontact.com/f381eaf7701/1ef1d33c-2cdf-4f03-827a-c0d1b0cc51bd.jpg',
  'https://files.constantcontact.com/f381eaf7701/df288e65-8e57-49be-80ad-8449e5df4e1b.jpg',
  'https://files.constantcontact.com/f381eaf7701/f3588888-fc90-455f-8b9a-c918d735ab83.jpg',
  'https://files.constantcontact.com/f381eaf7701/d72b7559-1a10-4225-93b3-5fd6cb1b43f7.jpg',
  'https://files.constantcontact.com/f381eaf7701/a984b6f7-c249-4099-b804-a9055c3e6998.jpg',
  'https://files.constantcontact.com/f381eaf7701/dee86e70-5903-482b-a0da-06db9b94f565.jpg',
  'https://files.constantcontact.com/f381eaf7701/f115819b-f9d9-4910-8f33-cd815f8fca69.jpg',
  'https://files.constantcontact.com/f381eaf7701/07ddaaba-6c9f-4550-86c1-cb816fe819a5.jpg',
  'https://files.constantcontact.com/f381eaf7701/26641f76-b696-4419-8c8e-129c531c3f3a.jpg',
  'https://files.constantcontact.com/f381eaf7701/4bfffc97-6880-4433-9a55-70be839c0770.jpg',
  'https://files.constantcontact.com/f381eaf7701/9b2d4af9-8c81-495e-8e50-d71eea261615.jpg',
  'https://files.constantcontact.com/f381eaf7701/ec0fda8b-37a2-4995-93c1-6cd2837ab4f6.jpg',
  'https://files.constantcontact.com/f381eaf7701/c7478ca7-ae7c-477f-9b09-226d878e975e.jpg',
  'https://files.constantcontact.com/f381eaf7701/18028d0f-19d1-41d9-b3a0-4139f51d5fbc.jpg',
  'https://files.constantcontact.com/f381eaf7701/f78d4cca-a6bc-45d3-9894-fc0f23e4c478.jpg',
];

export default function BettingTicketsGrid() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Betting Tickets Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
          {bettingTicketImages.map((imageUrl, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-green-500 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 overflow-hidden mb-6 break-inside-avoid transform hover:scale-105 hover:-translate-x-2"
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={`Betting Ticket ${index + 1}`}
                  className="w-full h-auto block"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  SHARPSIDE
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 