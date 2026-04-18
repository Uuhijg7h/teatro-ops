export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold text-blue-900">Teatro Banquet Hall</a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Events</h3>
            <p className="text-4xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-600 mt-2">+3 from last month</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-green-600">$45,230</p>
            <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Pending Bookings</h3>
            <p className="text-4xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-gray-600 mt-2">Requires attention</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded">
              <h3 className="font-semibold text-lg">Wedding - Smith & Johnson</h3>
              <p className="text-gray-600">Date: April 25, 2026 | Guests: 150 | Status: Confirmed</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded">
              <h3 className="font-semibold text-lg">Corporate Event - TechCorp</h3>
              <p className="text-gray-600">Date: April 28, 2026 | Guests: 200 | Status: Confirmed</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded">
              <h3 className="font-semibold text-lg">Birthday Party - Anderson</h3>
              <p className="text-gray-600">Date: May 2, 2026 | Guests: 75 | Status: Tentative</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/booking" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            New Booking
          </a>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
            View Calendar
          </button>
        </div>
      </main>
    </div>
  )
}
