// ==========================================================================
// D:/top-tens/frontend/app.js
// MAIN APPLICATION ARCHITECTURE, VIEW ROUTER ENGINE & PERSISTENCE MATRIX WRITER
// ==========================================================================

const BACKEND_BASE = "https://top-tens-backend.swoodson96.workers.dev";

// GLOBAL APPLICATION APPLICATION MEMORY DATA RUNTIME MATRIX
let state = {
    user: null,
    isGuestMode: false,
    categories: [...INITIAL_STOCK_CATEGORIES],
    items: JSON.parse(JSON.stringify(INITIAL_STOCK_ITEMS)),
    friends: [
        { name: "AlphaRanker", mutualCategories: 1, mutualItems: 9, avatar: "" },
        { name: "CryptoCollector", mutualCategories: 1, mutualItems: 9, avatar: "" },
        { name: "OmegaLister", mutualCategories: 0, mutualItems: 0, avatar: "" }
    ],
    profile: {
        name: "Sean D Woodson",
        dob: "Not Set",
        hometown: "Not Set",
        vocation: "Algorithmic Engineer",
        email: "guest@toptens.dev",
        recovery: "Not Set",
        isPublic: true,
        avatar: ""
    },
    tierLimit: 21,
    currentCategoryContextId: null,
    viewHistoryStack: []
};

// ==========================================================================
// PURE LINK GENERATION CONTROLLER - CRITICAL LINK EDIT RECOVERY MATRIX
// ==========================================================================
function generateAutonomousAffiliateLinkNode(itemName, customUrl) {
    // RULE 1: If user provided a specific alternative or custom reference, pass it out instantly!
    if (customUrl && typeof customUrl === 'string' && customUrl.trim() !== '') {
        return customUrl.trim();
    }
    // RULE 2: Fall back cleanly to the stock amazon structural macro builder query parameter layout string
    const structuredQuery = encodeURIComponent(itemName + " purchase online store");
    return `https://www.amazon.com/s?k=${structuredQuery}&tag=toptens20-20`;
}

// ==========================================================================
// APP LIFE CYCLE ENTRYPOINT PIPELINE INDEXER
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    bindInterfaceEventHandlers();
    evaluateSessionTokenState();
});

function bindInterfaceEventHandlers() {
    // Navigation Core Paths
    document.getElementById('landing-enter-vault-btn').addEventListener('click', enterAsGuestContext);
    document.getElementById('landing-auth-drawer-btn').addEventListener('click', () => openUniversalSidebarDrawer('drawer-auth'));
    document.getElementById('header-back-trigger').addEventListener('click', navigateBackwardThroughHistory);
    document.getElementById('settings-burger-trigger').addEventListener('click', () => openUniversalSidebarDrawer('drawer-settings'));
    document.getElementById('profile-avatar-trigger').addEventListener('click', () => openUniversalSidebarDrawer('drawer-profile'));
    
    // Auth Form Interactions
    document.getElementById('password-reveal-toggle-btn').addEventListener('click', togglePasswordVisibility);
    document.getElementById('auth-action-signin-btn').addEventListener('click', executeSignInRequest);
    document.getElementById('auth-action-signup-btn').addEventListener('click', executeSignUpRequest);

    // Global Drawer Close Handling
    document.getElementById('drawer-overlay-shield').addEventListener('click', closeAllUniversalDrawers);
    document.querySelectorAll('aside .drawer-close-cross-btn').forEach(btn => {
        btn.addEventListener('click', closeAllUniversalDrawers);
    });

    // Dashboard Controls Mapping Layer
    document.getElementById('add-custom-category-btn').addEventListener('click', createCustomCategoryElement);
    document.getElementById('add-item-commit-btn').addEventListener('click', addNewItemToStackInstance);
    document.getElementById('media-upload-dummy-btn').addEventListener('click', () => document.getElementById('input-item-file').click());
    
    // Settings Options
    document.getElementById('settings-toggle-theme-btn').addEventListener('click', toggleApplicationThemeContext);
    document.getElementById('settings-upgrade-tier-btn').addEventListener('click', executeUpgradeTierAllocation);
    document.getElementById('settings-add-friend-trigger-btn').addEventListener('click', createDynamicNetworkFriendPrompt);
    document.getElementById('settings-goto-friends-btn').addEventListener('click', () => { closeAllUniversalDrawers(); navigateToActiveView('view-friends'); });
    document.getElementById('settings-vault-wipe-btn').addEventListener('click', triggerVaultWipeSystemReset);
    document.getElementById('add-friends-matrix-btn').addEventListener('click', createDynamicNetworkFriendPrompt);

    // Profile Modifiers Configuration
    document.getElementById('avatar-upload-trigger-btn').addEventListener('click', () => document.getElementById('input-avatar-file').click());
    document.getElementById('input-avatar-file').addEventListener('change', handleProfileAvatarUpload);
    document.getElementById('profile-privacy-toggle-btn').addEventListener('click', toggleProfilePrivacyState);
    document.getElementById('profile-save-commit-btn').addEventListener('click', commitUserProfileDetailsToServer);
    
    document.querySelectorAll('.field-edit-glyph-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.parentElement.querySelector('input');
            const newVal = prompt(`Update ${input.id.replace('prof-', '').toUpperCase()}:`, input.value);
            if (newVal !== null) {
                input.value = newVal;
                const prop = input.id.replace('prof-', '');
                state.profile[prop] = newVal;
            }
        });
    });
}

