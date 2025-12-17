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
import { albumsService } from '../../services/api';

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

<style scoped src="./AlbumsList.css"></style>