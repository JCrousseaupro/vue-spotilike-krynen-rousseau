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
import { authService } from '../services/authService';

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

<style scoped>
.auth-container {
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 24px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 48px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

h2 {
  color: #1db954;
  margin: 0 0 15px 0;
  font-size: 2.2em;
  text-align: center;
  font-weight: 800;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 28px 0;
  font-size: 1.05em;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #fff;
  font-weight: 600;
  font-size: 0.95em;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1em;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1db954;
  background: rgba(255, 255, 255, 0.08);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-submit {
  margin-top: 20px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
  color: white;
  font-size: 1.05em;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(29, 185, 84, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  padding: 14px;
  background: rgba(29, 185, 84, 0.2);
  border: 2px solid #1db954;
  border-radius: 10px;
  color: #1ed760;
  text-align: center;
  font-weight: 600;
}

.error-message {
  margin-top: 20px;
  padding: 14px;
  background: rgba(255, 68, 68, 0.2);
  border: 2px solid #ff4444;
  border-radius: 10px;
  color: #ff6b6b;
  text-align: center;
  font-weight: 600;
}

.auth-switch {
  margin-top: 30px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-switch p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 10px 0;
}

.link-button {
  background: none;
  border: none;
  color: #1db954;
  font-size: 1.05em;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: #1ed760;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 28px 16px;
  }

  .auth-card {
    padding: 28px 22px;
    border-radius: 16px;
  }

  h2 {
    font-size: 1.9em;
  }
}
</style>

