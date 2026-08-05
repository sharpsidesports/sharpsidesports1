import { HOW_IT_WORKS_STEPS } from './placeholderData';

export default function HowItWorks() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">From line to logged result, in four steps.</p>
        </div>

        <ol className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sharpside-green text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
