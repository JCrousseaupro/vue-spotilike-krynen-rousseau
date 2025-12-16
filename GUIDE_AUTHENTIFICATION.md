# 🔐 Guide d'Authentification - Spotilike

## 📋 Vue d'ensemble

Le système d'authentification est maintenant **complètement intégré** dans Spotilike ! Vous pouvez :
- ✅ Créer un compte (inscription)
- ✅ Se connecter
- ✅ Se déconnecter
- ✅ Afficher les informations utilisateur

## 🎯 Composants créés

### 1. **Register.vue** - Formulaire d'inscription
Permet aux nouveaux utilisateurs de créer un compte.

**Champs :**
- Nom d'utilisateur (minimum 3 caractères)
- Email
- Mot de passe (minimum 6 caractères)
- Confirmation du mot de passe

**Validation :**
- Vérification que les mots de passe correspondent
- Validation des longueurs minimales
- Format email valide

### 2. **Login.vue** - Formulaire de connexion
Permet aux utilisateurs existants de se connecter.

**Champs :**
- Email
- Mot de passe

### 3. **NavBar.vue** - Barre de navigation
Affiche différents éléments selon l'état de connexion :

**Non connecté :**
- Bouton "Connexion"
- Bouton "Inscription"

**Connecté :**
- Message de bienvenue avec nom d'utilisateur
- Bouton "Déconnexion"

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FLUX D'AUTHENTIFICATION               │
└─────────────────────────────────────────────────────────┘

1. Utilisateur clique sur "Inscription" ou "Connexion"
   │
   ▼
2. App.vue change la vue (currentView)
   │
   ▼
3. Composant Register.vue ou Login.vue s'affiche
   │
   ▼
4. Utilisateur remplit le formulaire
   │
   ▼
5. Soumission → authService traite la demande
   │
   ▼
6. API backend est appelée (usersService)
   │
   ▼
7. Si succès → authStore sauvegarde l'utilisateur
   │
   ▼
8. localStorage conserve la session
   │
   ▼
9. NavBar se met à jour automatiquement
   │
   ▼
10. Redirection vers la page d'accueil
```

## 📁 Fichiers créés

```
src/
├── components/
│   ├── Register.vue          ✨ NOUVEAU
│   ├── Login.vue             ✨ NOUVEAU
│   └── NavBar.vue            ✨ NOUVEAU
│
├── services/
│   └── authService.js        ✨ NOUVEAU
│
└── stores/
    └── authStore.js          ✨ NOUVEAU
```

## 🔧 Utilisation

### Dans App.vue

```vue
<script setup>
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import { authStore } from './stores/authStore';

const currentView = ref('home');

const showLogin = () => currentView.value = 'login';
const showRegister = () => currentView.value = 'register';

const handleLoginSuccess = (user) => {
  console.log('Connecté:', user);
  currentView.value = 'home';
};
</script>

<template>
  <NavBar 
    @show-login="showLogin"
    @show-register="showRegister"
  />
  
  <Login 
    v-if="currentView === 'login'"
    @login-success="handleLoginSuccess"
  />
  
  <Register 
    v-if="currentView === 'register'"
    @register-success="handleRegisterSuccess"
  />
</template>
```

### Dans n'importe quel composant

#### Vérifier si l'utilisateur est connecté

```vue
<script setup>
import { authStore } from '../stores/authStore';
</script>

<template>
  <div v-if="authStore.isAuthenticated.value">
    <p>Bienvenue {{ authStore.currentUser.value?.username }} !</p>
  </div>
  <div v-else>
    <p>Veuillez vous connecter</p>
  </div>
</template>
```

#### Utiliser authService

```vue
<script setup>
import { authService } from '../services/authService';

// Inscription
const register = async () => {
  const result = await authService.register({
    username: 'John',
    email: 'john@example.com',
    password: 'password123'
  });
  
  if (result.success) {
    console.log('Inscription réussie:', result.user);
  } else {
    console.error('Erreur:', result.message);
  }
};

// Connexion
const login = async () => {
  const result = await authService.login(
    'john@example.com',
    'password123'
  );
  
  if (result.success) {
    console.log('Connecté:', result.user);
  }
};

// Déconnexion
const logout = () => {
  authService.logout();
};

// Vérifier l'état
const isConnected = authService.isAuthenticated();
const currentUser = authService.getCurrentUser();
</script>
```

## 🔐 authStore - Store d'authentification

### État disponible

```javascript
import { authStore } from './stores/authStore';

// État réactif
authStore.state.currentUser      // Utilisateur actuel (objet)
authStore.state.isAuthenticated  // Boolean
authStore.state.isLoading        // Boolean

// Getters computed
authStore.currentUser.value      // Utilisateur (computed)
authStore.isAuthenticated.value  // Boolean (computed)
authStore.isLoading.value        // Boolean (computed)
```

### Méthodes disponibles

```javascript
// Définir l'utilisateur connecté
authStore.setUser(user);

// Déconnecter
authStore.logout();

// Charger depuis localStorage
authStore.loadUserFromStorage();

// Changer l'état de chargement
authStore.setLoading(true/false);
```

## 🌐 authService - Service d'authentification

### Méthodes disponibles

#### 1. Inscription

```javascript
const result = await authService.register({
  username: 'JohnDoe',
  email: 'john@example.com',
  password: 'securePassword123'
});