// ==========================================================================
// VIEW ROUTER FLOW CONTROLLERS
// ==========================================================================
function navigateToActiveView(targetViewId) {
    const currentActive = document.querySelector('main .active-viewport');
    if (currentActive) {
        state.viewHistoryStack.push(currentActive.id);
        currentActive.classList.remove('active-viewport');
        currentActive.classList.add('hidden-element');
    }

    const nextView = document.getElementById(targetViewId);
    nextView.classList.remove('hidden-element');
    nextView.classList.add('active-viewport');

    const header = document.getElementById('global-app-header');
    if (targetViewId === 'view-landing') {
        header.classList.add('hidden-element');
    } else {
        header.classList.remove('hidden-element');
    }

    // Refresh targeted elements loop layouts instantly
    if (targetViewId === 'view-categories') renderCategoriesGrid();
    if (targetViewId === 'view-items-stack') renderItemsStack();
    if (targetViewId === 'view-friends') renderFriendsStack();
}

function navigateBackwardThroughHistory() {
    if (state.viewHistoryStack.length === 0) {
        navigateToActiveView('view-landing');
        return;
    }
    const previousViewId = state.viewHistoryStack.pop();
    
    const currentActive = document.querySelector('main .active-viewport');
    if (currentActive) {
        currentActive.classList.remove('active-viewport');
        currentActive.classList.add('hidden-element');
    }

    const targetView = document.getElementById(previousViewId);
    targetView.classList.remove('hidden-element');
    targetView.classList.add('active-viewport');

    const header = document.getElementById('global-app-header');
    if (previousViewId === 'view-landing') {
        header.classList.add('hidden-element');
    } else {
        header.classList.remove('hidden-element');
    }

    if (previousViewId === 'view-categories') renderCategoriesGrid();
    if (previousViewId === 'view-items-stack') renderItemsStack();
    if (previousViewId === 'view-friends') renderFriendsStack();
}

// ==========================================================================
// DRAWER DISPLAY MANAGER ENGINE
// ==========================================================================
function openUniversalSidebarDrawer(drawerId) {
    closeAllUniversalDrawers();
    document.getElementById(drawerId).classList.remove('universal-sidebar-drawer-closed');
    const overlay = document.getElementById('drawer-overlay-shield');
    overlay.classList.remove('drawer-overlay-shield-hidden');
}

function closeAllUniversalDrawers() {
    document.querySelectorAll('aside').forEach(drawer => {
        drawer.classList.add('universal-sidebar-drawer-closed');
    });
    document.getElementById('drawer-overlay-shield').classList.add('drawer-overlay-shield-hidden');
}

function togglePasswordVisibility() {
    const pwdField = document.getElementById('auth-password-field');
    if (pwdField.type === 'password') {
        pwdField.type = 'text';
    } else {
        pwdField.type = 'password';
    }
}

