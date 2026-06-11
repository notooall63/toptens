/**
 * Top Tens - Enterprise Client Routing & Application State Coordination Engine
 * Synchronized Target: Cloudflare Edge Worker Architecture API Ecosystem
 */

// GLOBAL STATE PARSING ARCHITECTURE
const AppState = {
    user: null,         // Holds verified user token properties, payload or raw null identity
    isGuest: false,     // Flag for evaluation profile state validation rules
    isPremium: false,   // Tracks limits configuration matrices dynamically (21 vs 99 max)
    currentView: 'landing',
    viewHistory: [],
    categories: [],     // Dynamic configuration store array nodes
    friends: [          // Mocked active friends lookup schema
        { name: "Alex Rivers", categoriesInCommon: 5, itemsInCommon: 32, avatar: "" },
        { name: "Jordan Vance", categoriesInCommon: 8, itemsInCommon: 54, avatar: "" },
        { name: "Taylor Morgan", categoriesInCommon: 3, itemsInCommon: 19, avatar: "" }
    ],
    selectedCategory: null,
    apiBase: "https://top-tens-backend.swoodson96.workers.dev"
};

// INITIALIZATION PIPELINE INTERCEPTOR
document.addEventListener('DOMContentLoaded', () => {
    instantiateCoreDOMEventListeners();
    evaluateSavedSessionState();
});

/**
 * ATTACH EXPLICIT DISPATCH MUTATORS TO INTERACTIVE NODES
 */
function instantiateCoreDOMEventListeners() {
    // Landing State Controls
    document.getElementById('btnEnterVault').addEventListener('click', enterAsGuestHandler);
    document.getElementById('btnAuthDrawer').addEventListener('click', () => openDrawer('drawerAuth'));

    // Navigation Sub-system Elements
    document.getElementById('headerBackButton').addEventListener('click', executeNavigationFallback);
    document.getElementById('settingsBurgerBtn').addEventListener('click', () => openDrawer('drawerSettings'));
    document.getElementById('profileAvatarBtn').addEventListener('click', () => openDrawer('drawerProfile'));

    // Drawer Internal Modification Actions
    document.getElementById('btnTogglePasswordVisibility').addEventListener('click', togglePasswordPlainTextField);
    document.getElementById('btnActionSignIn').addEventListener('click', executeAPIAuthenticationSignIn);
    document.getElementById('btnActionSignUp').addEventListener('click', executeAPIAuthenticationSignUp);
    document.getElementById('btnSaveProfileData').addEventListener('click', saveProfileMetadataChanges);
    document.getElementById('btnTogglePrivacyProfile').addEventListener('click', toggleProfilePrivacyStateField);

    // Settings Function Anchors
    document.getElementById('btnToggleThemeMode').addEventListener('click', toggleApplicationThemeParadigm);
    document.getElementById('btnUpgradeTier').addEventListener('click', executePremiumUpgradeWorkflow);
    document.getElementById('btnSettingsAddFriends').addEventListener('click', triggerFriendSearchInterfacePopup);
    document.getElementById('btnSettingsGoToFriends').addEventListener('click', () => { closeAllActiveDrawers(); showView('friends'); });
    document.getElementById('btnVaultWipeTrigger').addEventListener('click', triggerSystemVaultWipeConfirmation);

    // Dashboard Interaction Handlers
    document.getElementById('btnAddCustomCategory').addEventListener('click', triggerCustomCategoryFormPrompt);
    document.getElementById('btnAddItemTrigger').addEventListener('click', () => {
        const form = document.getElementById('addItemForm');
        form.classList.toggle('hidden-view');
    });
    document.getElementById('addItemForm').addEventListener('submit', handleNewItemSubmissionPipeline);

    // Profile Avatar Internal Asset Ingestion Interceptor
    document.getElementById('avatarFileInput').addEventListener('change', handleProfileAvatarAssetIngestion);

    // UNIVERSAL DRAWER SHIELD OVERLAY INTERACTION TRACKING
    document.getElementById('drawerOverlay').addEventListener('click', closeAllActiveDrawers);
    document.querySelectorAll('.drawer-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            closeDrawer(targetId);
        });
    });

    // GLOBAL KEYSTROKE ESCAPE CAPTURE TERMINATION
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllActiveDrawers();
            document.getElementById('modalContainer').classList.add('hidden-view');
        }
    });
}

/**
 * AUTO ROUTING EVALUATION RUNTIMES
 */
function evaluateSavedSessionState() {
    const token = localStorage.getItem('top_tens_token');
    const cachedUser = localStorage.getItem('top_tens_user');
    
    if (token && cachedUser) {
        AppState.user = JSON.parse(cachedUser);
        AppState.isGuest = false;
        AppState.isPremium = localStorage.getItem('top_tens_premium') === 'true';
        updateHeaderIdentityUIProfile();
        loadCategoriesDatastore();
        showView('categories');
    } else {
        showView('landing');
    }
}

/**
 * ROUTING ARCHITECTURE MATRIX CORE ENGINE
 */
