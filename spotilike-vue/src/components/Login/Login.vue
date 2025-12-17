<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Connexion</h2>
      <p class="subtitle">Bienvenue sur Spotilike</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe *</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="auth-switch">
        <p>Vous n'avez pas encore de compte ?</p>
        <button @click="$emit('switch-to-register')" class="link-button">
          Créer un compte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { authService } from '../../services/authService';

const emit = defineEmits(['login-success', 'switch-to-register']);

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = reactive({
  email: '',
  password: ''
});

const resetForm = () => {
  formData.email = '';
  formData.password = '';
  errorMessage.value = '';
};

const handleLogin = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const result = await authService.login(formData.email, formData.password);

    if (result.success) {
      successMessage.value = result.message;

      // Émettre l'événement de succès
      emit('login-success', result.user);

      // Rediriger après 1 seconde
      setTimeout(() => {
        resetForm();
      }, 1000);
    } else {
      errorMessage.value = result.message;
    }
  } catch (err) {
    errorMessage.value = err.message || 'Erreur lors de la connexion';
    console.error('Erreur lors de la connexion:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped src="./Login.css"></style>
