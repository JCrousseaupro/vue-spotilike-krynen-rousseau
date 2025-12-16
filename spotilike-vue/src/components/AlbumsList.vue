<template>
  <div class="albums-container">
    <h2>Albums</h2>
    
    <div v-if="loading" class="loading">
      Chargement des albums...
    </div>
    
    <div v-else-if="error" class="error">
      Erreur : {{ error }}
    </div>
    
    <div v-else-if="albums.length === 0" class="no-data">
      Aucun album trouvé
    </div>
    
    <div v-else class="albums-grid">
      <div v-for="album in albums" :key="album.id" class="album-card">
        <div class="album-info">
          <h3>{{ album.title || album.name }}</h3>
          <p class="album-artist">{{ album.artist_name || 'Artiste inconnu' }}</p>
          <p class="album-genre" v-if="album.genre_name">{{ album.genre_name }}</p>
          <p class="album-year" v-if="album.release_year">
            {{ album.release_year }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { albumsService } from '../services/api';

const albums = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchAlbums = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await albumsService.getAllAlbums();
    albums.value = response.data.data || response.data;
    console.log('Albums chargés:', albums.value);
  } catch (err) {
    error.value = err.message || 'Impossible de charger les albums';
    console.error('Erreur lors du chargement des albums:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped>
.albums-container {
  padding: 0;
  max-width: 100%;
}

h2 {
  color: #1db954;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 60px;
  font-size: 1.2em;
}

.error {
  color: #ff4444;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.album-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.album-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
}

.album-card:hover::before {
  opacity: 1;
}

.album-info h3 {
  color: white;
  margin: 0 0 15px 0;
  font-size: 1.5em;
  font-weight: 600;
}

.album-artist {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1em;
  margin: 8px 0;
  font-weight: 500;
}

.album-genre {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  margin: 8px 0;
  font-style: italic;
}

.album-year {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
  margin-top: 12px;
  font-weight: 300;
}

/* Desktop */
@media (min-width: 1024px) {
  .albums-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .albums-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
  }
  
  h2 {
    font-size: 2em;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .albums-container {
    padding: 20px 0;
  }
  
  .albums-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .album-card {
    padding: 20px;
  }
  
  h2 {
    font-size: 1.8em;
  }
}

@media (max-width: 480px) {
  .albums-grid {
    grid-template-columns: 1fr;
  }
}
</style>

