import React from 'react';

function CourseInsights() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">What Our Pros Are Using This Week</h2>
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Augusta National Golf Club Analysis</h3>
        
        <p className="mb-4">
          Augusta National presents a unique challenge that demands precision in every aspect of the game. 
          Our analysis shows that approach play and putting on these lightning-fast bentgrass greens are 
          crucial factors for success.
        </p>

        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-10">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
              Upgrade to Pro
            </button>
          </div>
          
          <div className="blur-sm">
            <h4 className="text-md font-semibold mb-2">Key Model Weights This Week:</h4>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Strokes Gained: Approach (35%)</strong> - With Augusta's elevated greens and severe slopes, 
              precise iron play is essential.</li>
              
              <li><strong>Strokes Gained: Putting (25%)</strong> - The complex green systems at Augusta National 
              make putting performance critical.</li>
              
              <li><strong>Proximity from 175-200 yards (20%)</strong> - This specific range is crucial at Augusta.</li>
              
              <li><strong>Strokes Gained: Off the Tee (15%)</strong> - While Augusta's fairways are relatively 
              generous, distance is advantageous.</li>
              
              <li><strong>Course History (5%)</strong> - Experience at Augusta matters, but recent form is more 
              predictive of success.</li>
            </ul>
          </div>
        </div>

        <h4 className="text-md font-semibold mb-2 mt-6">Course Characteristics:</h4>
        <ul className="list-disc pl-5 mb-4">
          <li>Par 72, 7,510 yards</li>
          <li>Bentgrass greens with severe slopes and undulations</li>
          <li>Four reachable par 5s</li>
          <li>Strategic bunkering and natural hazards</li>
          <li>Elevation changes throughout the course</li>
        </ul>

        <p className="text-sm text-gray-600 italic">
          Note: Our model weights are adjusted based on historical tournament data, course conditions, 
          and weather forecasts. These weights represent our optimal configuration for this week's event.
        </p>
      </div>
    </div>
  );
}

export default CourseInsights;