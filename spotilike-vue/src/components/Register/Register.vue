<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Inscription</h2>
      <p class="subtitle">Créez votre compte Spotilike</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Nom d'utilisateur *</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Votre nom d'utilisateur"
            required
            minlength="3"
          />
        </div>

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
            placeholder="Minimum 6 caractères"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe *</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
        </button>
      </form>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="auth-switch">
        <p>Vous avez déjà un compte ?</p>
        <button @click="$emit('switch-to-login')" class="link-button">
          Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { authService } from '../../services/authService';

const emit = defineEmits(['register-success', 'switch-to-login']);

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const resetForm = () => {
  formData.username = '';
  formData.email = '';
  formData.password = '';
  formData.confirmPassword = '';
  errorMessage.value = '';
};

const handleRegister = async () => {
  // Validation
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  if (formData.password.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    const result = await authService.register(userData);

    if (result.success) {
      successMessage.value = result.message;

      // Émettre l'événement de succès
      emit('register-success', result.user);

      // Réinitialiser après 2 secondes et basculer vers login
      setTimeout(() => {
        resetForm();
        emit('switch-to-login');
      }, 2000);
    } else {
      errorMessage.value = result.message;
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Erreur lors de l\'inscription';
    console.error('Erreur lors de l\'inscription:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped src="./Register.css"></style>