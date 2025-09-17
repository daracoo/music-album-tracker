const BASE = import.meta.env.VITE_API_URL ?? '';
const API = BASE ? `${BASE}` : '';

export async function fetchAlbums() {
  const res = await fetch(API + '/albums');
  if (!res.ok) throw new Error('Failed to fetch albums');
  return res.json();
}

export async function createAlbum(payload) {
  const res = await fetch(API + '/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create album');
  return res.json();
}

export async function updateAlbum(id, payload) {
  const res = await fetch(API + `/albums/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update album');
  return res.json();
}

export async function deleteAlbum(id) {
  const res = await fetch(API + `/albums/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete album');
  return res.json();
}
