// ==========================================================================
// 1. Application State & Storage Engine
// ==========================================================================

const defaultState = {
    categories: [
        { id: 'cat-1', title: 'Restaurants' },
        { id: 'cat-2', title: 'Movies' },
        { id: 'cat-3', title: 'Travel' }
    ],
    items: {
        'cat-1': ['Taco Hub', 'Burger Joint', 'Pizza Place'],
        'cat-2': ['Inception', 'The Matrix', 'Interstellar'],
        'cat-3': ['Tokyo', 'London', 'New York']
    },
    currentView: 'landing', // 'landing' | 'categories' | 'list'
    activeCategoryId: null,
    maxCategories: 21
};

let state = {};

function loadStateFromStorage() {
    try {
        const storedData = localStorage.getItem('top_tens_app_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
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
    categoriesView: document.getElementById('categories-view'),
    listView: document.getElementById('list-view'),
    enterVaultBtn: document.getElementById('enter-vault-btn'),
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
        card.addEventListener('click', () => navigateToList(category.id));
        DOM.categoriesGrid.appendChild(card);
    });

    if (state.categories.length >= state.maxCategories) {
        DOM.addCategoryBtn.disabled = true;
        DOM.addCategoryBtn.className = 'btn-primary limited';
        DOM.addCategoryBtn.textContent = 'Category Limit Reached (Max 21)';
    } else {
        DOM.addCategoryBtn.disabled = false;
        DOM.addCategoryBtn.className = 'btn-primary';
        DOM.addCategoryBtn.textContent = 'Add Custom Categories—Up To 21 Total';
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
// 4. Viewport Routing Matrix (Three Distinct Stages)
// ==========================================================================
function navigateToLanding(isBackAction = false) {
    state.currentView = 'landing';
    state.activeCategoryId = null;

    DOM.categoriesView.classList.add('hidden');
    DOM.listView.classList.add('hidden');
    DOM.landingView.classList.remove('hidden');
    DOM.backButton.classList.add('hidden');

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
    DOM.backButton.classList.remove('hidden');

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
    DOM.backButton.classList.remove('hidden');

    if (!isBackAction) {
        history.pushState({ view: 'list', categoryId: categoryId }, '', `#list-${categoryId}`);
    }
}

// ==========================================================================
// 5. User Interaction Interceptors
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
    const value = DOM.newItemInput.value.trim();
    if (!value || !state.activeCategoryId) return;

    if (!state.items[state.activeCategoryId]) {
        state.items[state.activeCategoryId] = [];
    }

    state.items[state.activeCategoryId].push(value);
    DOM.newItemInput.value = '';
    
    saveStateToStorage();
    renderItems(state.activeCategoryId);
});

DOM.newItemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') DOM.addItemBtn.click();
});

DOM.backButton.addEventListener('click', () => {
    window.history.back();
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
// 6. Application Lifecycle Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    history.replaceState({ view: 'landing' }, '', ' ');
    navigateToLanding(true);
});