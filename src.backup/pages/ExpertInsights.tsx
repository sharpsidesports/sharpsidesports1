import CourseInsights from '../components/dashboard/CourseInsights';

export default function ExpertInsights() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Expert Insights</h1>
        <p className="text-gray-600">Professional analysis and course insights from our experts</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Course Insights Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">What Our Pros Are Using This Week</h2>
          <div className="relative">
            <div className="prose max-w-none">
              <div className="blur-[2.5px] pointer-events-none">
                <h3 className="text-lg font-semibold text-green-700 mb-3">Augusta National Golf Club Analysis</h3>
                <p className="mb-4">
                  Augusta National presents a unique challenge that demands precision in every aspect of the game. 
                  Our analysis shows that approach play and putting on these lightning-fast bentgrass greens are 
                  crucial factors for success.
                </p>
              </div>
            </div>
            <div className="absolute inset-0 backdrop-blur-[2.5px] bg-white/30 flex items-center justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
        
        {/* Our Model Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Our Model for This Week</h2>
          <div className="relative">
            <div className="prose max-w-none">
              <div className="blur-[2.5px] pointer-events-none">
                <p className="mb-4">
                  Our experts analyze every aspect of the tournament to provide you with the most comprehensive insights:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Course-specific strategies and key holes to watch</li>
                  <li>Weather impact analysis and adjustments</li>
                  <li>Historical performance patterns at this venue</li>
                  <li>Current form analysis of top contenders</li>
                </ul>
              </div>
            </div>
            <div className="absolute inset-0 backdrop-blur-[2.5px] bg-white/30 flex items-center justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Expert Picks Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expert Picks</h2>
          <div className="relative">
            <div className="prose max-w-none">
              <div className="blur-[2.5px] pointer-events-none">
                <p className="mb-4">
                  Our team of golf analysts provides detailed reasoning behind their top picks for:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Outright winners</li>
                  <li>Head-to-head matchups</li>
                  <li>Placement positions (Top 5, Top 10, etc.)</li>
                  <li>First round leader predictions</li>
                </ul>
              </div>
            </div>
            <div className="absolute inset-0 backdrop-blur-[2.5px] bg-white/30 flex items-center justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 