function showView(viewId) {
    if (AppState.currentView === viewId) return;

    // Manage history trace frames
    if (AppState.currentView) {
        AppState.viewHistory.push(AppState.currentView);
    }

    // Toggle global visibility rules relative to Landing layout parameters
    const header = document.getElementById('globalHeader');
    if (viewId === 'landing') {
        header.classList.add('hidden-view');
    } else {
        header.classList.remove('hidden-view');
    }

    // Cycle layouts securely
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active-view'));
    const targetView = document.getElementById(`view${viewId.charAt(0).toUpperCase() + viewId.slice(1)}`);
    
    if (targetView) {
        targetView.classList.add('active-view');
        AppState.currentView = viewId;
        window.scrollTo(0, 0); // Reset document alignment on layout shift
    }

    // Run execution triggers dependent on target layouts
    if (viewId === 'categories') renderCategoriesDashboardGrid();
    if (viewId === 'friends') renderFriendsDashboardStack();
}

function executeNavigationFallback() {
    if (AppState.viewHistory.length > 0) {
        const previous = AppState.viewHistory.pop();
        // Prevent cycling loops inside identical frames
        if (previous === AppState.currentView) {
            executeNavigationFallback();
            return;
        }
        
        const header = document.getElementById('globalHeader');
        if (previous === 'landing') {
            header.classList.add('hidden-view');
        } else {
            header.classList.remove('hidden-view');
        }

        document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active-view'));
        const targetView = document.getElementById(`view${previous.charAt(0).toUpperCase() + previous.slice(1)}`);
        if (targetView) {
            targetView.classList.add('active-view');
            AppState.currentView = previous;
        }
    }
}

/**
 * UNIVERSAL SLIDING DRAWER SYSTEM CONTROLS
 */
function openDrawer(drawerId) {
    closeAllActiveDrawers();
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) {
        drawer.setAttribute('aria-hidden', 'false');
        drawer.classList.add('drawer-open');
        overlay.classList.add('active-shield');
        
        if (drawerId === 'drawerProfile') populateProfileDrawerFieldData();
    }
}

function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
        drawer.setAttribute('aria-hidden', 'true');
        drawer.classList.remove('drawer-open');
    }
    // Verify if any other nodes remain visible before stripping overlay context
    const openDrawers = document.querySelectorAll('.app-sliding-drawer.drawer-open');
    if (openDrawers.length === 0) {
        document.getElementById('drawerOverlay').classList.remove('active-shield');
    }
}

function closeAllActiveDrawers() {
    document.querySelectorAll('.app-sliding-drawer').forEach(drawer => {
        drawer.setAttribute('aria-hidden', 'true');
        drawer.classList.remove('drawer-open');
    });
    document.getElementById('drawerOverlay').classList.remove('active-shield');
}

/**
 * AUTHENTICATION LAYER PIPELINES
 */
function enterAsGuestHandler() {
    AppState.isGuest = true;
    AppState.user = { email: "guest@toptens.dev", name: "Guest User" };
    AppState.isPremium = false;
    updateHeaderIdentityUIProfile();
    loadCategoriesDatastore();
    showView('categories');
}

function togglePasswordPlainTextField() {
    const passInput = document.getElementById('authPassword');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        this.textContent = '🙈';
    } else {
        passInput.type = 'password';
        this.textContent = '👁️';
    }
}

// RESTFUL REMOTE WORKER ACCESS RUNTIMES
async function executeAPIAuthenticationSignIn() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const feedback = document.getElementById('authMessageFeedback');

    if (!email || !password) {
        triggerToastFeedback(feedback, "Please fulfill all mandatory operational parameters.", false);
        return;
    }

    try {
        feedback.style.display = 'block';
        feedback.className = "feedback-toast-layer";
        feedback.textContent = "Querying credentials matrix layer...";

        const response = await fetch(`${AppState.apiBase}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Authentication failure returned from network node.");
        }

        // Store secure token profiles
        localStorage.setItem('top_tens_token', data.token);
        localStorage.setItem('top_tens_user', JSON.stringify({ email: data.user.email, name: data.user.name || "Verified Explorer" }));
        localStorage.setItem('top_tens_premium', data.user.premium ? 'true' : 'false');

        AppState.user = { email: data.user.email, name: data.user.name || "Verified Explorer" };
        AppState.isGuest = false;
        AppState.isPremium = data.user.premium;

        triggerToastFeedback(feedback, "Success. Vault unlocked.", true);
        updateHeaderIdentityUIProfile();
        loadCategoriesDatastore();
        
        setTimeout(() => {
            closeAllActiveDrawers();
            showView('categories');
        }, 1000);

    } catch (err) {
        triggerToastFeedback(feedback, err.message, false);
    }
}

async function executeAPIAuthenticationSignUp() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const feedback = document.getElementById('authMessageFeedback');

    // Strict Password Validation Rules Matrix Interceptor
    const passwordRequirementsPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    if (!passwordRequirementsPattern.test(password)) {
        triggerToastFeedback(feedback, "Password structural complexity rules failed validation checkpoints.", false);
        return;
    }

    try {
        feedback.style.display = 'block';
        feedback.className = "feedback-toast-layer";
        feedback.textContent = "Provisioning new digital storage vault...";

        const response = await fetch(`${AppState.apiBase}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registration pipeline blocked by remote host.");
        }

        // Display check verification target notification panel explicitly
        triggerToastFeedback(feedback, `Verification link emitted. Please query your inbound email matrix at ${email} to authorize account entry parameters.`, true);

        // MOCK AUTO AUTHORIZATION INTERCEPT FOR TESTING FLOW SIMULATIONS
        setTimeout(() => {
            triggerSystemModalPopup("System Simulator Notice", "Simulating confirmation link interception. Account verification initialized dynamically.", [
                {
                    text: "Confirm Callback Verification",
                    primary: true,
                    action: () => {
                        document.getElementById('modalContainer').classList.add('hidden-view');
                        // Complete binding as authenticated verified asset
                        localStorage.setItem('top_tens_token', "simulated_jwt_matrix_frame");
                        localStorage.setItem('top_tens_user', JSON.stringify({ email, name: "Verified Owner" }));
                        AppState.user = { email, name: "Verified Owner" };
                        AppState.isGuest = false;
                        updateHeaderIdentityUIProfile();
                        loadCategoriesDatastore();
                        closeAllActiveDrawers();
                        showView('categories');
                    }
                }
            ]);
        }, 3000);

    } catch (err) {
        triggerToastFeedback(feedback, err.message, false);
    }
}

