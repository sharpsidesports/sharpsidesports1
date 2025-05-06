import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.js';
import SignUpForm from '../components/auth/SignUpForm.js';
import { useAuthContext } from '../context/AuthContext.js';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(() => !sessionStorage.getItem('selectedPlan'));
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, check for stored plan
    if (user) {
      const storedPlan = sessionStorage.getItem('selectedPlan');
      if (storedPlan) {
        // Clear the stored plan
        sessionStorage.removeItem('selectedPlan');
        // Redirect back to subscription page
        navigate('/subscription', { replace: true });
      } else {
        // If no stored plan, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        {sessionStorage.getItem('selectedPlan') && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Please {isLogin ? 'sign in' : 'sign up'} to continue with your subscription
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <SignUpForm ctaText="Sign up to get started" />}
          
          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}