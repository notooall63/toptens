/**
 * Master Frontend Client Application Orchestrator
 */
const BACKEND_BASE = "https://top-tens-backend.swoodson96.workers.dev";

// STATE ARCHITECTURE DEFINITION
let state = {
    user: null, // Holds token payload if verified account session exists
    tier: "free", // "free" | "premium"
    categories: [],
    items: {}, // Keyed by categoryId
    friends: [],
    historyStack: ['page-landing'],
    currentCategoryContextId: null,
    activeCroppingTarget: null
};

// INITIALIZATION DETECTOR ENTRYPOINT
document.addEventListener('DOMContentLoaded', async () => {
    setupUniversalEventHandlers();
    loadLocalFallbackSession();
    await attemptSessionValidation();
    renderApplicationFramework();
});

function setupUniversalEventHandlers() {
    // Structural Click-Outside-Drawer Collapsing Listener
    document.addEventListener('click', (e) => {
        const activeDrawer = document.querySelector('.sliding-drawer-panel:not(.horizontal-collapse)');
        if (activeDrawer) {
            // Check if click boundary is independent of drawer canvas frame and action triggers
            const hitDrawer = activeDrawer.contains(e.target);
            const hitBurger = document.getElementById('btn-settings-burger').contains(e.target);
            const hitAvatar = document.getElementById('btn-profile-avatar').contains(e.target);
            const hitAuthBtn = document.getElementById('btn-open-auth').contains(e.target);
            
            if (!hitDrawer && !hitBurger && !hitAvatar && !hitAuthBtn) {
                activeDrawer.classList.add('horizontal-collapse');
            }
        }
    });

    // Close buttons binding within drawers
    document.querySelectorAll('.btn-close-drawer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.sliding-drawer-panel').classList.add('horizontal-collapse');
        });
    });

    // Landing navigation bindings
    document.getElementById('btn-enter-vault').addEventListener('click', () => {
        navigateTo('page-categories');
    });

    document.getElementById('btn-open-auth').addEventListener('click', () => {
        toggleDrawer('drawer-auth');
    });

    // Eye Password Field Toggler Binding
    document.getElementById('btn-toggle-pwd').addEventListener('click', () => {
        const input = document.getElementById('auth-password');
        input.type = input.type === 'password' ? 'text' : 'password';
    });

    // Back Routing Navigation Module Binding
    document.getElementById('btn-global-back').addEventListener('click', () => {
        if (state.historyStack.length > 1) {
            state.historyStack.pop(); // Remove current node
            const destination = state.historyStack[state.historyStack.length - 1];
            executeViewTransition(destination, false);
        }
    });

    // Drawers layout triggers
    document.getElementById('btn-settings-burger').addEventListener('click', () => toggleDrawer('drawer-settings'));
    document.getElementById('btn-profile-avatar').addEventListener('click', () => toggleDrawer('drawer-profile'));

    // Identity action targets
    document.getElementById('btn-action-signin').addEventListener('click', executeSignInPipeline);
    document.getElementById('btn-action-signup').addEventListener('click', executeSignUpPipeline);

    // Dashboard management targets
    document.getElementById('btn-add-custom-category').addEventListener('click', createCustomCategoryNode);
    document.getElementById('btn-commit-item').addEventListener('click', commitItemFormNode);

    // Profile internal customizer actions
    document.getElementById('btn-trigger-avatar-upload').addEventListener('click', () => document.getElementById('input-hidden-avatar').click());
    document.getElementById('input-hidden-avatar').addEventListener('change', initiateAvatarCropMatrix);
    document.getElementById('btn-save-profile').addEventListener('click', saveProfileMetadata);
    document.getElementById('btn-profile-privacy-toggle').addEventListener('click', toggleProfilePrivacyState);

    // Settings actions routing
    document.getElementById('btn-toggle-theme').addEventListener('click', toggleThemeModeAesthetic);
    document.getElementById('btn-upgrade-tier').addEventListener('click', processTierUpgradeSubscription);
    document.getElementById('btn-settings-add-friends').addEventListener('click', () => { toggleDrawer('drawer-settings'); navigateTo('page-friends'); });
    document.getElementById('btn-settings-go-friends').addEventListener('click', () => { toggleDrawer('drawer-settings'); navigateTo('page-friends'); });
    document.getElementById('btn-vault-wipe').addEventListener('click', () => { toggleDrawer('drawer-settings'); document.getElementById('modal-wipe').classList.remove('display-none'); });

    // Modals action confirmation hooks
    document.getElementById('btn-wipe-cancel').addEventListener('click', () => document.getElementById('modal-wipe').classList.add('display-none'));
    document.getElementById('btn-wipe-confirm').addEventListener('click', executeAbsoluteVaultWipeClearing);
    document.getElementById('btn-crop-cancel').addEventListener('click', () => document.getElementById('modal-crop').classList.add('display-none'));
    document.getElementById('btn-crop-confirm').addEventListener('click', finalizeCroppingCoordinateCapture);
    document.getElementById('btn-social-cancel').addEventListener('click', () => document.getElementById('modal-social').classList.add('display-none'));
    document.getElementById('btn-social-submit').addEventListener('click', executeSocialOperationFormula);
    document.getElementById('btn-matrix-close').addEventListener('click', () => document.getElementById('modal-results-matrix').classList.add('display-none'));
    document.getElementById('btn-trigger-friend-search').addEventListener('click', triggerFriendDiscoverySearchPopup);
}

