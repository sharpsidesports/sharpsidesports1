function CourseInsights() {
  return (
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
      </div>
    </div>
  );
}

export default CourseInsights;