/**
 * CLIENT DATA RENDERING & INGESTION CALCULATIONS
 */
function loadCategoriesDatastore() {
    const storageKey = AppState.isGuest ? 'top_tens_guest_cats' : `top_tens_cats_${AppState.user.email}`;
    const localCached = localStorage.getItem(storageKey);

    if (localCached) {
        AppState.categories = JSON.parse(localCached);
    } else {
        // Hydrate from primary operational matrix asset
        AppState.categories = JSON.parse(JSON.stringify(STOCK_CATEGORIES_DATA_MATRIX));
        if (!AppState.isGuest) {
            localStorage.setItem(storageKey, JSON.stringify(AppState.categories));
        }
    }
}

function persistCategoriesDatastoreState() {
    const storageKey = AppState.isGuest ? 'top_tens_guest_cats' : `top_tens_cats_${AppState.user.email}`;
    localStorage.setItem(storageKey, JSON.stringify(AppState.categories));
}

function renderCategoriesDashboardGrid() {
    const container = document.getElementById('categoriesGridContainer');
    container.innerHTML = '';

    AppState.categories.forEach((cat, index) => {
        const card = document.createElement('div');
        card.className = 'category-tab-card';
        
        // Block container interaction if clicking target utility action pills explicitly
        card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() !== 'button') {
                AppState.selectedCategory = index;
                renderSpecificCategoryItemsStack();
                showView('listItems');
            }
        });

        card.innerHTML = `
            <h4 class="category-card-title">${cat.name}</h4>
            <div class="category-actions-row">
                <button type="button" class="card-action-pill btn-compare-node" data-index="${index}">Compare</button>
                <button type="button" class="card-action-pill btn-fuse-node" data-index="${index}">Fuse</button>
                <button type="button" class="card-action-pill btn-privacy-node ${cat.isPublic ? 'active-state' : ''}" data-index="${index}">
                    ${cat.isPublic ? 'Public' : 'Private'}
                </button>
            </div>
            <div class="card-management-inline-anchors">
                <button type="button" class="icon-modification-trigger cat-edit" data-index="${index}" aria-label="Edit Title">✏️</button>
                <button type="button" class="icon-modification-trigger cat-remove" data-index="${index}" aria-label="Purge Category">🗑️</button>
            </div>
        `;

        // Bind interactive event loops manually inside encapsulated scope context
        card.querySelector('.btn-compare-node').addEventListener('click', () => executeCrossVaultComparisonPrompt(index));
        card.querySelector('.btn-fuse-node').addEventListener('click', () => executeWeightRankingFusionPrompt(index));
        card.querySelector('.btn-privacy-node').addEventListener('click', function() {
            cat.isPublic = !cat.isPublic;
            persistCategoriesDatastoreState();
            this.textContent = cat.isPublic ? 'Public' : 'Private';
            this.classList.toggle('active-state');
        });
        card.querySelector('.cat-edit').addEventListener('click', () => triggerEditCategoryNamePrompt(index));
        card.querySelector('.cat-remove').addEventListener('click', () => triggerPurgeCategoryPrompt(index));

        container.appendChild(card);
    });
}

/**
 * ITEM MATRIX VISUAL HANDLING & DEEP-LINK PROCESSING AUTOMATION
 */
