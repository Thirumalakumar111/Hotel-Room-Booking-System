import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Room {
  _id: string;
  roomNumber: number;
  type: string;
  price: number;
  isAvailable: boolean;
  description?: string;
}

const GuestDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/rooms');
        setRooms(data.filter((room: Room) => room.isAvailable));
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || 'Guest'} 👋</h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate('/guest-rooms')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
          >
            🏨 Book a Room
          </button>
          <button
            onClick={() => navigate('/guest-bookings')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
          >
            📜 My Bookings
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow"
          >
            🚪 Logout
          </button>
        </div>

        {/* Room Snapshot */}
        <h2 className="text-2xl font-semibold mb-4">Top Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map((room) => (
            <div
              key={room._id}
              className="bg-[#1e293b] rounded-xl p-5 shadow-md border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-1">Room {room.roomNumber}</h3>
              <p className="text-gray-300">Type: {room.type}</p>
              <p className="text-gray-300">Price: ₹{room.price}</p>
              <p className="text-green-400 font-semibold">Available</p>
              {room.description && (
                <p className="text-sm text-gray-400 mt-2">{room.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