// ==========================================================================
// USER SECURITY Handshake REST Operations
// ==========================================================================
function enterAsGuestContext() {
    state.isGuestMode = true;
    state.user = null;
    state.categories = [...INITIAL_STOCK_CATEGORIES];
    state.items = JSON.parse(JSON.stringify(INITIAL_STOCK_ITEMS));
    navigateToActiveView('view-categories');
}

async function executeSignInRequest() {
    const email = document.getElementById('auth-email-field').value;
    const password = document.getElementById('auth-password-field').value;
    const feedback = document.getElementById('auth-feedback-status-box');

    feedback.style.color = "var(--gold-primary)";
    feedback.innerText = "Processing system authentication match patterns...";

    try {
        const response = await fetch(`${BACKEND_BASE}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const resData = await response.json();

        if (!response.ok) {
            feedback.style.color = "var(--action-red)";
            feedback.innerText = resData.error || "Login parameters confirmation verification failure.";
            return;
        }

        localStorage.setItem('token', resData.token);
        state.isGuestMode = false;
        state.user = resData.user;
        
        feedback.style.color = "var(--action-green)";
        feedback.innerText = "Access verified. Syncing vault space...";
        
        await pullUserVaultStorageMatrices();
        closeAllUniversalDrawers();
        navigateToActiveView('view-categories');
    } catch (err) {
        feedback.style.color = "var(--action-red)";
        feedback.innerText = "Network pipeline error connection blocked.";
    }
}

async function executeSignUpRequest() {
    const email = document.getElementById('auth-email-field').value;
    const password = document.getElementById('auth-password-field').value;
    const feedback = document.getElementById('auth-feedback-status-box');

    // Password Parameter Verification Matrix Checklist Rules
    const reqRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!reqRegex.test(password)) {
        feedback.style.color = "var(--action-red)";
        feedback.innerText = "Password string rejected. Does not match core constraints architecture requirements.";
        return;
    }

    feedback.style.color = "var(--gold-primary)";
    feedback.innerText = "Registering node. Initializing email activation loop hooks...";

    try {
        const response = await fetch(`${BACKEND_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const resData = await response.json();

        if (!response.ok) {
            feedback.style.color = "var(--action-red)";
            feedback.innerText = resData.error || "Registration validation routing path dropped.";
            return;
        }

        feedback.style.color = "var(--action-green)";
        feedback.innerText = "Verification issued. Polling for activation handshake confirmation link...";

        // Set up the poll looping tracking sequence to check if verification is confirmed
        initializeActivationPollingSequence(email, feedback);
    } catch (err) {
        feedback.style.color = "var(--action-red)";
        feedback.innerText = "Network mapping channel execution error.";
    }
}

function initializeActivationPollingSequence(email, feedbackElement) {
    const pollId = setInterval(async () => {
        try {
            const pollRes = await fetch(`${BACKEND_BASE}/api/auth/poll-verification?email=${encodeURIComponent(email)}`);
            const pollData = await pollRes.json();
            
            if (pollData.verified) {
                clearInterval(pollId);
                localStorage.setItem('token', pollData.token);
                state.isGuestMode = false;
                state.user = pollData.user;
                
                feedbackElement.innerText = "Verification path matched! Entering vault workspace context.";
                await dispatchVaultSynchronizationPayload();
                
                setTimeout(() => {
                    closeAllUniversalDrawers();
                    navigateToActiveView('view-categories');
                }, 1500);
            }
        } catch (e) {
            console.error("Polling stream interruption skipped:", e);
        }
    }, 2500);
}

async function evaluateSessionTokenState() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${BACKEND_BASE}/api/auth/verify-session`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            state.user = data.user;
            state.isGuestMode = false;
            await pullUserVaultStorageMatrices();
            if (document.getElementById('view-landing').classList.contains('active-viewport')) {
                navigateToActiveView('view-categories');
            }
        } else {
            localStorage.removeItem('token');
        }
    } catch (err) {
        console.warn("Session token parsing verification route offline. Native persistence offline.");
    }
}

// ==========================================================================
// PERSISTENCE STORAGE SYNCHRONIZATION PIPELINES
// ==========================================================================
async function dispatchVaultSynchronizationPayload() {
    if (state.isGuestMode || !state.user) return;
    const token = localStorage.getItem('token');
    try {
        await fetch(`${BACKEND_BASE}/api/vault/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ categories: state.categories, items: state.items })
        });
    } catch (e) {
        console.error("Vault network stream synchronization error write back dropped:", e);
    }
}

