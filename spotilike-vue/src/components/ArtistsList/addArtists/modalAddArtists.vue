<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-header">
          <h3>Créer un artiste</h3>
          <button class="btn-close" type="button" @click="$emit('close')">✕</button>
        </div>
  
        <form class="modal-body" @submit.prevent="submit">
          <label class="field">
            <span>Nom *</span>
            <input v-model="form.name" type="text" required />
          </label>
  
          <label class="field">
            <span>Pays</span>
            <input v-model="form.country" type="text" />
          </label>
  
          <label class="field">
            <span>Bio</span>
            <textarea v-model="form.bio" rows="4"></textarea>
          </label>
  
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="$emit('close')">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  
  const emit = defineEmits(['close', 'created']);
  
  const loading = ref(false);
  const errorMessage = ref('');
  
  const form = reactive({
    name: '',
    country: '',
    bio: ''
  });
  
  const submit = async () => {
    errorMessage.value = '';
    loading.value = true;
  
    try {
      // On remonte les données au parent, il fera l'appel API
      emit('created', { ...form });
    } catch (e) {
      errorMessage.value = e?.message || 'Erreur lors de la création';
    } finally {
      loading.value = false;
    }
  };
  </script>

<style scoped src="./modalAddArtists.css"></style>