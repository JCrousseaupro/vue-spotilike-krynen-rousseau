<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-header">
          <h3>Supprimer un artiste</h3>
          <button class="btn-close" type="button" @click="$emit('close')">✕</button>
        </div>
  
        <div class="modal-body">
          <p class="warning-title">
            Attention : suppression définitive !
          </p>
  
          <p class="warning-text">
            Vous êtes sur le point de supprimer <strong>{{ artist?.name }}</strong>.
            <br>Si vous cliquez sur "Oui, supprimer" cela va aussi supprimer :
          </p>
  
          <ul class="warning-list">
            <li>Tous les albums de cet artiste</li>
            <li>Toutes les chansons liées</li>
          </ul>
  
          <p class="warning-text">
            Cette action est <strong>irréversible</strong>.
          </p>
  
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="$emit('close')" :disabled="loading">
              Annuler
            </button>
            <button type="button" class="btn-danger" @click="confirm" :disabled="loading">
              {{ loading ? 'Suppression...' : 'Oui, supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    artist: { type: Object, default: null }
  });
  
  const emit = defineEmits(['close', 'confirm']);
  
  const loading = ref(false);
  const errorMessage = ref('');
  
  const confirm = async () => {
    errorMessage.value = '';
    loading.value = true;
    try {
      emit('confirm');
    } catch (e) {
      errorMessage.value = e?.message || 'Erreur lors de la suppression';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped src="./modalDeleteArtist.css"></style>