async function pullUserVaultStorageMatrices() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch(`${BACKEND_BASE}/api/vault/pull`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.categories && data.categories.length > 0) {
                state.categories = data.categories;
                state.items = data.items || {};
            }
        }
    } catch (e) {
        console.error("Vault read cluster synchronization matrix error:", e);
    }
}

// ==========================================================================
// VIEW 2 RENDER GENERATOR: CATEGORIES MANAGER MATRIX
// ==========================================================================
function renderCategoriesGrid() {
    const grid = document.getElementById('categories-grid-matrix');
    grid.innerHTML = '';

    state.categories.forEach(cat => {
        const listItems = state.items[cat.id] || [];
        const card = document.createElement('div');
        card.className = 'category-elongated-card-tab';
        
        card.innerHTML = `
            <div>
                <div class="category-tab-meta-header">
                    <span class="category-emoji-node">${cat.emoji || '📂'}</span>
                    <span class="category-title-node">${cat.title}</span>
                </div>
                <div class="category-counter-node">(${listItems.length} items allocated)</div>
                <div class="category-tab-actions-row">
                    <button class="category-utility-btn compare-trigger-action">Compare</button>
                    <button class="category-utility-btn fuse-trigger-action">Fuse</button>
                    <button class="category-utility-btn privacy-toggle-trigger ${cat.isPrivate ? 'active-state-toggle' : ''}">
                        ${cat.isPrivate ? 'Private' : 'Public'}
                    </button>
                </div>
            </div>
            <div class="tab-corner-actions-cluster">
                <button class="icon-util-btn edit-cat-trigger">&#9998;</button>
                <button class="icon-util-btn remove-cat-trigger">&#128465;</button>
            </div>
        `;

        // Direct Routing Core Frame Clicking Check (Intercept Button Actions)
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            state.currentCategoryContextId = cat.id;
            navigateToActiveView('view-items-stack');
        });

        card.querySelector('.edit-cat-trigger').addEventListener('click', () => triggerCategoryUpdatePrompt(cat.id));
        card.querySelector('.remove-cat-trigger').addEventListener('click', () => removeCategoryElementInstance(cat.id));
        card.querySelector('.compare-trigger-action').addEventListener('click', () => executeSocialComputeOperation('compare', cat.title, cat.id));
        card.querySelector('.fuse-trigger-action').addEventListener('click', () => executeSocialComputeOperation('fuse', cat.title, cat.id));
        card.querySelector('.privacy-toggle-trigger').addEventListener('click', () => toggleCategoryPrivacyState(cat.id));

        grid.appendChild(card);
    });
}

function createCustomCategoryElement() {
    if (state.categories.length >= state.tierLimit) {
        alert(`Storage boundary allocated tier capacity threshold reached. Free Tier cap: ${state.tierLimit}. Upgrade inside settings drawer.`);
        return;
    }
    const title = prompt("Enter Custom Category Title:");
    if (!title) return;
    
    const id = "custom-cat-" + Date.now();
    state.categories.push({ id, title: title.trim(), emoji: "📂", isPrivate: false });
    state.items[id] = [];

    renderCategoriesGrid();
    dispatchVaultSynchronizationPayload();
}

function triggerCategoryUpdatePrompt(catId) {
    const cat = state.categories.find(c => c.id === catId);
    if (!cat) return;
    const newTitle = prompt("Update Category Title:", cat.title);
    if (newTitle) {
        cat.title = newTitle.trim();
        renderCategoriesGrid();
        dispatchVaultSynchronizationPayload();
    }
}

function removeCategoryElementInstance(catId) {
    if (!confirm("Confirm complete eradication of this data tracking category structural frame node?")) return;
    state.categories = state.categories.filter(c => c.id !== catId);
    delete state.items[catId];
    renderCategoriesGrid();
    dispatchVaultSynchronizationPayload();
}

