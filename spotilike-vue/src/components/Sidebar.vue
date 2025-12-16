<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo" @click="handleLogoClick">Spotilike</h1>
    </div>

    <nav class="sidebar-nav" v-if="authStore.isAuthenticated.value">
      <div class="nav-item active">
        <span class="label">Accueil</span>
      </div>
      <div class="nav-item">
        <span class="label">Genres</span>
      </div>
      <div class="nav-item">
        <span class="label">Albums</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div v-if="authStore.isAuthenticated.value" class="user-info">
        <p class="username">{{ authStore.currentUser.value?.username }}</p>
        <button @click="handleLogout" class="btn-logout-sidebar">
          Déconnexion
        </button>
      </div>
      <div v-else class="auth-buttons-sidebar">
        <button @click="$emit('show-login')" class="btn-login-sidebar">
          Connexion
        </button>
        <button @click="$emit('show-register')" class="btn-register-sidebar">
          Inscription
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { authStore } from '../stores/authStore';
import { authService } from '../services/authService';

const emit = defineEmits(['show-login', 'show-register', 'logout', 'go-home']);

const handleLogout = () => {
  authService.logout();
  emit('logout');
};

const handleLogoClick = () => {
  if (authStore.isAuthenticated.value) {
    emit('go-home');
  } else {
    emit('show-login');
  }
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: #0a0a0a;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
  flex: 0 0 240px;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.8em;
  font-weight: 800;
  color: #1db954;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #1ed760;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: rgba(29, 185, 84, 0.1);
  color: #1db954;
  border-left-color: #1db954;
}

.label {
  font-size: 1em;
  font-weight: 600;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.username {
  color: white;
  font-weight: 600;
  margin: 0;
  font-size: 0.95em;
}

.btn-logout-sidebar,
.btn-login-sidebar,
.btn-register-sidebar {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-sidebar {
  background: rgba(255, 68, 68, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.btn-logout-sidebar:hover {
  background: rgba(255, 68, 68, 0.3);
}

.auth-buttons-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-login-sidebar {
  background: #1db954;
  color: white;
}

.btn-login-sidebar:hover {
  background: #1ed760;
}

.btn-register-sidebar {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-register-sidebar:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Mobile */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
    flex-basis: 80px;
  }

  .label {
    display: none;
  }

  .sidebar-header {
    padding: 20px 10px;
  }

  .logo {
    font-size: 1.2em;
    text-align: center;
  }

  .nav-item {
    justify-content: center;
    padding: 12px 10px;
  }

  .sidebar-footer {
    padding: 10px;
  }

  .username {
    display: none;
  }

  button {
    font-size: 0.8em;
    padding: 8px;
  }
}
</style>

