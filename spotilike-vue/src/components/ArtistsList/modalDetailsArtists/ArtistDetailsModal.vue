<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal modal-details">
            <div class="modal-header">
                <h3>{{ artist?.name }}</h3>
                <button class="btn-close" type="button" @click="$emit('close')">✕</button>
            </div>

            <div class="modal-body">
                <!-- Photo et infos principales -->
                <div class="artist-header">
                    <div class="artist-photo-large">
                        <img v-if="artist?.avatar" :src="artist.avatar" :alt="artist.name" />
                        <span v-else class="artist-initial-large">
                            {{ artist?.name ? artist.name.charAt(0).toUpperCase() : '?' }}
                        </span>
                    </div>

                    <div class="artist-main-info">
                        <p class="artist-country" v-if="artist?.country">
                            <span class="icon">🌍</span> {{ artist.country }}
                        </p>
                        <p class="artist-bio-full" v-if="artist?.bio">
                            {{ artist.bio }}
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
                        Aucune chanson trouvée pour cet artiste
                    </div>

                    <div v-else class="songs-list">
                        <div v-for="song in songs" :key="song.id" class="song-item">
                            <div class="song-main">
                                <span class="song-title">{{ song.title }}</span>
                                <span class="song-album" v-if="song.album_title">{{ song.album_title }}</span>
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
import { artistsService } from '../../../services/api';

const props = defineProps({
    artist: { type: Object, required: true }
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
        const response = await artistsService.getArtistSongs(props.artist.id);
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

<style scoped src="./ArtistDetailsModal.css"></style>