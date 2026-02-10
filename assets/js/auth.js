/**
 * Authentication System for Woods & Spices Restaurant
 *
 * Handles user registration, login, logout, and session management
 * Uses localStorage for data persistence
 *
 * @author Woods & Spices Development Team
 * @version 1.0.0
 */

// Authentication System
// Handles user login, signup, and session management

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.checkSession();
  }

  // Check session status from LocalStorage
  async checkSession() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const user = localStorage.getItem("currentUser");
    this.currentUser = user ? JSON.parse(user) : null;
    this.updateUI();
  }

  // Register new user
  async signup(name, email, password) {
    return this.mockSignup(name, email, password);
  }

  mockSignup(name, email, password) {
    let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "Email already registered" };
    }
    users.push({ id: Date.now(), name, email, password, role: "user" });
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    return { success: true, message: "Account created successfully!" };
  }

  // Login user
  async login(email, password) {
    return this.mockLogin(email, password);
  }

  mockLogin(email, password) {
    // Admin Mock
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminUser = {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin",
      };
      this.currentUser = adminUser;
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      localStorage.setItem("adminLoggedIn", "true");
      this.updateUI();
      return {
        success: true,
        message: "Admin login successful",
        user: adminUser,
      };
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.updateUI();
      return { success: true, message: "Login successful", user: user };
    }

    return { success: false, message: "Invalid email or password" };
  }

  // Social Login (Google, Apple)
  async socialLogin(provider) {
    // Mock social login - in production, this would integrate with OAuth providers
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    
    // Simulate OAuth flow
    const mockUser = {
      id: Date.now(),
      name: `${providerName} User`,
      email: `user@${provider}.com`,
      role: 'user',
      provider: provider,
      avatar: provider === 'google' 
        ? 'https://ui-avatars.com/api/?name=Google+User&background=db4437&color=fff'
        : 'https://ui-avatars.com/api/?name=Apple+User&background=000&color=fff'
    };

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find(u => u.email === mockUser.email);

    if (!existingUser) {
      // Register new social user
      users.push(mockUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // Log in the user
    this.currentUser = existingUser || mockUser;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.updateUI();
    this.closeModal();

    alert(`Successfully signed in with ${providerName}!`);
    
    return { 
      success: true, 
      message: `${providerName} login successful`, 
      user: this.currentUser 
    };
  }

  // Logout user
  async logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("adminLoggedIn");
    this.updateUI();
    this.showNotification("Logged out successfully");

    if (window.location.pathname.includes("dashboard")) {
      window.location.href = "index.html";
    }
  }

  // Update UI based on auth state
  updateUI() {
    // Remove any existing dashboard link from nav
    const existingDashboardLink = document.querySelector(".dashboard-link");
    if (existingDashboardLink) existingDashboardLink.remove();

    const accountBtn = document.querySelector(".account-btn");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = userDropdown
      ? userDropdown.querySelector('[data-action="logout"]')
      : null;
    const loginBtn = userDropdown
      ? userDropdown.querySelector('[data-action="login"]')
      : null;
    const signupBtn = userDropdown
      ? userDropdown.querySelector('[data-action="signup"]')
      : null;
    const dashboardBtn = userDropdown
      ? userDropdown.querySelector('[data-action="dashboard"]')
      : null;

    if (this.currentUser) {
      const isAdmin = this.currentUser.role === "admin";

      // Dashboard link removed from nav bar

      if (accountBtn) {
        // Create personalized avatar
        const userEmail = this.currentUser.email || '';
        const userName = this.currentUser.name || '';
        const userAvatar = this.currentUser.avatar || null;
        
        // Get first letter from name or email
        const firstLetter = (userName.charAt(0) || userEmail.charAt(0) || 'U').toUpperCase();
        
        if (userAvatar) {
          // If user has avatar (from social login), show it
          accountBtn.innerHTML = `<img src="${userAvatar}" alt="User avatar" class="user-avatar-img">`;
        } else {
          // Show first letter in a circle
          accountBtn.innerHTML = `<span class="user-avatar-letter">${firstLetter}</span>`;
        }
        
        accountBtn.setAttribute(
          "aria-label",
          `${isAdmin ? "Admin" : "User"} account`,
        );
        accountBtn.onclick = () => this.toggleUserMenu();
      }

      if (logoutBtn) logoutBtn.style.display = "block";
      if (dashboardBtn) {
        dashboardBtn.style.display = "block";
        // Update dashboard button destination logic relies on click listener
      }
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";
    } else {
      // User is logged out
      if (accountBtn) {
        accountBtn.innerHTML =
          '<i class="fa-solid fa-user" aria-hidden="true"></i>';
        accountBtn.setAttribute("aria-label", "User account");
        accountBtn.onclick = () => this.toggleUserMenu();
      }
      if (logoutBtn) logoutBtn.style.display = "none";
      if (dashboardBtn) dashboardBtn.style.display = "none";
      if (loginBtn) loginBtn.style.display = "block";
      if (signupBtn) signupBtn.style.display = "block";
    }
  }

  // Toggle user menu dropdown
  toggleUserMenu() {
    const dropdown = document.querySelector(".user-dropdown");
    if (dropdown) {
      const isShowing = dropdown.classList.contains("show");
      dropdown.classList.toggle("show");
      
      // If showing dropdown, add click-outside listener
      if (!isShowing) {
        setTimeout(() => {
          document.addEventListener('click', this.closeDropdownOutside.bind(this), { once: true });
        }, 0);
      }
    }
  }

  // Close dropdown when clicking outside
  closeDropdownOutside(event) {
    const dropdown = document.querySelector(".user-dropdown");
    const accountBtn = document.getElementById("accountBtn");
    
    if (dropdown && !dropdown.contains(event.target) && event.target !== accountBtn && !accountBtn.contains(event.target)) {
      dropdown.classList.remove("show");
    } else if (dropdown && dropdown.classList.contains("show")) {
      // Re-add listener if dropdown is still showing
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdownOutside.bind(this), { once: true });
      }, 0);
    }
  }

  // Open login modal
  openLoginModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.style.display = "flex";
      this.showLoginForm();
    }
  }

  // Open signup modal
  openSignupModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.style.display = "flex";
      this.showSignupForm();
    }
  }

  // Close modal
  closeModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.style.display = "none";
      this.clearForms();
    }
  }

  // Show login form
  showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
  }

  // Show signup form
  showSignupForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
  }

  // Clear form inputs
  clearForms() {
    document
      .querySelectorAll(".auth-form input")
      .forEach((input) => (input.value = ""));
    document
      .querySelectorAll(".error-message")
      .forEach((msg) => (msg.textContent = ""));
  }

  // Handle login form submission
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorMsg = document.getElementById("loginError");

    const result = await this.login(email, password);

    if (result.success) {
      this.closeModal();
      this.showNotification(result.message);
      // Redirect based on role
      if (result.user.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    } else {
      errorMsg.textContent = result.message;
    }
  }

  // Handle signup form submission
  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const errorMsg = document.getElementById("signupError");

    const result = await this.signup(name, email, password);

    if (result.success) {
      this.showNotification(result.message);
      this.showLoginForm();
      errorMsg.textContent = "";
    } else {
      errorMsg.textContent = result.message;
    }
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "auth-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize auth system
const auth = new AuthSystem();