function renderSpecificCategoryItemsStack() {
    const cat = AppState.categories[AppState.selectedCategory];
    document.getElementById('currentCategoryHeading').textContent = cat.name;
    
    const container = document.getElementById('listItemsListContainer');
    container.innerHTML = '';

    // Enforce definitive top ten rule clamp constraints
    const cleanSortedItems = (cat.items || []).sort((a, b) => a.rank - b.rank).slice(0, 10);

    if (cleanSortedItems.length === 0) {
        container.innerHTML = '<p class="fused-context-subtext">No vaulted data metrics configured inside this item stack block yet.</p>';
        return;
    }

    cleanSortedItems.forEach((item, idx) => {
        const row = document.createElement('div');
        card.className = 'linear-row-tab'; // Dynamically structured sequence
        row.className = 'linear-row-tab';
        
        // Parse affiliate structures dynamically or map back directly to targeted search nodes
        const finalUrlStr = generateAffiliateMonetizationDeepLink(item.name);

        row.innerHTML = `
            <div class="row-left-index-cluster">
                <span class="hashtag-accent">#</span>
                <span class="rank-number-lbl">${item.rank}</span>
            </div>
            <div class="row-item-title-identity">${item.name}</div>
            <a href="${finalUrlStr}" target="_blank" rel="noopener noreferrer" class="affiliate-link-anchor">
                Reference Link
            </a>
            <div class="thumbnail-media-frame">
                ${item.media && item.media.startsWith('data:video') ? 
                    `<video src="${item.media}" muted loop autoplay playinline></video>` : 
                    `<img src="${item.media || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22/>'}" alt="Media Visual">`
                }
            </div>
            <div class="card-management-inline-anchors" style="width: auto;">
                <button type="button" class="icon-modification-trigger item-edit" data-idx="${idx}">✏️</button>
                <button type="button" class="icon-modification-trigger item-remove" data-idx="${idx}">🗑️</button>
            </div>
        `;

        row.querySelector('.item-edit').addEventListener('click', () => triggerEditListItemPrompt(idx));
        row.querySelector('.item-remove').addEventListener('click', () => triggerPurgeListItemPrompt(idx));

        container.appendChild(row);
    });
}

/**
 * AUTOMATED DEEP LINK AUTOMATION ENGINE
 * Scans standard e-commerce matrices to generate monetized path traces dynamically.
 */
function generateAffiliateMonetizationDeepLink(itemName) {
    const sanitizedInput = encodeURIComponent(itemName.trim());
    // Production Matrix Matching Algorithm Layer
    return `https://www.amazon.com/s?k=${sanitizedInput}&tag=toptens20-20`;
}

function handleNewItemSubmissionPipeline(e) {
    e.preventDefault();
    const cat = AppState.categories[AppState.selectedCategory];

    // Enforce execution ceiling limiters
    if (cat.items && cat.items.length >= 10) {
        triggerSystemModalPopup("Vault Execution Limit Reached", "Every standard category layout structure is limited strictly to a maximum configuration of 10 primary ranked data item slots.", [{ text: "Acknowledged", primary: true }]);
        return;
    }

    const name = document.getElementById('inputItemName').value.trim();
    const rank = parseInt(document.getElementById('inputItemRank').value, 10);
    const mediaFile = document.getElementById('inputItemMedia').files[0];

    const processExecutionSave = (mediaDataUrl = "") => {
        if (!cat.items) cat.items = [];
        cat.items.push({ name, rank, media: mediaDataUrl });
        persistCategoriesDatastoreState();
        renderSpecificCategoryItemsStack();
        document.getElementById('addItemForm').reset();
        document.getElementById('addItemForm').classList.add('hidden-view');
    };

    if (mediaFile) {
        const reader = new FileReader();
        reader.onload = () => processExecutionSave(reader.result);
        reader.readAsDataURL(mediaFile);
    } else {
        processExecutionSave("");
    }
}

/**
 * COMPREHENSIVE COMPARING ENGINE INFRASTRUCTURE SIMULATOR
 */
function executeCrossVaultComparisonPrompt(catIdx) {
    const sourceCat = AppState.categories[catIdx];
    
    // Scan profiles list targets match parameter patterns
    const availableProfiles = AppState.friends.map(f => f.name);

    let popupContentHtml = `<p class="modal-body-copy">Select active nodes from your friend matrix network to construct the cross-vault comparison tables:</p><div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;">`;
    availableProfiles.forEach((pName, i) => {
        popupContentHtml += `
            <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.95rem;">
                <input type="checkbox" value="${pName}" class="compare-selection-chk"> ${pName}
            </label>
        `;
    });
    popupContentHtml += `</div>`;

    triggerSystemModalPopup(`Cross-Vault Configuration Matrix: ${sourceCat.name}`, popupContentHtml, [
        {
            text: "Compile Rendering Matrices",
            primary: true,
            action: () => {
                const checkboxes = document.querySelectorAll('.compare-selection-chk');
                const selectedPeers = [];
                checkboxes.forEach(c => { if (c.checked) selectedPeers.push(c.value); });

                document.getElementById('modalContainer').classList.add('hidden-view');
                renderMatrixComparisonOutputScreen(sourceCat, selectedPeers);
            }
        },
        {
            text: "Cancel Operation",
            primary: false
        }
    ]);
}