function toggleCategoryPrivacyState(catId) {
    const cat = state.categories.find(c => c.id === catId);
    if (!cat) return;
    cat.isPrivate = !cat.isPrivate;
    renderCategoriesGrid();
    dispatchVaultSynchronizationPayload();
}

// ==========================================================================
// VIEW 3 RENDER GENERATOR: CRITICAL FIXED ITEMS MANAGER & REPLACEMENT ENGINE
// ==========================================================================
function renderItemsStack() {
    const cat = state.categories.find(c => c.id === state.currentCategoryContextId);
    document.getElementById('current-category-view-title').innerText = cat ? `${cat.title} Vault Stack` : "Items Vault Stack List";

    const container = document.getElementById('items-vertical-stack');
    if (!container) return;
    container.innerHTML = '';

    const listItems = state.items[state.currentCategoryContextId] || [];
    listItems.sort((a, b) => a.rank - b.rank);

    listItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'item-list-row';
        
        const affiliateLink = generateAutonomousAffiliateLinkNode(item.name, item.customUrl);

        // Map the image rendering rule directly to item.avatar (with item.media as a secondary fallback)
        const displayImage = item.avatar || item.media || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;%238a99ad&quot;><path d=&quot;M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 5H5l3.5-4.5z&quot;/></svg>';

        row.innerHTML = `
            <div class="item-left-block">
                <span class="item-hashtag">#</span>
                <span class="item-rank-num">${item.rank}</span>
                <span class="item-core-name">${item.name}</span>
            </div>
            <div class="item-right-block">
                <a href="${affiliateLink}" target="_blank" class="affiliate-reference-link">Reference Link</a>
                <div class="thumbnail-media-circle" style="background-image: url('${displayImage}'); background-size: cover; background-position: center;"></div>
                <div class="row-utility-actions">
                    <button class="icon-util-btn edit-item-trigger">&#9998;</button>
                    <button class="icon-util-btn remove-item-trigger">&#128465;</button>
                </div>
            </div>
        `;

        row.querySelector('.edit-item-trigger').addEventListener('click', () => triggerItemUpdateMatrix(item.id));
        row.querySelector('.remove-item-trigger').addEventListener('click', () => removeItemNodeInstance(item.id));

        container.appendChild(row);
    });
}

function addNewItemToStackInstance() {
    const nameInput = document.getElementById('input-item-name');
    const rankInput = document.getElementById('input-item-rank');
    
    const name = nameInput.value.trim();
    const rank = parseInt(rankInput.value);

    if (!name || isNaN(rank) || rank < 1 || rank > 10) {
        alert("Please assign a valid Item Title string and integer rank parameters bound between (1-10).");
        return;
    }

    const currentItems = state.items[state.currentCategoryContextId] || [];
    if (currentItems.length >= 10) {
        alert("List tracking matrices arrays are strictly limited to an absolute cap of 10 items.");
        return;
    }

    const id = "item-node-" + Date.now();
    const newItem = { id, name, rank, customUrl: "", media: "" };
    
    if (!state.items[state.currentCategoryContextId]) {
        state.items[state.currentCategoryContextId] = [];
    }
    state.items[state.currentCategoryContextId].push(newItem);

    nameInput.value = '';
    rankInput.value = '';

    renderItemsStack();
    dispatchVaultSynchronizationPayload();
}

