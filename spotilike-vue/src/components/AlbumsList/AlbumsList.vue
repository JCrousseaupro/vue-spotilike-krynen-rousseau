<template>
  <div class="albums-container">
    <!-- Modal de détails -->
    <AlbumDetailsModal 
      v-if="showDetailsModal" 
      :album="albumToShow" 
      @close="showDetailsModal = false" 
    />

    <div class="albums-header">
      <h2>Albums</h2>
      
      <div class="filter-section">
        <label for="genre-filter">Filtrer par genre :</label>
        <select id="genre-filter" v-model="selectedGenre" class="genre-select">
          <option value="">Tous les genres</option>
          <option v-for="genre in uniqueGenres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Chargement des albums...
    </div>
    
    <div v-else-if="error" class="error">
      Erreur : {{ error }}
    </div>
    
    <div v-else-if="filteredAlbums.length === 0" class="no-data">
      Aucun album trouvé
    </div>
    
    <div v-else class="albums-grid">
      <div v-for="album in filteredAlbums" :key="album.id" class="album-card" @click="showAlbumDetails(album)">
        <!-- Infos À GAUCHE -->
        <div class="album-info">
          <h3>{{ album.title || album.name }}</h3>
          <p class="album-artist">{{ album.artist_name || 'Artiste inconnu' }}</p>
          <p class="album-genre" v-if="album.genre_name">🎵 {{ album.genre_name }}</p>
          <p class="album-year" v-if="album.release_year">
            📅 {{ album.release_year }}
          </p>
        </div>
        
        <!-- Pochette À DROITE -->
        <img 
          v-if="album.cover_image" 
          :src="album.cover_image" 
          :alt="album.title"
          class="album-cover-img"
        />
        <div v-else class="album-cover-placeholder">
          <span class="album-initial">{{ (album.title || album.name || '?').charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { albumsService } from '../../services/api';
import AlbumDetailsModal from './modalDetailsAlbums/AlbumDetailsModal.vue';

const albums = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedGenre = ref('');
const showDetailsModal = ref(false);
const albumToShow = ref(null);

// Liste unique des genres
const uniqueGenres = computed(() => {
  const genres = albums.value
    .map(album => album.genre_name)
    .filter(genre => genre);  // Enlever les null/undefined
  return [...new Set(genres)].sort();
});

// Albums filtrés
const filteredAlbums = computed(() => {
  if (!selectedGenre.value) {
    return albums.value;
  }
  return albums.value.filter(album => album.genre_name === selectedGenre.value);
});

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

const showAlbumDetails = (album) => {
  albumToShow.value = album;
  showDetailsModal.value = true;
};

onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped src="./AlbumsList.css"></style>