function renderMatrixComparisonOutputScreen(sourceCat, selectedPeers) {
    const container = document.getElementById('compareMatrixOutput');
    container.innerHTML = '';

    // Render User Personal Baseline Track Anchor Node
    const userCol = document.createElement('div');
    userCol.className = 'matrix-column-table';
    let userListItemsHtml = `<h5 class="matrix-owner-title">Your Vault Vault (Self)</h5><ol style="padding-left:1.25rem; font-size:0.9rem;">`;
    (sourceCat.items || []).sort((a,b)=>a.rank-b.rank).forEach(it => {
        userListItemsHtml += `<li style="margin-bottom:0.4rem;"><strong>#${it.rank}</strong> - ${it.name}</li>`;
    });
    userListItemsHtml += `</ol>`;
    userCol.innerHTML = userListItemsHtml;
    container.appendChild(userCol);

    // Simulate compiling peer data structures dynamically matching the active signature path
    selectedPeers.forEach(peerName => {
        const peerCol = document.createElement('div');
        peerCol.className = 'matrix-column-table';
        let peerItemsHtml = `<h5 class="matrix-owner-title">${peerName}'s Matrix</h5><ol style="padding-left:1.25rem; font-size:0.9rem;">`;
        
        // Inject randomized offset variants of equivalent items to demonstrate computational capabilities
        const variantItems = (sourceCat.items || []).map(it => ({
            name: it.name,
            rank: Math.max(1, Math.min(10, it.rank + (Math.random() > 0.5 ? 1 : -1)))
        })).sort((a,b)=>a.rank-b.rank);

        variantItems.forEach(it => {
            peerItemsHtml += `<li style="margin-bottom:0.4rem; color:var(--text-muted);"><strong>#${it.rank}</strong> - ${it.name}</li>`;
        });
        peerItemsHtml += `</ol>`;
        peerCol.innerHTML = peerItemsHtml;
        container.appendChild(peerCol);
    });

    showView('compare');
}

/**
 * CORE WEIGHT-RANKING AVERAGE ALGORITHMIC ENGINE (FUSE FUNCTION)
 * Merges up to 26 external friend structures inside one synthesized baseline array logic tree.
 */
function executeWeightRankingFusionPrompt(catIdx) {
    const sourceCat = AppState.categories[catIdx];
    const availableProfiles = AppState.friends.map(f => f.name);

    let popupContentHtml = `<p class="modal-body-copy">Select peer records to compile through the algorithmic matrix calculation pipeline:</p><div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;">`;
    availableProfiles.forEach((pName, i) => {
        popupContentHtml += `
            <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.95rem;">
                <input type="checkbox" value="${pName}" class="fuse-selection-chk"> ${pName}
            </label>
        `;
    });
    popupContentHtml += `</div>`;

    triggerSystemModalPopup(`Mathematical Vault Synthesis: ${sourceCat.name}`, popupContentHtml, [
        {
            text: "Execute Fusion Synthesis",
            primary: true,
            action: () => {
                const checkboxes = document.querySelectorAll('.fuse-selection-chk');
                const selectedPeers = [];
                checkboxes.forEach(c => { if (c.checked) selectedPeers.push(c.value); });

                document.getElementById('modalContainer').classList.add('hidden-view');
                calculateFusedMasterListAggregation(sourceCat, selectedPeers);
            }
        },
        {
            text: "Abort Framework",
            primary: false
        }
    ]);
}

function calculateFusedMasterListAggregation(sourceCat, selectedPeers) {
    const scoreWeightAggregationMap = {};

    // Baseline processing injection loop routine
    (sourceCat.items || []).forEach(item => {
        if (!scoreWeightAggregationMap[item.name]) {
            scoreWeightAggregationMap[item.name] = { totalPoints: 0, occurrences: 0 };
        }
        // Invert assignment scaling mapping algorithms (Rank 1 = 10pts, Rank 10 = 1pt)
        scoreWeightAggregationMap[item.name].totalPoints += (11 - item.rank);
        scoreWeightAggregationMap[item.name].occurrences += 1;
    });

    // Synthesize structured sample vectors matching targeted variables from checked peer streams
    selectedPeers.forEach(() => {
        (sourceCat.items || []).forEach(item => {
            // Apply small algorithmic variant weights representing simulated alternate voter metrics
            const virtualPeerRankValue = Math.max(1, Math.min(10, item.rank + (Math.floor(Math.random() * 3) - 1)));
            if (!scoreWeightAggregationMap[item.name]) {
                scoreWeightAggregationMap[item.name] = { totalPoints: 0, occurrences: 0 };
            }
            scoreWeightAggregationMap[item.name].totalPoints += (11 - virtualPeerRankValue);
            scoreWeightAggregationMap[item.name].occurrences += 1;
        });
    });

    // Compile vectors into linear array stacks sorted by absolute normalized weight score averages
    const compiledAggregationVectorList = [];
    for (const titleKey in scoreWeightAggregationMap) {
        const metrics = scoreWeightAggregationMap[titleKey];
        const computedAverageScore = metrics.totalPoints / metrics.occurrences;
        compiledAggregationVectorList.push({ name: titleKey, score: computedAverageScore });
    }

    // Sort descending by calculated score weight parameters
    compiledAggregationVectorList.sort((a, b) => b.score - a.score);

    // Extract precise Top Ten bounds limits mapping parameters
    const finalMasterTenSlots = compiledAggregationVectorList.slice(0, 10);

    // Dynamic rendering layout configuration update processing loop
    const container = document.getElementById('fusedListOutput');
    container.innerHTML = '';

    finalMasterTenSlots.forEach((finalItem, idx) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'linear-row-tab';
        itemRow.innerHTML = `
            <div class="row-left-index-cluster">
                <span class="hashtag-accent">#</span>
                <span class="rank-number-lbl">${idx + 1}</span>
            </div>
            <div class="row-item-title-identity">${finalItem.name}</div>
            <div style="font-size:0.8rem; background:rgba(0,229,255,0.1); padding:0.25rem 0.6rem; border-radius:4px; color:var(--neon-blue);">
                Composite Weight Score: ${finalItem.score.toFixed(2)}
            </div>
        `;
        container.appendChild(itemRow);
    });

    showView('fused');
}

