<template>
  <div class="add-album-container">
    <h2>Ajouter un Album</h2>
    
    <form @submit.prevent="handleSubmit" class="album-form">
      <div class="form-group">
        <label for="title">Titre de l'album *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="Ex: Abbey Road"
          required
        />
      </div>

      <div class="form-group">
        <label for="artist_id">ID de l'artiste *</label>
        <input
          id="artist_id"
          v-model.number="formData.artist_id"
          type="number"
          placeholder="Ex: 1"
          required
        />
      </div>

      <div class="form-group">
        <label for="release_date">Date de sortie</label>
        <input
          id="release_date"
          v-model="formData.release_date"
          type="date"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Ajout en cours...' : 'Ajouter l\'album' }}
        </button>
        <button type="button" class="btn-cancel" @click="resetForm">
          Annuler
        </button>
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { albumsService } from '../services/api';

// Émission d'événement pour notifier le parent qu'un album a été ajouté
const emit = defineEmits(['album-added']);

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = reactive({
  title: '',
  artist_id: null,
  release_date: ''
});

const resetForm = () => {
  formData.title = '';
  formData.artist_id = null;
  formData.release_date = '';
  successMessage.value = '';
  errorMessage.value = '';
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const albumData = {
      title: formData.title,
      artist_id: formData.artist_id,
      release_date: formData.release_date || null
    };

    const response = await albumsService.createAlbum(albumData);
    
    successMessage.value = `Album "${formData.title}" ajouté avec succès !`;
    
    // Émettre l'événement pour que le parent puisse rafraîchir la liste
    emit('album-added', response.data);
    
    // Réinitialiser le formulaire après 2 secondes
    setTimeout(() => {
      resetForm();
    }, 2000);

  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Erreur lors de l\'ajout de l\'album';
    console.error('Erreur lors de l\'ajout:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-album-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  color: #1db954;
  margin-bottom: 20px;
  font-size: 2em;
  text-align: center;
}

.album-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #fff;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1db954;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

button {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit {
  background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
  color: white;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.success-message {
  margin-top: 20px;
  padding: 12px;
  background: rgba(29, 185, 84, 0.2);
  border: 2px solid #1db954;
  border-radius: 8px;
  color: #1ed760;
  text-align: center;
  font-weight: 600;
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background: rgba(255, 68, 68, 0.2);
  border: 2px solid #ff4444;
  border-radius: 8px;
  color: #ff6b6b;
  text-align: center;
  font-weight: 600;
}
</style>

