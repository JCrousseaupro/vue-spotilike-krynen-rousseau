import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5678/api';

// Instance axios avec configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Intercepteur - Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Intercepteur - Header Authorization ajouté:', config.headers.Authorization);
    } else {
      console.warn('Intercepteur - Pas de token dans localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les albums
export const albumsService = {
  // 1. GET /api/albums - Récupère la liste de tous les albums
  getAllAlbums() {
    return apiClient.get('/albums');
  },
  
  // 2. GET /api/albums/:id - Récupère les détails de l'album précisé par :id
  getAlbumById(id) {
    return apiClient.get(`/albums/${id}`);
  },
  
  // 3. GET /api/albums/:id/songs - Récupère les morceaux de l'album précisé par :id
  getAlbumSongs(id) {
    return apiClient.get(`/albums/${id}/songs`);
  },
  
  // 8. POST /api/albums - Ajout d'un album
  createAlbum(albumData) {
    return apiClient.post('/albums', albumData);
  },
  
  // 9. POST /api/albums/:id/songs - Ajout d'un morceau dans l'album précisé par :id
  addSongToAlbum(id, songData) {
    return apiClient.post(`/albums/${id}/songs`, songData);
  },
  
  // 11. PUT /api/albums/:id - Modification de l'album précisé par :id
  updateAlbum(id, albumData) {
    return apiClient.put(`/albums/${id}`, albumData);
  },
  
  // 14. DELETE /api/albums/:id - Suppression de l'album précisé par :id
  deleteAlbum(id) {
    return apiClient.delete(`/albums/${id}`);
  },
};

// Service pour les artistes
export const artistsService = {
  // 5. GET /api/artists/:id/songs - Récupère la liste de tous les morceaux de l'artiste précisé par :id
  getArtistSongs(id) {
    return apiClient.get(`/artists/${id}/songs`);
  },

  // 17. GET /api/artists - Récupère la liste de tous les artistes
  getAllArtists() {
    return apiClient.get('/artists');
  },

  // 16. POST /api/artists - Ajout d'un artiste
  createArtist(artistData) {
    return apiClient.post('/artists', artistData);
  },
  
  // 10. PUT /api/artists/:id - Modification de l'artiste précisé par :id
  updateArtist(id, artistData) {
    return apiClient.put(`/artists/${id}`, artistData);
  },
  
  // 15. DELETE /api/artists/:id - Suppression de l'artiste précisé par :id
  deleteArtist(id) {
    return apiClient.delete(`/artists/${id}`);
  },
};

// Service pour les genres
export const genresService = {
  // 4. GET /api/genres - Récupère la liste de tous les genres
  getAllGenres() {
    return apiClient.get('/genres');
  },
  
  // 12. PUT /api/genres/:id - Modification du genre précisé par :id
  updateGenre(id, genreData) {
    return apiClient.put(`/genres/${id}`, genreData);
  },
};

// Service pour les utilisateurs
export const usersService = {
  // 6. POST /api/users/signup - Ajout d'un utilisateur (géré par authService)
  // 7. POST /api/users/login - Connexion d'un utilisateur (géré par authService)
  
  // 13. DELETE /api/users/:id - Suppression de l'utilisateur précisé par :id
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  },
};

export default apiClient;

