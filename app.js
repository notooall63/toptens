// State & Tracking Engine Context Initialization
let userSessionToken = localStorage.getItem('vault_jwt') || null;
let userProfileData = JSON.parse(localStorage.getItem('vault_profile')) || { isPremium: false, privacy: 'public' };
let clientAppVaultMemory = JSON.parse(localStorage.getItem('vault_data')) || JSON.parse(JSON.stringify(SYSTEM_INITIAL_VAULT_DEFAULTS));
let trackingActiveCategoryContext = null;
let navigationViewHistoryStack = ['view-landing'];

// Synthetic Mock Database Layer for Guest Operations
let clientMockFriendsList = [
    { name: "Swoodson_Dev", commonCategories: 4, commonItems: 22, avatar: "" },
    { name: "AlphaQuant", commonCategories: 7, commonItems: 41, avatar: "" }
];

const BACKEND_BASE_URI = "https://top-tens-backend.swoodson96.workers.dev/api";

// Universal Selector Interface Mapping Layer
const UI = {
    overlay: document.getElementById('modalOverlay'),
    header: document.getElementById('globalHeader'),
    backBtn: document.getElementById('headerBackButton'),
    avatarCircle: document.getElementById('profileAvatarCircle')
};

document.addEventListener('DOMContentLoaded', () => {
    bindGlobalUIEvents();
    evaluateSystemSessionState();
    renderCategoriesGrid();
});

function evaluateSystemSessionState() {
    if (userSessionToken) {
        UI.header.classList.remove('hidden-element');
        if (userProfileData && userProfileData.avatar) {
            UI.avatarCircle.style.backgroundImage = `url(${userProfileData.avatar})`;
        }
    }
}

// Navigation Framework Router
function transitionToStageView(targetViewId, captureInHistory = true) {
    document.querySelectorAll('#viewContainer > section').forEach(view => {
        view.classList.add('hidden-element');
        view.classList.remove('active-view');
    });

    const activeTarget = document.getElementById(targetViewId);
    activeTarget.classList.remove('hidden-element');
    activeTarget.classList.add('active-view');

    if (targetViewId === 'view-landing') {
        UI.header.classList.add('hidden-element');
    } else {
        UI.header.classList.remove('hidden-element');
    }

    if (captureInHistory && navigationViewHistoryStack[navigationViewHistoryStack.length - 1] !== targetViewId) {
        navigationViewHistoryStack.push(targetViewId);
    }
}

function handleStepBackNavigation() {
    if (navigationViewHistoryStack.length > 1) {
        navigationViewHistoryStack.pop();
        const prev = navigationViewHistoryStack[navigationViewHistoryStack.length - 1];
        transitionToStageView(prev, false);
    }
}

// Universal Open/Close Panel System Logic
function expandSlidingDrawer(drawerNode) {
    if (!drawerNode) return;
    collapseAllSlidingDrawers();
    drawerNode.classList.remove('state-collapsed');
    UI.overlay.classList.remove('modal-overlay-hidden');
}

function collapseAllSlidingDrawers() {
    document.querySelectorAll('.sliding-drawer-panel').forEach(panel => {
        panel.classList.add('state-collapsed');
    });
    document.querySelectorAll('.universal-alert-popup').forEach(popup => {
        popup.classList.add('hidden-element');
    });
    UI.overlay.classList.add('modal-overlay-hidden');
}

// Core Component Binding Routines
function bindGlobalUIEvents() {
    UI.backBtn.addEventListener('click', handleStepBackNavigation);
    UI.overlay.addEventListener('click', collapseAllSlidingDrawers);
    
    document.querySelectorAll('.drawer-close-x').forEach(btn => {
        btn.addEventListener('click', collapseAllSlidingDrawers);
    });

    // Landing Triggers
    document.getElementById('btnEnterVault').addEventListener('click', () => {
        transitionToStageView('view-categories');
    });
    
    document.getElementById('btnTriggerAuthDrawer').addEventListener('click', () => {
        expandSlidingDrawer(document.getElementById('drawerAuth'));
    });

    // Settings Panel Triggers
    document.getElementById('settingsBurgerBtn').addEventListener('click', () => {
        expandSlidingDrawer(document.getElementById('drawerSettings'));
    });

    document.getElementById('btnToggleThemeMode').addEventListener('click', () => {
        document.body.classList.toggle('light-theme-context');
        document.getElementById('btnToggleThemeMode').innerText = 
            document.body.classList.contains('light-theme-context') ? "Toggle Dark Mode" : "Toggle Light Mode";
    });

    document.getElementById('btnTriggerVaultWipe').addEventListener('click', () => {
        document.getElementById('popupVaultWipeConfirmation').classList.remove('hidden-element');
        UI.overlay.classList.remove('modal-overlay-hidden');
    });

    document.getElementById('btnConfirmVaultWipeExecution').addEventListener('click', executeSystemVaultWipe);
    document.getElementById('btnCancelWipe').addEventListener('click', collapseAllSlidingDrawers);

    // Profile Trigger Logic
    UI.avatarCircle.addEventListener('click', () => {
        populateProfileFieldsUI();
        expandSlidingDrawer(document.getElementById('drawerProfile'));
    });

    document.getElementById('btnSaveProfileData').addEventListener('click', saveProfileDataSequence);

    // Password Field Reveal Handler
    document.getElementById('btnTogglePasswordReveal').addEventListener('click', (e) => {
        e.preventDefault();
        const pwdInput = document.getElementById('authPassword');
        if (pwdInput.type === "password") {
            pwdInput.type = "text";
            e.target.innerText = "🔒";
        } else {
            pwdInput.type = "password";
            e.target.innerText = "👁";
        }
    });

    // Authentication Submission Channels
    document.getElementById('btnExecuteSignUp').addEventListener('click', authRegisterEngineCall);
    document.getElementById('btnExecuteSignIn').addEventListener('click', authLoginEngineCall);

    // List Construction Binding
    document.getElementById('btnCommitItem').addEventListener('click', executeAddNewItemToList);

    // Routing shortcuts inside system settings
    document.getElementById('btnNavFriendsRoster').addEventListener('click', () => {
        collapseAllSlidingDrawers();
        renderFriendsRosterStage();
        transitionToStageView('view-friends');
    });
    
    document.getElementById('btnNavDiscoverFriends').addEventListener('click', () => {
        collapseAllSlidingDrawers();
        renderFriendsRosterStage();
        transitionToStageView('view-friends');
    });
}

