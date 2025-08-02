import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomNumber, checkIn, checkOut, total } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-4">
      <h1 className="text-4xl font-extrabold text-green-400 mb-4 animate-bounce">
        🎉 Booking Confirmed!
      </h1>

      <div className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg p-6 w-full max-w-md text-left space-y-3">
        <p className="text-lg">
          <span className="text-gray-300">Room:</span>{' '}
          <span className="font-semibold text-blue-400">{roomNumber}</span>
        </p>
        <p className="text-lg">
          <span className="text-gray-300">Check-In:</span>{' '}
          {new Date(checkIn).toDateString()}
        </p>
        <p className="text-lg">
          <span className="text-gray-300">Check-Out:</span>{' '}
          {new Date(checkOut).toDateString()}
        </p>
        <p className="text-lg">
          <span className="text-gray-300">Total Paid:</span>{' '}
          <span className="text-green-400 font-semibold">₹{total}</span>
        </p>
      </div>

      <button
        onClick={() => navigate('/guest-dashboard')}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition duration-200"
      >
        🏠 Go to Dashboard
      </button>
    </div>
  );
};

export default BookingSuccess;
