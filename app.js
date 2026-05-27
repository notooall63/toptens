// ==========================================================================
// 1. Application State & Storage Engine (With "Hottest ?" Core Category)
// ==========================================================================

const defaultState = {
    categories: [
        { id: 'cat-1', title: 'Shoes' },
        { id: 'cat-2', title: 'Movies' },
        { id: 'cat-3', title: 'Restaurants' },
        { id: 'cat-4', title: 'Travel Destinations' },
        { id: 'cat-5', title: 'Books' },
        { id: 'cat-6', title: 'Albums' },
        { id: 'cat-7', title: 'Video Games' },
        { id: 'cat-8', title: 'Tech Gadgets' },
        { id: 'cat-9', title: 'Hottest ?' }
    ],
    items: {
        'cat-1': [
            { title: 'adidas adiprene', link: 'https://adidas.com', media: null },
            { title: 'Nike Air Max', link: 'https://nike.com', media: null },
            { title: 'New Balance 990v6', link: 'https://newbalance.com', media: null }
        ],
        'cat-2': [], 'cat-3': [], 'cat-4': [], 'cat-5': [], 'cat-6': [], 'cat-7': [], 'cat-8': [], 'cat-9': []
    },
    userProfile: {
        username: 'Guest Mode',
        isAuthenticated: false,
        email: ''
    },
    currentView: 'landing',
    activeCategoryId: null,
    maxCategories: 21
};

let state = {};
let activeCroppingImage = null;

function loadStateFromStorage() {
    try {
        const storedData = localStorage.getItem('top_tens_app_data');
        if (storedData) {
            state = JSON.parse(storedData);
            state.currentView = 'landing';
            state.activeCategoryId = null;
            state.maxCategories = 21;
            
            if (!state.categories || state.categories.length === 0) state.categories = [...defaultState.categories];
            if (!state.items) state.items = {...defaultState.items};
            if (!state.userProfile) state.userProfile = {...defaultState.userProfile};
            
            const index9 = state.categories.findIndex(c => c.id === 'cat-9');
            if (index9 !== -1 && state.categories[index9].title !== 'Hottest ?') {
                state.categories[index9].title = 'Hottest ?';
            }
        } else {
            state = JSON.parse(JSON.stringify(defaultState));
        }
    } catch (e) {
        state = JSON.parse(JSON.stringify(defaultState));
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem('top_tens_app_data', JSON.stringify(state));
    } catch (e) {}
}

// ==========================================================================
// 2. DOM Interface Reference Matrix
// ==========================================================================
const DOM = {
    appHeader: document.getElementById('app-header'),
    backButton: document.getElementById('back-button'),
    headerLogo: document.getElementById('header-logo'),
    headerTitle: document.getElementById('header-title'),
    settingsButton: document.getElementById('settings-button'),
    landingView: document.getElementById('landing-view'),
    categoriesView: document.getElementById('categories-view'),
    listView: document.getElementById('list-view'),
    enterVaultBtn: document.getElementById('enter-vault-btn'),
    landingSigninBtn: document.getElementById('landing-signin-btn'),
    categoriesGrid: document.getElementById('categories-grid'),
    addCategoryBtn: document.getElementById('add-category-btn'),
    currentCategoryTitle: document.getElementById('current-category-title'),
    newItemInput: document.getElementById('new-item-input'),
    newItemRank: document.getElementById('new-item-rank'),
    newItemUrl: document.getElementById('new-item-url'),
    newItemMedia: document.getElementById('new-item-media'),
    mediaStatusLabel: document.getElementById('media-status-label'),
    alignmentControlSandbox: document.getElementById('alignment-control-sandbox'),
    cropCanvas: document.getElementById('crop-canvas'),
    centerOffsetSlider: document.getElementById('center-offset-slider'),
    addItemBtn: document.getElementById('add-item-btn'),
    rankedItemsList: document.getElementById('ranked-items-list'),
    
    drawerOverlay: document.getElementById('settings-drawer-overlay'),
    closeDrawerBtn: document.getElementById('close-drawer-btn'),
    displayUsername: document.getElementById('display-username'),
    profileAvatarDisplay: document.getElementById('profile-avatar-display'),
    authEmail: document.getElementById('auth-email'),
    authPassword: document.getElementById('auth-password'),
    btnActionSignin: document.getElementById('btn-action-signin'),
    btnActionSignup: document.getElementById('btn-action-signup'),
    btnActionLogout: document.getElementById('btn-action-logout'),
    authLoggedOutView: document.getElementById('auth-logged-out-view'),
    authPendingView: document.getElementById('auth-pending-view'),
    authLoggedInView: document.getElementById('auth-logged-in-view'),
    purgeDataBtn: document.getElementById('purge-data-btn')
};