// ROUTING VIEW CONTROLLER NAVIGATION PIPELINE
function navigateTo(pageId) {
    if (state.historyStack[state.historyStack.length - 1] !== pageId) {
        state.historyStack.push(pageId);
    }
    executeViewTransition(pageId, true);
}

function executeViewTransition(pageId, isForwardDirection) {
    document.querySelectorAll('.view-page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    const header = document.getElementById('global-header');
    if (pageId === 'page-landing') {
        header.classList.add('hidden-header');
    } else {
        header.classList.remove('hidden-header');
    }

    // Contextual redraw events hooks
    if (pageId === 'page-categories') renderCategoriesGrid();
    if (pageId === 'page-items') renderItemsStack();
    if (pageId === 'page-friends') renderFriendsRosterStack();
}

function toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const isOpen = !drawer.classList.contains('horizontal-collapse');
    document.querySelectorAll('.sliding-drawer-panel').forEach(d => d.classList.add('horizontal-collapse'));
    if (isOpen) {
        drawer.classList.add('horizontal-collapse');
    } else {
        drawer.classList.remove('horizontal-collapse');
    }
}

// IDENTITY LOGIC HANDLERS
async function executeSignInPipeline() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const msgBox = document.getElementById('auth-status-msg');

    try {
        const res = await fetch(`${BACKEND_BASE}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Array(data.error);

        localStorage.setItem('top_tens_token', data.token);
        state.user = data.user;
        state.tier = data.user.tier || "free";
        
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
        msgBox.innerText = "Access granted. Synchronizing Vault vault context...";
        
        await syncVaultDataFromCloud();
        setTimeout(() => {
            toggleDrawer('drawer-auth');
            navigateTo('page-categories');
            updateUIStateElements();
        }, 1000);

    } catch (err) {
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        msgBox.innerText = Array.isArray(err) ? err[0] : "Network authentication handshake failed.";
    }
}

async function executeSignUpPipeline() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const msgBox = document.getElementById('auth-status-msg');

    // Regex checking validation matching parameters rules
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        msgBox.innerText = "Password requirements validation failed.";
        return;
    }

    try {
        const res = await fetch(`${BACKEND_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = 'rgba(77, 166, 255, 0.2)';
        msgBox.innerText = "Verification link pushed to target address. Verify to trigger dashboard redirection context.";

        // Long polling mock engine simulation context for verification monitoring logic loops
        let pollInterval = setInterval(async () => {
            const checkRes = await fetch(`${BACKEND_BASE}/api/auth/poll-verification?email=${encodeURIComponent(email)}`);
            const checkData = await checkRes.json();
            if (checkData.verified) {
                clearInterval(pollInterval);
                localStorage.setItem('top_tens_token', checkData.token);
                state.user = checkData.user;
                msgBox.innerText = "Email verification confirmed! Vault initializing...";
                setTimeout(() => {
                    toggleDrawer('drawer-auth');
                    navigateTo('page-categories');
                    updateUIStateElements();
                }, 1200);
            }
        }, 3000);

    } catch(e) {
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        msgBox.innerText = e.message;
    }
}

// DASHBOARD RENDERING RENDERS MANAGEMENT LAYER
function renderCategoriesGrid() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';

    state.categories.forEach(cat => {
        const itemCount = state.items[cat.id] ? state.items[cat.id].length : 0;
        const node = document.createElement('div');
        node.className = 'category-tab-node';
        
        node.innerHTML = `
            <div class="category-main-click-zone">
                <span class="category-emoji-frame">${cat.emoji || '📂'}</span>
                <span class="category-node-title">${cat.title}</span>
                <span class="category-node-counter">(${itemCount} items)</span>
            </div>
            <div class="node-utility-icons">
                <button class="icon-util-btn edit-cat-btn">&#9998;</button>
                <button class="icon-util-btn remove-cat-btn">&#128465;</button>
            </div>
            <div class="category-actions-row">
                <button class="btn-node-sub compare-action-trigger">Compare</button>
                <button class="btn-node-sub fuse-action-trigger">Fuse</button>
                <button class="btn-node-sub privacy-action-trigger">${cat.isPublic ? 'Public' : 'Private'}</button>
            </div>
        `;

        // Routing click actions bindings
        node.querySelector('.category-main-click-zone').addEventListener('click', () => {
            state.currentCategoryContextId = cat.id;
            navigateTo('page-items');
        });

        node.querySelector('.edit-cat-btn').addEventListener('click', (e) => { e.stopPropagation(); editCategoryTitleInline(cat.id); });
        node.querySelector('.remove-cat-btn').addEventListener('click', (e) => { e.stopPropagation(); removeCategoryNodeState(cat.id); });
        node.querySelector('.compare-action-trigger').addEventListener('click', (e) => { e.stopPropagation(); openSocialOperationModal(cat.id, 'compare'); });
        node.querySelector('.fuse-action-trigger').addEventListener('click', (e) => { e.stopPropagation(); openSocialOperationModal(cat.id, 'fuse'); });
        node.querySelector('.privacy-action-trigger').addEventListener('click', (e) => { e.stopPropagation(); toggleCategoryPrivacyState(cat.id); });

        grid.appendChild(node);
    });
}

