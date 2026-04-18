export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-400">Teatro Banquet Hall</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/login" className="px-4 py-2 text-white hover:text-yellow-400 transition-colors">
                Login
              </a>
              <a href="/signup" className="px-6 py-2 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 mb-8 animate-fade-in">
            Teatro Banquet Hall
          </h1>
          <p className="text-3xl md:text-4xl text-cyan-300 font-semibold mb-4">
            Event Management System
          </p>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Professional event booking and management platform
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <a 
              href="/dashboard" 
              className="px-8 py-4 bg-yellow-400 text-blue-900 rounded-lg text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
            >
              Go to Dashboard
            </a>
            <a 
              href="/booking" 
              className="px-8 py-4 bg-white/20 text-white border-2 border-white rounded-lg text-xl font-bold hover:bg-white/30 transform hover:scale-105 transition-all shadow-lg"
            >
              Book an Event
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Event Scheduling</h3>
              <p className="text-gray-300">Manage your events with our intuitive calendar system</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Payment Processing</h3>
              <p className="text-gray-300">Secure payment handling and invoice management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Client Management</h3>
              <p className="text-gray-300">Keep track of all your clients and their preferences</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}