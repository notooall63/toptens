// ==========================================================================
// 1. Application State & Storage Engine
// ==========================================================================

// Fallback baseline data if no local storage exists yet
const defaultState = {
    categories: [
        { id: 'cat-1', title: 'Movies' },
        { id: 'cat-2', title: 'Books' },
        { id: 'cat-3', title: 'Tech Tools' }
    ],
    items: {
        'cat-1': ['Inception', 'The Matrix', 'Interstellar'],
        'cat-2': ['Neuromancer', 'Snow Crash', 'Dune'],
        'cat-3': ['Vim', 'Git', 'Linux Container']
    },
    currentView: 'landing',
    activeCategoryId: null,
    maxCategories: 21
};

let state = {};

// Load application data from browser's local memory footprint
function loadStateFromStorage() {
    try {
        const storedData = localStorage.getItem('top_tens_app_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            // Re-hydrate application values while preserving clean view state baselines
            state = {
                categories: parsed.categories || [],
                items: parsed.items || {},
                currentView: 'landing',
                activeCategoryId: null,
                maxCategories: 21
            };
        } else {
            state = JSON.parse(JSON.stringify(defaultState));
        }
    } catch (e) {
        console.error("Storage read exception: fallback to factory defaults triggered.", e);
        state = JSON.parse(JSON.stringify(defaultState));
    }
}

// Commit active mutations directly to local device storage
function saveStateToStorage() {
    try {
        const dataToSave = {
            categories: state.categories,
            items: state.items
        };
        localStorage.setItem('top_tens_app_data', JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Storage write exception: payload could not be preserved.", e);
    }
}

// ==========================================================================
// 2. DOM Interface Reference Matrix
// ==========================================================================
const DOM = {
    backButton: document.getElementById('back-button'),
    landingView: document.getElementById('landing-view'),
    detailView: document.getElementById('detail-view'),
    categoriesGrid: document.getElementById('categories-grid'),
    addCategoryBtn: document.getElementById('add-category-btn'),
    currentCategoryTitle: document.getElementById('current-category-title'),
    newItemInput: document.getElementById('new-item-input'),
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
        card.addEventListener('click', () => navigateToDetail(category.id));
        DOM.categoriesGrid.appendChild(card);
    });

    // Enforce strict category depth threshold rules safely
    if (state.categories.length >= state.maxCategories) {
        DOM.addCategoryBtn.disabled = true;
        DOM.addCategoryBtn.style.opacity = '0.5';
        DOM.addCategoryBtn.textContent = 'Category Limit Reached (Max 21)';
    } else {
        DOM.addCategoryBtn.disabled = false;
        DOM.addCategoryBtn.style.opacity = '1';
        DOM.addCategoryBtn.textContent = 'Add Custom Categories--Up To 21 Total';
    }
}

function renderItems(categoryId) {
    if (!DOM.rankedItemsList) return;
    DOM.rankedItemsList.innerHTML = '';
    const itemList = state.items[categoryId] || [];
    
    itemList.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        DOM.rankedItemsList.appendChild(li);
    });
}

// ==========================================================================
// 4. Viewport Routing Matrix
// ==========================================================================
function navigateToDetail(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category) return;

    state.currentView = 'detail';
    state.activeCategoryId = categoryId;

    DOM.currentCategoryTitle.textContent = category.title;
    renderItems(categoryId);

    DOM.landingView.classList.add('hidden');
    DOM.detailView.classList.remove('hidden');
    DOM.backButton.classList.remove('hidden');

    history.pushState({ view: 'detail', categoryId: categoryId }, '', `#category-${categoryId}`);
}

function navigateToLanding(isBackAction = false) {
    state.currentView = 'landing';
    state.activeCategoryId = null;

    DOM.detailView.classList.add('hidden');
    DOM.landingView.classList.remove('hidden');
    DOM.backButton.classList.add('hidden');

    if (!isBackAction) {
        history.pushState({ view: 'landing' }, '', ' ');
    }
}

// ==========================================================================
// 5. User Interaction & Data Mutation Interceptors
// ==========================================================================
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

    // Save mutations immediately to disk
    saveStateToStorage();
    renderCategories();
});

DOM.addItemBtn.addEventListener('click', () => {
    const value = DOM.newItemInput.value.trim();
    if (!value || !state.activeCategoryId) return;

    if (!state.items[state.activeCategoryId]) {
        state.items[state.activeCategoryId] = [];
    }

    state.items[state.activeCategoryId].push(value);
    DOM.newItemInput.value = '';
    
    // Save mutations immediately to disk
    saveStateToStorage();
    renderItems(state.activeCategoryId);
});

DOM.newItemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') DOM.addItemBtn.click();
});

// Explicit Header Back Button Hook
DOM.backButton.addEventListener('click', () => {
    window.history.back();
});

// Intercept Hardware/Browser History Pops
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view === 'detail') {
        navigateToDetail(event.state.categoryId);
    } else {
        navigateToLanding(true);
    }
});

// ==========================================================================
// 6. Application Lifecycle Initialization Execution
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Re-hydrate state from device storage layer
    loadStateFromStorage();
    
    history.replaceState({ view: 'landing' }, '', ' ');
    renderCategories();
});