function createCustomCategoryNode() {
    const limit = state.tier === 'premium' ? 99 : 21;
    if (state.categories.length >= limit) {
        alert("Maximum storage category ceiling constraints limit reached. Upgrade profile allocation vectors via settings drawer.");
        return;
    }
    const title = prompt("Enter Custom Category Designation Name:");
    if (!title) return;
    
    const newId = 'custom-' + Date.now();
    state.categories.push({ id: newId, title: title, emoji: "🏷️", isPublic: true });
    state.items[newId] = [];
    
    persistStateToStorageAndSync();
    renderCategoriesGrid();
}

function editCategoryTitleInline(id) {
    const cat = state.categories.find(c => c.id === id);
    const updated = prompt("Modify Category Title Name Designation:", cat.title);
    if (updated) {
        cat.title = updated;
        persistStateToStorageAndSync();
        renderCategoriesGrid();
    }
}

function removeCategoryNodeState(id) {
    if (confirm("Execute extraction removal of this category block and all contained index nodes?")) {
        state.categories = state.categories.filter(c => c.id !== id);
        delete state.items[id];
        persistStateToStorageAndSync();
        renderCategoriesGrid();
    }
}

function toggleCategoryPrivacyState(id) {
    const cat = state.categories.find(c => c.id === id);
    cat.isPublic = !cat.isPublic;
    persistStateToStorageAndSync();
    renderCategoriesGrid();
}

