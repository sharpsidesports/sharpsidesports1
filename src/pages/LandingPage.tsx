// This is the landing page component for the golf analytics platform.
import { Link } from 'react-router-dom';
import PerformanceGraph from '../components/subscription/PerformanceGraph.js';
import VideoShowcase from '../components/landing/VideoShowcase.js';
import BettingTicketsGrid from '../components/BettingTicketsGrid.js';
import NFLRecords from '../components/subscription/NFLRecords.js';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            YOU WILL <span className="text-green-500">WIN</span> WITH US
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Premier handicapping, and tools service dedicated to helping you gain an edge and beat the book.
          </p>
          <button
            onClick={() => window.location.href = 'https://www.winible.com/checkout/1378745735868076494?pid=1378745735876465103'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get started
          </button>
        </div>
      </section>

      {/* Betting Tickets Grid */}
      <BettingTicketsGrid />

      {/* Video Showcase Section */}
      <section className="bg-white">
        <VideoShowcase />
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-500">
              Select the plan that best fits your betting strategy
            </p>
          </div>

          {/* All Access Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All Access</h3>
              <p className="text-gray-600">Complete access to all sports and tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Weekly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Weekly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$99.99</p>
                  <p className="text-gray-500 mb-6">per week</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=week'}
                    className="w-full py-3 px-6 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Start Weekly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All sports coverage
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All tools & models
                  </li>
                </ul>
              </div>

              {/* Monthly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$299.99</p>
                  <p className="text-gray-500 mb-6">per month</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=month'}
                    className="w-full py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Start Monthly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All sports coverage
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All tools & models
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>

              {/* Yearly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Yearly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$1,199.99</p>
                  <p className="text-gray-500 mb-2">per year</p>
                  <p className="text-green-600 text-sm mb-6">Save $600/year</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1359269787951190914?store_url=/sharpsidesports&interval=year'}
                    className="w-full py-3 px-6 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Start Yearly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All sports coverage
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All tools & models
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Football Season Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Football Season</h3>
              <p className="text-gray-600">Complete NFL & CFB coverage for the entire season</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Season Pass</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$799.99</p>
                  <p className="text-gray-500 mb-6">for the entire season</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1378745735868076494?pid=1378745735876465103'}
                    className="w-full py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Get Season Pass
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    NFL betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    CFB betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Football models & tools
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Season-long access
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Golf Only Section */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Golf Only</h3>
              <p className="text-gray-600">Complete golf analytics and betting tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Weekly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Weekly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$59.99</p>
                  <p className="text-gray-500 mb-6">per week</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=week'}
                    className="w-full py-3 px-6 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Start Weekly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Golf betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All golf tools
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Course fit analysis
                  </li>
                </ul>
              </div>

              {/* Monthly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$239.99</p>
                  <p className="text-gray-500 mb-6">per month</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=month'}
                    className="w-full py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Start Monthly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Golf betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All golf tools
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Course fit analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>

              {/* Yearly */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Yearly</h4>
                  <p className="text-4xl font-bold text-gray-900 mb-1">$599.99</p>
                  <p className="text-gray-500 mb-2">per year</p>
                  <p className="text-green-600 text-sm mb-6">Save $280/year</p>
                  <button 
                    onClick={() => window.location.href = 'https://www.winible.com/checkout/1378395472007287051?store_url=/sharpsidesports&interval=year'}
                    className="w-full py-3 px-6 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Start Yearly
                  </button>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Golf betting picks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All golf tools
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Course fit analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600 text-lg">Simple steps to get started with your winning picks</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Plan</h4>
                <p className="text-gray-600 text-sm">Choose your subscription plan and sign up with your email.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Winning Picks</h4>
                <p className="text-gray-600 text-sm">Get winning picks and projections sent directly to your inbox.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Everything</h4>
                <p className="text-gray-600 text-sm">Or log in with your password to access everything on the site.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Backed by Data</h4>
                <p className="text-gray-600 text-sm">Backed by data models and years of betting experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFL Records Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NFLRecords />
        </div>
      </section>

      {/* Performance Graph Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">All Access Performance</h2>
            <p className="mt-4 text-lg text-gray-500">
              Track record of success across all sports
            </p>
          </div>
          <div className="mt-8">
            <PerformanceGraph />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 - Super Bowl Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Mike R.</h4>
              </div>
              <p className="text-gray-600">
                "The Chiefs ML pick in Super Bowl 58 was perfect. Their analysis of the matchup and player props was spot on. Made a killing on the game."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Super Bowl 58 • Chiefs ML</span>
                <span className="ml-2">+4.40%</span>
              </div>
            </div>

            {/* Testimonial 2 - Season Long Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">David K.</h4>
              </div>
              <p className="text-gray-600">
                "Followed their picks all season and hit 89 wins in 2024. The player prop analysis is incredible - especially the Tyreek Hill over yards."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>2024 Season • 89 Wins</span>
                <span className="ml-2">+148.8%</span>
              </div>
            </div>

            {/* Testimonial 3 - Player Props */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">James L.</h4>
              </div>
              <p className="text-gray-600">
                "Their player prop analysis is unmatched. Hit multiple Nico Collins and Tank Dell overs throughout the season. The reception props are gold."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Player Props • Tank Dell</span>
                <span className="ml-2">+4.00%</span>
              </div>
            </div>

            {/* Testimonial 4 - Spread Picks */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Ryan S.</h4>
              </div>
              <p className="text-gray-600">
                "The spread analysis is incredible. Hit the Cardinals +7 in Week 1 and never looked back. Their teaser plays are especially profitable."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Week 1 • Cardinals +7</span>
                <span className="ml-2">+4.00%</span>
              </div>
            </div>

            {/* Testimonial 5 - Playoff Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Tom W.</h4>
              </div>
              <p className="text-gray-600">
                "Their playoff picks are legendary. Hit the Lions -6 in the divisional round and Chiefs ML in the Super Bowl. The postseason analysis is elite."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Playoffs • Lions -6</span>
                <span className="ml-2">+4.00%</span>
              </div>
            </div>

            {/* Testimonial 6 - Long-term Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Chris P.</h4>
              </div>
              <p className="text-gray-600">
                "Been following for 5 years now. 322 total wins, 60.1% win rate, and over 1186% return. These guys are the real deal in NFL betting."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>5-Year Record • 322 Wins</span>
                <span className="ml-2">+1186%</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to gain your edge?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of users making data-driven decisions with our professional-grade golf analytics platform.
          </p>
          <button
            onClick={() => window.location.href = 'https://www.winible.com/checkout/1378745735868076494?pid=1378745735876465103'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
          >
            Get started now
          </button>
        </div>
      </section>
    </div>
  );
} 