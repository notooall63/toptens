// D:/top-tens/frontend/app.js

(function() {
    const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";

    // STATE INITIALIZATION ENGINE
    let appState = {
        userToken: localStorage.getItem('vault_jwt') || null,
        userEmail: localStorage.getItem('vault_email') || null,
        isPremium: false,
        activePage: 'view-landing-page',
        historyStack: ['view-landing-page'],
        vaultData: JSON.parse(localStorage.getItem('cached_vault')) || INITIAL_STOCK_CATEGORIES,
        profile: JSON.parse(localStorage.getItem('cached_profile')) || {
            name: '', dob: '', hometown: '', vocation: '', avatar: '', isPublic: true
        },
        friends: [
            { name: "AlphaTrader", commonCategories: 4, commonItems: 22, avatar: "" },
            { name: "QuantumBot", commonCategories: 7, commonItems: 41, avatar: "" }
        ],
        currentActiveCategoryContext: null
    };

    // DOM REGISTRY BINDINGS
    const UI = {
        pages: document.querySelectorAll('.app-page-view'),
        header: document.getElementById('master-application-header'),
        backBtn: document.getElementById('header-back-button'),
        burgerMenu: document.getElementById('header-burger-settings'),
        avatarAnchor: document.getElementById('header-profile-avatar-anchor'),
        avatarImg: document.getElementById('header-profile-avatar-img'),
        overlay: document.getElementById('modal-overlay-container'),
        toast: document.getElementById('toast-notification-system'),
        drawers: document.querySelectorAll('.universal-docked-drawer'),
        
        // Landings
        btnEnterVault: document.getElementById('btn-landing-enter-vault'),
        btnSignGateway: document.getElementById('btn-landing-sign-gateway'),
        
        // Categories Layout
        categoriesGrid: document.getElementById('categories-grid-viewport'),
        btnAddCustomCategoryModal: document.getElementById('btn-trigger-custom-category-modal'),
        
        // Modals Structural Nodes
        modalCategory: document.getElementById('modal-custom-category-injection'),
        inputCategoryName: document.getElementById('input-modal-category-name'),
        btnCategoryCancel: document.getElementById('btn-category-modal-cancel'),
        btnCategoryCommit: document.getElementById('btn-category-modal-commit'),
        
        // Items View Outlets
        itemsStack: document.getElementById('items-list-vertical-stack'),
        inputItemTitle: document.getElementById('input-item-title'),
        inputItemRank: document.getElementById('input-item-rank'),
        inputItemMedia: document.getElementById('input-item-media'),
        btnCommitItem: document.getElementById('btn-commit-item-injection'),
        contextTitle: document.getElementById('items-panel-context-title'),
        
        // Drawers
        drawerAuth: document.getElementById('drawer-authentication-gateway'),
        drawerProfile: document.getElementById('drawer-profile-management'),
        drawerSettings: document.getElementById('drawer-settings-configuration'),
        
        // Authentication Interface Fields
        authEmail: document.getElementById('auth-email-field'),
        authPassword: document.getElementById('auth-password-field'),
        btnTogglePass: document.getElementById('btn-auth-toggle-visibility'),
        btnSignIn: document.getElementById('btn-auth-execute-signin'),
        btnSignUp: document.getElementById('btn-auth-execute-signup'),
        
        // Profile Internal Forms Handles
        pName: document.getElementById('profile-field-fullname'),
        pDob: document.getElementById('profile-field-dob'),
        pHometown: document.getElementById('profile-field-hometown'),
        pVocation: document.getElementById('profile-field-vocation'),
        pEmail: document.getElementById('profile-field-email'),
        pRecovery: document.getElementById('profile-field-recovery'),
        pAvatarFile: document.getElementById('input-avatar-file-binder'),
        pAvatarPreview: document.getElementById('profile-drawer-avatar-preview'),
        pToggleVisibility: document.getElementById('btn-profile-visibility-toggle'),
        pSaveBtn: document.getElementById('btn-profile-save-and-synchronize'),
        
        // Settings Internal Elements Links
        btnThemeToggle: document.getElementById('btn-settings-toggle-theme-matrix'),
        btnUpgrade: document.getElementById('btn-settings-tier-upgrade'),
        btnWipeVault: document.getElementById('btn-settings-wipe-vault-sequence'),
        btnSettingsAddFriends: document.getElementById('btn-settings-add-friends-shortcut'),
        btnSettingsRouteFriends: document.getElementById('btn-settings-route-friends-view'),
        
        // Modals Sub-interfaces Handles
        modalWipe: document.getElementById('modal-confirmation-vault-wipe'),
        btnWipeAbort: document.getElementById('btn-wipe-abort-sequence'),
        btnWipeConfirm: document.getElementById('btn-wipe-confirm-destruction'),
        
        // Friends Modal Outlets
        btnFriendsTrigger: document.getElementById('btn-trigger-friends-discovery-modal'),
        modalFriends: document.getElementById('modal-friends-search-discovery'),
        inputFriendsQuery: document.getElementById('input-modal-friends-query'),
        friendsResults: document.getElementById('friends-search-results-output-node'),
        friendsClose: document.getElementById('btn-friends-modal-close'),
        friendsPageStack: document.getElementById('friends-list-vertical-stack'),
        
        // Comparators and Fusions Panels
        modalCompare: document.getElementById('modal-comparison-friends-picker'),
        compareCheckboxes: document.getElementById('comparison-checkbox-selection-matrix'),
        btnCompareCancel: document.getElementById('btn-compare-picker-cancel'),
        btnCompareSubmit: document.getElementById('btn-compare-picker-submit'),
        compareViewCanvas: document.getElementById('compare-matrix-scrollable-canvas'),
        
        modalFuse: document.getElementById('modal-fuse-friends-picker'),
        fuseCheckboxes: document.getElementById('fuse-checkbox-selection-matrix'),
        btnFuseCancel: document.getElementById('btn-fuse-picker-cancel'),
        btnFuseSubmit: document.getElementById('btn-fuse-picker-submit'),
        fuseViewStack: document.getElementById('fuse-list-vertical-stack'),
        
        // Image Cropping Engine Nodes
        modalCrop: document.getElementById('modal-crop-interface'),
        cropImgTarget: document.getElementById('image-node-target-for-crop'),
        btnCropCancel: document.getElementById('btn-crop-cancel-discard'),
        btnCropCommit: document.getElementById('btn-crop-commit-transform')
    };

    let temporarySelectedFile = null;

    // RUNTIME INITIALIZATION BLOCK
    function initialize() {
        bindEvents();
        evaluateUrlVerificationContext();
        renderActivePageContext();
        refreshProfileUIElements();
    }

    function showToast(msg, duration = 4000) {
        UI.toast.innerText = msg;
        UI.toast.classList.remove('toast-hidden');
        setTimeout(() => UI.toast.classList.add('toast-hidden'), duration);
    }

    // INTERFACE NAVIGATION SYSTEM
    function navigateToPage(pageId) {
        appState.activePage = pageId;
        if (appState.historyStack[appState.historyStack.length - 1] !== pageId) {
            appState.historyStack.push(pageId);
        }
        renderActivePageContext();
    }

    function navigateBackSequence() {
        if (appState.historyStack.length > 1) {
            appState.historyStack.pop();
            appState.activePage = appState.historyStack[appState.historyStack.length - 1];
            renderActivePageContext();
        }
    }

    function renderActivePageContext() {
        UI.pages.forEach(p => p.classList.remove('state-active'));
        const activeNode = document.getElementById(appState.activePage);
        if (activeNode) activeNode.classList.add('state-active');

        if (appState.activePage === 'view-landing-page') {
            UI.header.classList.add('header-hidden');
        } else {
            UI.header.classList.remove('header-hidden');
        }

        if (appState.historyStack.length <= 1) {
            UI.backBtn.style.visibility = 'hidden';
        } else {
            UI.backBtn.style.visibility = 'visible';
        }

        // Context dynamic data rendering execution route mapping rules
        if (appState.activePage === 'view-categories-page') renderCategoriesMatrix();
        if (appState.activePage === 'view-items-page') renderItemsVerticalStack();
        if (appState.activePage === 'view-friends-page') renderFriendsViewLayout();
    }

    // DRAWERS CONTROL SUBSYSTEMS
    // Preceded by: your collapseAllDrawers() function definition or global declarations
// Followed by: your next UI event listener or helper function

    function expandDrawer(drawerNode) {
        if (!drawerNode) {
            console.error("expandDrawer error: drawerNode is undefined or null.");
            return;
        }
        
        collapseAllDrawers();
        drawerNode.classList.remove('state-collapsed');
        
        if (UI && UI.overlay) {
            UI.overlay.classList.remove('modal-overlay-hidden');
        } else {
            console.warn("expandDrawer warning: UI.overlay elements are not initialized yet.");
        }
    }

    function collapseAllDrawers() {
        UI.drawers.forEach(d => d.classList.add('state-collapsed'));
        UI.overlay.classList.add('modal-overlay-hidden');
        hideAllModals();
    }

    function hideAllModals() {
        UI.modalCategory.classList.add('modal-hidden');
        UI.modalWipe.classList.add('modal-hidden');
        UI.modalFriends.classList.add('modal-hidden');
        UI.modalCrop.classList.add('modal-hidden');
        UI.modalCompare.classList.add('modal-hidden');
        UI.modalFuse.classList.add('modal-hidden');
    }

    function triggerModal(modalNode) {
        UI.overlay.classList.remove('modal-overlay-hidden');
        modalNode.classList.remove('modal-hidden');
    }

    // DATA MUTATION PERSISTENCE LAYERS
    async function executeCloudVaultSynchronization() {
        if (!appState.userToken) {
            localStorage.setItem('cached_vault', JSON.stringify(appState.vaultData));
            localStorage.setItem('cached_profile', JSON.stringify(appState.profile));
            return; // Guest local storage failover validation pass exit path
        }
        try {
            const resp = await fetch(`${API_BASE}/api/vault/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${appState.userToken}`
                },
                body: JSON.stringify({
                    vaultData: appState.vaultData,
                    profile: appState.profile,
                    isPremium: appState.isPremium
                })
            });
            if (!resp.ok) throw new Error('Synchronization error returned off server cluster');
            localStorage.setItem('cached_vault', JSON.stringify(appState.vaultData));
            localStorage.setItem('cached_profile', JSON.stringify(appState.profile));
        } catch (err) {
            showToast(`Sync Failure Falling back locally: ${err.message}`);
        }
    }

    async function executeCloudVaultPull() {
        if (!appState.userToken) return;
        try {
            const resp = await fetch(`${API_BASE}/api/vault/pull`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${appState.userToken}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data.vaultData) appState.vaultData = data.vaultData;
                if (data.profile) appState.profile = data.profile;
                appState.isPremium = !!data.isPremium;
                localStorage.setItem('cached_vault', JSON.stringify(appState.vaultData));
                localStorage.setItem('cached_profile', JSON.stringify(appState.profile));
                refreshProfileUIElements();
            }
        } catch (err) {
            showToast("Failed pulling down persistent cloud structure state models.");
        }
    }

    // AUTOMATION HOOKS AND AFFILIATE INJECTIONS
    function generateAffiliateAutomationLink(itemName) {
        const queryToken = encodeURIComponent(itemName);
        return `https://www.amazon.com/s?k=${queryToken}&tag=toptens2026-20`;
    }

    // DYNAMIC RENDERING INTERFACES: CATEGORIES MATRIX
    function renderCategoriesMatrix() {
        UI.categoriesGrid.innerHTML = '';
        appState.vaultData.forEach((cat) => {
            const card = document.createElement('div');
            card.className = 'category-rectangle-card';
            
            // Evaluates total active structures array allocation lengths
            const totalCount = cat.items ? cat.items.length : 0;
            
            card.innerHTML = `
                <h3 class="category-label-text">${escapeHtml(cat.name)}</h3>
                <p class="category-item-count-subtext">(${totalCount} items)</p>
                <div class="category-functional-button-strip">
                    <button class="category-strip-btn btn-compare-action" data-id="${cat.id}">Compare</button>
                    <button class="category-strip-btn btn-fuse-action" data-id="${cat.id}">Fuse</button>
                    <button class="category-strip-btn btn-visibility-toggle" data-id="${cat.id}">
                        ${cat.isPublic ? 'Public' : 'Private'}
                    </button>
                </div>
                <div class="card-mutator-icon-cluster">
                    <span class="mutator-icon-action btn-edit-cat" data-id="${cat.id}">✏️</span>
                    <span class="mutator-icon-action btn-remove-cat" data-id="${cat.id}">❌</span>
                </div>
            `;
            
            // Event capturing routing separation logic paths
            card.addEventListener('click', (e) => {
                if (e.target.closest('.category-functional-button-strip') || e.target.closest('.card-mutator-icon-cluster')) {
                    return; // Swallowed by absolute elements selectors inside block bounds execution trap
                }
                appState.currentActiveCategoryContext = cat.id;
                navigateToPage('view-items-page');
            });
            
            UI.categoriesGrid.appendChild(card);
        });

        // Attach listeners to isolated targets dynamically populated inside innerHTML configuration block
        UI.categoriesGrid.querySelectorAll('.btn-visibility-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const target = appState.vaultData.find(c => c.id === id);
                if (target) {
                    target.isPublic = !target.isPublic;
                    executeCloudVaultSynchronization();
                    renderCategoriesMatrix();
                }
            });
        });

        UI.categoriesGrid.querySelectorAll('.btn-remove-cat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                appState.vaultData = appState.vaultData.filter(c => c.id !== id);
                executeCloudVaultSynchronization();
                renderCategoriesMatrix();
            });
        });

        UI.categoriesGrid.querySelectorAll('.btn-edit-cat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const target = appState.vaultData.find(c => c.id === id);
                if (target) {
                    const newName = prompt("Update category metric structural identification token tag string:", target.name);
                    if (newName) {
                        target.name = newName;
                        executeCloudVaultSynchronization();
                        renderCategoriesMatrix();
                    }
                }
            });
        });

        UI.categoriesGrid.querySelectorAll('.btn-compare-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openComparisonFriendsPicker(id);
            });
        });

        UI.categoriesGrid.querySelectorAll('.btn-fuse-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openFuseFriendsPicker(id);
            });
        });
    }

    // DYNAMIC RENDERING INTERFACES: ITEMS MONOLITH SEQUENCE VIEW
    function renderItemsVerticalStack() {
        const cat = appState.vaultData.find(c => c.id === appState.currentActiveCategoryContext);
        if (!cat) return;

        UI.contextTitle.innerText = `MANAGE ${cat.name.toUpperCase()} REPOSITORY ENTRIES`;
        UI.itemsStack.innerHTML = '';

        // Enforce chronological sorting logic constraints bounds strictly across allocation layer array states
        const orderedItems = (cat.items || []).sort((a, b) => a.rank - b.rank).slice(0, 10);

        orderedItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'linear-strip-row-component';
            
            const mediaSourcePlaceholder = item.media || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a9ba8'><rect width='24' height='24' fill='%23141923'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ffe57f' font-size='8'>No Pic</text></svg>`;
            
            let renderingMediaTag = `<img src="${mediaSourcePlaceholder}" alt="Thumbnail Asset">`;
            if (mediaSourcePlaceholder.startsWith('data:video/') || mediaSourcePlaceholder.includes('blob:http') && item.isMediaVideo) {
                renderingMediaTag = `<video src="${mediaSourcePlaceholder}" autoplay loop muted playsinline></video>`;
            }

            row.innerHTML = `
                <span class="strip-hashtag-token">#</span>
                <span class="strip-rank-integer">${item.rank}</span>
                <span class="strip-core-title-label">${escapeHtml(item.name)}</span>
                <a class="strip-affiliate-automation-link" href="${item.link || generateAffiliateAutomationLink(item.name)}" target="_blank" rel="noopener">Reference Link</a>
                <div class="strip-circular-thumbnail-frame explicit-thumbnail-mutation-trigger" data-rank="${item.rank}">
                    ${renderingMediaTag}
                </div>
                <div class="card-mutator-icon-cluster" style="opacity:1; position:relative; bottom:auto; right:auto; margin-left:16px;">
                    <span class="mutator-icon-action btn-edit-item" data-rank="${item.rank}">✏️</span>
                    <span class="mutator-icon-action btn-remove-item" data-rank="${item.rank}">❌</span>
                </div>
            `;
            
            UI.itemsStack.appendChild(row);
        });

        // Attachment bindings elements triggers loops inline execution maps
        UI.itemsStack.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rank = parseInt(btn.getAttribute('data-rank'));
                cat.items = cat.items.filter(i => i.rank !== rank);
                executeCloudVaultSynchronization();
                renderItemsVerticalStack();
            });
        });

        UI.itemsStack.querySelectorAll('.btn-edit-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rank = parseInt(btn.getAttribute('data-rank'));
                const targetItem = cat.items.find(i => i.rank === rank);
                if (targetItem) {
                    const newTitle = prompt("Update identity title token structure matching record context:", targetItem.name);
                    if (newTitle) {
                        targetItem.name = newTitle;
                        targetItem.link = generateAffiliateAutomationLink(newTitle);
                        executeCloudVaultSynchronization();
                        renderItemsVerticalStack();
                    }
                }
            });
        });

        UI.itemsStack.querySelectorAll('.explicit-thumbnail-mutation-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const rank = parseInt(trigger.getAttribute('data-rank'));
                const targetItem = cat.items.find(i => i.rank === rank);
                const fileInputSurrogate = document.createElement('input');
                fileInputSurrogate.type = 'file';
                fileInputSurrogate.accept = 'image/*,video/*';
                fileInputSurrogate.onchange = (ev) => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    
                    if (file.type.startsWith('video/')) {
                        const videoUrl = URL.createObjectURL(file);
                        const videoObjCheck = document.createElement('video');
                        videoObjCheck.src = videoUrl;
                        videoObjCheck.onloadedmetadata = () => {
                            if (videoObjCheck.duration > 6.2) {
                                showToast("Validation exception: Parameter constraint limits media files strictly underneath 6 seconds context durations bounds.");
                                return;
                            }
                            targetItem.media = videoUrl;
                            targetItem.isMediaVideo = true;
                            executeCloudVaultSynchronization();
                            renderItemsVerticalStack();
                        };
                    } else {
                        const reader = new FileReader();
                        reader.onload = (readerEvent) => {
                            temporarySelectedFile = { type: 'item', targetRank: rank, dataUrl: readerEvent.target.result };
                            openCroppingModalInterface(readerEvent.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                fileInputSurrogate.click();
            });
        });
    }

    // DYNAMIC RENDERING INTERFACES: FRIENDS LAYOUT STRUCTURE MATRIX
    function renderFriendsViewLayout() {
        UI.friendsPageStack.innerHTML = '';
        appState.friends.forEach(f => {
            const row = document.createElement('div');
            row.className = 'linear-strip-row-component';
            
            const picSource = f.avatar || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4af37'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>`;

            row.innerHTML = `
                <span class="strip-core-title-label" style="font-weight:700;">${escapeHtml(f.name)}</span>
                <span style="flex:2; font-size:0.85rem; color:var(--text-muted)">Categories in Common: <strong>${f.commonCategories}</strong></span>
                <span style="flex:2; font-size:0.85rem; color:var(--text-muted)">Items in Common: <strong>${f.commonItems}</strong></span>
                <div class="strip-circular-thumbnail-frame" style="margin:0 0 0 16px;">
                    <img src="${picSource}" alt="Profile Pic">
                </div>
            `;
            UI.friendsPageStack.appendChild(row);
        });
    }

    // MATRIX CORES CALCULATION CORES: TRANS-COMPARISON & RE-WEIGHTED FUSIONS
    function openComparisonFriendsPicker(catId) {
        UI.compareCheckboxes.innerHTML = '';
        appState.friends.forEach((f, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.margin = '8px 0';
            wrapper.innerHTML = `
                <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                    <input type="checkbox" value="${f.name}" class="compare-selector-cb" data-idx="${idx}">
                    <span>${escapeHtml(f.name)}</span>
                </label>
            `;
            UI.compareCheckboxes.appendChild(wrapper);
        });
        UI.btnCompareSubmit.setAttribute('data-source-cat', catId);
        triggerModal(UI.modalCompare);
    }

    function openFuseFriendsPicker(catId) {
        UI.fuseCheckboxes.innerHTML = '';
        appState.friends.forEach((f, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.margin = '8px 0';
            wrapper.innerHTML = `
                <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                    <input type="checkbox" value="${f.name}" class="fuse-selector-cb" data-idx="${idx}">
                    <span>${escapeHtml(f.name)}</span>
                </label>
            `;
            UI.fuseCheckboxes.appendChild(wrapper);
        });
        UI.btnFuseSubmit.setAttribute('data-source-cat', catId);
        triggerModal(UI.modalFuse);
    }

    function executeTransComparativeRenderingPipeline(targetCatId, selectedFriendNames) {
        const baseCat = appState.vaultData.find(c => c.id === targetCatId);
        UI.compareViewCanvas.innerHTML = '';

        // Inject the core primary baseline structural entity array container column sheet first
        const primaryColumn = document.createElement('div');
        primaryColumn.className = 'compare-column-bucket';
        primaryColumn.innerHTML = `<h3 style="color:var(--neon-blue); border-bottom:1px solid var(--gold-primary); margin-bottom:12px; padding-bottom:4px;">YOU (Primary)</h3>`;
        
        const sortedBaseItems = (baseCat.items || []).sort((a,b) => a.rank - b.rank);
        sortedBaseItems.forEach(i => {
            primaryColumn.innerHTML += `<div style="margin:6px 0; font-size:0.9rem;"><strong>#${i.rank}</strong> - ${escapeHtml(i.name)}</div>`;
        });
        UI.compareViewCanvas.appendChild(primaryColumn);

        // Mock multi-node relative transformation engine pipeline sequence layer matrix array nodes mapping blocks loop parameters iteration tracking points
        selectedFriendNames.forEach(name => {
            const col = document.createElement('div');
            col.className = 'compare-column-bucket';
            col.innerHTML = `<h3 style="color:var(--gold-primary); border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:12px; padding-bottom:4px;">${escapeHtml(name)}</h3>`;
            
            // Mirror structures arrays alignment simulation matrix transformation logic definitions blocks 
            const scrambledMockItems = sortedBaseItems.map(i => ({...i})).sort(() => Math.random() - 0.5);
            scrambledMockItems.forEach((item, index) => {
                col.innerHTML += `<div style="margin:6px 0; font-size:0.9rem; color:var(--text-muted)"><strong>#${index+1}</strong> - ${escapeHtml(item.name)}</div>`;
            });
            UI.compareViewCanvas.appendChild(col);
        });

        navigateToPage('view-compare-page');
    }

    function executeWeightedFusionPipeline(targetCatId, selectedFriendNames) {
        const baseCat = appState.vaultData.find(c => c.id === targetCatId);
        UI.fuseViewStack.innerHTML = '';
        
        const masterWeightAggregationMatrix = {};

        function ingestItemWeightMatrix(name, rank) {
            const key = name.trim().toLowerCase();
            if (!masterWeightAggregationMatrix[key]) {
                masterWeightAggregationMatrix[key] = { originalName: name, totalWeightPoints: 0, occurrences: 0 };
            }
            // Weight Ranking Average Formula: Inverse ranking allocation mapping optimization profile 
            const weightCalculatedScalar = (11 - rank);
            masterWeightAggregationMatrix[key].totalWeightPoints += weightCalculatedScalar;
            masterWeightAggregationMatrix[key].occurrences += 1;
        }

        if (baseCat && baseCat.items) {
            baseCat.items.forEach(i => ingestItemWeightMatrix(i.name, i.rank));
        }

        selectedFriendNames.forEach(() => {
            if (baseCat && baseCat.items) {
                baseCat.items.forEach(i => {
                    const noiseScrambleRank = Math.min(10, Math.max(1, i.rank + Math.floor(Math.random() * 3) - 1));
                    ingestItemWeightMatrix(i.name, noiseScrambleRank);
                });
            }
        });

        const compiledFusionRanksArray = [];
        for (const key in masterWeightAggregationMatrix) {
            const item = masterWeightAggregationMatrix[key];
            const mathematicalAveragedRankResult = 11 - (item.totalWeightPoints / (selectedFriendNames.length + 1));
            compiledFusionRanksArray.push({ name: item.originalName, computedRankScore: mathematicalAveragedRankResult });
        }

        compiledFusionRanksArray.sort((a,b) => a.computedRankScore - b.computedRankScore);
        const standardizedTopTenExtractionSlice = compiledFusionRanksArray.slice(0, 10);

        standardizedTopTenExtractionSlice.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'linear-strip-row-component';
            row.innerHTML = `
                <span class="strip-hashtag-token">#</span>
                <span class="strip-rank-integer">${index + 1}</span>
                <span class="strip-core-title-label">${escapeHtml(item.name)}</span>
                <span style="color:var(--text-muted); font-size:0.85rem;">Computed Index Load Score: <strong>${item.computedRankScore.toFixed(2)}</strong></span>
            `;
            UI.fuseViewStack.appendChild(row);
        });

        navigateToPage('view-fuse-page');
    }

    // IMAGE CROPPING PORTAL RUNTIME TRANSLATION
    function openCroppingModalInterface(dataUrl) {
        UI.cropImgTarget.src = dataUrl;
        triggerModal(UI.modalCrop);
    }

    // USER DATA PROFILE RECONCILIATION UPDATES
    function refreshProfileUIElements() {
        const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4af37'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>`;
        const finalUrl = appState.profile.avatar || fallbackAvatar;
        
        UI.avatarImg.src = finalUrl;
        UI.pAvatarPreview.src = finalUrl;
        
        UI.pName.value = appState.profile.name || '';
        UI.pDob.value = appState.profile.dob || '';
        UI.pHometown.value = appState.profile.hometown || '';
        UI.pVocation.value = appState.profile.vocation || '';
        UI.pEmail.value = appState.userEmail || 'GUEST_ENVIRONMENT_RECONCILIATION';
        UI.pRecovery.value = appState.profile.recovery || '';
        
        if (appState.profile.isPublic) {
            UI.pToggleVisibility.innerText = "Profile Public";
            UI.pToggleVisibility.classList.remove('dynamic-danger-color-theme');
        } else {
            UI.pToggleVisibility.innerText = "Profile Private";
            UI.pToggleVisibility.classList.add('dynamic-danger-color-theme');
        }

        if (appState.isPremium) {
            UI.btnUpgrade.innerText = "Premium Vault Tier Active (99 Slots Enabled)";
            UI.btnUpgrade.disabled = true;
            UI.btnUpgrade.style.borderColor = "var(--neon-green)";
        } else {
            UI.btnUpgrade.innerText = "Upgrade to Premium ($0.99/mo)";
            UI.btnUpgrade.disabled = false;
        }
    }

    // NETWORK AUTHENTICATION REST INTERACTION BOUNDS
    async function executeGatewaySignupTransaction() {
        const email = UI.authEmail.value;
        const pass = UI.authPassword.value;
        
        // Comprehensive Client Password Matrix Validation Checks Prior to Discharging Outbound Network Frame payloads
        const rx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[{\]};:<>|./?,-]).{8,20}$/;
        if (!rx.test(pass)) {
            showToast("Password validation constraint fault. Check specifications rule criteria parameter thresholds.");
            return;
        }

        try {
            const resp = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Server rejected registration pipeline format frame');
            showToast("System validation packet fired. Inspect designated verification folder coordinates.");
        } catch (err) {
            showToast(`Sign Up Interrupted: ${err.message}`);
        }
    }

    async function executeGatewaySigninTransaction() {
        const email = UI.authEmail.value;
        const pass = UI.authPassword.value;
        try {
            const resp = await fetch(`${API_BASE}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Identity mapping credential matching validation exception');
            
            appState.userToken = data.token;
            appState.userEmail = data.email;
            if (data.profile) appState.profile = data.profile;
            appState.isPremium = !!data.isPremium;
            
            localStorage.setItem('vault_jwt', data.token);
            localStorage.setItem('vault_email', data.email);
            
            showToast("Cryptographic Session Identity Cleared. Re-routing to storage nodes.");
            collapseAllDrawers();
            await executeCloudVaultPull();
            navigateToPage('view-categories-page');
        } catch (err) {
            showToast(`Authentication Refused: ${err.message}`);
        }
    }

    async function evaluateUrlVerificationContext() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('verify_token');
        if (token) {
            try {
                const resp = await fetch(`${API_BASE}/api/auth/verify?token=${token}`);
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error || 'Verification transaction confirmation failure.');
                
                appState.userToken = data.token;
                appState.userEmail = data.email;
                localStorage.setItem('vault_jwt', data.token);
                localStorage.setItem('vault_email', data.email);
                
                showToast("Account confirmation sequence validated completely! Vault initializations complete.");
                window.history.replaceState({}, document.title, "/");
                await executeCloudVaultPull();
                navigateToPage('view-categories-page');
            } catch (err) {
                showToast(`Token verification process crashed: ${err.message}`);
            }
        }
    }

    // EXPLICIT EVENT INTERCEPTORS BINDINGS ENGINE
    function bindEvents() {
        // Navigations Structural Anchors Events
        UI.backBtn.addEventListener('click', navigateBackSequence);
        UI.btnEnterVault.addEventListener('click', () => navigateToPage('view-categories-page'));
        UI.btnSignGateway.addEventListener('click', () => expandDrawer(UI.drawerAuth));
        
        UI.avatarAnchor.addEventListener('click', () => expandDrawer(UI.drawerProfile));
        UI.burgerMenu.addEventListener('click', () => expandDrawer(UI.drawerSettings));
        
        // Universal Drawer Dismissals Bindings Interface Hooks
        UI.overlay.addEventListener('click', collapseAllDrawers);
        document.querySelectorAll('.drawer-close-trigger-x').forEach(btn => {
            btn.addEventListener('click', collapseAllDrawers);
        });

        // Add Category Actions Controllers
        UI.btnAddCustomCategoryModal.addEventListener('click', () => triggerModal(UI.modalCategory));
        UI.btnCategoryCancel.addEventListener('click', hideAllModals);
        UI.btnCategoryCommit.addEventListener('click', () => {
            const name = UI.inputCategoryName.value.trim();
            if (!name) return;
            
            // Limit bounds execution paths checks validation metrics matching criteria lists shapes
            const currentTotalLimitThreshold = appState.isPremium ? 99 : 21;
            if (appState.vaultData.length >= currentTotalLimitThreshold) {
                showToast(`Storage Allocation Exhausted. Tier limits capped strictly at ${currentTotalLimitThreshold} units context structures.`);
                return;
            }

            const newCat = { id: `custom-${Date.now()}`, name, isPublic: true, items: [] };
            appState.vaultData.push(newCat);
            executeCloudVaultSynchronization();
            renderCategoriesMatrix();
            UI.inputCategoryName.value = '';
            collapseAllDrawers();
        });

        // Add Items Actions Controller Hook Binder Sequences
        UI.btnCommitItem.addEventListener('click', () => {
            const cat = appState.vaultData.find(c => c.id === appState.currentActiveCategoryContext);
            if (!cat) return;

            const title = UI.inputItemTitle.value.trim();
            const rank = parseInt(UI.inputItemRank.value);

            if (!title || isNaN(rank) || rank < 1 || rank > 10) {
                showToast("Parameter type mismatch validation index fault.");
                return;
            }

            if (!cat.items) cat.items = [];
            
            // Filter dynamic arrays records to drop duplicate positional rankings collisions rows
            cat.items = cat.items.filter(i => i.rank !== rank);

            const newItem = { rank, name: title, link: generateAffiliateAutomationLink(title), media: "" };
            cat.items.push(newItem);
            
            executeCloudVaultSynchronization();
            renderItemsVerticalStack();

            UI.inputItemTitle.value = '';
            UI.inputItemRank.value = '';
        });

        // Authenticators Interface Inputs Triggers Hooks Elements Binders Loops
        UI.btnTogglePass.addEventListener('click', () => {
            const t = UI.authPassword.type === 'password' ? 'text' : 'password';
            UI.authPassword.type = t;
        });
        UI.btnSignUp.addEventListener('click', executeGatewaySignupTransaction);
        UI.btnSignIn.addEventListener('click', executeGatewaySigninTransaction);

        // Profiles Management Interaction Hooks
        UI.pToggleVisibility.addEventListener('click', () => {
            appState.profile.isPublic = !appState.profile.isPublic;
            refreshProfileUIElements();
        });
        UI.pSaveBtn.addEventListener('click', () => {
            appState.profile.name = UI.pName.value;
            appState.profile.dob = UI.pDob.value;
            appState.profile.hometown = UI.pHometown.value;
            appState.profile.vocation = UI.pVocation.value;
            appState.profile.recovery = UI.pRecovery.value;
            executeCloudVaultSynchronization();
            showToast("System user details data state records pushed to storage completely.");
            collapseAllDrawers();
            refreshProfileUIElements();
        });

        UI.pAvatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => {
                temporarySelectedFile = { type: 'avatar', dataUrl: re.target.result };
                openCroppingModalInterface(re.target.result);
            };
            reader.readAsDataURL(file);
        });

        // Cropping Core Canvas Transform Commit Execution Map Controls Interfaces
        UI.btnCropCancel.addEventListener('click', hideAllModals);
        UI.btnCropCommit.addEventListener('click', () => {
            if (!temporarySelectedFile) return;
            // High fidelity image compression transform baseline simulation canvas operation logic block
            const simCanvas = document.createElement('canvas');
            simCanvas.width = 180;
            simCanvas.height = 180;
            const simCtx = simCanvas.getContext('2d');
            const img = new Image();
            img.src = temporarySelectedFile.dataUrl;
            img.onload = () => {
                simCtx.drawImage(img, 0, 0, 180, 180);
                const optimizedDataUrl = simCanvas.toDataURL('image/jpeg', 0.8);
                
                if (temporarySelectedFile.type === 'avatar') {
                    appState.profile.avatar = optimizedDataUrl;
                    refreshProfileUIElements();
                    executeCloudVaultSynchronization();
                } else if (temporarySelectedFile.type === 'item') {
                    const cat = appState.vaultData.find(c => c.id === appState.currentActiveCategoryContext);
                    if (cat && cat.items) {
                        const it = cat.items.find(i => i.rank === temporarySelectedFile.targetRank);
                        if (it) {
                            it.media = optimizedDataUrl;
                            it.isMediaVideo = false;
                            renderItemsVerticalStack();
                            executeCloudVaultSynchronization();
                        }
                    }
                }
                temporarySelectedFile = null;
                hideAllModals();
            };
        });

        // Settings Structural Panels Control Binders Actions Strip 
        UI.btnThemeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
        });

        UI.btnUpgrade.addEventListener('click', () => {
            appState.isPremium = true;
            executeCloudVaultSynchronization();
            refreshProfileUIElements();
            showToast("Transaction Processed Successfully. Storage expanded to 99 structural slot contexts.");
        });

        UI.btnWipeVault.addEventListener('click', () => triggerModal(UI.modalWipe));
        UI.btnWipeAbort.addEventListener('click', hideAllModals);
        UI.btnWipeConfirm.addEventListener('click', () => {
            appState.vaultData = INITIAL_STOCK_CATEGORIES;
            executeCloudVaultSynchronization();
            hideAllModals();
            collapseAllDrawers();
            showToast("System complete data clear parameters execution vectors successfully processed.");
            if (appState.activePage === 'view-categories-page') renderCategoriesMatrix();
        });

        UI.btnSettingsAddFriends.addEventListener('click', () => triggerModal(UI.modalFriends));
        UI.btnSettingsRouteFriends.addEventListener('click', () => { collapseAllDrawers(); navigateToPage('view-friends-page'); });
        UI.btnFriendsTrigger.addEventListener('click', () => triggerModal(UI.modalFriends));
        UI.friendsClose.addEventListener('click', hideAllModals);

        UI.inputFriendsQuery.addEventListener('input', () => {
            const q = UI.inputFriendsQuery.value.trim().toLowerCase();
            UI.friendsResults.innerHTML = '';
            if (q.length < 2) return;

            // Simulated decentralized networks lookup transformation layer engine matrix blocks configuration logic definitions fields structures
            const mockGlobalRegistry = ["OmegaSystem", "BetaDeltaVariant", "SigmaVaultCore", "WoodsonAlgos", "AegisArbitrage"];
            const filtered = mockGlobalRegistry.filter(u => u.toLowerCase().includes(q));
            
            filtered.forEach(u => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.padding = '8px';
                item.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                item.innerHTML = `
                    <span>${escapeHtml(u)}</span>
                    <button class="neon-green-action-button" style="padding:4px 8px; font-size:0.75rem;">+ Add Friend</button>
                `;
                item.querySelector('button').addEventListener('click', () => {
                    if (!appState.friends.some(f => f.name === u)) {
                        appState.friends.push({ name: u, commonCategories: Math.floor(Math.random() * 8), commonItems: Math.floor(Math.random() * 50), avatar: "" });
                        showToast(`Connection parameters mapped directly onto profile element handles: ${u}`);
                        renderFriendsViewLayout();
                    }
                    hideAllModals();
                });
                UI.friendsResults.appendChild(item);
            });
        });

        // Select Pickers Submissions Pipeline Interceptors Handlers Configuration Maps Triggers
        UI.btnCompareCancel.addEventListener('click', hideAllModals);
        UI.btnCompareSubmit.addEventListener('click', () => {
            const catId = UI.btnCompareSubmit.getAttribute('data-source-cat');
            const selected = Array.from(UI.compareCheckboxes.querySelectorAll('.compare-selector-cb:checked')).map(cb => cb.value);
            hideAllModals();
            executeTransComparativeRenderingPipeline(catId, selected);
        });

        UI.btnFuseCancel.addEventListener('click', hideAllModals);
        UI.btnFuseSubmit.addEventListener('click', () => {
            const catId = UI.btnFuseSubmit.getAttribute('data-source-cat');
            const selected = Array.from(UI.fuseCheckboxes.querySelectorAll('.fuse-selector-cb:checked')).map(cb => cb.value);
            hideAllModals();
            executeWeightedFusionPipeline(catId, selected);
        });
    }

    // SANITIZATION UTILITIES SECURITY ENGINE ESCAPING PROFILES LAYOUT ARRAYS SHAPES
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // RUN THE RUNTIME SYSTEM BOOTSTRAPPER CONTEXT EXECUTIONS ENGINE INSTANTIATOR
    document.addEventListener('DOMContentLoaded', initialize);
})();
// Example of the structural trap to check for:
function initializeDOMEventMappings() {
    // If ANY of these selectors return null, the script crashes here...
    document.getElementById('settings-btn').addEventListener('click', () => expandDrawer(UI.settingsDrawer));
    document.getElementById('profile-btn').addEventListener('click', () => expandDrawer(UI.profileDrawer));
    
    // ...And these lines below will NEVER execute!
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.addEventListener('click', handleBackNavigation);
    });
}
function safeBindClick(elementId, callback) {
        const el = document.getElementById(elementId);
        if (el) {
            el.addEventListener('click', callback);
        } else {
            console.warn(`UI Initialization Warning: Element #${elementId} not found in DOM.`);
        }
    }

    // Apply this to your broken components:
    safeBindClick('settings-trigger-id', () => expandDrawer(UI.settingsDrawer));
    safeBindClick('profile-trigger-id', () => expandDrawer(UI.profileDrawer));

    // For your back buttons:
    document.querySelectorAll('.back-button-class').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Your back navigation handling logic here
        });
    });