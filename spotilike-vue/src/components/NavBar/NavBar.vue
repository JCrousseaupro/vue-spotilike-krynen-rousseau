<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <h1 class="logo" @click="$emit('go-home')">Spotilike</h1>
      </div>

      <div class="nav-right">
        <div v-if="authStore.isAuthenticated.value" class="user-section">
          <span class="welcome-text">
            Bonjour, <strong>{{ authStore.currentUser.value?.username }}</strong>
          </span>
          <button @click="handleLogout" class="btn-logout">
            Déconnexion
          </button>
        </div>

        <div v-else class="auth-buttons">
          <button @click="$emit('show-login')" class="btn-login">
            Connexion
          </button>
          <button @click="$emit('show-register')" class="btn-register">
            Inscription
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { authStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const emit = defineEmits(['show-login', 'show-register', 'logout', 'go-home']);

const handleLogout = () => {
  const result = authService.logout();
  if (result.success) {
    emit('logout');
  }
};
</script>

<style scoped src="./NavBar.css"></style>