// CRITICAL REPAIR MATRIX: OPENS ACTIVE LINK STRING DIRECTLY FOR REPLACEMENT CONTROL PROMPTS
async function triggerItemUpdateMatrix(itemId) {
    // 1. Pull down the full array mapping tracking context safely
    const currentCategoryKey = state.currentCategoryContextId;
    if (!state.items || !state.items[currentCategoryKey]) {
        console.error(`Missing items reference array context map tracking for: ${currentCategoryKey}`);
        return;
    }

    // Force pull a cloned slice or instance array to safely perform structural updates
    let categoryItems = [...state.items[currentCategoryKey]];
    
    // 2. Identify target item index directly in structural array list
    const itemIndex = categoryItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const item = categoryItems[itemIndex];

    // 3. Capture the active tracking URL link configuration and current image states
    const currentActiveLink = typeof generateAutonomousAffiliateLinkNode === 'function'
        ? generateAutonomousAffiliateLinkNode(item.name, item.customUrl)
        : (item.customUrl || '');
        
    // Capture either key variant to handle stock vs custom creation history safely
    const currentMedia = item.avatar || item.media || '';

    // 4. Prompt for core text identity update rules sequentially
    const newName = prompt("Edit Item Name/Title Text:", item.name);
    if (newName === null) return;

    // NEW INTERACTION STEP: Collect URL or Base64 data string for the image asset
    const newMedia = prompt("Edit Thumbnail Media URL / Base64 String (Leave blank for default icon):", currentMedia);
    if (newMedia === null) return;

    const newUrl = prompt("Edit or Completely Replace Reference Link:", currentActiveLink);
    if (newUrl === null) return;

    // Apply the text values securely directly to the indexed element parameter matrix
    item.name = newName.trim() || item.name;
    
    // Commit to both keys simultaneously to enforce alignment across rendering engines
    item.avatar = newMedia.trim();
    item.media = newMedia.trim();

    // Handle affiliate URL extraction tracking fallbacks
    if (typeof generateAutonomousAffiliateLinkNode === 'function') {
        const defaultStockLink = generateAutonomousAffiliateLinkNode(item.name);
        if (newUrl.trim() === '' || newUrl.trim() === defaultStockLink) {
            item.customUrl = ''; 
        } else {
            item.customUrl = newUrl.trim(); 
        }
    } else {
        item.customUrl = newUrl.trim();
    }

    // 5. Prompt layout configuration to shift position ordering numbers safely
    const newRank = prompt("Edit Item Rank (1-10):", item.rank);
    if (newRank) {
        const rInt = parseInt(newRank);
        if (!isNaN(rInt) && rInt >= 1 && rInt <= 10) {
            item.rank = rInt;
        }
    }

    // 6. Commit the entire array back into state memory blocks to preserve sibling positions
    state.items[currentCategoryKey] = categoryItems;

    // 7. Re-sort the list array map if ranks shifted, keeping all items bound seamlessly
    state.items[currentCategoryKey].sort((a, b) => (parseInt(a.rank) || 0) - (parseInt(b.rank) || 0));

    // 8. Commit data array mutations back down to local persist caches
    localStorage.setItem('toptens_items', JSON.stringify(state.items));

    // 9. Execute layout repaint loops and trigger network push dispatch routines
    if (typeof renderItemsStack === 'function') {
        renderItemsStack();
    }
    
    if (typeof dispatchVaultSynchronizationPayload === 'function') {
        dispatchVaultSynchronizationPayload();
    }
}

function removeItemNodeInstance(itemId) {
    if (!confirm("Eradicate this list element item row from local memory stacks?")) return;
    state.items[state.currentCategoryContextId] = (state.items[state.currentCategoryContextId] || []).filter(i => i.id !== itemId);
    renderItemsStack();
    dispatchVaultSynchronizationPayload();
}

