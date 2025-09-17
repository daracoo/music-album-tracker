import { useEffect, useState } from "react";
import { fetchAlbums, createAlbum, updateAlbum, deleteAlbum } from "./api";
import AlbumForm from "./components/AlbumForm";
import  AlbumCard from "./components/AlbumList";

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('LISTENING');
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAlbums();
      setAlbums(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(payload) {
    const newAlbum = await createAlbum(payload);
    setAlbums(prev => [newAlbum, ...prev]);
    setShowForm(false);
  }

  async function handleUpdate(id, payload) {
    const updated = await updateAlbum(id, payload);
    setAlbums(prev => prev.map(a => a.id === updated.id ? updated : a));
  }

  async function handleDelete(id) {
    await deleteAlbum(id);
    setAlbums(prev => prev.filter(a => a.id !== id));
  }

  const statusTabs = [
    { key: 'LISTENING', label: 'Currently Listening', icon: '🎵' },
    { key: 'TO_LISTEN', label: 'To Listen', icon: '📝' },
    { key: 'LISTENED', label: 'Listened', icon: '✅' }
  ];

  const filteredAlbums = albums.filter(album => album.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your music collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">Error loading albums</p>
          <p>{error}</p>
          <button onClick={load} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎶 Music Album Tracker</h1>
          <p className="text-gray-600">Keep track of your music listening journey</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-0 px-4 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                <span className="ml-2 text-sm opacity-75">
                  ({albums.filter(a => a.status === tab.key).length})
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                showForm
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="mr-2">➕</span>
              Add Album
            </button>
          </div>
        </div>

        {/* Add Album Form */}
        {showForm && (
          <div className="mb-6">
            <AlbumForm onCreate={handleCreate} />
          </div>
        )}

        {/* Current Tab Content */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {statusTabs.find(tab => tab.key === activeTab)?.icon} {statusTabs.find(tab => tab.key === activeTab)?.label}
          </h2>
          
          {filteredAlbums.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📀</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No albums in this section
              </h3>
              <p className="text-gray-600">
                {activeTab === 'LISTENING' && "You're not currently listening to any albums."}
                {activeTab === 'TO_LISTEN' && "Your listening queue is empty."}
                {activeTab === 'LISTENED' && "You haven't finished listening to any albums yet."}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Album
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map(album => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}