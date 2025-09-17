<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Header Section -->
      <div class="login-header">
        <div class="logo-section">
          <img src="@/assets/primeno2.jpeg" alt="App Logo" class="app-logo-img" />
          <h1>{{ isRegistering ? 'Create Account' : 'Welcome Back' }}</h1>
          <p>{{ isRegistering ? 'Join our platform today' : 'Sign in to your account' }}</p>
        </div>
      </div>

      <!-- Toggle Buttons -->
      <div class="toggle-buttons">
        <button
          type="button"
          :class="['toggle-btn', { active: !isRegistering }]"
          @click="switchToLogin"
        >
          Sign In
        </button>
        <button
          type="button"
          :class="['toggle-btn', { active: isRegistering }]"
          @click="switchToRegister"
        >
          Sign Up
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-error">
        <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.953 2C6.465 2 2 6.48 2 12s4.465 10 9.953 10C17.442 22 22 17.52 22 12S17.442 2 11.953 2zm-.235 15.698L11.758 13.91l-.005.006A.75.75 0 0110.74 13.5l-1.002.576.002-.003.003-.002a.75.75 0 01-.001-.001l-.004.002-1.004-.578a.75.75 0 01-.253-1.002.75.75 0 011.001-.253l.632.365.372-.644A.75.75 0 0110.5 11l.5.866.5-.866a.75.75 0 01.75-.13.75.75 0 01.129.75l-.365.632.644.372a.75.75 0 01.13.75.75.75 0 01-.75.129l-.5-.866-.5.866a.75.75 0 01-1.001.253zM12 7a1 1 0 100 2 1 1 0 000-2z"/>
        </svg>
        {{ error }}
      </div>

      <!-- Success Messages -->
      <div v-if="resetEmailSent" class="alert alert-success">
        <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.997 13.921l-3.25-3.25a.75.75 0 10-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l5.5-5.5a.75.75 0 10-1.06-1.06l-4.44 4.44z"/>
        </svg>
        Password reset email sent. Please check your inbox.
      </div>

      <div v-if="registrationSuccess" class="alert alert-success">
        <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.997 13.921l-3.25-3.25a.75.75 0 10-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l5.5-5.5a.75.75 0 10-1.06-1.06l-4.44 4.44z"/>
        </svg>
        Account created successfully! Please sign in with your credentials.
      </div>

      <!-- Login Form -->
      <form v-if="!isRegistering" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-wrapper">
            <input type="email" id="email" v-model="formData.email" required class="form-input" placeholder="Enter your email">
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" required class="form-input" placeholder="Enter your password">
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <span v-if="!showPassword">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn-primary">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <div class="forgot-password">
            <a href="#" @click.prevent="resetPassword" class="forgot-link">Forgot your password?</a>
          </div>
        </div>
      </form>

      <!-- Registration Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="reg-name" class="form-label">Full Name</label>
          <div class="input-wrapper">
            <input type="text" id="reg-name" v-model="registerData.name" required class="form-input" placeholder="Enter your full name">
          </div>
        </div>

        <div class="form-group">
          <label for="reg-email" class="form-label">Email Address</label>
          <div class="input-wrapper">
            <input type="email" id="reg-email" v-model="registerData.email" required class="form-input" placeholder="Enter your email">
          </div>
        </div>

        <div class="form-group">
          <label for="reg-role" class="form-label">Account Type</label>
          <div class="input-wrapper">
            <select id="reg-role" v-model="registerData.role" required class="form-select">
              <option value="">Select account type</option>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password" class="form-label">Password</label>
          <div class="input-wrapper">
            <input :type="showRegPassword ? 'text' : 'password'" id="reg-password" v-model="registerData.password" required class="form-input" placeholder="Create a password" minlength="6">
            <button type="button" class="password-toggle" @click="showRegPassword = !showRegPassword">
              <span v-if="!showRegPassword">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
          <p class="password-hint">Password must be at least 6 characters long</p>
        </div>

        <div class="form-group">
          <label for="reg-confirm-password" class="form-label">Confirm Password</label>
          <div class="input-wrapper">
            <input :type="showConfirmPassword ? 'text' : 'password'" id="reg-confirm-password" v-model="registerData.confirmPassword" required class="form-input" placeholder="Confirm your password" :class="{ 'error': passwordMismatch }">
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <span v-if="!showConfirmPassword">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
          <p v-if="passwordMismatch" class="error-text">Passwords do not match</p>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading || passwordMismatch" class="btn-primary">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const router = useRouter();

