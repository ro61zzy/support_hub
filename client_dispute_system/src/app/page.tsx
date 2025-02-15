'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Capi Dispute System</h1>
        <div>
          <Link href="/login" className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600">Login</Link>
          <Link href="/signup" className="ml-4 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-4xl font-bold text-blue-800">Resolve Disputes Seamlessly</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
          Our platform streamlines dispute resolution, ensuring fairness and transparency for all parties involved.
        </p>
        <Link href="/signup" className="mt-6 px-6 py-3 bg-orange-500 text-white text-lg rounded-lg shadow-md hover:bg-orange-700">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold text-blue-800">How It Works</h3>
        <div className="flex flex-wrap justify-center mt-8 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h4 className="text-xl font-bold text-orange-600">1. Raise a Ticket</h4>
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

      {/* Call to Action Section */}
      <section className="py-12 bg-blue-600 text-center text-white">
        <h3 className="text-3xl font-semibold">Get Started Today</h3>
        <p className="mt-4 text-lg">Join now and resolve disputes efficiently with our streamlined process.</p>
        <Link href="/signup" className="mt-6 inline-block px-6 py-3 bg-orange-500 text-lg rounded-lg shadow-md hover:bg-orange-700">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