// Category Engine Component Generator
function renderCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';

    Object.keys(clientAppVaultMemory).forEach(categoryTitle => {
        const itemArray = clientAppVaultMemory[categoryTitle] || [];
        const card = document.createElement('div');
        card.className = 'category-card-tab';
        
        card.innerHTML = `
            <div class="category-header-info">
                <h3>${categoryTitle}</h3>
                <small>(${itemArray.length} items)</small>
            </div>
            <div class="category-inline-actions">
                <button class="gold-action-btn clean-sm-btn cmp-trigger" data-cat="${categoryTitle}">Compare</button>
                <button class="gold-action-btn clean-sm-btn fuse-trigger" data-cat="${categoryTitle}">Fuse</button>
            </div>
            <div class="card-icon-controls">
                <span class="edit-cat-btn" data-cat="${categoryTitle}">✏️</span>
                <span class="del-cat-btn" data-cat="${categoryTitle}">❌</span>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('edit-cat-btn') || e.target.classList.contains('del-cat-btn')) return;
            openCategoryItemListStage(categoryTitle);
        });

        grid.appendChild(card);
    });

    // Dynamic Binding for Dynamic Matrix Actions
    grid.querySelectorAll('.cmp-trigger').forEach(b => b.addEventListener('click', (e) => triggerCompareFlowPicker(e.target.getAttribute('data-cat'))));
    grid.querySelectorAll('.fuse-trigger').forEach(b => b.addEventListener('click', (e) => triggerFuseFlowPicker(e.target.getAttribute('data-cat'))));
}

// Detail View Roster Display Builder
function openCategoryItemListStage(categoryTitle) {
    trackingActiveCategoryContext = categoryTitle;
    transitionToStageView('view-items');
    renderVerticalItemsList();
}

function renderVerticalItemsList() {
    const container = document.getElementById('itemsVerticalList');
    container.innerHTML = '';

    const items = clientAppVaultMemory[trackingActiveCategoryContext] || [];
    // Force structured cap ordering
    items.sort((a,b) => a.rank - b.rank);

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'item-row-container';
        row.innerHTML = `
            <span class="item-hashtag">#</span>
            <span class="item-rank">${item.rank}</span>
            <span class="item-title">${item.name}</span>
            <span class="item-affiliate-link" onclick="window.open('${item.link}', '_blank')">Reference Link</span>
            <div class="thumbnail-media-circle">
                <img src="${item.avatar || 'placeholder.png'}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\'><rect width=\'45\' height=\'45\' fill=\'%23aa7c11\'/></svg>'">
            </div>
            <span class="edit-icon-btn" style="cursor:pointer; margin-right:10px;">✏️</span>
            <span class="remove-icon-btn" style="cursor:pointer;">❌</span>
        `;
        container.appendChild(row);
    });
}

function executeAddNewItemToList() {
    const name = document.getElementById('inputItemName').value.trim();
    const rank = parseInt(document.getElementById('inputItemRank').value);
    
    if(!name || isNaN(rank) || rank < 1 || rank > 10) {
        alert("Enter a functional item name and a rank parameter scaled from 1 to 10.");
        return;
    }

    if(!clientAppVaultMemory[trackingActiveCategoryContext]) {
        clientAppVaultMemory[trackingActiveCategoryContext] = [];
    }

    // Dynamic clean evict on conflict
    clientAppVaultMemory[trackingActiveCategoryContext] = clientAppVaultMemory[trackingActiveCategoryContext].filter(i => i.rank !== rank);
    
    clientAppVaultMemory[trackingActiveCategoryContext].push({
        name: name,
        rank: rank,
        link: "https://top-tens.pages.dev/affiliate-redirect?target=" + encodeURIComponent(name)
    });

    if(userSessionToken) {
        persistStateToCloudWorker();
    } else {
        localStorage.setItem('vault_data', JSON.stringify(clientAppVaultMemory));
    }

    renderVerticalItemsList();
    renderCategoriesGrid();
}

// Authentication Transaction API Bridge
async function authRegisterEngineCall() {
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPassword').value;
    const msg = document.getElementById('authDrawerMessage');

    msg.classList.remove('hidden-element');
    msg.innerText = "Initiating system credential analysis...";

    try {
        const res = await fetch(`${BACKEND_BASE_URI}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if(!res.ok) {
            msg.innerText = data.error || "System rejected registration sequence.";
            return;
        }
        msg.innerText = "Verification token dispatched. Access your structural link node to verify account initialization.";
    } catch (e) {
        msg.innerText = "Network bridge structural connectivity timeout error.";
    }
}

