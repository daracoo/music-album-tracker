import { useState } from "react";

export default function AlbumCard({ album, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...album });

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'rating' ? (value === '' ? null : Number(value)) : value }));
  }

  async function save() {
    await onUpdate(album.id, form);
    setEditing(false);
  }

  const statusColors = {
    TO_LISTEN: "bg-yellow-100 text-yellow-800",
    LISTENING: "bg-blue-100 text-blue-800",
    LISTENED: "bg-green-100 text-green-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {!editing ? (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{album.title}</h3>
              <p className="text-gray-600">by {album.artist}</p>
              {album.genre && <p className="text-sm text-gray-500">{album.genre}</p>}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[album.status]}`}>
              {album.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`text-lg ${album.rating && star <= album.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
                {!album.rating && <span className="text-gray-400 text-sm ml-2">Not rated</span>}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setEditing(true)} 
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(album.id)} 
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              name="title" 
              value={form.title} 
              onChange={onChange} 
              className="p-2 border border-gray-300 rounded"
              placeholder="Title"
            />
            <input 
              name="artist" 
              value={form.artist} 
              onChange={onChange} 
              className="p-2 border border-gray-300 rounded"
              placeholder="Artist"
            />
            <input 
              name="genre" 
              value={form.genre} 
              onChange={onChange} 
              className="p-2 border border-gray-300 rounded"
              placeholder="Genre"
            />
            <div className="flex gap-2">
              <select 
                name="status" 
                value={form.status} 
                onChange={onChange} 
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="TO_LISTEN">To Listen</option>
                <option value="LISTENING">Listening</option>
                <option value="LISTENED">Listened</option>
              </select>
              <input 
                name="rating" 
                type="number" 
                min="0" 
                max="5" 
                value={form.rating ?? ''} 
                onChange={onChange} 
                className="w-11 p-2 border border-gray-300 rounded"
                placeholder="0-5"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={save} 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button 
              onClick={() => setEditing(false)} 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
