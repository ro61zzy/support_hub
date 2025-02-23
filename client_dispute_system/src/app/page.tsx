'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      <nav className="flex justify-between items-center p-6 shadow-md bg-white text-gray-900">
        <h1 className="text-3xl font-bold">Support Hub</h1>
        <div>
          <Link href="/auth" className="px-4 py-2 bg-buttons text-white rounded-lg hover:bg-orange-600">
            Login / Sign Up
          </Link>
        </div>
      </nav>

      <section className="relative w-full h-[80vh] flex items-center justify-center">

  <div className="relative z-10 w-full sm:w-3/4 lg:w-2/3  text-center  sm:text-left sm:pr-40 ">
    <h2 className="text-5xl  font-bold text-[#2458bf]">Resolve Issues Seamlessly</h2>
    <p className="mt-4 text-2xl text-black sm:text-[#c0bfbf] font-bold">
    Get the support you need, when you need it.<br /> Support Hub helps you resolve issues quickly and efficiently.
    </p>
    <Link href="/auth" className="mt-6 inline-block px-6 py-3 bg-buttons text-white text-lg rounded-lg shadow-md hover:bg-orange-700">
      Get Started
    </Link>
  </div>

{/* 
  <div className="relative z-10  w-full md:w-3/4 lg:w-2/3 text-center md:text-left md:pr-40">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2458bf]">Resolve Issues Seamlessly</h2>
          <p className="mt-4 text-lg md:text-2xl text-[#b5b5b5] font-bold">
            Get the support you need, when you need it.<br />
            Support Hub helps you resolve issues quickly and efficiently.
          </p>
          <Link href="/auth" className="mt-6 inline-block px-6 py-3 bg-buttons text-white text-lg rounded-lg shadow-md hover:bg-orange-700">
            Get Started
          </Link>
        </div> */}

  <div className="absolute opacity-25 sm:opacity-95 right-0 lg:top-10 top-0 sm:w-1/2  w-full h-full">
    <Image 
      src="/hero_image.png" 
      alt="Landing" 
      layout="fill" 
      objectFit="cover" 
    />
  </div>
 
</section>


      <section className="py-16 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold text-gray-900">How It Works</h3>
        <div className="flex flex-wrap justify-center mt-8 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h4 className="text-xl font-bold text-buttons">1. Raise a Ticket</h4>
            <p className="text-gray-700 mt-2">Submit a dispute by providing the necessary details and evidence.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h4 className="text-xl font-bold text-green-600">2. Review & Mediation</h4>
            <p className="text-gray-700 mt-2">Our system assigns a mediator to review and facilitate resolution.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h4 className="text-xl font-bold text-blue-600">3. Resolution</h4>
            <p className="text-gray-700 mt-2">Receive a fair resolution based on provided information and policies.</p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-buttons text-center text-white">
        <h3 className="text-3xl font-semibold">Get Started Today</h3>
        <p className="mt-4 text-lg">Join now and resolve disputes efficiently with our streamlined process.</p>
        <Link href="/auth" className="mt-6 inline-block px-6 py-3 bg-white text-orange-500 text-lg rounded-lg shadow-md hover:bg-gray-200">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
