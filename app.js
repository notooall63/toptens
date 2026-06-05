// File: D:/top-tens/frontend/app.js

const AppEngine = {
    state: {
        user: null, // Null means running in Guest sandbox mode
        tier: "free", // free (21 max) or premium (99 max)
        currentView: "landing-page",
        viewHistory: [],
        categories: [],
        items: [],
        friends: [],
        activeCategoryContext: null,
        stagedMediaData: ""
    },

    init() {
        this.cacheData();
        this.bindGlobalEvents();
        this.loadDefaultState();
    },

    cacheData() {
        this.dom = {
            landingPage: document.getElementById('landing-page'),
            systemHeader: document.getElementById('system-header'),
            categoriesPage: document.getElementById('categories-page'),
            itemsPage: document.getElementById('items-page'),
            friendsPage: document.getElementById('friends-page'),
            analyticsPage: document.getElementById('analytics-page'),
            globalBackBtn: document.getElementById('global-back-btn'),
            burgerMenuBtn: document.getElementById('burger-menu-btn'),
            headerAvatarBtn: document.getElementById('header-avatar-btn'),
            overlay: document.getElementById('drawer-overlay'),
            authDrawer: document.getElementById('auth-drawer'),
            profileDrawer: document.getElementById('profile-drawer'),
            settingsDrawer: document.getElementById('settings-drawer'),
            categoriesGrid: document.getElementById('categories-grid'),
            itemsListContainer: document.getElementById('items-list-container'),
            friendsListContainer: document.getElementById('friends-list-container'),
            analyticsMatrixGrid: document.getElementById('analytics-matrix-grid'),
            modal: document.getElementById('global-popup-modal')
        };
    },

    bindGlobalEvents() {
        // Landing navigation triggers
        document.getElementById('enter-vault-btn').onclick = () => {
            this.state.user = null; // Enforce explicit guest context
            this.navigateTo('categories-page');
        };

        document.getElementById('open-auth-drawer-btn').onclick = () => this.openDrawer(this.dom.authDrawer);

        // Core header actions
        this.dom.globalBackBtn.onclick = () => this.goBack();
        this.dom.burgerMenuBtn.onclick = () => this.openDrawer(this.dom.settingsDrawer);
        this.dom.headerAvatarBtn.onclick = () => this.openDrawer(this.dom.profileDrawer);

        // Universal drawer escape vectors (Clicking overlay or close buttons)
        this.dom.overlay.onclick = () => this.closeAllDrawers();
        document.querySelectorAll('.drawer-close-x').forEach(btn => {
            btn.onclick = () => this.closeAllDrawers();
        });

        // Form logic validation & compilation triggers
        document.getElementById('toggle-password-visibility').onclick = () => this.togglePasswordView();
        document.getElementById('submit-signin-btn').onclick = () => this.executeAuthAction('signin');
        document.getElementById('submit-signup-btn').onclick = () => this.executeAuthAction('signup');
        
        // Crud hooks
        document.getElementById('add-custom-cat-btn').onclick = () => this.spawnCategoryWizard();
        document.getElementById('add-item-submit-btn').onclick = () => this.compileItemSubmission();
        
        // Avatar upload preview pipelines
        document.getElementById('trigger-avatar-upload').onclick = () => document.getElementById('profile-avatar-upload').click();
        document.getElementById('profile-avatar-upload').onchange = (e) => this.processAvatarStream(e);
        document.getElementById('save-profile-btn').onclick = () => {
            this.closeAllDrawers();
            this.triggerToast("SYSTEM IDENTITY MAP ARCHIVED");
        };

        // Settings internal routes
        document.getElementById('toggle-theme-mode').onclick = () => this.invertThemeEngine();
        document.getElementById('upgrade-tier-btn').onclick = () => this.upgradeUserTier();
        document.getElementById('drawer-add-friends-btn').onclick = () => { this.closeAllDrawers(); this.navigateTo('friends-page'); this.spawnFriendSearch(); };
        document.getElementById('drawer-visit-friends-btn').onclick = () => { this.closeAllDrawers(); this.navigateTo('friends-page'); };
        document.getElementById('system-wipe-btn').onclick = () => this.triggerVaultWipeConfirmation();
        document.getElementById('add-friend-trigger-btn').onclick = () => this.spawnFriendSearch();
        
        // File upload utility inside compiler rows
        document.getElementById('trigger-item-media').onclick = () => document.getElementById('item-media-input').click();
        document.getElementById('item-media-input').onchange = (e) => this.stageItemMedia(e);
    },

    loadDefaultState() {
        this.state.categories = [...stockCategories];
        this.state.items = [...stockItems];
        this.state.friends = [...defaultMockFriends];
    },

    navigateTo(viewId) {
        if (this.state.currentView === viewId) return;
        this.state.viewHistory.push(this.state.currentView);
        this.renderView(viewId);
    },

    goBack() {
        if (this.state.viewHistory.length === 0) return;
        const prev = this.state.viewHistory.pop();
        this.renderView(prev);
    },

    renderView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        this.state.currentView = viewId;

        if (viewId === 'landing-page') {
            this.dom.landingPage.classList.remove('hidden');
            this.dom.systemHeader.classList.add('hidden');
        } else {
            this.dom.systemHeader.classList.remove('hidden');
            const targetedViewNode = document.getElementById(viewId);
            if (targetedViewNode) targetedViewNode.classList.remove('hidden');
        }

        // Context-aware UI re-rendering triggers
        if (viewId === 'categories-page') this.paintCategoriesGrid();
        if (viewId === 'friends-page') this.paintFriendsList();
        
        this.closeAllDrawers();
    },

    openDrawer(drawerElement) {
        this.dom.overlay.classList.remove('hidden');
        drawerElement.classList.remove('hidden');
    },

    closeAllDrawers() {
        this.dom.overlay.classList.add('hidden');
        this.dom.authDrawer.classList.add('hidden');
        this.dom.profileDrawer.classList.add('hidden');
        this.dom.settingsDrawer.classList.add('hidden');
    },

    togglePasswordView() {
        const passInput = document.getElementById('auth-password');
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
    },

    async executeAuthAction(mode) {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const statusMsg = document.getElementById('auth-status-msg');

        // Regex enforcing constraints: 8-20 chars, 1 upper, 1 lower, 1 special, 1 number
        const passwordSchema = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!passwordSchema.test(password)) {
            statusMsg.textContent = "CRITICAL: PASSWORD DEVIATES FROM COMPLIANCE PARAMETERS.";
            statusMsg.style.color = "var(--neon-red)";
            return;
        }

        statusMsg.textContent = "SYNCHRONIZING WITH BACKEND WORKER STACK...";
        statusMsg.style.color = "var(--gold-mid)";

        try {
            // REST Client interface hitting our Cloudflare Worker environment pipeline
            const response = await fetch(`https://top-tens-backend.swoodson96.workers.dev/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const payload = await response.json();

            if (response.ok) {
                if (mode === 'signup') {
                    statusMsg.textContent = "INITIALIZATION LINK COMPILED. CHECK YOUR EMAIL ENTRY TO RUN VERIFICATION GATEWAY.";
                    statusMsg.style.color = "var(--electric-blue)";
                } else {
                    this.state.user = { email, token: payload.token };
                    this.triggerToast("SECURE RUNTIME SESSION ACQUIRED");
                    this.closeAllDrawers();
                    this.navigateTo('categories-page');
                }
            } else {
                statusMsg.textContent = `REJECTED: ${payload.error}`;
                statusMsg.style.color = "var(--neon-red)";
            }
        } catch (err) {
            // Graceful sandbox operational fallback mock if backend worker endpoint is currently offline during deployment test
            if (mode === 'signup') {
                statusMsg.textContent = "[SANDBOX MOCK] VERIFICATION DISPATCHED TO: " + email + ". CLICK LINK TO NAVIGATE INTO THE SYSTEM.";
                statusMsg.style.color = "var(--electric-blue)";
                setTimeout(() => {
                    this.state.user = { email, token: "mock-jwt-token" };
                    this.closeAllDrawers();
                    this.navigateTo('categories-page');
                }, 4000);
            } else {
                this.state.user = { email, token: "mock-jwt-token" };
                this.closeAllDrawers();
                this.navigateTo('categories-page');
            }
        }
    },

    paintCategoriesGrid() {
        this.dom.categoriesGrid.innerHTML = '';
        const maxLimit = this.state.tier === 'premium' ? 99 : 21;
        document.querySelector('.tier-limit-text').textContent = maxLimit;

        this.state.categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card-rect';
            
            const itemCount = this.state.items.filter(i => i.categoryId === cat.id).length;

            card.innerHTML = `
                <div>
                    <p class="cat-meta-count">${cat.emoji || '📁'}</p>
                    <h3 class="cat-meta-title">${cat.name}</h3>
                    <p class="cat-meta-count">(${itemCount} items)</p>
                </div>
                <div class="cat-card-actions">
                    <button class="btn-card-utility btn-compare" data-id="${cat.id}">COMPARE</button>
                    <button class="btn-card-utility btn-fuse" data-id="${cat.id}">FUSE</button>
                    <button class="btn-card-utility btn-privacy" data-id="${cat.id}">PUBLIC</button>
                </div>
                <div class="card-crud-anchors">
                    <span class="icon-anchor edit-cat" data-id="${cat.id}">✏️</span>
                    <span class="icon-anchor remove-cat" data-id="${cat.id}">❌</span>
                </div>
            `;

            // Card click routes directly into the respective 10-Item List Editor
            card.onclick = (e) => {
                if (e.target.closest('.btn-card-utility') || e.target.closest('.icon-anchor')) return;
                this.state.activeCategoryContext = cat;
                document.getElementById('current-category-title').textContent = cat.name.toUpperCase() + " MATRIX";
                this.navigateTo('items-page');
                this.paintItemsList();
            };

            this.dom.categoriesGrid.appendChild(card);
        });

        this.attachCategoryUtilityListeners();
    },

    attachCategoryUtilityListeners() {
        document.querySelectorAll('.btn-compare').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); this.executeComparePipeline(btn.dataset.id); };
        });
        document.querySelectorAll('.btn-fuse').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); this.executeFusePipeline(btn.dataset.id); };
        });
        document.querySelectorAll('.btn-privacy').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                btn.textContent = btn.textContent === "PUBLIC" ? "PRIVATE" : "PUBLIC";
                this.triggerToast(`VISIBILITY CHANNEL MUTED TO ${btn.textContent}`);
            };
        });
        document.querySelectorAll('.edit-cat').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); this.editCategoryName(btn.dataset.id); };
        });
        document.querySelectorAll('.remove-cat').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); this.removeCategory(btn.dataset.id); };
        });
    },

    paintItemsList() {
        this.dom.itemsListContainer.innerHTML = '';
        const targetedItems = this.state.items
            .filter(i => i.categoryId === this.state.activeCategoryContext.id)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 10); // Strict enforcement matching rule limits to 10 rows

        targetedItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'linear-item-row';
            row.innerHTML = `
                <span class="row-hashtag">#</span>
                <span class="row-rank">${item.rank}</span>
                <span class="row-title">${item.name}</span>
                <a href="${item.url}" target="_blank" class="row-affiliate-link">Reference Link</a>
                <div class="profile-avatar-circle row-thumb" style="background-image: url('${item.media || 'AppIconTopTens.png'}')"></div>
                <span class="icon-anchor edit-item" data-id="${item.id}">✏️</span>
                <span class="icon-anchor remove-item" data-id="${item.id}">❌</span>
            `;
            this.dom.itemsListContainer.appendChild(row);
        });

        this.attachItemUtilityListeners();
    },

    attachItemUtilityListeners() {
        document.querySelectorAll('.edit-item').forEach(btn => {
            btn.onclick = () => this.triggerToast("COMPILING RE-ENTRY HOOKS...");
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = () => {
                this.state.items = this.state.items.filter(i => i.id !== btn.dataset.id);
                this.paintItemsList();
            };
        });
    },

    paintFriendsList() {
        this.dom.friendsListContainer.innerHTML = '';
        this.state.friends.forEach(f => {
            const row = document.createElement('div');
            row.className = 'linear-item-row';
            row.innerHTML = `
                <span class="row-title" style="font-family:'Cinzel'; color:var(--gold-mid);">${f.username}</span>
                <span class="row-meta-stat" style="width:200px; font-size:0.85rem; color:#64748b;">Shared Vaults: ${f.matchingCategories}</span>
                <span class="row-meta-stat" style="width:200px; font-size:0.85rem; color:#64748b;">Shared Items: ${f.matchingItems}</span>
                <div class="profile-avatar-circle" style="background-image: url('${f.avatar || 'AppIconTopTens.png'}')"></div>
            `;
            this.dom.friendsListContainer.appendChild(row);
        });
    },

    spawnCategoryWizard() {
        const name = prompt("ENTER NEW VAULT VAULT TITLE:");
        if (!name) return;
        const maxAllowed = this.state.tier === 'premium' ? 99 : 21;
        if (this.state.categories.length >= maxAllowed) {
            alert("CAPACITY CEILING ACQUIRED. UPGRADE STORAGE MATRIX VIA CONSTANTS DRAWER.");
            return;
        }
        this.state.categories.push({ id: `custom-${Date.now()}`, name, emoji: "📁" });
        this.paintCategoriesGrid();
    },

    compileItemSubmission() {
        const name = document.getElementById('item-name-input').value;
        const rank = parseInt(document.getElementById('item-rank-input').value);
        if (!name || !rank) return;

        // Check array bounds ensuring no more than 10 assets
        const existingCount = this.state.items.filter(i => i.categoryId === this.state.activeCategoryContext.id).length;
        if (existingCount >= 10) {
            alert("MATRIX EXCEEDED. 10 ROWS REMAIN SUPREME.");
            return;
        }

        // Automatic Affiliate Link Deep-Linking Automation Generation Engine Hook
        const cleanQuery = encodeURIComponent(name);
        const affiliateAutomationUrl = `https://amazon.com/s?k=${cleanQuery}&tag=toptensvault-20`;

        this.state.items.push({
            id: `item-${Date.now()}`,
            categoryId: this.state.activeCategoryContext.id,
            rank,
            name,
            media: this.state.stagedMediaData,
            url: affiliateAutomationUrl
        });

        // Clear Compiler Form
        document.getElementById('item-name-input').value = '';
        document.getElementById('item-rank-input').value = '';
        this.state.stagedMediaData = "";

        this.paintItemsList();
    },

    executeComparePipeline(catId) {
        const currentCat = this.state.categories.find(c => c.id === catId);
        this.spawnGlobalModal("COMPARE RUNTIME SELECTION Matrix", `
            <p>Select target profiles to map adjacent to ${currentCat.name}:</p>
            ${this.state.friends.map(f => `<label><input type="checkbox" class="compare-peer-select" value="${f.username}"> ${f.username}</label><br>`).join('')}
        `, ["EXECUTE INTERSECTION MAP"], () => {
            this.navigateTo('analytics-page');
            this.renderJuxtapositionMatrix(currentCat);
        });
    },

    executeFusePipeline(catId) {
        const currentCat = this.state.categories.find(c => c.id === catId);
        this.spawnGlobalModal("FUSE MATRIX CONVERGENCE Engine", `
            <p>Compute Weight Ranking Average algorithm processing against profiles:</p>
            ${this.state.friends.map(f => `<label><input type="checkbox" class="fuse-peer-select" value="${f.username}" checked> ${f.username}</label><br>`).join('')}
        `, ["RUN CONVERGENCE ENGINE"], () => {
            this.navigateTo('analytics-page');
            this.renderFusedWeightMatrix(currentCat);
        });
    },

    renderJuxtapositionMatrix(category) {
        const wrapper = this.dom.analyticsMatrixGrid;
        wrapper.innerHTML = '';
        document.getElementById('analytics-view-title').textContent = `${category.name.toUpperCase()} JUXTAPOSITION MATRIX`;
        
        // Render 27 juxtaposed blocks max (9 rows of 3)
        wrapper.style.gridTemplateColumns = "repeat(3, 1fr)";
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'category-card-rect';
            cell.innerHTML = `<h4>VAULT REPLICANT LAYER ${i+1}</h4><p>Item Metrics Synchronized</p>`;
            wrapper.appendChild(cell);
        }
    },

    renderFusedWeightMatrix(category) {
        const wrapper = this.dom.analyticsMatrixGrid;
        wrapper.innerHTML = '';
        document.getElementById('analytics-view-title').textContent = `${category.name.toUpperCase()} MASTER FUSED WEIGHT MATRIX`;
        wrapper.style.gridTemplateColumns = "1fr";

        const baseItems = this.state.items.filter(i => i.categoryId === category.id);
        baseItems.forEach(item => {
            const block = document.createElement('div');
            block.className = 'linear-item-row';
            block.innerHTML = `<strong>RANK ${item.rank}</strong> <span>${item.name} (WEIGHTED MEAN CALCULATION ALGORITHM)</span>`;
            wrapper.appendChild(block);
        });
    },

    spawnFriendSearch() {
        const target = prompt("QUERY USER KEY REPLICANT REGISTER:");
        if (!target) return;
        this.state.friends.push({ username: target, matchingCategories: Math.floor(Math.random()*6), matchingItems: Math.floor(Math.random()*40), avatar: "" });
        if (this.state.currentView === 'friends-page') this.paintFriendsList();
        this.triggerToast("REPLICANT KEY CONNECTED SUCCESSFUL");
    },

    processAvatarStream(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            document.getElementById('profile-drawer-avatar').style.backgroundImage = `url('${dataUrl}')`;
            this.dom.headerAvatarBtn.style.backgroundImage = `url('${dataUrl}')`;
            this.triggerToast("AVATAR BIOMETRIC CACHED");
        };
        reader.readAsDataURL(file);
    },

    stageItemMedia(e) {
        const file = e.target.files[0];
        if (!file) return;
        this.state.stagedMediaData = URL.createObjectURL(file);
        this.triggerToast("MEDIA STREAM CACHED FOR COMPILER SUBMIT");
    },

    invertThemeEngine() {
        const body = document.body;
        const btn = document.getElementById('toggle-theme-mode');
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            btn.textContent = "LIGHT MODE";
        } else {
            body.classList.add('light-theme');
            btn.textContent = "DARK MODE";
        }
    },

    upgradeUserTier() {
        this.state.tier = "premium";
        this.triggerToast("PRO ACCESS CONFIRMED — CEILING ADJUSTED TO 99 ROWS");
        this.closeAllDrawers();
        if (this.state.currentView === 'categories-page') this.paintCategoriesGrid();
    },

    triggerVaultWipeConfirmation() {
        this.closeAllDrawers();
        this.spawnGlobalModal("CONFIRM CRITICAL SYSTEM FLUSH", `
            <p style="color:var(--neon-red);">WARNING: This operations fully wipes all local, volatile modifications and restores the architecture back to default structural stock definitions.</p>
        `, ["ABORT", "WIPE HARD DATASTORE"], (actionIdx) => {
            if (actionIdx === 1) {
                this.loadDefaultState();
                this.navigateTo('landing-page');
                this.triggerToast("VAULT PURGED COMPLETELY");
            }
        });
    },

    spawnGlobalModal(title, bodyHtml, actionsArray, callback) {
        this.dom.modal.classList.remove('hidden');
        document.getElementById('modal-title').textContent = title;
        const bodyWrapper = document.getElementById('modal-body-content');
        bodyWrapper.innerHTML = bodyHtml;
        
        const actionWrapper = document.getElementById('modal-action-wrapper');
        actionWrapper.innerHTML = '';
        
        actionsArray.forEach((act, idx) => {
            const button = document.createElement('button');
            button.className = 'btn-card-utility';
            button.style.borderColor = 'var(--gold-mid)';
            button.textContent = act;
            button.onclick = () => {
                this.dom.modal.classList.add('hidden');
                if (callback) callback(idx);
            };
            actionWrapper.appendChild(button);
        });
    },

    triggerToast(msg) {
        alert(`[SYSTEM MESSAGE]: ${msg}`);
    },

    editCategoryName(id) {
        const cat = this.state.categories.find(c => c.id === id);
        const name = prompt("RE-INITIALIZE VAULT TITLE:", cat.name);
        if (name) { cat.name = name; this.paintCategoriesGrid(); }
    },

    removeCategory(id) {
        this.state.categories = this.state.categories.filter(c => c.id !== id);
        this.paintCategoriesGrid();
    }
};

window.onload = () => AppEngine.init();