import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from './placeholderData';

export default function FAQ() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently asked questions</h2>
        </div>

        <div className="mt-12 divide-y divide-gray-200 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {FAQ_ITEMS.map((item) => (
            <Disclosure key={item.question} as="div" className="px-6">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between py-5 text-left text-base font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sharpside-green">
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pb-5 text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
