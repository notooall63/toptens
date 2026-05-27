// ==========================================================================
// 1. Application State & Storage Engine
// ==========================================================================

const defaultState = {
    categories: [
        { id: 'cat-1', title: 'Shoes' },
        { id: 'cat-2', title: 'Movies' },
        { id: 'cat-3', title: 'Restaurants' }
    ],
    items: {
        'cat-1': [
            { title: 'adidas adiprene', link: 'https://adidas.com', media: null }
        ],
        'cat-2': [],
        'cat-3': []
    },
    currentView: 'landing',
    activeCategoryId: null,
    maxCategories: 21
};

let state = {};

function loadStateFromStorage() {
    try {
        const storedData = localStorage.getItem('top_tens_app_data');
        if (storedData) {
            state = JSON.parse(storedData);
            
            // Clean up state parameters for consistency
            state.currentView = 'landing';
            state.activeCategoryId = null;
            state.maxCategories = 21;
            
            // Re-map fallback lists if array targets are missing
            if (!state.categories) state.categories = [...defaultState.categories];
            if (!state.items) state.items = {...defaultState.items};
        } else {
            state = JSON.parse(JSON.stringify(defaultState));
        }
    } catch (e) {
        console.error("Storage read exception: fallback to factory defaults triggered.", e);
        state = JSON.parse(JSON.stringify(defaultState));
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem('top_tens_app_data', JSON.stringify(state));
    } catch (e) {
        console.error("Storage write exception: payload could not be preserved.", e);
    }
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
        
        // Safe mapping to route details smoothly
        card.addEventListener('click', () => {
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

        // 1. Hashtag Position Badging Matrix (#1)
        const rankBadge = document.createElement('div');
        rankBadge.className = 'rank-badge-number';
        rankBadge.textContent = `#${index + 1}`;
        
        // 2. Central Reference Text Layout Engine
        const textContainer = document.createElement('div');
        textContainer.className = 'item-text-container';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'item-title-text';
        
        if (item.link && item.link.trim() !== '') {
            const anchor = document.createElement('a');
            anchor.href = item.link;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = item.title;
            titleSpan.appendChild(anchor);
        } else {
            titleSpan.textContent = item.title;
        }
        textContainer.appendChild(titleSpan);

        // 3. Trailing Circular Media Layout Canvas Block
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

        // Linear Layout Appends: Rank -> Title/Link -> Media Card
        li.appendChild(rankBadge);
        li.appendChild(textContainer);
        li.appendChild(mediaContainer);
        
        DOM.rankedItemsList.appendChild(li);
    });
}

// ==========================================================================
// 4. Viewport Routing Matrix
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
        DOM.backButton.classList.remove('hidden'); // Force visibility on all inner views
    }
}

function navigateToLanding(isBackAction = false) {
    state.currentView = 'landing';
    state.activeCategoryId = null;

    DOM.categoriesView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.landingView.classList.remove('hidden');
    
    updateHeaderDecorations('landing');

    if (!isBackAction) {
        history.pushState({ view: 'landing' }, '', ' ');
    }
}

function navigateToCategories(isBackAction = false) {
    state.currentView = 'categories';
    state.activeCategoryId = null;

    renderCategories();

    DOM.landingView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.categoriesView.classList.remove('hidden');
    
    updateHeaderDecorations('categories');

    if (!isBackAction) {
        history.pushState({ view: 'categories' }, '', '#categories');
    }
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

    if (!isBackAction) {
        history.pushState({ view: 'list', categoryId: categoryId }, '', `#list-${categoryId}`);
    }
}

// ==========================================================================
// 5. User Interaction & Data Mutation Interceptors
// ==========================================================================
DOM.enterVaultBtn.addEventListener('click', () => {
    navigateToCategories();
});

DOM.addCategoryBtn.addEventListener('click', () => {
    if (state.categories.length >= state.maxCategories) {
        alert('System Limit: You cannot create more than 21 custom categories.');
        return;
    }

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

    if (!state.items[state.activeCategoryId]) {
        state.items[state.activeCategoryId] = [];
    }

    const targetList = state.items[state.activeCategoryId];

    function commitItem(mediaDataString) {
        const newItem = {
            title: titleValue,
            link: urlValue,
            media: mediaDataString
        };

        if (!isNaN(rankValue) && rankValue > 0) {
            const indexPosition = rankValue - 1;
            if (indexPosition >= targetList.length) {
                targetList.push(newItem);
            } else {
                targetList.splice(indexPosition, 0, newItem);
            }
        } else {
            targetList.push(newItem);
        }

        DOM.newItemInput.value = '';
        DOM.newItemRank.value = '';
        DOM.newItemUrl.value = '';
        DOM.newItemMedia.value = '';

        saveStateToStorage();
        renderItems(state.activeCategoryId);
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            commitItem(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        commitItem(null);
    }
});

DOM.newItemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') DOM.addItemBtn.click();
});

DOM.backButton.addEventListener('click', () => {
    window.history.back();
});

DOM.settingsButton.addEventListener('click', () => {
    if(confirm("Reset System Storage to default categories to fix legacy links?")) {
        localStorage.clear();
        location.reload();
    }
});

window.addEventListener('popstate', (event) => {
    if (event.state) {
        if (event.state.view === 'list') {
            navigateToList(event.state.categoryId, true);
        } else if (event.state.view === 'categories') {
            navigateToCategories(true);
        } else {
            navigateToLanding(true);
        }
    } else {
        navigateToLanding(true);
    }
});

// ==========================================================================
// 6. Application Lifecycle Initialization Execution
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    history.replaceState({ view: 'landing' }, '', ' ');
    navigateToLanding(true);
});