import CryptoJS from 'crypto-js';

class AuthManager {
  constructor() {
    this.storageKey = 'tf_auth_session';
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Validate consumer key and secret key
  validateCredentials(consumerKey, secretKey) {
    // Hash the keys for security
    const hashedConsumer = CryptoJS.SHA256(consumerKey).toString();
    const hashedSecret = CryptoJS.SHA256(secretKey).toString();
    
    // Demo credentials (in production, these would be validated against a secure backend)
    const validCredentials = [
      {
        consumer: CryptoJS.SHA256('TF_CONSUMER_2024').toString(),
        secret: CryptoJS.SHA256('TF_SECRET_KEY_FROZEN_DASH').toString(),
        role: 'admin',
        name: 'Administrator'
      },
      {
        consumer: CryptoJS.SHA256('TF_MANAGER_KEY').toString(),
        secret: CryptoJS.SHA256('TF_MANAGER_SECRET').toString(),
        role: 'manager',
        name: 'Manager'
      },
      {
        consumer: CryptoJS.SHA256('TF_EMPLOYEE_KEY').toString(),
        secret: CryptoJS.SHA256('TF_EMPLOYEE_SECRET').toString(),
        role: 'employee',
        name: 'Employee'
      }
    ];

    return validCredentials.find(cred => 
      cred.consumer === hashedConsumer && cred.secret === hashedSecret
    );
  }

  // Login user
  login(consumerKey, secretKey) {
    const user = this.validateCredentials(consumerKey, secretKey);
    
    if (user) {
      const session = {
        user: {
          role: user.role,
          name: user.name,
          loginTime: new Date().toISOString()
        },
        token: this.generateToken(),
        expiresAt: Date.now() + this.sessionTimeout
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(session));
      return { success: true, user: session.user };
    }
    
    return { success: false, message: 'Invalid credentials' };
  }

  // Generate secure token
  generateToken() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return CryptoJS.SHA256(timestamp + random).toString();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    return session && session.expiresAt > Date.now();
  }

  // Get current session
  getSession() {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.storageKey);
    window.location.href = './login.html';
  }

  // Check permissions
  hasPermission(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = { admin: 3, manager: 2, employee: 1 };
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  }

  // Protect page (redirect to login if not authenticated)
  protectPage() {
    if (!this.isAuthenticated()) {
      window.location.href = './login.html';
      return false;
    }
    return true;
  }
}

// Create global auth instance
window.authManager = new AuthManager();

export default AuthManager;