// ITEMS DASHBOARD WORKER INSTANCE
function renderItemsStack() {
    const cat = state.categories.find(c => c.id === state.currentCategoryContextId);
    document.getElementById('current-category-view-title').innerText = cat ? cat.title : "Vault Stack Items List";

    const container = document.getElementById('items-vertical-stack');
    container.innerHTML = '';

    const listItems = state.items[state.currentCategoryContextId] || [];
    // Force structural rank configuration sort optimization algorithm matching execution rules mapping parameters
    listItems.sort((a, b) => a.rank - b.rank);

    listItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'item-list-row';
        
        // Dynamic affiliate processing links execution algorithm fallback logic map
        const affiliateLink = generateAutonomousAffiliateLinkNode(item.name);

        row.innerHTML = `
            <div class="item-left-block">
                <span class="item-hashtag">#</span>
                <span class="item-rank-num">${item.rank}</span>
                <span class="item-core-name">${item.name}</span>
            </div>
            <div class="item-right-block">
                <a href="${affiliateLink}" target="_blank" class="affiliate-reference-link">Reference Link</a>
                <div class="thumbnail-media-circle" style="background-image: url('${item.media || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;%238a99ad&quot;><path d=&quot;M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 5H5l3.5-4.5z&quot;/></svg>'}')"></div>
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

function commitItemFormNode() {
    const name = document.getElementById('input-item-name').value.trim();
    const rank = parseInt(document.getElementById('input-item-rank').value);
    const mediaInput = document.getElementById('input-item-media');

    if (!name || isNaN(rank) || rank < 1 || rank > 10) {
        alert("Verification logic constraint missing data fields elements parameter parameters.");
        return;
    }

    const currentList = state.items[state.currentCategoryContextId] || [];
    if (currentList.length >= 10 && !currentList.find(i => i.rank === rank)) {
        alert("Maximum allocation bounds size threshold limit reached for single index track framework (Limit: 10 items).");
        return;
    }

    const processExecution = (mediaBase64) => {
        // Handle cascading replacement rank realignment math configuration mapping sequence
        state.items[state.currentCategoryContextId] = currentList.filter(i => i.rank !== rank);
        
        state.items[state.currentCategoryContextId].push({
            id: 'item-' + Date.now(),
            name: name,
            rank: rank,
            media: mediaBase64 || ""
        });

        // Clear dynamic parameters form
        document.getElementById('input-item-name').value = '';
        document.getElementById('input-item-rank').value = '';
        mediaInput.value = '';

        persistStateToStorageAndSync();
        renderItemsStack();
    };

    if (mediaInput.files && mediaInput.files[0]) {
        const file = mediaInput.files[0];
        state.activeCroppingTarget = {
            file: file,
            callback: processExecution
        };
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('crop-preview-img').src = e.target.result;
            document.getElementById('modal-crop').classList.remove('display-none');
        };
        reader.readAsDataURL(file);
    } else {
        processExecution("");
    }
}

function triggerItemUpdateMatrix(itemId) {
    const list = state.items[state.currentCategoryContextId] || [];
    const item = list.find(i => i.id === itemId);
    const nextName = prompt("Modify Item Object Identifier Name Label Title:", item.name);
    if (!nextName) return;
    const nextRank = parseInt(prompt("Re-assign Mathematical Sort Alignment Rank Index Target Vector (1-10):", item.rank));
    if (isNaN(nextRank) || nextRank < 1 || nextRank > 10) return;

    // Remove existing target element instance nodes
    let filtered = list.filter(i => i.id !== itemId);
    // Erase anything occupying target index vector cascade paths to clean pipeline execution blocks
    filtered = filtered.filter(i => i.rank !== nextRank);
    
    item.name = nextName;
    item.rank = nextRank;
    filtered.push(item);
    
    state.items[state.currentCategoryContextId] = filtered;
    persistStateToStorageAndSync();
    renderItemsStack();
}

function removeItemNodeInstance(itemId) {
    if (confirm("Purge selected target parameter element track from list stack frame context layer?")) {
        state.items[state.currentCategoryContextId] = (state.items[state.currentCategoryContextId] || []).filter(i => i.id !== itemId);
        persistStateToStorageAndSync();
        renderItemsStack();
    }
}

function generateAutonomousAffiliateLinkNode(itemName) {
    // Standard affiliate autogeneration macro builder logic configuration string output vector routing mapping
    const structuredQuery = encodeURIComponent(itemName + " purchase online store");
    return `https://www.amazon.com/s?k=${structuredQuery}&tag=toptens20-20`;
}