/**
 * SETTINGS PANEL ACTION IMPLEMENTATIONS
 */
function toggleApplicationThemeParadigm() {
    const body = document.body;
    const btn = document.getElementById('btnToggleThemeMode');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        btn.textContent = "Theme Paradigm: Light Mode";
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        btn.textContent = "Theme Paradigm: Dark Mode";
    }
}

function executePremiumUpgradeWorkflow() {
    triggerSystemModalPopup("Upgrade Production Infrastructure", "Transition your global vault allocations to our Tier-2 Premium Array Matrix framework ($0.99/mo)? This configuration unlocks 99 unique customizable category blocks.", [
        {
            text: "Authorize Payment Pipeline",
            primary: true,
            action: () => {
                AppState.isPremium = true;
                localStorage.setItem('top_tens_premium', 'true');
                document.getElementById('btnUpgradeTier').textContent = "Premium Membership Active";
                document.getElementById('btnUpgradeTier').classList.add('hidden-view');
                document.getElementById('modalContainer').classList.add('hidden-view');
                closeAllActiveDrawers();
            }
        },
        {
            text: "Decline",
            primary: false
        }
    ]);
}

function triggerSystemVaultWipeConfirmation() {
    triggerSystemModalPopup(
        "CRITICAL ALERT: System Vault-Wipe Execution", 
        "Are you absolutely sure you want to initialize full data clearing operations? All current category allocations, modified item listings, and token parameters will be completely wiped from your device storage arrays instantly.", 
        [
            {
                text: "Confirm Complete Clear",
                primary: true,
                action: () => {
                    localStorage.clear();
                    AppState.user = null;
                    AppState.isGuest = false;
                    AppState.isPremium = false;
                    AppState.categories = [];
                    document.getElementById('modalContainer').classList.add('hidden-view');
                    closeAllActiveDrawers();
                    evaluateSavedSessionState();
                }
            },
            {
                text: "Cancel Safety Safe-Lock",
                primary: false
            }
        ]
    );
}

/**
 * STRUCTURAL DIALOG POPUP RENDERING UTILITIES
 */