async function authLoginEngineCall() {
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPassword').value;
    const msg = document.getElementById('authDrawerMessage');

    try {
        const res = await fetch(`${BACKEND_BASE_URI}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if(!res.ok) {
            msg.innerText = data.error || "Invalid configuration parameters.";
            return;
        }

        userSessionToken = data.token;
        userProfileData = data.profile || { isPremium: false, privacy: 'public', email };
        clientAppVaultMemory = data.vault || clientAppVaultMemory;

        localStorage.setItem('vault_jwt', userSessionToken);
        localStorage.setItem('vault_profile', JSON.stringify(userProfileData));
        localStorage.setItem('vault_data', JSON.stringify(clientAppVaultMemory));

        evaluateSystemSessionState();
        renderCategoriesGrid();
        collapseAllSlidingDrawers();
        transitionToStageView('view-categories');
    } catch (e) {
        msg.innerText = "Network operational authorization node crash.";
    }
}

async function persistStateToCloudWorker() {
    if (!userSessionToken) return;
    await fetch(`${BACKEND_BASE_URI}/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userSessionToken}`
        },
        body: JSON.stringify({ vault: clientAppVaultMemory, profile: userProfileData })
    });
}

function populateProfileFieldsUI() {
    document.getElementById('profEmail').value = userProfileData.email || "";
    document.getElementById('profFullName').value = userProfileData.fullName || "Anonymous User";
}

function saveProfileDataSequence() {
    userProfileData.fullName = document.getElementById('profFullName').value;
    localStorage.setItem('vault_profile', JSON.stringify(userProfileData));
    persistStateToCloudWorker();
    collapseAllSlidingDrawers();
}

function executeSystemVaultWipe() {
    localStorage.clear();
    userSessionToken = null;
    userProfileData = { isPremium: false, privacy: 'public' };
    clientAppVaultMemory = JSON.parse(JSON.stringify(SYSTEM_INITIAL_VAULT_DEFAULTS));
    renderCategoriesGrid();
    collapseAllSlidingDrawers();
    transitionToStageView('view-landing');
}

function renderFriendsRosterStage() {
    const container = document.getElementById('friendsVerticalList');
    container.innerHTML = '';
    clientMockFriendsList.forEach(friend => {
        const d = document.createElement('div');
        d.className = 'friend-row-container';
        d.innerHTML = `
            <span class="item-title">${friend.name}</span>
            <span style="margin-right:20px;">Shared Categories: ${friend.commonCategories}</span>
            <span style="margin-right:20px;">Shared Items: ${friend.commonItems}</span>
            <div class="thumbnail-media-circle"></div>
        `;
        container.appendChild(d);
    });
}

// Matrix Cross-Comparison Operations Logic
function triggerCompareFlowPicker(categoryTitle) {
    trackingActiveCategoryContext = categoryTitle;
    const container = document.getElementById('compareFriendsCheckboxContainer');
    container.innerHTML = '';
    
    clientMockFriendsList.forEach((friend, idx) => {
        container.innerHTML += `
            <label style="display:block; margin: 10px 0;">
                <input type="checkbox" value="${friend.name}" class="compare-friend-picker-check"> ${friend.name}
            </label>
        `;
    });
    document.getElementById('popupCompareFriendPicker').classList.remove('hidden-element');
    UI.overlay.classList.remove('modal-overlay-hidden');
}

// Weighted Rank Average Fusion Algorithm Block
function triggerFuseFlowPicker(categoryTitle) {
    trackingActiveCategoryContext = categoryTitle;
    const container = document.getElementById('fuseFriendsCheckboxContainer');
    container.innerHTML = '';
    
    clientMockFriendsList.forEach((friend, idx) => {
        container.innerHTML += `
            <label style="display:block; margin: 10px 0;">
                <input type="checkbox" value="${friend.name}" class="fuse-friend-picker-check"> ${friend.name}
            </label>
        `;
    });
    document.getElementById('popupFuseFriendPicker').classList.remove('hidden-element');
    UI.overlay.classList.remove('modal-overlay-hidden');
}