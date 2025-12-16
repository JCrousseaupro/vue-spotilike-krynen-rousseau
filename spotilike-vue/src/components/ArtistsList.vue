<template>
  <div class="artists-container">
    <h2>Artistes</h2>
    
    <div v-if="loading" class="loading">
      Chargement des artistes...
    </div>
    
    <div v-else-if="error" class="error">
      Erreur : {{ error }}
    </div>
    
    <div v-else-if="artists.length === 0" class="no-data">
      Aucun artiste trouvé
    </div>
    
    <div v-else class="artists-grid">
      <div v-for="artist in artists" :key="artist.id" class="artist-card">
        <div class="artist-avatar">
          {{ artist.name ? artist.name.charAt(0).toUpperCase() : '?' }}
        </div>
        <div class="artist-info">
          <h3>{{ artist.name }}</h3>
          <p class="artist-bio" v-if="artist.bio">
            {{ artist.bio.substring(0, 100) }}{{ artist.bio.length > 100 ? '...' : '' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { artistsService } from '../services/api';

const artists = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchArtists = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await artistsService.getAllArtists();
    artists.value = response.data;
  } catch (err) {
    error.value = err.message || 'Impossible de charger les artistes';
    console.error('Erreur lors du chargement des artistes:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArtists();
});
</script>

<style scoped>
.artists-container {
  padding: 20px;
}

h2 {
  color: #1db954;
  margin-bottom: 20px;
  font-size: 2em;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #ff4444;
}

.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.artist-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
}

.artist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.artist-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.artist-info {
  flex: 1;
}

.artist-info h3 {
  color: white;
  margin: 0 0 8px 0;
  font-size: 1.3em;
}

.artist-bio {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9em;
  margin: 0;
  line-height: 1.4;
}
</style>