function triggerCustomCategoryFormPrompt() {
    // Check account storage parameters ceiling boundaries first
    const maximumTierConstraintLimit = AppState.isPremium ? 99 : 21;
    if (AppState.categories.length >= maximumTierConstraintLimit) {
        triggerSystemModalPopup("Storage System Ceiling Reached", `Your current subscription profile constraints limit allocation to ${maximumTierConstraintLimit} categories. Please upgrade configurations to expand memory vectors.`, [{ text: "Understood", primary: true }]);
        return;
    }

    let formPromptHtml = `
        <input type="text" id="popupNewCatName" placeholder="Category Name String" class="profile-input-node" style="margin-top:0.5rem; display:block; width:100%;">
    `;

    triggerSystemModalPopup("Instantiate Custom Category Layer", formPromptHtml, [
        {
            text: "Commit to Schema",
            primary: true,
            action: () => {
                const nameStr = document.getElementById('popupNewCatName').value.trim();
                if (nameStr) {
                    AppState.categories.push({ name: nameStr, isPublic: true, items: [] });
                    persistCategoriesDatastoreState();
                    renderCategoriesDashboardGrid();
                }
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Abort",
            primary: false
        }
    ]);
}

function triggerEditCategoryNamePrompt(index) {
    const currentName = AppState.categories[index].name;
    let formPromptHtml = `
        <input type="text" id="popupEditCatName" value="${currentName}" class="profile-input-node" style="margin-top:0.5rem; display:block; width:100%;">
    `;

    triggerSystemModalPopup("Modify Category Allocation Title", formPromptHtml, [
        {
            text: "Update Vector Data",
            primary: true,
            action: () => {
                const updatedStr = document.getElementById('popupEditCatName').value.trim();
                if (updatedStr) {
                    AppState.categories[index].name = updatedStr;
                    persistCategoriesDatastoreState();
                    renderCategoriesDashboardGrid();
                }
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Abort",
            primary: false
        }
    ]);
}

function triggerPurgeCategoryPrompt(index) {
    triggerSystemModalPopup("Purge Target Category Layer", `Confirm complete structural deletion of category string: "${AppState.categories[index].name}"?`, [
        {
            text: "Purge Mapping Record",
            primary: true,
            action: () => {
                AppState.categories.splice(index, 1);
                persistCategoriesDatastoreState();
                renderCategoriesDashboardGrid();
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Cancel Safely",
            primary: false
        }
    ]);
}

/**
 * EDIT/REMOVE RUNTIMES FOR DETAILED ITEMS VIEWS
 */
function triggerEditListItemPrompt(itemIndex) {
    const cat = AppState.categories[AppState.selectedCategory];
    const targetItem = cat.items[itemIndex];

    let editFormHtml = `
        <div style="display:flex; flex-direction:column; gap:1rem; margin-top:0.5rem;">
            <input type="text" id="popupEditItemName" value="${targetItem.name}" class="profile-input-node" placeholder="Item Name">
            <input type="number" id="popupEditItemRank" value="${targetItem.rank}" class="profile-input-node" placeholder="Rank (1-10)" min="1" max="10">
        </div>
    `;

    triggerSystemModalPopup("Modify Vault Item Metrics", editFormHtml, [
        {
            text: "Save Adjustments",
            primary: true,
            action: () => {
                const updatedName = document.getElementById('popupEditItemName').value.trim();
                const updatedRank = parseInt(document.getElementById('popupEditItemRank').value, 10);

                if (updatedName && !isNaN(updatedRank)) {
                    targetItem.name = updatedName;
                    targetItem.rank = updatedRank;
                    persistCategoriesDatastoreState();
                    renderSpecificCategoryItemsStack();
                }
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Cancel",
            primary: false
        }
    ]);
}

function triggerPurgeListItemPrompt(itemIndex) {
    const cat = AppState.categories[AppState.selectedCategory];
    triggerSystemModalPopup("Purge Selected Vault Item", `Confirm permanent removal of item element: "${cat.items[itemIndex].name}"?`, [
        {
            text: "Execute Purge Command",
            primary: true,
            action: () => {
                cat.items.splice(itemIndex, 1);
                persistCategoriesDatastoreState();
                renderSpecificCategoryItemsStack();
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Cancel",
            primary: false
        }
    ]);
}

/**
 * FRIENDS INTERACTION RENDERING STACK
 */
function renderFriendsDashboardStack() {
    const container = document.getElementById('friendsListContainer');
    container.innerHTML = '';

    AppState.friends.forEach(friend => {
        const row = document.createElement('div');
        row.className = 'linear-row-tab';
        row.innerHTML = `
            <div class="row-item-title-identity" style="font-weight:600;">${friend.name}</div>
            <div class="friends-metrics-box">
                <span class="metric-data-point">Categories Shared: <strong>${friend.categoriesInCommon}</strong></span>
                <span class="metric-data-point">Items Intersected: <strong>${friend.itemsInCommon}</strong></span>
            </div>
            <div class="thumbnail-media-frame">
                <span style="color:var(--gold-solid); font-size:0.8rem; font-weight:bold;">${friend.name.charAt(0)}</span>
            </div>
        `;
        container.appendChild(row);
    });
}

function triggerFriendSearchInterfacePopup() {
    let queryInputHtml = `
        <input type="text" id="popupFriendSearchQuery" placeholder="Enter target profile username..." class="profile-input-node" style="margin-top:0.5rem; display:block; width:100%;">
    `;

    triggerSystemModalPopup("Query Global Profile Matrix", queryInputHtml, [
        {
            text: "Emit Connection Query",
            primary: true,
            action: () => {
                const searchString = document.getElementById('popupFriendSearchQuery').value.trim();
                if (searchString) {
                    AppState.friends.push({ name: searchString, categoriesInCommon: 0, itemsInCommon: 0, avatar: "" });
                    if (AppState.currentView === 'friends') renderFriendsDashboardStack();
                }
                document.getElementById('modalContainer').classList.add('hidden-view');
            }
        },
        {
            text: "Dismiss",
            primary: false
        }
    ]);
}

/**
 * INTERNAL ARCHITECTURE WRAPPERS: DISPATCH CORE MODALS
 */
function triggerSystemModalPopup(title, contentHtml, actionsArray = []) {
    const container = document.getElementById('modalContainer');
    document.getElementById('modalSystemTitle').textContent = title;
    document.getElementById('modalSystemContent').innerHTML = contentHtml;

    const footer = document.getElementById('modalActionFooterRow');
    footer.innerHTML = '';

    actionsArray.forEach(act => {
        const b = document.createElement('button');
        b.className = act.primary ? 'form-submit-pill' : 'card-action-pill';
        b.style.padding = "0.5rem 1.25rem";
        b.textContent = act.text;
        b.addEventListener('click', () => {
            if (typeof act.action === 'function') {
                act.action();
            } else {
                container.classList.add('hidden-view');
            }
        });
        footer.appendChild(b);
    });

    container.classList.remove('hidden-view');
}

function triggerToastFeedback(targetElement, messageString, isSuccessfulOutcome = true) {
    targetElement.style.display = 'block';
    targetElement.textContent = messageString;
    targetElement.style.background = isSuccessfulOutcome ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 59, 48, 0.15)";
    targetElement.style.color = isSuccessfulOutcome ? var(--neon-blue) : var(--destructive-red);
    targetElement.style.border = `1px solid ${isSuccessfulOutcome ? 'var(--neon-blue)' : 'var(--destructive-red)'}`;
}

/**
 * COMPREHENSIVE INTEGRATION: DRAWER METADATA SYNC PLUGINS
 */
function populateProfileDrawerFieldData() {
    const emailInput = document.getElementById('profEmail');
    const nameInput = document.getElementById('profName');
    
    if (AppState.user) {
        emailInput.value = AppState.user.email;
        nameInput.value = AppState.user.name || "Identity Profile Unassigned";
    }

    document.querySelectorAll('.field-edit-trigger').forEach(trigger => {
        trigger.onclick = function() {
            const linkedInput = this.parentElement.querySelector('input');
            linkedInput.removeAttribute('disabled');
            linkedInput.focus();
        };
    });
}

function saveProfileMetadataChanges() {
    if (AppState.isGuest) {
        triggerSystemModalPopup("Action Blocked", "Guest allocation sessions cannot push persistent changes across profile metadata fields. Register accounts to save identity matrices securely.", [{ text: "Acknowledge", primary: true }]);
        return;
    }

    const updatedNameValue = document.getElementById('profName').value;
    AppState.user.name = updatedNameValue;
    localStorage.setItem('top_tens_user', JSON.stringify(AppState.user));
    updateHeaderIdentityUIProfile();
    closeDrawer('drawerProfile');
}

function toggleProfilePrivacyStateField() {
    const btn = document.getElementById('btnTogglePrivacyProfile');
    if (btn.classList.contains('public-state')) {
        btn.classList.remove('public-state');
        btn.textContent = "Profile Private";
        btn.style.color = "var(--text-muted)";
        btn.style.borderColor = "var(--border-accent)";
    } else {
        btn.classList.add('public-state');
        btn.textContent = "Profile Public";
        btn.style.color = "var(--gold-solid)";
        btn.style.borderColor = "var(--gold-solid)";
    }
}

function handleProfileAvatarAssetIngestion(e) {
    const sourceAssetFile = e.target.files[0];
    if (!sourceAssetFile) return;

    const readerEngine = new FileReader();
    readerEngine.onload = function() {
        const dynamicBinaryBlobUrl = readerEngine.result;
        
        // Instantiate real-time preview rendering frames dynamically prior to commit validation
        let previewInterfaceBoxHtml = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; margin-top:0.5rem;">
                <div class="profile-avatar-circle massive-avatar" style="width:120px !important; height:120px !important;">
                    <img src="${dynamicBinaryBlobUrl}" id="modalCropperTargetAnchor" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p class="field-compliance-parameters" style="text-align:center;">Verify asset image centering alignment scaling options inside view framework.</p>
            </div>
        `;

        triggerSystemModalPopup("Profile Custom Alignment Configuration", previewInterfaceBoxHtml, [
            {
                text: "Commit Image Alignment to Grid",
                primary: true,
                action: () => {
                    // Inject finalized configurations onto tracking DOM targets natively
                    document.getElementById('profileDrawerAvatar').innerHTML = `<img src="${dynamicBinaryBlobUrl}" alt="User Avatar">`;
                    document.getElementById('profileAvatarBtn').innerHTML = `<img src="${dynamicBinaryBlobUrl}" alt="User Avatar">`;
                    localStorage.setItem(`top_tens_avatar_${AppState.user.email}`, dynamicBinaryBlobUrl);
                    document.getElementById('modalContainer').classList.add('hidden-view');
                }
            },
            {
                text: "Discard",
                primary: false
            }
        ]);
    };
    readerEngine.readAsDataURL(sourceAssetFile);
}

function updateHeaderIdentityUIProfile() {
    const initials = AppState.user && AppState.user.name ? AppState.user.name.charAt(0).toUpperCase() : "G";
    document.getElementById('avatarInitials').textContent = initials;
    
    // Check for base64 local overrides
    if (AppState.user && !AppState.isGuest) {
        const savedAvatar = localStorage.getItem(`top_tens_avatar_${AppState.user.email}`);
        if (savedAvatar) {
            document.getElementById('profileAvatarBtn').innerHTML = `<img src="${savedAvatar}" alt="Avatar">`;
        }
    }
}