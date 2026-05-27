// ==========================================================================
// 1. Application State & Storage Engine (9 Hydrated Stock Categories)
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
        'cat-2': [
            { title: 'Inception', link: 'https://www.warnerbros.com/movies/inception', media: null },
            { title: 'The Matrix', link: 'https://www.warnerbros.com/movies/matrix', media: null },
            { title: 'Interstellar', link: 'https://www.warnerbros.com/movies/interstellar', media: null }
        ],
        'cat-3': [
            { title: 'Taco Hub', link: 'https://tacohub.example.com', media: null },
            { title: 'Burger Joint', link: 'https://burgerjoint.example.com', media: null },
            { title: 'Pizza Place', link: 'https://pizzaplace.example.com', media: null }
        ],
        'cat-4': [
            { title: 'Tokyo, Japan', link: 'https://page.travel/tokyo', media: null },
            { title: 'London, UK', link: 'https://page.travel/london', media: null },
            { title: 'Kyoto, Japan', link: 'https://page.travel/kyoto', media: null }
        ],
        'cat-5': [
            { title: 'Neuromancer', link: 'https://www.penguinrandomhouse.com', media: null },
            { title: 'Snow Crash', link: 'https://www.penguinrandomhouse.com', media: null },
            { title: 'Dune', link: 'https://www.macmillanpublishers.com', media: null }
        ],
        'cat-6': [
            { title: 'Random Access Memories', link: 'https://www.daftpunk.com', media: null },
            { title: 'Dark Side of the Moon', link: 'https://www.pinkfloyd.com', media: null },
            { title: 'Discovery', link: 'https://www.daftpunk.com', media: null }
        ],
        'cat-7': [
            { title: 'Elden Ring', link: 'https://www.bandainamcoent.com', media: null },
            { title: 'Cyberpunk 2077', link: 'https://www.cyberpunk.net', media: null },
            { title: 'The Witcher 3', link: 'https://www.thewitcher.com', media: null }
        ],
        'cat-8': [
            { title: 'Travel Chromebook', link: 'https://google.com/chromebook', media: null },
            { title: 'Mechanical Keyboard', link: 'https://keychron.com', media: null },
            { title: 'Wireless ANC Earbuds', link: 'https://sony.com', media: null }
        ],
        'cat-9': [
            { title: 'The Espresso Lab', link: 'https://espressolab.example.com', media: null },
            { title: 'Monarch Coffee', link: 'https://monarch.example.com', media: null },
            { title: 'Roaster Vault', link: 'https://roastervault.example.com', media: null }
        ]
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
            
            // Clean up state runtime parameters dynamically
            state.currentView = 'landing';
            state.activeCategoryId = null;
            state.maxCategories = 21;
            
            // Re-verify that items matrices align with all category definitions
            if (!state.categories || state.categories.length === 0) {
                state.categories = [...defaultState.categories];
            }
            if (!state.items) {
                state.items = {...defaultState.items};
            } else {
                // Ensure legacy items mapping doesn't swallow new stock profiles
                state.categories.forEach(cat => {
                    if (!state.items[cat.id]) {
                        state.items[cat.id] = defaultState.items[cat.id] || [];
                    }
                });
            }
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
        
        // Dynamic interception point for all stock and added buttons
        card.removeAttribute('onclick'); 
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

        // 1. Prominent hashtag element
        const hashBadge = document.createElement('span');
        hashBadge.className = 'item-hash-symbol';
        hashBadge.textContent = '#';

        // 2. Continuous individual rank counter number
        const numBadge = document.createElement('span');
        numBadge.className = 'item-numerical-rank';
        numBadge.textContent = `${index + 1}`;

        // 3. Item Name Node Block
        const nameBadge = document.createElement('span');
        nameBadge.className = 'item-name-string';
        nameBadge.textContent = item.title;
        
        // 4. Dedicated Link Button / Icon Element Box
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

        // 5. Appended Circular Media Frame Matrix
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

        // Sequential Structural Mount Matrix
        li.appendChild(hashBadge);
        li.appendChild(numBadge);
        li.appendChild(nameBadge);
        li.appendChild(linkWrapper);
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

DOM.backButton.addEventListener('click', () => {
    window.history.back();
});

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