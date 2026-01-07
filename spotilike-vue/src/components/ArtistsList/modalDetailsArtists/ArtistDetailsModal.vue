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

                <!-- Section Albums -->
                <div class="songs-section">
                    <h4>
                        <span class="icon">💿</span> Albums
                        <span class="songs-count" v-if="!loadingAlbums">({{ albums.length }})</span>
                    </h4>

                    <div v-if="loadingAlbums" class="loading">
                        Chargement des albums...
                    </div>

                    <div v-else-if="albums.length === 0" class="no-songs">
                        Aucun album trouvé pour cet artiste
                    </div>

                    <div v-else class="songs-list">
                        <div v-for="album in albums" :key="album.id" class="song-item album-item" @click="$emit('showAlbum', album)">
                            <div class="song-main">
                                <span class="song-title">{{ album.title }}</span>
                                <span class="song-album" v-if="album.genre_name">{{ album.genre_name }}</span>
                            </div>
                            <span class="song-duration" v-if="album.release_year">{{ album.release_year }}</span>
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
    artist: { type: Object, required: true }
});

const emit = defineEmits(['close', 'showAlbum']);

const albums = ref([]);
const loadingAlbums = ref(true);

const fetchAlbums = async () => {
    try {
        loadingAlbums.value = true;
        // Récupérer tous les albums et filtrer par artist_id
        const response = await albumsService.getAllAlbums();
        const allAlbums = response.data.data || response.data;
        albums.value = allAlbums.filter(album => album.artist_id === props.artist.id);
    } catch (error) {
        console.error('Erreur chargement albums:', error);
    } finally {
        loadingAlbums.value = false;
    }
};

onMounted(() => {
    fetchAlbums();
});
</script>

<style scoped src="./ArtistDetailsModal.css"></style>