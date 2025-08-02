import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

interface Room {
  _id: string;
  roomNumber: number;
  type: string;
  price: number;
  isAvailable: boolean;
  description?: string;
}

const GuestRoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [upiLink, setUpiLink] = useState('');

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

  const calculateNights = (inDate: string, outDate: string) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const openQRModal = (room: Room) => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    const nights = calculateNights(checkIn, checkOut);
    const total = room.price * nights;
    const upi = `upi://pay?pa=7013533594-2@ibl&pn=HotelBooking&am=${total}&cu=INR`;

    setSelectedRoom(room);
    setTotalAmount(total);
    setUpiLink(upi);
    setShowQR(true);
  };

  const handleBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      alert('Please select dates and a room');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5001/api/bookings',
        {
          roomId: selectedRoom._id,
          checkIn,
          checkOut,
          paymentMethod: 'UPI',
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const booking = res.data;

      if (booking && booking.room) {
        alert(`✅ Booking Confirmed! Room ${booking.room.roomNumber}`);
        setShowQR(false);
        setSelectedRoom(null);
        setCheckIn('');
        setCheckOut('');

        navigate('/booking-success', {
          state: {
            roomNumber: booking.room.roomNumber,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            total: totalAmount,
          },
        });
      } else {
        alert('⚠️ Booking succeeded, but no details returned. Please check My Bookings.');
        navigate('/guest-bookings');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || '❌ Booking failed due to server error';
      console.error('Booking error:', err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Book Your Stay</h1>

        {/* Date Inputs Centered */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="p-2 rounded-md bg-gray-700 text-white border border-gray-500"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="p-2 rounded-md bg-gray-700 text-white border border-gray-500"
          />
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-[#1e293b] rounded-xl p-6 shadow-md border border-gray-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold text-blue-400 mb-1">
                  🛏 Room {room.roomNumber}
                </h2>
                <p className="text-lg text-gray-300">Type: {room.type}</p>
                <p className="text-lg text-gray-300">Price: ₹{room.price}</p>
                <p className="text-lg text-green-400 font-semibold">Available</p>
                {room.description && (
                  <p className="text-sm text-gray-400 mt-2">{room.description}</p>
                )}
              </div>
              <button
                disabled={loading}
                onClick={() => openQRModal(room)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

     {showQR && selectedRoom && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm text-center border-2 border-blue-300">
      <h2 className="text-2xl font-bold text-green-700 mb-3">🧾 Scan & Pay with UPI</h2>

      {/* QR Code Box with better contrast */}
      <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-lg mb-4">
        <QRCodeCanvas value={upiLink} size={200} className="mx-auto" />
      </div>

      {/* Booking Info */}
      <div className="text-gray-700 space-y-1 text-sm mb-3">
        <p><span className="font-semibold text-blue-600">Room:</span> {selectedRoom.roomNumber}</p>
        <p><span className="font-semibold text-blue-600">Check-In:</span> {checkIn}</p>
        <p><span className="font-semibold text-blue-600">Check-Out:</span> {checkOut}</p>
      </div>

      <p className="text-lg font-bold text-green-800 mb-5">
        Total Amount: ₹{totalAmount}
      </p>

      {/* Buttons */}
      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full transition duration-200 shadow-md"
      >
        ✅ I’ve Paid
      </button>
      <button
        onClick={() => {
          setShowQR(false);
          setSelectedRoom(null);
        }}
        className="mt-3 text-sm text-red-600 hover:underline"
      >
        ❌ Cancel
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default GuestRoomList;
