import React, { FC } from 'react';
import Translations from "@/translate/en.json";
import { useSearchState } from '@/zustand/product';
import Link from 'next/link';

interface HeroSectionProps { }

const HeroSection: FC<HeroSectionProps> = () => {
  const focus = useSearchState(state => state.toggleOpen);
  return (
    <div data-testid="HeroSection">
      <div className="relative bg-white isolate px-6 pt-14 lg:px-0">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          {/* <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[color:var(--primary-color)] to-[color:var(--primary-color-2)] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          /> */}
        </div>
        <div
          className="mx-auto border max-w-7xl py-32 rounded-lg px-10 py-10 mt-[6rem] mb-20 b-g-gray-100 bg-fixed bg-cover bg-no-repeat bg-top"
          style={{
            background:
              "linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.1)), url('/static/noise.svg')",
          }}
        >
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Where E-Commerce meets 3D Product Rendering.{" "}
              <Link
                href="/about"
                className="font-semibold text-[color:var(--primary-color) cursor-pointer"
              >
                Learn More <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {Translations["Index:Hero:Heading"]}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {Translations["Index:Hero:Subtitle"]}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/products"
                className="rounded-md bg-[color:var(--primary-color)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--primary-color-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary-color)]"
              >
                Shop Now
              </a>
              {/* <a onClick={focus} className="text-sm font-semibold leading-6 text-gray-900">
                Search <span aria-hidden="true">→</span>
              </a> */}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

HeroSection.displayName = 'HeroSection';

export default HeroSection;
