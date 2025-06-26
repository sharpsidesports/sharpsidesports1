import React from 'react';

export default function ArticleTemplate({
  title = "Article Title",
  imageUrl = "https://files.constantcontact.com/f381eaf7701/b8bf744e-fd2c-46ea-9eeb-ca515f2eeb83.png", // Default image, replace as needed
  imageAlt = "Article Visual",
  children,
}: {
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h1>
        <div className="flex justify-center mb-8">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-3/5 border-4 rounded-lg"
            style={{ borderColor: '#059669' }}
          />
        </div>
        <div className="bg-white rounded shadow border p-6 text-gray-900 text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
} 