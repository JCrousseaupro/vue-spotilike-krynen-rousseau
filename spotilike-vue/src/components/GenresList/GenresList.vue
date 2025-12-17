<template>
  <div class="genres-container">
    <h2>Genres Musicaux</h2>
    
    <div v-if="loading" class="loading">
      Chargement des genres...
    </div>
    
    <div v-else-if="error" class="error">
      Erreur : {{ error }}
    </div>
    
    <div v-else-if="genres.length === 0" class="no-data">
      Aucun genre trouvé
    </div>
    
    <div v-else class="genres-list">
      <div v-for="genre in genres" :key="genre.id" class="genre-tag">
        {{ genre.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { genresService } from '../../services/api';

const genres = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchGenres = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await genresService.getAllGenres();
    genres.value = response.data.data || response.data;
    console.log('Genres chargés:', genres.value);
  } catch (err) {
    error.value = err.message || 'Impossible de charger les genres';
    console.error('Erreur lors du chargement des genres:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGenres();
});
</script>

<style scoped src="./GenresList.css"></style>
