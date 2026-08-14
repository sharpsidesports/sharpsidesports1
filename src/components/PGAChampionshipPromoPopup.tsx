import { useEffect, useState } from 'react';

const PROMO_SEEN_KEY = 'footballSeasonPromoSeen';
const FOOTBALL_SUBSCRIPTIONS_URL = '/subscription#plans';

export default function PGAChampionshipPromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(PROMO_SEEN_KEY);
    if (!seen) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(PROMO_SEEN_KEY, 'true');
    setShow(false);
  };

  const handleViewSubscriptions = () => {
    sessionStorage.setItem(PROMO_SEEN_KEY, 'true');
    window.location.href = FOOTBALL_SUBSCRIPTIONS_URL;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl border-2 border-green-500 bg-white p-8 text-center shadow-2xl">
        <p className="mb-3 text-lg font-bold uppercase tracking-wide text-gray-900">
          FOOTBALL SEASON PACKAGE
        </p>
        <p className="mb-2 text-base text-gray-700">
          Get every NFL and CFB pick all season long with our{' '}
          <span className="font-semibold text-gray-900">Football Season package</span>.
        </p>
        <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-red-600">
          Only 20 spots left
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleViewSubscriptions}
            className="rounded-md bg-green-500 px-6 py-3 font-semibold uppercase text-white transition-colors hover:bg-green-600"
          >
            Get the Football Season package
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border-2 border-gray-300 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