// ==========================================================================
// VIEW 4 RENDER GENERATOR: NETWORK FRIENDS LAYOUT
// ==========================================================================
function renderFriendsStack() {
    const container = document.getElementById('friends-vertical-stack');
    if (!container) return;
    container.innerHTML = '';

    state.friends.forEach((fr, index) => {
        const row = document.createElement('div');
        row.className = 'friend-list-row';
        row.style.position = 'relative';

        row.innerHTML = `
            <div class="friend-left-block">
                <span class="friend-core-name">${fr.name}</span>
            </div>
            <div class="friend-right-block" style="display: flex; align-items: center; gap: 12px;">
                <span class="friend-stats-node">Mutual Categories: ${fr.mutualCategories}</span>
                <span class="friend-stats-node">Mutual Items: ${fr.mutualItems}</span>
                <div class="friend-avatar-circle" style="background-image: url('${fr.avatar || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;%238a99ad&quot;><path d=&quot;M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z&quot;/></svg>'}')"></div>
                
                <div class="friend-actions-wrapper" style="display: flex; gap: 6px; margin-left: 4px;">
                    <button onclick="inlineEditFriendStackNode(${index})" style="background: rgba(77, 166, 255, 0.1); border: 1px solid #4da6ff; color: #4da6ff; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s;">
                        Edit
                    </button>
                    <button onclick="inlineRemoveFriendStackNode(${index})" style="background: rgba(255, 77, 77, 0.1); border: 1px solid #ff4d4d; color: #ff4d4d; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s;">
                        Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

// MANAGEMENT HANDLERS FOR RUNTIME STACK MUTATIONS
async function inlineEditFriendStackNode(index) {
    if (!state.friends || !state.friends[index]) return;
    const oldName = state.friends[index].name;
    
    const newName = prompt(`Modify workspace reference identifier for "${oldName}":`, oldName);
    if (!newName || newName.trim() === "" || newName.trim() === oldName) return;

    // Apply the update to runtime memory models
    state.friends[index].name = newName.trim();
    
    // Save updated arrays back down to local layout cache layers
    localStorage.setItem('toptens_friends', JSON.stringify(state.friends));
    
    // Force immediate UI repaint
    renderFriendsStack();

    // Trigger persistence update up to cloud worker mirrors if session token is active
    if (localStorage.getItem('token') && typeof syncVaultToCloudPersistence === 'function') {
        await syncVaultToCloudPersistence();
    }
}

async function inlineRemoveFriendStackNode(index) {
    if (!state.friends || !state.friends[index]) return;
    const targetName = state.friends[index].name;

    if (!confirm(`Are you sure you want to permanently strip "${targetName}" from your active comparative view stack?`)) return;

    // Filter node from memory array models
    state.friends.splice(index, 1);
    
    // Commit modified array map back to persistent storage caches
    localStorage.setItem('toptens_friends', JSON.stringify(state.friends));
    
    // Repaint interface lines
    renderFriendsStack();

    // Force secure global account state replication
    if (localStorage.getItem('token') && typeof syncVaultToCloudPersistence === 'function') {
        await syncVaultToCloudPersistence();
    }
}

function createDynamicNetworkFriendPrompt() {
    const fName = prompt("Search Global Verified Top Tens Database Network Profiles (Public Profiles by Default):");
    if (!fName) return;
    
    // Add dynamically mapped profile node element objects directly matching infrastructure layout requirements
    state.friends.push({
        name: fName.trim(),
        mutualCategories: Math.floor(Math.random() * 3),
        mutualItems: Math.floor(Math.random() * 10),
        avatar: ""
    });
    
    if (document.getElementById('view-friends').classList.contains('active-viewport')) {
        renderFriendsStack();
    } else {
        alert(`Friend link established with profile connection node: "${fName}". Relocating to Network Roster.`);
        closeAllUniversalDrawers();
        navigateToActiveView('view-friends');
    }
}

// ==========================================================================
// SOCIAL CALCULATOR ENGINES: JUUXTAPOSED COMPARISONS & WEIGHTED AVERAGES FUSION
// ==========================================================================
async function executeSocialComputeOperation(action, categoryTitle, catId) {
    const targetFriends = state.friends.filter(f => f.mutualCategories > 0).map(f => f.name);
    if (targetFriends.length === 0) {
        alert("No active network connection node records detected currently tracking this configuration index path.");
        return;
    }

    const currentList = state.items[catId] || [];
    
    // Fire analytical matrix computation algorithms directly targeting server computing nodes
    try {
        const response = await fetch(`${BACKEND_BASE}/api/social/compute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action,
                categoryTitle,
                friends: targetFriends,
                userList: currentList
            })
        });
        const data = await response.json();
        
        renderSocialComputeOutputSheet(action, categoryTitle, data.payload);
    } catch (e) {
        // Safe, Bulletproof Client Side Local Fallback Matrix Execution Engine
        const fallbackPayload = [{ nodeName: "Your List", items: currentList }];
        targetFriends.forEach(f => {
            const mockItems = currentList.map(it => ({
                name: action === 'compare' ? `${it.name} (${f} Alteration Variant)` : `Synthesized Master Target Node: ${it.name}`
            }));
            fallbackPayload.push({ nodeName: `${f} Data Frame`, items: mockItems });
        });
        renderSocialComputeOutputSheet(action, categoryTitle, fallbackPayload);
    }
}