const user = ref(null);
const loading = ref(false);
const error = ref(null);
const isRegistering = ref(false);
const showPassword = ref(false);
const showRegPassword = ref(false);
const showConfirmPassword = ref(false);
const resetEmailSent = ref(false);
const registrationSuccess = ref(false);

const formData = ref({ email: '', password: '' });
const registerData = ref({ name: '', email: '', password: '', confirmPassword: '', role: '' });

const passwordMismatch = computed(() => registerData.value.password && registerData.value.confirmPassword && registerData.value.password !== registerData.value.confirmPassword);

const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().role : 'student';
  } catch (err) {
    console.error(err);
    return 'student';
  }
};

const redirectToDashboard = (role) => {
  router.push(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
};

let unsubscribe = null;

const initAuth = () => {
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
      const role = await getUserRole(firebaseUser.uid);
      localStorage.setItem('user', JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }));
      localStorage.setItem('role', role);
      if (router.currentRoute.value.path === '/login') redirectToDashboard(role);
    } else {
      user.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  });
};

onMounted(initAuth);
onUnmounted(() => { if (unsubscribe) unsubscribe(); });

const switchToLogin = () => { isRegistering.value = false; error.value = null; resetEmailSent.value = false; registrationSuccess.value = false; };
const switchToRegister = () => { isRegistering.value = true; error.value = null; resetEmailSent.value = false; registrationSuccess.value = false; };

const handleLogin = async () => {
  resetEmailSent.value = false;
  registrationSuccess.value = false;
  loading.value = true;
  error.value = null;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.value.email, formData.value.password);
    const role = await getUserRole(userCredential.user.uid);
    localStorage.setItem('user', JSON.stringify({ uid: userCredential.user.uid, email: userCredential.user.email }));
    localStorage.setItem('role', role);
    formData.value = { email: '', password: '' };
    redirectToDashboard(role);
  } catch (err) {
    error.value = 'Invalid email or password. Please try again.';
  } finally { loading.value = false; }
};

const handleRegister = async () => {
  if (passwordMismatch.value) { error.value = 'Passwords do not match'; return; }
  if (registerData.value.password.length < 6) { error.value = 'Password must be at least 6 characters long'; return; }
  loading.value = true; error.value = null;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, registerData.value.email, registerData.value.password);
    await setDoc(doc(db, "users", userCredential.user.uid), { name: registerData.value.name, email: registerData.value.email, role: registerData.value.role, createdAt: new Date() });
    const registeredEmail = registerData.value.email;
    registerData.value = { name: '', email: '', password: '', confirmPassword: '', role: '' };
    formData.value.email = registeredEmail;
    registrationSuccess.value = true;
    await signOut(auth);
    setTimeout(() => { isRegistering.value = false; registrationSuccess.value = false; }, 2000);
  } catch (err) {
    error.value = err.code === 'auth/email-already-in-use' ? 'This email is already registered.' : 'An error occurred during registration.';
  } finally { loading.value = false; }
};

const resetPassword = async () => {
  if (!formData.value.email) { error.value = 'Please enter your email address first.'; return; }
  if (formData.value.email === 'kapkechui72@gmail.com') { error.value = 'Please contact the administrator for password reset.'; return; }
  try { await sendPasswordResetEmail(auth, formData.value.email); resetEmailSent.value = true; error.value = null; } 
  catch (err) { error.value = 'An error occurred during password reset. Please try again.'; }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #e0efff 0%, #d0e7ff 100%);
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: fadeInScale 0.5s ease-out;
  border: 1px solid #e0efff;
}

@keyframes fadeInScale { from { opacity:0; transform: translateY(20px) scale(0.98);} to {opacity:1; transform:translateY(0) scale(1);} }

