import { useState, useEffect } from 'react';

interface Section {
  title: string;
  content: string[];
}

export default function ExpertInsightContent() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const DOC_ID = '1n36VnBsK-Kj_bsS9hkMG4VR6Ayw0tr1Ware5e4CKseo';
        const response = await fetch(
          `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const text = await response.text();
        console.log('Raw text:', text); // Debug log
        const parsedSections = parseContent(text);
        console.log('Parsed sections:', parsedSections); // Debug log
        setSections(parsedSections);
      } catch (err) {
        setError('Failed to load expert insights. Please try again later.');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const parseContent = (text: string): Section[] => {
    // Split the text into lines and remove empty lines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedSections: Section[] = [];
    let currentSection: Section | null = null;
    let currentParagraph: string[] = [];

    for (const line of lines) {
      // Remove leading and trailing whitespace
      const trimmedLine = line.trim();
      
      // New section starts with a '#'
      if (trimmedLine.startsWith('#')) {
        // close out previous section
        if (currentSection) {
          if (currentParagraph.length > 0) {
            currentSection.content.push(currentParagraph.join(' '));
            currentParagraph = [];
          }
          parsedSections.push(currentSection);
        }
        
        // Start a new section
        currentSection = {
          title: trimmedLine.slice(1).trim(),
          content: []
        };
      } 
      // otherwise, if we already have a section in flight...
      else if (currentSection) {
        // If this line ends with a period, it's likely the end of a paragraph
        if (/[.?!]$/.test(trimmedLine)) {
          currentParagraph.push(trimmedLine);
          currentSection.content.push(currentParagraph.join(' '));
          currentParagraph = [];
        } else {
          currentParagraph.push(trimmedLine);
        }
      }
    }

    // inside parseContent function, after the loop
    if (currentSection) {
      if (currentParagraph.length > 0) {
        currentSection.content.push(currentParagraph.join(' '));
      }
      parsedSections.push(currentSection);
    }

    return parsedSections;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-2xl font-bold text-green-600 mb-6 font-heading">
            {section.title}
          </h2>
          {section.content.map((paragraph, pIndex) => (
            <p key={pIndex} className="text-gray-700 mb-4 last:mb-0 font-body leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
} 