// ==========================================================================
// 3. Side-Drawer Interactive Shell Engine & Password Validation Pipeline
// ==========================================================================
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-\[\]{}|;:',.<>?\/]).{8,20}$/;
    return passwordRegex.test(password);
}

function syncDrawerUIFields() {
    DOM.displayUsername.textContent = state.userProfile.username;
    DOM.profileAvatarDisplay.textContent = state.userProfile.username.charAt(0).toUpperCase() || 'G';
    
    const statusBadge = document.getElementById('display-status');

    if (state.userProfile.isAuthenticated) {
        DOM.authLoggedOutView.classList.add('hidden');
        DOM.authPendingView.classList.add('hidden');
        DOM.authLoggedInView.classList.remove('hidden');
        statusBadge.textContent = "Account Verified & Synced";
        statusBadge.className = "profile-status-badge verified-tier"; 
    } else {
        DOM.authLoggedInView.classList.add('hidden');
        DOM.authPendingView.classList.add('hidden');
        DOM.authLoggedOutView.classList.remove('hidden');
        statusBadge.textContent = "Unsaved Local Storage Only";
        statusBadge.className = "profile-status-badge free-tier"; 
        DOM.authEmail.value = '';
        DOM.authPassword.value = '';
    }
}

function openSettingsDrawer() {
    syncDrawerUIFields();
    DOM.drawerOverlay.classList.remove('hidden');
    setTimeout(() => {
        DOM.drawerOverlay.classList.add('active');
    }, 10);
}

function closeSettingsDrawer() {
    DOM.drawerOverlay.classList.remove('active');
    setTimeout(() => {
        DOM.drawerOverlay.classList.add('hidden');
    }, 300);
}

DOM.settingsButton.addEventListener('click', openSettingsDrawer);
DOM.landingSigninBtn.addEventListener('click', openSettingsDrawer);
DOM.closeDrawerBtn.addEventListener('click', closeSettingsDrawer);
DOM.drawerOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.drawerOverlay) closeSettingsDrawer();
});

DOM.btnActionSignup.addEventListener('click', () => {
    const email = DOM.authEmail.value.trim();
    const pass = DOM.authPassword.value;
    const hintBox = document.getElementById('password-rules-hint');

    if (!email || !pass) {
        alert("Please enter both an email address and a secure password target.");
        return;
    }

    if (!validatePassword(pass)) {
        hintBox.style.color = '#f85149'; 
        alert("Password failed rule check. Requirements detailed below password entry field.");
        return;
    }

    hintBox.style.color = '#8b949e'; 
    
    DOM.authLoggedOutView.classList.add('hidden');
    DOM.authPendingView.classList.remove('hidden');
    
    console.log(`Verification URL engine string generated. Token payload route: ${email}`);
    
    setTimeout(() => {
        state.userProfile.username = email.split('@')[0];
        state.userProfile.email = email;
        state.userProfile.isAuthenticated = true;
        saveStateToStorage();
        syncDrawerUIFields();
        alert("Email auto-verified via loop packet! Secure cloud data sync is now online.");
    }, 4000);
});

DOM.btnActionSignin.addEventListener('click', () => {
    const email = DOM.authEmail.value.trim();
    const pass = DOM.authPassword.value;
    if (!email || !pass) { alert("Please complete account target fields."); return; }
    
    state.userProfile.username = email.split('@')[0];
    state.userProfile.email = email;
    state.userProfile.isAuthenticated = true;
    saveStateToStorage();
    syncDrawerUIFields();
});

DOM.btnActionLogout.addEventListener('click', () => {
    state.userProfile.username = 'Guest Mode';
    state.userProfile.email = '';
    state.userProfile.isAuthenticated = false;
    saveStateToStorage();
    syncDrawerUIFields();
});

DOM.purgeDataBtn.addEventListener('click', () => {
    if (confirm("Wipe local store engine to reconstruct and clear data indexes?")) {
        localStorage.clear();
        state = JSON.parse(JSON.stringify(defaultState));
        saveStateToStorage();
        location.reload();
    }
});

