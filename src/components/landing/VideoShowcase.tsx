import { useState, useRef } from 'react';

interface FeatureVideo {
  title: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  features: string[];
}

const features: FeatureVideo[] = [
  {
    title: 'Matchup Tool',
    description: 'Our advanced matchup analysis engine grades each head-to-head matchup, calculating precise Expected Value (EV) for both players based on current odds, historical performance, and course conditions.',
    videoSrc: '/videos/matchup tool.mp4',
    posterSrc: '/videos/matchup tool_poster.jpg',
    features: [
      'EV-based matchup grading',
      'Value-based recommendations',
      'Course-specific insights'
    ]
  },
  {
    title: 'AI Caddie',
    description: 'Get personalized insights and recommendations from our advanced AI system, analyzing every aspect of the game.',
    videoSrc: '/videos/ai caddie.mp4',
    posterSrc: '/videos/ai caddie_poster.jpg',
    features: [
      'Course-specific strategies',
      'Player matchup analysis',
      'Weather-adjusted performance forecasts'
    ]
  },
  {
    title: 'Fantasy Optimizer',
    description: 'Build winning lineups with our advanced optimization engine that considers all possible combinations and constraints.',
    videoSrc: '/videos/Fantasy Optimizer.mp4',
    posterSrc: '/videos/Fantasy Optimizer_poster.jpg',
    features: [
      'Advanced lineup optimization',
      'Real-time updates',
      'Custom player pools'
    ]
  },
  {
    title: 'Course Fit Tool',
    description: 'Analyze how well players match up with specific courses based on historical performance and course characteristics.',
    videoSrc: '/videos/course fit .mp4',
    posterSrc: '/videos/course fit _poster.jpg',
    features: [
      'Course-specific analysis',
      'Historical performance tracking',
      'Detailed statistics breakdown'
    ]
  },
  {
    title: 'Betting Picks',
    description: 'Get access to professional betting picks and insights for every tournament and player.',
    videoSrc: '/videos/expert insights.mp4',
    posterSrc: '/videos/expert insights_poster.jpg',
    features: [
      'Professional betting picks',
      'Tournament previews',
      'Player spotlights'
    ]
  },
  {
    title: 'Model Dashboard',
    description: 'View all our predictive models in one place with our comprehensive dashboard.',
    videoSrc: '/videos/model dashboard.mp4',
    posterSrc: '/videos/model dashboard_poster.jpg',
    features: [
      'Real-time updates',
      'Multiple model views',
      'Custom filters'
    ]
  }
];

const VideoPlayer = ({ video }: { video: FeatureVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoClick = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
        setIsPlaying(!isPlaying);
        setError(null);
      } catch (err) {
        console.error('Video playback error:', err);
        setError('Error playing video');
        setIsPlaying(false);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    setError('Error loading video');
    setIsPlaying(false);
  };

  // Get video extension
  const videoExt = video.videoSrc.split('.').pop()?.toLowerCase();

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
      <video 
        ref={videoRef}
        className="w-full h-auto"
        poster={video.posterSrc}
        onClick={handleVideoClick}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        playsInline
        preload="metadata"
        muted
        controls
      >
        <source 
          src={video.videoSrc} 
          type={videoExt === 'mov' ? 'video/quicktime' : 'video/mp4'} 
        />
        {/* Add MP4 fallback for MOV files */}
        {videoExt === 'mov' && (
          <source 
            src={video.videoSrc.replace('.mov', '.mp4')} 
            type="video/mp4" 
          />
        )}
        Your browser does not support the video tag.
      </video>
      
      {/* Play/Pause Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        } hover:opacity-100`}
        onClick={handleVideoClick}
      >
        <div className="rounded-full bg-white bg-opacity-90 p-4 shadow-lg transform transition-transform duration-200 hover:scale-110">
          {error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <svg 
              className="w-12 h-12 text-green-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {isPlaying ? (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default function VideoShowcase() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            See Our Tools in Action
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"
            >
              {/* Content Section */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-4">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center">
                      <span className="text-green-500">✓</span>
                      <span className="ml-3 text-gray-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Section */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <VideoPlayer video={feature} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 