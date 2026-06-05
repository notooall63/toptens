// State Tracker
const state = {
    currentView: 'auth-view',
    viewHistory: [],
    user: null
};

// DOM Cache
const views = {
    auth: document.getElementById('auth-view'),
    categories: document.getElementById('categories-view'),
    items: document.getElementById('items-view'),
    friends: document.getElementById('friends-view')
};

const backBtn = document.getElementById('back-btn');
const menuBtn = document.getElementById('menu-btn');
const settingsDrawer = document.getElementById('settings-drawer');
const closeDrawerBtn = document.getElementById('close-drawer-btn');

// View Router Engine
function navigateTo(viewId) {
    if (state.currentView === viewId) return;
    
    state.viewHistory.push(state.currentView);
    switchView(viewId);
}

function goBack() {
    if (state.viewHistory.length === 0) return;
    const previousView = state.viewHistory.pop();
    switchView(previousView);
}

function switchView(viewId) {
    // Hide all views
    Object.values(views).forEach(v => v.classList.add('hidden'));
    
    // Show Target View
    if (views[viewId.replace('-view', '')]) {
        views[viewId.replace('-view', '')].classList.remove('hidden');
    } else {
        document.getElementById(viewId).classList.remove('hidden');
    }
    
    state.currentView = viewId;

    // Show/Hide Back Button conditions
    // Hidden on auth or when at base landing view (categories) with no deep history
    if (viewId === 'auth-view' || viewId === 'categories-view') {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }
    
    // Close drawer on navigation change
    settingsDrawer.classList.add('hidden');
}

// Navigation Event Wire-up
backBtn.addEventListener('click', goBack);
menuBtn.addEventListener('click', () => settingsDrawer.classList.remove('hidden'));
closeDrawerBtn.addEventListener('click', () => settingsDrawer.classList.add('hidden'));

// Drawer Internal Navigation Wire-up
document.getElementById('nav-categories-btn').addEventListener('click', () => navigateTo('categories-view'));
document.getElementById('nav-friends-btn').addEventListener('click', () => navigateTo('friends-view'));

// Simulated Auth Flows
document.getElementById('login-btn').addEventListener('click', () => {
    state.user = { email: document.getElementById('auth-email').value };
    navigateTo('categories-view');
});

document.getElementById('signup-btn').addEventListener('click', () => {
    const msg = document.getElementById('auth-msg');
    msg.textContent = "INITIALIZATION LINK COMPILED. (CHECK SIMULATED BACKEND MAIL STACK)";
    // Note: True outbound mail execution requires Cloudflare Worker integration with a transactional mail provider.
});

// Client Avatar Processing (Local Sandbox Hook)
const avatarUpload = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('avatar-preview');
const changeAvatarBtn = document.getElementById('change-avatar-btn');

changeAvatarBtn.addEventListener('click', () => avatarUpload.click());

avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            avatarPreview.style.backgroundImage = `url(${event.target.result})`;
            avatarPreview.style.borderStyle = 'solid';
        };
        reader.readAsDataURL(file);
        // Note: Actual saving persistent to the user profile requires an R2 object storage signing pipeline on the Worker.
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    state.user = null;
    state.viewHistory = [];
    switchView('auth-view');
});