// Setup event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  auth.updateUI();

  // Update UI when page is shown (for back button navigation)
  window.addEventListener("pageshow", () => auth.updateUI());

  // Close modal when clicking outside
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        auth.closeModal();
      }
    });
  }

  // Login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => auth.handleLogin(e));
  }

  // Signup form submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => auth.handleSignup(e));
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".user-dropdown");
    const accountBtn = document.querySelector(".account-btn");

    if (
      dropdown &&
      !accountBtn.contains(e.target) &&
      !dropdown.contains(e.target)
    ) {
      dropdown.classList.remove("show");
    }
  });

  // Handle logout button click using event delegation
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="logout"]')) {
      e.preventDefault();
      auth.logout();
    }
  });

  // Handle login button click using event delegation
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="login"]')) {
      e.preventDefault();
      auth.openLoginModal();
    }
  });

  // Handle signup button click using event delegation
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="signup"]')) {
      e.preventDefault();
      auth.openSignupModal();
    }
  });

  // Handle dashboard button click using event delegation
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="dashboard"]')) {
      e.preventDefault();
      // Check current user state
      if (auth.currentUser) {
        if (auth.currentUser.role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "user-dashboard.html";
        }
      }
    }
  });

  // Handle close modal button
  document.addEventListener("click", (e) => {
    if (e.target.closest(".auth-close")) {
      e.preventDefault();
      auth.closeModal();
    }
  });

  // Password visibility toggle
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-password")) {
      const targetId = e.target.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);

      if (passwordInput) {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          e.target.classList.remove("fa-eye-slash");
          e.target.classList.add("fa-eye");
        } else {
          passwordInput.type = "password";
          e.target.classList.remove("fa-eye");
          e.target.classList.add("fa-eye-slash");
        }
      }
    }
  });

  // Validate confirm password on signup
  const signupFormModal = document.getElementById("signupForm");
  if (signupFormModal) {
    const originalSubmitHandler = signupFormModal.onsubmit;
    signupFormModal.onsubmit = async (e) => {
      e.preventDefault();

      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword");

      if (confirmPassword && password !== confirmPassword.value) {
        const errorMsg = document.getElementById("signupError");
        if (errorMsg) {
          errorMsg.textContent = "Passwords do not match!";
        }
        return false;
      }

      // Call original handler if passwords match
      if (originalSubmitHandler) {
        return originalSubmitHandler.call(signupFormModal, e);
      }
    };
  }
});