// PROFILE DRAWER CUSTOMIZER CONTROLLER PIPELINE
function initiateAvatarCropMatrix(e) {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        state.activeCroppingTarget = {
            file: file,
            callback: (base64Payload) => {
                document.getElementById('profile-drawer-avatar-preview').style.backgroundImage = `url('${base64Payload}')`;
                document.getElementById('btn-profile-avatar').style.backgroundImage = `url('${base64Payload}')`;
                state.avatarDataPayload = base64Payload;
            }
        };
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('crop-preview-img').src = event.target.result;
            document.getElementById('modal-crop').classList.remove('display-none');
        };
        reader.readAsDataURL(file);
    }
}

function finalizeCroppingCoordinateCapture() {
    // Simulated cropping canvas frame bounding matrix parser mapping
    // Compiles active element to standardized asset size format inline data blocks
    const img = document.getElementById('crop-preview-img');
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 150, 150);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    
    if (state.activeCroppingTarget && state.activeCroppingTarget.callback) {
        state.activeCroppingTarget.callback(dataUrl);
    }
    document.getElementById('modal-crop').classList.add('display-none');
}

async function saveProfileMetadata() {
    const payload = {
        name: document.getElementById('profile-name').value,
        dob: document.getElementById('profile-dob').value,
        hometown: document.getElementById('profile-hometown').value,
        vocation: document.getElementById('profile-vocation').value,
        recovery: document.getElementById('profile-recovery').value,
        avatar: state.avatarDataPayload || ""
    };

    if (state.user) {
        const token = localStorage.getItem('top_tens_token');
        await fetch(`${BACKEND_BASE}/api/profile/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
    } else {
        localStorage.setItem('top_tens_guest_profile', JSON.stringify(payload));
    }
    alert("Profile parameters safely written to vault storage maps.");
    toggleDrawer('drawer-profile');
}

function toggleProfilePrivacyState() {
    const btn = document.getElementById('btn-profile-privacy-toggle');
    const isPublic = btn.classList.contains('active-public');
    if (isPublic) {
        btn.classList.remove('active-public');
        btn.innerText = "Profile Private";
    } else {
        btn.classList.add('active-public');
        btn.innerText = "Profile Public";
    }
}

// SOCIAL ACTIONS COMPARE AND FUSE OPERATIONS FRAMEWORKS
function openSocialOperationModal(catId, actionType) {
    state.activeSocialCategoryContextId = catId;
    state.activeSocialContextActionType = actionType;
    
    document.getElementById('social-modal-title').innerText = actionType === 'compare' ? "Category Comparative Lookup" : "Category Synthesis Weighted Fusion";
    const container = document.getElementById('social-friends-checklist');
    container.innerHTML = '';

    if (state.friends.length === 0) {
        container.innerHTML = '<p class="password-specs">No verified nodes connected in network roster matrix.</p>';
    }

    state.friends.forEach(f => {
        const row = document.createElement('div');
        row.className = 'picker-row';
        row.innerHTML = `
            <input type="checkbox" value="${f.name}" id="chk-friend-${f.name}">
            <label for="chk-friend-${f.name}">${f.name} (Match Index: ${f.mutualCategories})</label>
        `;
        container.appendChild(row);
    });

    document.getElementById('modal-social').classList.remove('display-none');
}

async function executeSocialOperationFormula() {
    const checked = Array.from(document.querySelectorAll('#social-friends-checklist input:checked')).map(i => i.value);
    document.getElementById('modal-social').classList.add('display-none');

    const cat = state.categories.find(c => c.id === state.activeSocialCategoryContextId);
    const token = localStorage.getItem('top_tens_token');

    const res = await fetch(`${BACKEND_BASE}/api/social/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: state.activeSocialContextActionType,
            categoryTitle: cat.title,
            friends: checked,
            userList: state.items[state.activeSocialCategoryContextId] || []
        })
    });
    const resultData = await res.json();

    // Direct dynamic payload parsing loop array map layout architecture output compiler configuration node
    document.getElementById('matrix-output-title').innerText = state.activeSocialContextActionType === 'compare' ? `Juxtaposed Frame View Grid: ${cat.title}` : `Weighted Matrix Consolidated Core Output: ${cat.title}`;
    const grid = document.getElementById('matrix-scroll-payload');
    grid.innerHTML = '';

    resultData.payload.forEach(col => {
        const card = document.createElement('div');
        card.className = 'matrix-column-card';
        let itemsHtml = col.items.map((it, idx) => `<p class="password-specs" style="color:white;"><b>#${idx+1}</b> ${it.name}</p>`).join('');
        card.innerHTML = `
            <div class="matrix-column-title">${col.nodeName}</div>
            <div class="matrix-column-body">${itemsHtml || '<p class="password-specs">Empty Set</p>'}</div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('modal-results-matrix').classList.remove('display-none');
}

// FRIENDS ENGINE ROSTER POPULATOR
function renderFriendsRosterStack() {
    const container = document.getElementById('friends-vertical-stack');
    container.innerHTML = '';

    if (state.friends.length === 0) {
        // Establish stock nodes framework for user system reference illustration maps parameters
        // Added unique IDs to ensure editing and removing track specific items cleanly
        state.friends = [
            { id: "alpha-ranker", name: "AlphaRanker", mutualCategories: 1, mutualItems: 9, avatar: "" },
            { id: "crypto-collector", name: "CryptoCollector", mutualCategories: 1, mutualItems: 9, avatar: "" },
            { id: "omega-lister", name: "OmegaLister", mutualCategories: 0, mutualItems: 0, avatar: "" }
        ];
    }

    state.friends.forEach(f => {
        const row = document.createElement('div');
        row.className = 'friend-list-row';
        row.setAttribute('data-id', f.id);
        
        row.innerHTML = `
            <span class="friend-profile-name">${f.name}</span>
            <span class="friend-metric-node">Mutual Categories: ${f.mutualCategories}</span>
            <span class="friend-metric-node">Mutual Items: ${f.mutualItems}</span>
            <div class="thumbnail-media-circle" style="background-image: url('${f.avatar || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;%23d4af37&quot;><path d=&quot;M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z&quot;/></svg>'}')"></div>
            
            <div class="roster-actions-wrapper" style="display: flex; gap: 8px; margin-left: auto; align-items: center; padding-right: 10px;">
                <button class="icon-btn edit-roster-btn" title="Edit Friend Name" style="background: transparent; border: none; cursor: pointer; color: #ffffff; opacity: 0.7; padding: 4px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="icon-btn remove-roster-btn" title="Remove Friend" style="background: transparent; border: none; cursor: pointer; color: #ffffff; opacity: 0.7; padding: 4px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Direct event hookups for the restored logic layer
        row.querySelector('.edit-roster-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click bubbling
            const newName = prompt(`Edit name for ${f.name}:`, f.name);
            if (newName && newName.trim() !== "" && newName.trim() !== f.name) {
                f.name = newName.trim();
                renderFriendsRosterStack(); // Re-render updated state
            }
        });

        row.querySelector('.remove-roster-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent row click bubbling
            if (confirm(`Are you sure you want to remove ${f.name} from your roster?`)) {
                state.friends = state.friends.filter(friend => friend.id !== f.id);
                renderFriendsRosterStack(); // Re-render updated state
            }
        });

        container.appendChild(row);
    });
}

