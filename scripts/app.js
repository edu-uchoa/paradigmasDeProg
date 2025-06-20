document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const authMessage = document.getElementById('auth-message');
  const protectedContent = document.getElementById('protected-content');
  const authContainer = document.getElementById('auth-container');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userEmail = document.getElementById('user-email');

  // Toggle between login and register forms
  showRegister.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
  });

  showLogin.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
  });

  // Handle login
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Success
              authMessage.textContent = '';
              showProtectedContent(userCredential.user);
          })
          .catch((error) => {
              // Error
              authMessage.textContent = error.message;
          });
  });

  // Handle registration
  registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      if (password !== confirmPassword) {
          authMessage.textContent = 'Passwords do not match';
          return;
      }
      
      auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Success
              authMessage.textContent = '';
              showProtectedContent(userCredential.user);
          })
          .catch((error) => {
              // Error
              authMessage.textContent = error.message;
          });
  });

  // Handle sign out
  signOutBtn.addEventListener('click', function() {
      auth.signOut().then(() => {
          // Sign-out successful
          protectedContent.style.display = 'none';
          authContainer.style.display = 'block';
      }).catch((error) => {
          console.error('Sign out error:', error);
      });
  });

 // Add this to your showProtectedContent function
function showProtectedContent(user) {
  authContainer.style.display = 'none';
  protectedContent.style.display = 'block';
  userEmail.textContent = `${user.email}`;
  
  // Initialize content toggling
  setupContentTabs();
}

// Separate function to handle the tab logic
function setupContentTabs() {
  // Get all buttons and sections
  const buttons = document.querySelectorAll('.content-btn');
  const sections = document.querySelectorAll('.content-section');
  
  // Add click event to each button
  buttons.forEach(btn => {
      btn.addEventListener('click', function() {
          // Remove active class from all buttons
          buttons.forEach(b => b.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Hide all sections
          sections.forEach(section => {
              section.style.display = 'none';
          });
          
          // Show the selected section
          const contentId = this.getAttribute('data-content');
          const activeSection = document.getElementById(contentId);
          if (activeSection) {
              activeSection.style.display = 'block';
          }
      });
  });
  
  // Show the first content by default if no hash in URL
  if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const tabButton = document.querySelector(`.content-btn[data-content="${hash}"]`);
      if (tabButton) tabButton.click();
  } else {
      document.querySelector('.content-btn.active')?.click();
  }
}

  // Check auth state on page load
  auth.onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          showProtectedContent(user);
      } else {
          // User is signed out
          protectedContent.style.display = 'none';
          authContainer.style.display = 'block';
      }
  });
});

document.querySelectorAll('.content-btn').forEach(btn => {
  btn.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.content-btn').forEach(b => {
          b.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Hide all content sections
      document.querySelectorAll('.content-section').forEach(section => {
          section.style.display = 'none';
      });
      
      // Show selected content
      const contentId = this.getAttribute('data-content');
      document.getElementById(contentId).style.display = 'block';
  });
});