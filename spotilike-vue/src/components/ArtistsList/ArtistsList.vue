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
import { artistsService } from '../../services/api';

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

<style scoped src="./ArtistsList.css"></style>