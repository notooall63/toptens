// ==========================================================================
// 1. Application State & Storage Engine
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
        { id: 'cat-9', title: 'Coffee Shops' }
    ],
    items: {
        'cat-1': [
            { title: 'adidas adiprene', link: 'https://adidas.com', media: null },
            { title: 'Nike Air Max', link: 'https://nike.com', media: null },
            { title: 'New Balance 990v6', link: 'https://newbalance.com', media: null }
        ],
        'cat-2': [], 'cat-3': [], 'cat-4': [], 'cat-5': [], 'cat-6': [], 'cat-7': [], 'cat-8': [], 'cat-9': []
    },
    currentView: 'landing',
    activeCategoryId: null,
    maxCategories: 21
};

let state = {};
let activeCroppingImage = null; // Memory tracking node for dynamic offset transforms

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
    backButton: document.getElementById('back-button'),
    headerLogo: document.getElementById('header-logo'),
    headerTitle: document.getElementById('header-title'),
    settingsButton: document.getElementById('settings-button'),
    landingView: document.getElementById('landing-view'),
    categoriesView: document.getElementById('categories-view'),
    listView: document.getElementById('list-view'),
    enterVaultBtn: document.getElementById('enter-vault-btn'),
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
    rankedItemsList: document.getElementById('ranked-items-list')
};

// ==========================================================================
// 3. UI Presentation Core Pipeline
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

// ==========================================================================
// 4. Canvas Centering Processing Engine
// ==========================================================================
function redrawCanvasPreview() {
    if (!activeCroppingImage) return;
    const ctx = DOM.cropCanvas.getContext('2d');
    const width = DOM.cropCanvas.width;
    const height = DOM.cropCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Calculate scaling calculations to keep aspect ratios clean
    const scale = Math.max(width / activeCroppingImage.width, height / activeCroppingImage.height);
    const imgWidth = activeCroppingImage.width * scale;
    const imgHeight = activeCroppingImage.height * scale;
    
    // Read offset adjustments directly out of slider calculations
    const sliderVal = parseInt(DOM.centerOffsetSlider.value, 10);
    
    let dx = (width - imgWidth) / 2;
    let dy = (height - imgHeight) / 2;
    
    if (imgWidth > imgHeight) {
        dx += sliderVal; // Horizontal positioning shift
    } else {
        dy += sliderVal; // Vertical positioning shift
    }
    
    ctx.drawImage(activeCroppingImage, dx, dy, imgWidth, imgHeight);
}

DOM.centerOffsetSlider.addEventListener('input', redrawCanvasPreview);

// ==========================================================================
// 5. Media Interception & Guardrail Logic
// ==========================================================================
DOM.newItemMedia.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Guardrail Block: Video duration strict runtime constraint inspection
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
                DOM.mediaStatusLabel.textContent = "Select Thumbnail (Img / Video ≤ 6s)";
                DOM.mediaStatusLabel.className = "media-label error-state";
            } else {
                DOM.mediaStatusLabel.textContent = `Video Loaded (${videoElement.duration.toFixed(1)}s)`;
                DOM.mediaStatusLabel.className = "media-label verified-state";
            }
        };
    } 
    // Image Handling Block: Render into interactive positioning engine sandbox
    else if (file.type.startsWith('image/')) {
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
// 6. Viewport Routing Matrix
// ==========================================================================
function updateHeaderDecorations(viewState) {
    if (viewState === 'landing') {
        DOM.backButton.classList.add('hidden');
        DOM.headerLogo.classList.add('hidden');
        DOM.headerTitle.classList.add('hidden');
        DOM.settingsButton.classList.add('hidden');
    } else {
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
    updateHeaderDecorations('landing');
    if (!isBackAction) history.pushState({ view: 'landing' }, '', ' ');
}

function navigateToCategories(isBackAction = false) {
    state.currentView = 'categories';
    state.activeCategoryId = null;
    renderCategories();
    DOM.landingView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.categoriesView.classList.remove('hidden');
    updateHeaderDecorations('categories');
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
    updateHeaderDecorations('list');
    if (!isBackAction) history.pushState({ view: 'list', categoryId: categoryId }, '', `#list-${categoryId}`);
}

// ==========================================================================
// 7. Data Mutation Interceptors
// ==========================================================================
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
        DOM.mediaStatusLabel.textContent = "Select Thumbnail (Img / Video ≤ 6s)";
        DOM.mediaStatusLabel.className = "media-label";
        activeCroppingImage = null;

        saveStateToStorage();
        renderItems(state.activeCategoryId);
    }

    // Canvas image commit stream vs standard native file stream
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
DOM.settingsButton.addEventListener('click', () => {
    if(confirm("Purge application localStorage to fully rebuild and synchronize all 9 stock categories?")) {
        localStorage.clear();
        state = JSON.parse(JSON.stringify(defaultState));
        saveStateToStorage();
        location.reload();
    }
});

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