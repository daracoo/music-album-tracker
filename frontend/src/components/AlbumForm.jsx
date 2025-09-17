import { useState } from "react";

export default function AlbumForm({ onCreate }) {
  const initial = { title: "", artist: "", genre: "", status: "TO_LISTEN", rating: null };
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'rating' ? (value === '' ? null : Number(value)) : value }));
  }

  async function onSubmit() {
    if (!form.title.trim() || !form.artist.trim()) return;
    
    setSubmitting(true);
    try {
      await onCreate(form);
      setForm(initial);
    } catch (err) {
      alert(err.message || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Album</h2>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            name="title" 
            placeholder="Album Title" 
            value={form.title} 
            onChange={onChange} 
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="artist" 
            placeholder="Artist" 
            value={form.artist} 
            onChange={onChange} 
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="genre" 
            placeholder="Genre" 
            value={form.genre} 
            onChange={onChange} 
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <select 
              name="status" 
              value={form.status} 
              onChange={onChange} 
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Rating" 
              value={form.rating ?? ''} 
              onChange={onChange} 
              className="w-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button 
          onClick={onSubmit} 
          disabled={submitting || !form.title.trim() || !form.artist.trim()} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Adding..." : "Add Album"}
        </button>
      </div>
    </div>
  );
}