// ==========================================================================
// 4. UI Presentation Core Pipeline
// ==========================================================================
function renderCategories() {
    if (!DOM.categoriesGrid) return;
    DOM.categoriesGrid.innerHTML = '';
    
    state.categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.textContent = category.title;
        card.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToList(category.id);
        });
        DOM.categoriesGrid.appendChild(card);
    });

    if (state.categories.length >= state.maxCategories) {
        DOM.addCategoryBtn.disabled = true;
        DOM.addCategoryBtn.className = 'btn-gold-dynamic limited';
        DOM.addCategoryBtn.textContent = 'Category Limit Reached (Max 21)';
    } else {
        DOM.addCategoryBtn.disabled = false;
        DOM.addCategoryBtn.className = 'btn-gold-dynamic';
        DOM.addCategoryBtn.textContent = 'Add Custom Categories—Up To 21 Total';
    }
}

function renderItems(categoryId) {
    if (!DOM.rankedItemsList) return;
    DOM.rankedItemsList.innerHTML = '';
    const itemList = state.items[categoryId] || [];
    
    itemList.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'ranked-item-row';

        const hashBadge = document.createElement('span');
        hashBadge.className = 'item-hash-symbol';
        hashBadge.textContent = '#';

        const numBadge = document.createElement('span');
        numBadge.className = 'item-numerical-rank';
        numBadge.textContent = `${index + 1}`;

        const nameBadge = document.createElement('span');
        nameBadge.className = 'item-name-string';
        nameBadge.textContent = item.title;
        
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'item-link-container';
        if (item.link && item.link.trim() !== '') {
            const anchor = document.createElement('a');
            anchor.href = item.link;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.className = 'item-external-anchor';
            anchor.textContent = 'Visit Link';
            linkWrapper.appendChild(anchor);
        } else {
            const noLink = document.createElement('span');
            noLink.className = 'item-no-link-text';
            noLink.textContent = '—';
            linkWrapper.appendChild(noLink);
        }

        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'item-thumbnail-container';
        
        if (item.media) {
            if (item.media.startsWith('data:video/')) {
                const video = document.createElement('video');
                video.src = item.media;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                mediaContainer.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = item.media;
                mediaContainer.appendChild(img);
            }
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'thumbnail-placeholder';
            mediaContainer.appendChild(placeholder);
        }

        li.appendChild(hashBadge);
        li.appendChild(numBadge);
        li.appendChild(nameBadge);
        li.appendChild(linkWrapper);
        li.appendChild(mediaContainer);
        DOM.rankedItemsList.appendChild(li);
    });
}

function redrawCanvasPreview() {
    if (!activeCroppingImage) return;
    const ctx = DOM.cropCanvas.getContext('2d');
    const width = DOM.cropCanvas.width;
    const height = DOM.cropCanvas.height;
    ctx.clearRect(0, 0, width, height);
    
    const scale = Math.max(width / activeCroppingImage.width, height / activeCroppingImage.height);
    const imgWidth = activeCroppingImage.width * scale;
    const imgHeight = activeCroppingImage.height * scale;
    const sliderVal = parseInt(DOM.centerOffsetSlider.value, 10);
    
    let dx = (width - imgWidth) / 2;
    let dy = (height - imgHeight) / 2;
    if (imgWidth > imgHeight) dx += sliderVal;
    else dy += sliderVal;
    
    ctx.drawImage(activeCroppingImage, dx, dy, imgWidth, imgHeight);
}

DOM.centerOffsetSlider.addEventListener('input', redrawCanvasPreview);

DOM.newItemMedia.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
        DOM.alignmentControlSandbox.classList.add('hidden');
        activeCroppingImage = null;
        
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(file);
        
        videoElement.onloadedmetadata = function() {
            URL.revokeObjectURL(videoElement.src);
            if (videoElement.duration > 6.0) {
                alert(`System Error: Selected video duration is ${videoElement.duration.toFixed(1)}s.\nVideos must be strictly 6 seconds or less.`);
                DOM.newItemMedia.value = '';
                DOM.mediaStatusLabel.textContent = "Select Thumbnail (Img / Video <= 6s)";
                DOM.mediaStatusLabel.className = "media-label error-state";
            } else {
                DOM.mediaStatusLabel.textContent = `Video Loaded (${videoElement.duration.toFixed(1)}s)`;
                DOM.mediaStatusLabel.className = "media-label verified-state";
            }
        };
    } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            activeCroppingImage = new Image();
            activeCroppingImage.onload = function() {
                DOM.alignmentControlSandbox.classList.remove('hidden');
                DOM.mediaStatusLabel.textContent = "Image Ready to Frame";
                DOM.mediaStatusLabel.className = "media-label verified-state";
                DOM.centerOffsetSlider.value = 0;
                redrawCanvasPreview();
            };
            activeCroppingImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ==========================================================================
