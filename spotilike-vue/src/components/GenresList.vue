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
import { genresService } from '../services/api';

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

<style scoped>
.genres-container {
  padding: 20px 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
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

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.genre-tag {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1em;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.genre-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.genre-tag:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
}

.genre-tag:hover::before {
  width: 300px;
  height: 300px;
}

/* Desktop */
@media (min-width: 1200px) {
  .genres-list {
    gap: 25px;
  }
  
  .genre-tag {
    padding: 18px 36px;
    font-size: 1.15em;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  h2 {
    font-size: 2em;
  }
  
  .genre-tag {
    padding: 14px 28px;
    font-size: 1em;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .genres-container {
    padding: 20px 0;
  }
  
  .genres-list {
    gap: 15px;
  }
  
  .genre-tag {
    padding: 12px 24px;
    font-size: 0.95em;
  }
  
  h2 {
    font-size: 1.8em;
  }
}
</style>