// Retour:
{
  success: true/false,
  user: { ... },      // Si succès
  message: '...'
}
```

#### 2. Connexion

```javascript
const result = await authService.login(
  'john@example.com',
  'securePassword123'
);

// Retour:
{
  success: true/false,
  user: { ... },      // Si succès
  message: '...'
}
```

#### 3. Déconnexion

```javascript
const result = authService.logout();

// Retour:
{
  success: true,
  message: 'Déconnexion réussie'
}
```

#### 4. Vérifier l'authentification

```javascript
const isAuth = authService.isAuthenticated();
// Retourne: true ou false
```

#### 5. Obtenir l'utilisateur actuel

```javascript
const user = authService.getCurrentUser();
// Retourne: objet user ou null
```

#### 6. Mettre à jour le profil

```javascript
const result = await authService.updateProfile(userId, {
  username: 'NewUsername',
  email: 'newemail@example.com'
});
```

## 💾 Persistance des données

Les données de session sont **automatiquement sauvegardées** dans le `localStorage` :

```javascript
// Sauvegarde automatique lors de la connexion
localStorage.setItem('currentUser', JSON.stringify(user));

// Chargement automatique au démarrage de l'app
authStore.loadUserFromStorage();

// Suppression automatique à la déconnexion
localStorage.removeItem('currentUser');
```

## 🎨 Interface utilisateur

### Page d'inscription

```
╔════════════════════════════════════════╗
║         📝 Inscription                 ║
║   Créez votre compte Spotilike         ║
╠════════════════════════════════════════╣
║                                        ║
║  Nom d'utilisateur *                   ║
║  [___________________________]         ║
║                                        ║
║  Email *                               ║
║  [___________________________]         ║
║                                        ║
║  Mot de passe *                        ║
║  [___________________________]         ║
║                                        ║
║  Confirmer le mot de passe *           ║
║  [___________________________]         ║
║                                        ║
║      [✅ S'inscrire]                   ║
║                                        ║
║ ─────────────────────────────────────  ║
║  Vous avez déjà un compte ?            ║
║  [Se connecter]                        ║
╚════════════════════════════════════════╝
```

### Page de connexion

```
╔════════════════════════════════════════╗
║         🔐 Connexion                   ║
║     Bienvenue sur Spotilike            ║
╠════════════════════════════════════════╣
║                                        ║
║  Email *                               ║
║  [___________________________]         ║
║                                        ║
║  Mot de passe *                        ║
║  [___________________________]         ║
║                                        ║
║      [🚀 Se connecter]                 ║
║                                        ║
║ ─────────────────────────────────────  ║
║  Vous n'avez pas encore de compte ?    ║
║  [Créer un compte]                     ║
╚════════════════════════════════════════╝
```

### Barre de navigation

**Non connecté :**
```
┌────────────────────────────────────────────────────┐
│ 🎧 Spotilike     [🔐 Connexion] [📝 Inscription] │
└────────────────────────────────────────────────────┘
```

**Connecté :**
```
┌────────────────────────────────────────────────────┐
│ 🎧 Spotilike     Bonjour, John 👋  [🚪 Déconnexion]│
└────────────────────────────────────────────────────┘
```

## 🔒 Sécurité

### Points importants

⚠️ **Note de sécurité :** Cette implémentation est une **démonstration éducative**.

Pour une application en production, vous devriez :

1. **Backend sécurisé** :
   - Créer un endpoint `/api/auth/register`
   - Créer un endpoint `/api/auth/login`
   - Hasher les mots de passe (bcrypt)
   - Utiliser des tokens JWT
   - Implémenter des sessions sécurisées

2. **Frontend** :
   - Ne jamais stocker de mots de passe
   - Utiliser HTTPS en production
   - Implémenter un timeout de session
   - Valider toutes les entrées utilisateur

3. **Améliorations suggérées** :
   - Vérification par email
   - Récupération de mot de passe
   - Double authentification (2FA)
   - Limitation des tentatives de connexion

## 🚀 Tester l'authentification

### Étape 1 : Démarrer l'application

```powershell
# Backend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike
npm start

# Frontend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm run dev
```

### Étape 2 : Créer un compte

1. Ouvrir http://localhost:5173
2. Cliquer sur "Inscription"
3. Remplir le formulaire
4. Cliquer sur "S'inscrire"

### Étape 3 : Se connecter

1. Cliquer sur "Connexion"
2. Entrer email et mot de passe
3. Cliquer sur "Se connecter"

### Étape 4 : Vérifier

- Votre nom apparaît dans la navbar
- Vous pouvez naviguer dans l'application
- Le bouton "Déconnexion" est visible

## 🎯 Prochaines améliorations possibles

- [ ] Page de profil utilisateur
- [ ] Modification du profil
- [ ] Avatar personnalisé
- [ ] Favoris/Likes d'albums
- [ ] Playlists personnelles
- [ ] Historique d'écoute
- [ ] Paramètres de compte
- [ ] Mode sombre/clair par utilisateur

## 📚 Ressources

- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Authentication](https://jwt.io/)
- [Sécurité des applications web](https://owasp.org/)

---

🎉 **Votre système d'authentification est maintenant opérationnel !**

Testez-le et personnalisez-le selon vos besoins ! 🚀