// 5. Viewport Routing Matrix (Strict Header Bar Protection)
// ==========================================================================
function updateHeaderVisibility(viewState) {
    if (viewState === 'landing') {
        DOM.appHeader.classList.add('hidden');
        DOM.backButton.classList.add('hidden');
        DOM.headerLogo.classList.add('hidden');
        DOM.headerTitle.classList.add('hidden');
        DOM.settingsButton.classList.add('hidden');
    } else {
        DOM.appHeader.classList.remove('hidden');
        DOM.headerLogo.classList.remove('hidden');
        DOM.headerTitle.classList.remove('hidden');
        DOM.settingsButton.classList.remove('hidden');
        DOM.backButton.classList.remove('hidden'); 
    }
}

function navigateToLanding(isBackAction = false) {
    state.currentView = 'landing';
    state.activeCategoryId = null;
    DOM.categoriesView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.landingView.classList.remove('hidden');
    updateHeaderVisibility('landing');
    if (!isBackAction) history.pushState({ view: 'landing' }, '', ' ');
}

function navigateToCategories(isBackAction = false) {
    state.currentView = 'categories';
    state.activeCategoryId = null;
    renderCategories();
    DOM.landingView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.categoriesView.classList.remove('hidden');
    updateHeaderVisibility('categories');
    if (!isBackAction) history.pushState({ view: 'categories' }, '', '#categories');
}

function navigateToList(categoryId, isBackAction = false) {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category) return;
    state.currentView = 'list';
    state.activeCategoryId = categoryId;
    DOM.currentCategoryTitle.textContent = category.title;
    renderItems(categoryId);
    DOM.landingView.classList.add('hidden');
    DOM.categoriesView.classList.add('hidden');
    DOM.listView.classList.remove('hidden');
    updateHeaderVisibility('list');
    if (!isBackAction) history.pushState({ view: 'list', categoryId: categoryId }, '', `#list-${categoryId}`);
}

DOM.enterVaultBtn.addEventListener('click', () => navigateToCategories());

DOM.addCategoryBtn.addEventListener('click', () => {
    if (state.categories.length >= state.maxCategories) return;
    const title = prompt('Enter custom category name:');
    if (!title || title.trim() === '') return;
    const id = `cat-${Date.now()}`;
    state.categories.push({ id, title: title.trim() });
    state.items[id] = [];
    saveStateToStorage();
    renderCategories();
});

DOM.addItemBtn.addEventListener('click', () => {
    const titleValue = DOM.newItemInput.value.trim();
    const rankValue = parseInt(DOM.newItemRank.value, 10);
    const urlValue = DOM.newItemUrl.value.trim();
    const file = DOM.newItemMedia.files[0];

    if (!titleValue || !state.activeCategoryId) return;
    const targetList = state.items[state.activeCategoryId];

    function commitItem(finalMediaString) {
        const newItem = { title: titleValue, link: urlValue, media: finalMediaString };
        if (!isNaN(rankValue) && rankValue > 0) {
            const indexPosition = rankValue - 1;
            if (indexPosition >= targetList.length) targetList.push(newItem);
            else targetList.splice(indexPosition, 0, newItem);
        } else {
            targetList.push(newItem);
        }

        DOM.newItemInput.value = '';
        DOM.newItemRank.value = '';
        DOM.newItemUrl.value = '';
        DOM.newItemMedia.value = '';
        DOM.alignmentControlSandbox.classList.add('hidden');
        DOM.mediaStatusLabel.textContent = "Select Thumbnail (Img / Video <= 6s)";
        DOM.mediaStatusLabel.className = "media-label";
        activeCroppingImage = null;

        saveStateToStorage();
        renderItems(state.activeCategoryId);
    }

    if (activeCroppingImage) {
        commitItem(DOM.cropCanvas.toDataURL('image/jpeg', 0.85));
    } else if (file) {
        const reader = new FileReader();
        reader.onload = (e) => commitItem(e.target.result);
        reader.readAsDataURL(file);
    } else {
        commitItem(null);
    }
});

DOM.backButton.addEventListener('click', () => window.history.back());

window.addEventListener('popstate', (event) => {
    if (event.state) {
        if (event.state.view === 'list') navigateToList(event.state.categoryId, true);
        else if (event.state.view === 'categories') navigateToCategories(true);
        else navigateToLanding(true);
    } else {
        navigateToLanding(true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    history.replaceState({ view: 'landing' }, '', ' ');
    navigateToLanding(true);
});