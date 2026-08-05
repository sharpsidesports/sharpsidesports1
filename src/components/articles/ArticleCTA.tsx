import { Link } from 'react-router-dom';

interface ArticleCTAProps {
  heading?: string;
  body?: string;
}

export default function ArticleCTA({
  heading = 'Want our actual picks, not just the theory?',
  body = 'Every NFL and CFB bet we place is timestamped and tracked before kickoff, and sent straight to members. See what applying this stuff for real looks like.',
}: ArticleCTAProps) {
  return (
    <div className="mt-10 rounded-lg border border-green-200 bg-green-50 p-6">
      <p className="font-semibold text-gray-900">{heading}</p>
      <p className="mt-2 text-gray-700">{body}</p>
      <Link
        to="/subscription"
        className="mt-4 inline-flex items-center rounded-md bg-sharpside-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
      >
        Start Free Trial
      </Link>
    </div>
  );
}
