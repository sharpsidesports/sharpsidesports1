import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Section {
  title: string;
  content: string[];
}

export default function ExpertInsightContent() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showProxModal, setShowProxModal] = useState(false);

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

    for (const line of lines) {
      // Remove leading and trailing whitespace
      const trimmedLine = line.trim();
      
      // New section starts with a '#'
      if (trimmedLine.startsWith('#')) {
        // close out previous section
        if (currentSection) {
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
        // Each non-empty line is a new paragraph
        currentSection.content.push(trimmedLine);
      }
    }

    // After the loop, push the last section if it exists
    if (currentSection) {
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
      {/* Model Buttons and Modals */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow"
          onClick={() => setShowModelModal(true)}
        >
          Our Model for This Week
        </button>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow"
          onClick={() => setShowProxModal(true)}
        >
          Proximity Model
        </button>
      </div>
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowModelModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">Our Model for This Week</h3>
            <iframe
              src="https://docs.google.com/spreadsheets/d/1WcDLe9cZ6_z9jt_HD2dsoyDpMndZnF8XytWp7GcehVE/preview"
              title="Model for This Week"
              width="100%"
              height="600px"
              className="border rounded"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {showProxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowProxModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">Proximity Model</h3>
            <iframe
              src="https://docs.google.com/spreadsheets/d/15xnX4XUjgls4AgmsQIbY77wVZeDZZuGlrVt-zfpu02c/preview"
              title="Proximity Model"
              width="100%"
              height="600px"
              className="border rounded"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <h2 className="text-2xl font-bold text-green-600 font-heading mb-4">Expert Betting Picks</h2>
        <p className="text-gray-600">
          Our expert analysis and betting picks for this week's tournament. We analyze course conditions, player form, and historical data to provide you with the most accurate predictions.
        </p>
      </div>
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