function triggerFriendDiscoverySearchPopup() {
    const query = prompt("Query Dynamic Network Profiles Target Name Registry Handle:");
    if (query) {
        alert(`Discovered matching unique identifier target path handle '${query}'. Node added to local synchronization queue roster mapping.`);
        state.friends.push({ name: query, mutualCategories: 2, mutualItems: 4, avatar: "" });
        persistStateToStorageAndSync();
        renderFriendsRosterStack();
    }
}

// CONFIGURATION UTILITY STORAGE SYNC MATRIX STRATEGY
function loadLocalFallbackSession() {
    const categoriesCached = localStorage.getItem('top_tens_categories');
    const itemsCached = localStorage.getItem('top_tens_items');

    if (categoriesCached && itemsCached) {
        state.categories = JSON.parse(categoriesCached);
        state.items = JSON.parse(itemsCached);
    } else {
        // Bootstrap stock data definitions context tracking logic blocks
        state.categories = [...GLOBAL_STOCK_CATEGORIES];
        state.items = JSON.parse(JSON.stringify(GLOBAL_STOCK_ITEMS));
        persistStateToStorageAndSync();
    }
}

function persistStateToStorageAndSync() {
    localStorage.setItem('top_tens_categories', JSON.stringify(state.categories));
    localStorage.setItem('top_tens_items', JSON.stringify(state.items));
    
    if (state.user) {
        // Fire fire-and-forget back-plane background async network write logic thread context parameters
        const token = localStorage.getItem('top_tens_token');
        fetch(`${BACKEND_BASE}/api/vault/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ categories: state.categories, items: state.items })
        }).catch(err => console.warn("Background pipeline cloud sync operation deferred. Queue latency active."));
    }
}

async function attemptSessionValidation() {
    const token = localStorage.getItem('top_tens_token');
    if (!token) return;

    try {
        const res = await fetch(`${BACKEND_BASE}/api/auth/verify-session`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            state.user = data.user;
            state.tier = data.user.tier || "free";
            await syncVaultDataFromCloud();
            updateUIStateElements();
        } else {
            localStorage.removeItem('top_tens_token');
        }
    } catch(e) {
        console.error("Session lookup dropped during connection bootstrap parsing operations framework.");
    }
}

async function syncVaultDataFromCloud() {
    const token = localStorage.getItem('top_tens_token');
    if (!token) return;
    try {
        const res = await fetch(`${BACKEND_BASE}/api/vault/pull`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.categories && data.items) {
            state.categories = data.categories;
            state.items = data.items;
            localStorage.setItem('top_tens_categories', JSON.stringify(state.categories));
            localStorage.setItem('top_tens_items', JSON.stringify(state.items));
        }
    } catch(e) {
         console.warn("Could not synchronize dynamic framework cloud storage matrices parameters fallbacks active.");
    }
}

function updateUIStateElements() {
    const isPremium = state.tier === 'premium';
    document.getElementById('category-max-limit').innerText = isPremium ? "99" : "21";
    document.getElementById('btn-upgrade-tier').innerText = isPremium ? "Tier State: Premium Matrix Active" : "Upgrade - $0.99/month";
    if (state.user) {
        document.getElementById('profile-email').value = state.user.email;
    }
}

function toggleThemeModeAesthetic() {
    const body = document.body;
    const btn = document.getElementById('btn-toggle-theme');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        btn.innerText = "Toggle Dark Mode";
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        btn.innerText = "Toggle Light Mode";
    }
}

function processTierUpgradeSubscription() {
    if (state.tier === 'premium') {
        alert("Account tier context maps are already optimized to maximal framework allocation limits.");
        return;
    }
    state.tier = 'premium';
    updateUIStateElements();
    persistStateToStorageAndSync();
    alert("Subscription tier expansion update successfully registered to running environment context mapping runtime.");
}

function executeAbsoluteVaultWipeClearing() {
    localStorage.clear();
    state.user = null;
    state.tier = "free";
    state.categories = [...GLOBAL_STOCK_CATEGORIES];
    state.items = JSON.parse(JSON.stringify(GLOBAL_STOCK_ITEMS));
    state.friends = [];
    state.historyStack = ['page-landing'];
    
    document.getElementById('modal-wipe').classList.add('display-none');
    updateUIStateElements();
    executeViewTransition('page-landing', false);
    alert("Vault wipe complete. Application state restored to default.");
}

function renderApplicationFramework() {
    // Top-level structural checks before execution logic
    updateUIStateElements();
}