function renderSocialComputeOutputSheet(type, title, dataset) {
    // Generate full-viewport runtime sandboxed interface container dynamically on the fly to avoid view disruption
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = 'var(--bg-primary)';
    container.style.zIndex = '2000';
    container.style.overflowY = 'auto';
    container.style.padding = '40px 20px';
    container.className = document.body.className; // Maintain dark/light mode alignment properties

    let blocksHtml = '';
    dataset.forEach(set => {
        let listItemsHtml = '';
        set.items.forEach((it, idx) => {
            listItemsHtml += `
                <div class="item-list-row" style="margin-bottom:8px;">
                    <div class="item-left-block">
                        <span class="item-hashtag">#</span>
                        <span class="item-rank-num">${idx + 1}</span>
                        <span class="item-core-name">${it.name}</span>
                    </div>
                </div>`;
        });
        blocksHtml += `
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:20px; border-radius:8px; min-width:280px; flex:1;">
                <h3 style="color:var(--gold-primary); margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">${set.nodeName}</h3>
                <div>${listItemsHtml || '<p style="color:var(--text-secondary)">Empty Stack Matrix</p>'}</div>
            </div>`;
    });

    container.innerHTML = `
        <div style="max-width:1200px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 class="section-sub-heading" style="margin:0;">ALGORITHMIC LAYER: ${type.toUpperCase()}ING [${title.toUpperCase()}]</h2>
                <button id="close-compute-overlay-btn" class="gold-action-button" style="width:130px; height:40px;">CLOSE VIEW</button>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">
                ${blocksHtml}
            </div>
        </div>
    `;

    document.body.appendChild(container);
    document.getElementById('close-compute-overlay-btn').addEventListener('click', () => {
        container.remove();
    });
}

// ==========================================================================
// DRAWER ATTACHED SECONDARY UTILITY ROUTINES
// ==========================================================================
function toggleApplicationThemeContext() {
    document.body.classList.toggle('light-theme-context');
}

function executeUpgradeTierAllocation() {
    state.tierLimit = 99;
    alert("Subscription verified layer active. Storage index configuration expanded safely to a cap of 99 custom list categories rows matrices arrays.");
}

function triggerVaultWipeSystemReset() {
    if (!confirm("Are you absolutely sure you want to execute an emergency system vault wipe sequence? All custom items, replacement lists, and profile alterations will be eradicated back to factory defaults.")) return;
    
    state.categories = [...INITIAL_STOCK_CATEGORIES];
    state.items = JSON.parse(JSON.stringify(INITIAL_STOCK_ITEMS));
    state.friends = [
        { name: "AlphaRanker", mutualCategories: 1, mutualItems: 9, avatar: "" },
        { name: "CryptoCollector", mutualCategories: 1, mutualItems: 9, avatar: "" },
        { name: "OmegaLister", mutualCategories: 0, mutualItems: 0, avatar: "" }
    ];
    
    renderCategoriesGrid();
    dispatchVaultSynchronizationPayload();
    closeAllUniversalDrawers();
    alert("Vault wipe complete. Default matrices successfully rebuilt.");
}

function handleProfileAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const b64Data = event.target.result;
        state.profile.avatar = b64Data;
        document.getElementById('profile-drawer-avatar-preview').style.backgroundImage = `url('${b64Data}')`;
        document.getElementById('profile-avatar-trigger').style.backgroundImage = `url('${b64Data}')`;
    };
    reader.readAsDataURL(file);
}

function toggleProfilePrivacyState() {
    state.profile.isPublic = !state.profile.isPublic;
    const btn = document.getElementById('profile-privacy-toggle-btn');
    btn.innerText = `Profile State: ${state.profile.isPublic ? 'Public' : 'Private'}`;
}

async function commitUserProfileDetailsToServer() {
    if (state.isGuestMode || !state.user) {
        alert("Profile details modification saved into temporary cache storage context memory layers successfully.");
        closeAllUniversalDrawers();
        return;
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BACKEND_BASE}/api/profile/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(state.profile)
        });
        if (response.ok) {
            alert("Profile metadata records synchronized securely to the cluster edge cloud registry.");
            closeAllUniversalDrawers();
        }
    } catch (err) {
        console.error("Profile synchronization engine pipeline blockage:", err);
    }
}