.login-header { text-align:center; margin-bottom:30px; }
.logo-section { display:flex; flex-direction:column; align-items:center; gap:10px; }
.app-logo-img { width: 100px; height: 100px; border-radius: 12px; object-fit: cover; }
.login-header h1 { font-size:2em; font-weight:700; color:#2c3e50; margin:0; }
.login-header p { color:#6a7d8e; font-size:1.05em; margin:5px 0 0; }

.toggle-buttons { display:flex; background:#f0f4f8; border-radius:12px; padding:6px; margin-bottom:30px; gap:6px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); }
.toggle-btn { flex:1; padding:12px 20px; border:none; border-radius:10px; background:transparent; color:#6a7d8e; font-weight:500; cursor:pointer; transition:all 0.3s ease; font-size:1.05em; }
.toggle-btn.active { background:white; color:#007bff; box-shadow:0 2px 8px rgba(0,123,255,0.15); font-weight:600; }
.toggle-btn:hover:not(.active) { color:#4a5568; background-color:#e8ecef; }

.alert { display:flex; align-items:center; gap:12px; padding:15px; border-radius:10px; margin-bottom:20px; font-weight:500; font-size:0.95em; }
.alert-icon { flex-shrink:0; width:22px; height:22px; }
.alert-error { background:#ffebeb; color:#cc0000; border:1px solid #ffcccc; }
.alert-success { background:#ebffed; color:#008000; border:1px solid #ccffcc; }

.auth-form { display:flex; flex-direction:column; gap:20px; }
.form-group { display:flex; flex-direction:column; gap:10px; }
.form-label { font-weight:600; color:#2c3e50; font-size:0.95em; }
.input-wrapper { position:relative; display:flex; align-items:center; }
.form-input, .form-select { width:100%; padding:14px; border:1px solid #d0dce7; border-radius:10px; font-size:1em; background:white; color:#333; transition: all 0.3s ease; }
.form-input:focus, .form-select:focus { outline:none; border-color:#007bff; box-shadow:0 0 0 3px rgba(0,123,255,0.15); }
.form-input.error { border-color:#e53e3e; box-shadow:0 0 0 3px rgba(229,62,62,0.1); }
.form-select { cursor:pointer; appearance:none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e"); background-position:right 12px center; background-repeat:no-repeat; background-size:16px; padding-right:40px; }

.password-toggle { position:absolute; right:12px; background:none; border:none; color:#007bff; font-weight:500; cursor:pointer; font-size:0.9em; padding:4px 8px; border-radius:6px; transition: background-color 0.2s ease; }
.password-toggle:hover { background:#f0f4f8; }

.password-hint, .error-text { font-size:0.85em; color:#7a8c9e; margin:5px 0 0; }
.error-text { color:#e53e3e; font-weight:500; }

.form-actions { display:flex; flex-direction:column; gap:15px; margin-top:10px; }
.btn-primary { width:100%; padding:16px; background:linear-gradient(135deg,#007bff 0%,#0056b3 100%); color:white; border:none; border-radius:10px; font-size:1.1em; font-weight:600; cursor:pointer; transition:all 0.3s ease; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 10px rgba(0,123,255,0.2); }
.btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,123,255,0.35); }
.btn-primary:disabled { opacity:0.7; cursor:not-allowed; transform:none; box-shadow:none; }

.loading-spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid white; border-radius:50%; animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.forgot-password { text-align:center; }
.forgot-link { color:#007bff; text-decoration:none; font-weight:500; font-size:0.9em; transition: color 0.3s ease, text-decoration 0.3s ease; }
.forgot-link:hover { color:#0056b3; text-decoration:underline; }

@media (max-width:480px) {
  .login-container { padding:30px 20px; margin:10px; }
  .login-header h1 { font-size:2em; }
  .toggle-buttons { flex-direction:column; }
  .toggle-btn { padding:10px 15px; }
  .form-input, .form-select, .btn-primary { padding:12px; font-size:1em; }
  .password-toggle { right:8px; }
}
</style>
