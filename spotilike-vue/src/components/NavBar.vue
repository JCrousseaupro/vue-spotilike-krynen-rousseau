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
import { authStore } from '../stores/authStore';
import { authService } from '../services/authService';

const emit = defineEmits(['show-login', 'show-register', 'logout', 'go-home']);

const handleLogout = () => {
  const result = authService.logout();
  if (result.success) {
    emit('logout');
  }
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  width: 100%;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.nav-left .logo {
  font-size: 2.5em;
  margin: 0;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 800;
  letter-spacing: -1px;
}

.nav-left .logo:hover {
  transform: scale(1.08);
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 25px;
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 25px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.welcome-text {
  color: white;
  font-size: 1.1em;
  font-weight: 500;
}

.welcome-text strong {
  font-weight: 700;
}

.auth-buttons {
  display: flex;
  gap: 15px;
}

button {
  padding: 12px 32px;
  border: none;
  border-radius: 30px;
  font-size: 1.05em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button:hover::before {
  width: 300px;
  height: 300px;
}

.btn-login {
  background: white;
  color: #1db954;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-register {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-register:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-logout:hover {
  background: rgba(255, 68, 68, 0.9);
  border-color: rgba(255, 68, 68, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.5);
}

/* Desktop Large */
@media (min-width: 1200px) {
  .nav-container {
    padding: 22px 40px;
  }
  
  .nav-left .logo {
    font-size: 2.5em;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .nav-container {
    padding: 18px 40px;
  }
  
  .nav-left .logo {
    font-size: 2.2em;
  }
  
  button {
    padding: 10px 24px;
    font-size: 1em;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .nav-left .logo {
    font-size: 2em;
  }

  .user-section {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
    width: 100%;
  }

  .welcome-text {
    font-size: 1em;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  button {
    width: 100%;
    padding: 14px 24px;
  }
}
</style>

