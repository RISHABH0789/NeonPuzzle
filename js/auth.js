// 1. Initialize the Bouncer (Supabase Client)
const SUPABASE_URL = 'https://xgccmigqlasyaoiejail.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_inOd90z8JCPzxKcTjl3Xtw_Qm9PHPjP';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. State Management
window.isLoginMode = true;

// 3. UI Toggle Function
window.toggleAuth = function() {
    const title = document.getElementById('auth-title');
    const confirmGroup = document.getElementById('confirm-group');
    const authBtn = document.getElementById('auth-btn');
    const toggleMsg = document.getElementById('toggle-msg');
    const toggleLink = document.getElementById('toggle-link');
    const confirmInput = document.getElementById('confirm-password');

    window.isLoginMode = !window.isLoginMode;

    if (window.isLoginMode) {
        title.innerText = "LOGIN";
        authBtn.innerText = "ENTER SYSTEM";
        confirmGroup.style.display = "none";
        confirmInput.removeAttribute('required');
        toggleMsg.innerText = "NEW USER?";
        toggleLink.innerText = "CREATE ACCOUNT";
        authBtn.className = "menu-btn neon-cyan-btn";
    } else {
        title.innerText = "SIGN UP";
        authBtn.innerText = "REGISTER";
        confirmGroup.style.display = "block";
        confirmInput.setAttribute('required', 'true');
        toggleMsg.innerText = "HAVE ACCOUNT?";
        toggleLink.innerText = "LOGIN";
        authBtn.className = "menu-btn neon-orange-btn";
    }
};

// 4. Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const cleanedName = usernameInput.toLowerCase().trim();
            
            // --- THE "NYX" PROTECTION SYSTEM ---
            if (cleanedName === 'nyx') {
                if (!window.isLoginMode) {
                    // BLOCK: Someone is trying to CREATE the Nyx account
                    alert("⚠️ ACCESS DENIED: This username is reserved for the System Creator.");
                    return; 
                }
                // ALLOW: If isLoginMode is true, the code continues and lets you log in!
            }

            const email = `${cleanedName}@neonpuzzle.com`;

            try {
                if (window.isLoginMode) {
                    // --- LOGIN PROCESS ---
                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;

                    localStorage.setItem('username', usernameInput);
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.href = "home.html";

                } else {
                    // --- SIGN UP PROCESS ---
                    const confirmPassword = document.getElementById('confirm-password').value;

                    if (password !== confirmPassword) {
                        alert("❌ Passwords do not match!");
                        return;
                    }

                    const { data, error } = await supabaseClient.auth.signUp({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;

                    alert("✅ Account Created! Log in to begin the mission.");
                    window.toggleAuth(); 
                }
            } catch (err) {
                alert("⚠️ Access Denied: " + err.message);
                console.error("Auth Error:", err);
            }
        });
    }
});