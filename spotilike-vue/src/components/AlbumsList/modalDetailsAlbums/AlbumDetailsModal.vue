<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal modal-details">
        <div class="modal-header">
          <h3>{{ album?.title }}</h3>
          <button class="btn-close" type="button" @click="$emit('close')">✕</button>
        </div>
  
        <div class="modal-body">
          <!-- Pochette et infos principales -->
          <div class="album-header">
            <div class="album-cover-large">
              <img 
                v-if="album?.cover_image" 
                :src="album.cover_image" 
                :alt="album.title"
              />
              <span v-else class="album-initial-large">
                {{ album?.title ? album.title.charAt(0).toUpperCase() : '?' }}
              </span>
            </div>
  
            <div class="album-main-info">
              <p class="album-artist-name" v-if="album?.artist_name">
                <span class="icon">👤</span> {{ album.artist_name }}
              </p>
              <p class="album-genre-name" v-if="album?.genre_name">
                <span class="icon">🎵</span> {{ album.genre_name }}
              </p>
              <p class="album-year-full" v-if="album?.release_year">
                <span class="icon">📅</span> {{ album.release_year }}
              </p>
            </div>
          </div>
  
          <!-- Section Chansons -->
          <div class="songs-section">
            <h4>
              <span class="icon">🎵</span> Chansons
              <span class="songs-count" v-if="!loadingSongs">({{ songs.length }})</span>
            </h4>
  
            <div v-if="loadingSongs" class="loading">
              Chargement des chansons...
            </div>
  
            <div v-else-if="songs.length === 0" class="no-songs">
              Aucune chanson trouvée pour cet album
            </div>
  
            <div v-else class="songs-list">
              <div v-for="song in songs" :key="song.id" class="song-item">
                <div class="song-main">
                  <span class="song-number" v-if="song.track_number">{{ song.track_number }}.</span>
                  <span class="song-title">{{ song.title }}</span>
                </div>
                <span class="song-duration" v-if="song.duration">{{ formatDuration(song.duration) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { albumsService } from '../../../services/api';
  
  const props = defineProps({
    album: { type: Object, required: true }
  });
  
  const emit = defineEmits(['close']);
  
  const songs = ref([]);
  const loadingSongs = ref(true);
  
  const formatDuration = (duration) => {
    if (!duration) return '--:--';
    
    // Si c'est déjà au format "MM:SS", le retourner directement
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // Sinon convertir depuis les secondes (au cas où)
    const seconds = Number(duration);
    if (isNaN(seconds)) return '--:--';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const fetchSongs = async () => {
    try {
      loadingSongs.value = true;
      const response = await albumsService.getAlbumSongs(props.album.id);
      songs.value = response.data.data;
    } catch (error) {
      console.error('Erreur chargement chansons:', error);
    } finally {
      loadingSongs.value = false;
    }
  };
  
  onMounted(() => {
    fetchSongs();
  });
  </script>
  
  <style scoped src="./AlbumDetailsModal.css"></style>