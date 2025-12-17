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
import { albumsService } from '../../services/api';

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

<style scoped src="./AddAlbumForm.css"></style>