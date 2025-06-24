<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Header Section -->
      <div class="login-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#gradient)"/>
              <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
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
        <svg class="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="resetEmailSent" class="alert alert-success">
        <svg class="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Password reset email sent. Please check your inbox.
      </div>

      <!-- Registration Success Message -->
      <div v-if="registrationSuccess" class="alert alert-success">
        <svg class="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Account created successfully! Please sign in with your credentials.
      </div>

      <!-- Login Form -->
      <form v-if="!isRegistering" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">
            Email Address
          </label>
          <div class="input-wrapper">
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required 
              class="form-input" 
              placeholder="Enter your email"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            Password
          </label>
          <div class="input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password" 
              required 
              class="form-input" 
              placeholder="Enter your password"
            >
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
          <label for="reg-name" class="form-label">
            Full Name
          </label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="reg-name" 
              v-model="registerData.name" 
              required 
              class="form-input" 
              placeholder="Enter your full name"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="reg-email" class="form-label">
            Email Address
          </label>
          <div class="input-wrapper">
            <input 
              type="email" 
              id="reg-email" 
              v-model="registerData.email" 
              required 
              class="form-input" 
              placeholder="Enter your email"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="reg-role" class="form-label">
            Account Type
          </label>
          <div class="input-wrapper">
            <select 
              id="reg-role" 
              v-model="registerData.role" 
              required 
              class="form-select"
            >
              <option value="">Select account type</option>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password" class="form-label">
            Password
          </label>
          <div class="input-wrapper">
            <input 
              :type="showRegPassword ? 'text' : 'password'" 
              id="reg-password" 
              v-model="registerData.password" 
              required 
              class="form-input" 
              placeholder="Create a password"
              minlength="6"
            >
            <button type="button" class="password-toggle" @click="showRegPassword = !showRegPassword">
              <span v-if="!showRegPassword">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
          <p class="password-hint">Password must be at least 6 characters long</p>
        </div>

        <div class="form-group">
          <label for="reg-confirm-password" class="form-label">
            Confirm Password
          </label>
          <div class="input-wrapper">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="reg-confirm-password" 
              v-model="registerData.confirmPassword" 
              required 
              class="form-input" 
              placeholder="Confirm your password"
              :class="{ 'error': passwordMismatch }"
            >
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

const router = useRouter();

// Auth state
const user = ref(null);
const loading = ref(false);
const error = ref(null);
const isAuthenticated = computed(() => user.value !== null);
const isAdmin = computed(() => user.value?.email === 'alvn4407@gmail.com');

// Form states
const isRegistering = ref(false);
const showPassword = ref(false);
const showRegPassword = ref(false);
const showConfirmPassword = ref(false);
const resetEmailSent = ref(false);
const registrationSuccess = ref(false);

// Form data
const formData = ref({
  email: '',
  password: ''
});

const registerData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

// Computed properties
const passwordMismatch = computed(() => {
  return registerData.value.password && 
         registerData.value.confirmPassword && 
         registerData.value.password !== registerData.value.confirmPassword;
});

// Initialize auth state listener
const initAuth = () => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    if (firebaseUser) {
      redirectToDashboard(firebaseUser.role || 'student');
    }
  });
};

// Check if user is already authenticated on component mount
onMounted(() => {
  initAuth();
});

// Methods
const switchToLogin = () => {
  isRegistering.value = false;
  error.value = null;
  resetEmailSent.value = false;
  registrationSuccess.value = false;
};

const switchToRegister = () => {
  isRegistering.value = true;
  error.value = null;
  resetEmailSent.value = false;
  registrationSuccess.value = false;
};

const redirectToDashboard = (userRole) => {
  if (userRole === 'student') {
    router.push('/student-dashboard');
  } else if (userRole === 'admin') {
    router.push('/admin-dashboard');
  } else {
    router.push('/student-dashboard'); // fallback to student dashboard
  }
};

const handleLogin = async () => {
  resetEmailSent.value = false;
  registrationSuccess.value = false;
  loading.value = true;
  error.value = null;
  
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      formData.value.email, 
      formData.value.password
    );
    
    user.value = userCredential.user;
    
    // Special case for admin password reset
    if (formData.value.email === 'alvn4407@gmail.com') {
      error.value = 'Please contact the administrator for password reset.';
      return;
    }

    // Clear form data
    formData.value = { email: '', password: '' };
    
    // Redirect based on role
    redirectToDashboard(registerData.value.role || 'student');
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (passwordMismatch.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (registerData.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters long';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerData.value.email,
      registerData.value.password
    );
    
    user.value = userCredential.user;
    
    // Here you would typically save additional user data (name, role) to your database
    // For now we'll just store it in the user object
    user.value.role = registerData.value.role;
    
    // Store the registered email for convenience
    const registeredEmail = registerData.value.email;
    
    // Clear form
    registerData.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    };

    // Set the registered email in login form for convenience
    formData.value.email = registeredEmail;

    // Show success message
    registrationSuccess.value = true;
    error.value = null;
    
    // Switch to login form after a short delay
    setTimeout(() => {
      isRegistering.value = false;
    }, 1500);
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'An error occurred during registration. Please try again.';
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (!formData.value.email) {
    error.value = 'Please enter your email address first.';
    return;
  }

  // Special handling for admin account
  if (formData.value.email === 'alvn4407@gmail.com') {
    error.value = 'Please contact the administrator for password reset.';
    return;
  }

  try {
    await sendPasswordResetEmail(auth, formData.value.email);
    resetEmailSent.value = true;
    error.value = null;
  } catch (err) {
    console.error('Password reset error:', err);
    error.value = 'An error occurred during password reset. Please try again.';
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  margin-bottom: 10px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.login-header p {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.toggle-buttons {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 30px;
  gap: 4px;
}

.toggle-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #718096;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.toggle-btn:hover:not(.active) {
  color: #4a5568;
}

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 500;
}

.alert-error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.alert-success {
  background: #c6f6d5;
  color: #2f855a;
  border: 1px solid #9ae6b4;
}

.alert-icon {
  flex-shrink: 0;
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

.form-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input,
.form-select {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: #f7fafc;
}

.password-hint {
  font-size: 12px;
  color: #718096;
  margin: 0;
}

.error-text {
  font-size: 12px;
  color: #e53e3e;
  margin: 0;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.forgot-password {
  text-align: center;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .form-input,
  .form-select,
  .btn-primary {
    padding: 14px;
    font-size: 16px;
  }
}
</style>