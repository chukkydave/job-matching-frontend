export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-instollar-dark mb-6">
            Find Your Perfect
            <span className="text-instollar-yellow block">Job Match</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with opportunities that match your skills and location.
            Our intelligent matching system helps talents and companies find each other.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="bg-instollar-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Browse Jobs
            </a>
            <a
              href="/register"
              className="bg-instollar-yellow text-instollar-dark px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-instollar-dark mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect with your next opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-instollar-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-instollar-dark">1</span>
            </div>
            <h3 className="text-xl font-semibold text-instollar-dark mb-2">
              Create Profile
            </h3>
            <p className="text-gray-600">
              Sign up and add your skills, location, and preferences
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-instollar-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-instollar-dark">2</span>
            </div>
            <h3 className="text-xl font-semibold text-instollar-dark mb-2">
              Get Matched
            </h3>
            <p className="text-gray-600">
              Our system matches you with relevant job opportunities
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-instollar-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-instollar-dark">3</span>
            </div>
            <h3 className="text-xl font-semibold text-instollar-dark mb-2">
              Connect
            </h3>
            <p className="text-gray-600">
              Apply to matched jobs and start your new career journey
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-instollar-dark text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have found their perfect match
          </p>
          <a
            href="/register"
            className="bg-instollar-yellow text-instollar-dark px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-block"
          >
            Start Your Journey
          </a>
        </div>
      </section>
    </div>
  );
}