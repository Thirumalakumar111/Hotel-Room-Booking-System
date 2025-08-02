import { useEffect, useState } from 'react';
import axios from 'axios';

interface Room {
  _id?: string;
  roomNumber: number;
  type: string;
  price: number;
  isAvailable: boolean;
}

export default function AdminRoomDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState<Room>({
    roomNumber: 0,
    type: '',
    price: 0,
    isAvailable: true,
  });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchRooms = async () => {
    const { data } = await axios.get('http://localhost:5001/api/rooms');
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isAvailable' ? value === 'true' : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await axios.put(
          `http://localhost:5001/api/rooms/${editingRoomId}`,
          formData,
          authHeaders
        );
      } else {
        await axios.post(
          'http://localhost:5001/api/rooms',
          formData,
          authHeaders
        );
      }
      setFormData({
        roomNumber: 0,
        type: '',
        price: 0,
        isAvailable: true,
      });
      setEditingRoomId(null);
      fetchRooms();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Room operation failed');
    }
  };

  const handleEdit = (room: Room) => {
    setFormData(room);
    setEditingRoomId(room._id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/rooms/${id}`, authHeaders);
      fetchRooms();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-r from-slate-900 to-gray-800">
      <h1 className="text-3xl font-bold mb-6">Admin Room Management</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 p-4 rounded-lg"
      >
        <input
          type="number"
          name="roomNumber"
          placeholder="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
          required
          className="p-3 rounded bg-white/80 text-black"
        />
        <input
          type="text"
          name="type"
          placeholder="Room Type (e.g., Deluxe)"
          value={formData.type}
          onChange={handleChange}
          required
          className="p-3 rounded bg-white/80 text-black"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="p-3 rounded bg-white/80 text-black"
        />
        <select
          name="isAvailable"
          value={formData.isAvailable.toString()}
          onChange={handleChange}
          className="p-3 rounded bg-white/80 text-black"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <button
          type="submit"
          className="col-span-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200"
        >
          {editingRoomId ? 'Update Room' : 'Create Room'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Room List</h2>
        <table className="w-full table-auto border-collapse bg-white/10 text-white">
          <thead>
            <tr className="bg-white/20">
              <th className="border p-2">Room No</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Available</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="text-center">
                <td className="border p-2">{room.roomNumber}</td>
                <td className="border p-2">{room.type}</td>
                <td className="border p-2">₹{room.price}</td>
                <td className="border p-2">{room.isAvailable ? 'Yes' : 'No'}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id!)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
