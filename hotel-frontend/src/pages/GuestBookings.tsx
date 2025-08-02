import { useEffect, useState } from 'react';
import axios from 'axios';

interface Booking {
  _id: string;
  room: {
    roomNumber: number;
    type: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  status: string;
}

const GuestBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/bookings/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-300 mb-10">📋 My Room Bookings</h1>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-red-400 font-medium text-lg">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white/10 border border-gray-600 rounded-2xl p-5 shadow-xl backdrop-blur-md transition duration-200"
              >
                <h2 className="text-xl font-semibold text-blue-300 mb-3">
                  🏨 Room {booking.room.roomNumber} - {booking.room.type}
                </h2>

                <p className="text-sm text-gray-200 mb-1">
                  <span className="font-medium text-teal-400">💰 Price/Night:</span>{' '}
                  <span className="text-white">₹{booking.room.price}</span>
                </p>

                <p className="text-sm text-gray-200 mb-1">
                  <span className="font-medium text-teal-400">📅 Check-In:</span>{' '}
                  <span className="text-white">{new Date(booking.checkIn).toDateString()}</span>
                </p>

                <p className="text-sm text-gray-200 mb-1">
                  <span className="font-medium text-teal-400">📅 Check-Out:</span>{' '}
                  <span className="text-white">{new Date(booking.checkOut).toDateString()}</span>
                </p>

                <p className="text-sm text-gray-200 mb-1">
                  <span className="font-medium text-teal-400">💳 Payment:</span>{' '}
                  <span className="text-white">{booking.paymentMethod}</span>
                </p>

                <p className="text-sm mt-3">
                  <span className="font-medium text-teal-400">📌 Status:</span>{' '}
                  <span className="text-white">{booking.status.toUpperCase()}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookings;
