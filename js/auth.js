// Simple client-side authentication using localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Update UI based on login status
    function updateLoginStatus() {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            if (isLoggedIn()) {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                loginButton.textContent = user.username;
                loginButton.href = 'dashboard.html';
            } else {
                loginButton.textContent = 'Login';
                loginButton.href = 'login.html';
            }
        }
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Store current user in localStorage (except password)
                const { password, ...userWithoutPassword } = user;
                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                
                // Redirect based on user type
                if (user.isAdmin) {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // Show error message
                errorMessage.textContent = 'Invalid username or password';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Validate passwords match
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if username already exists
            if (users.some(u => u.username === username)) {
                errorMessage.textContent = 'Username already exists';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                errorMessage.textContent = 'Email already exists';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                username,
                email,
                password,
                isAdmin: false,
                createdAt: new Date().toISOString()
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login
            const { password: _, ...userWithoutPassword } = newUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }

    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Initial setup - create admin user if none exists
    function setupInitialUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if admin exists
        if (!users.some(u => u.isAdmin)) {
            // Create admin user
            const adminUser = {
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                password: 'adminpassword',
                isAdmin: true,
                createdAt: new Date().toISOString()
            };
            
            // Create regular user
            const regularUser = {
                id: 2,
                username: 'user',
                email: 'user@example.com',
                password: 'password',
                isAdmin: false,
                createdAt: new Date().toISOString()
            };
            
            users.push(adminUser, regularUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Initialize
    setupInitialUsers();
    updateLoginStatus();
});