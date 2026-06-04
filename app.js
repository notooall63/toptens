// frontend/app.js

(function () {
    class TopTensEngine {
        constructor() {
            this.currentViewState = "landing"; 
            this.activeCategoryId = null;
            this.appSessionMode = "anonymous"; 
            this.appThemeSetting = "dark";
            this.isPremiumTier = false;
            this.isVaultPrivate = false;
            this.authMode = "login"; // login or register
            
            this.workerApiBaseUrl = "https://top-tens-backend.swoodson96.workers.dev"; 
            
            this.vaultCategoriesMemory = [];
            this.friendsMemory = [];
            this.userProfileMetadata = {
                name: "", dob: "", hometown: "", vocation: "", email: "guest@toptens.internal", phone: "", recovery: "", avatarData: "", avatarYOffset: 0
            };
            this.stagedItemMedia = { data: "", yOffset: 0 };

            this.conceptEquivalencyDictionary = {
                "shoes": ["sneakers", "footwear", "kicks", "boots"],
                "inspiring athletes": ["athletes", "sports players", "runners", "mvps"],
                "tech devices": ["gadgets", "computers", "phones", "hardware", "tech gadgets"],
                "celebrities": ["famous people", "actors", "stars", "favorite celebrity"],
                "post 2000 movies": ["movies", "cinema", "films", "modern movies"],
                "90s rap songs": ["rap", "hip hop", "tracks", "90s rap"],
                "post 2010 video games": ["video games", "gaming", "games"],
                "novels": ["books", "literature", "fiction"],
                "restaurants": ["best eatery", "best restaurant", "eateries", "dining", "restaurant"]
            };
        }

        initializeEngine() {
            window.appEngine = this;
            this.generateSparkleCoordinatesGrid();
            this.loadVaultState();
            this.renderTargetViewState();
        }

        generateSparkleCoordinatesGrid() {
            const canvas = document.getElementById("sparkle-canvas-layer");
            if (!canvas) return;
            canvas.innerHTML = "";
            for (let i = 0; i < 45; i++) {
                const spark = document.createElement("div");
                spark.className = "star-sparkle-node";
                spark.style.top = `${Math.floor(Math.random() * 100)}vh`;
                spark.style.left = `${Math.floor(Math.random() * 100)}vw`;
                spark.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
                canvas.appendChild(spark);
            }
        }

        async loadVaultState() {
            const savedData = localStorage.getItem("toptens_vault_save");
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    this.userProfileMetadata = parsed.profile || this.userProfileMetadata;
                    this.appSessionMode = parsed.session || "anonymous";
                    this.isPremiumTier = !!parsed.isPremium;
                    this.isVaultPrivate = !!parsed.isPrivate;
                    this.friendsMemory = parsed.friends || [];
                } catch (e) {
                    console.error("Local storage allocation context load fault:", e);
                }
            }

            if (this.appSessionMode === "authenticated") {
                await this.fetchVaultFromCloudflareWorker();
            } else {
                this.loadDefaultStockAssets();
            }
            this.syncProfileUIDrawers();
            this.renderTargetViewState();
        }

        loadDefaultStockAssets() {
            if (typeof getFreshStockCategories === "function") {
                this.vaultCategoriesMemory = getFreshStockCategories();
            }
        }

        async fetchVaultFromCloudflareWorker() {
            const token = localStorage.getItem("toptens_jwt_token");
            try {
                const response = await fetch(`${this.workerApiBaseUrl}/api/vault`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.categories && data.categories.length > 0) {
                        this.vaultCategoriesMemory = data.categories;
                        return;
                    }
                }
                this.loadDefaultStockAssets();
            } catch (err) {
                this.loadDefaultStockAssets();
            }
        }

        async persistVaultState() {
            const localPayload = {
                profile: this.userProfileMetadata, session: this.appSessionMode,
                isPremium: this.isPremiumTier, isPrivate: this.isVaultPrivate, friends: this.friendsMemory
            };
            localStorage.setItem("toptens_vault_save", JSON.stringify(localPayload));

            if (this.appSessionMode !== "authenticated") return;

            const token = localStorage.getItem("toptens_jwt_token");
            try {
                await fetch(`${this.workerApiBaseUrl}/api/vault`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ categories: this.vaultCategoriesMemory })
                });
            } catch (err) {
                console.error("Worker channel dropped state write sync failure.", err);
            }
        }

        renderTargetViewState() {
            const viewport = document.getElementById("app-root-viewport");
            if (!viewport) return;
            this.evaluateHeaderNavigationControls();

            if (this.currentViewState === "landing") this.renderLandingViewScreen(viewport);
            else if (this.currentViewState === "categories") this.renderCategoriesViewScreen(viewport);
            else if (this.currentViewState === "lists") this.renderListsViewScreen(viewport);
            else if (this.currentViewState === "friends") this.renderFriendsViewScreen(viewport);
            else if (this.currentViewState === "compare") this.renderComparisonMatrixScreen(viewport);
        }

        evaluateHeaderNavigationControls() {
            const backBtn = document.getElementById("header-back-btn");
            const avatarBtn = document.getElementById("header-avatar-btn");
            const burgerBtn = document.getElementById("header-burger-btn");

            if (this.currentViewState === "landing") {
                [backBtn, avatarBtn, burgerBtn].forEach(b => b?.classList.add("hidden"));
            } else {
                backBtn?.classList.remove("hidden");
                avatarBtn?.classList.remove("hidden");
                burgerBtn?.classList.remove("hidden");
            }
        }

        renderLandingViewScreen(target) {
            target.innerHTML = `
                <div class="landing-page-center-card">
                    <h2 class="branding-serif-title">TOP TENS</h2>
                    <p class="branding-serif-italic-desc">Your personal dynamic Favorite-Things vault.</p>
                    <div class="landing-action-button-stack">
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.triggerSessionEntry('guest')">ENTER VAULT AS GUEST</button>
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.openAuthDrawer('login')">SIGN IN</button>
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.openAuthDrawer('register')">CREATE ACCOUNT (SIGN UP)</button>
                    </div>
                </div>
            `;
        }

        renderCategoriesViewScreen(target) {
            const allocationCap = this.isPremiumTier ? 99 : 21;
            target.innerHTML = `
                <div class="categories-central-bounding-box">
                    <div class="box-heading-accent">VAULT EXPANSION ALLOCATION: ${this.vaultCategoriesMemory.length} / ${allocationCap} MAX</div>
                    <div style="margin-bottom:20px;">
                        <button class="gold-gradient-ui-btn" style="padding:10px 20px;" onclick="window.appEngine.promptCreateNewCategory()">+ CREATE CUSTOM CATEGORY</button>
                    </div>
                    <div class="categories-3x3-grid" id="categories-3x3-grid"></div>
                </div>
            `;
            const grid = document.getElementById("categories-3x3-grid");
            this.vaultCategoriesMemory.forEach(cat => {
                const card = document.createElement("div");
                card.className = "category-block-tab-card";
                card.onclick = () => this.enterCategoryListView(cat.id);
                card.innerHTML = `
                    <div class="tab-emoji-graphic">${cat.icon || "📁"}</div>
                    <div class="tab-title-text">${cat.name}</div>
                    <div class="tab-item-counter">(${cat.items.length} items)</div>
                    <div class="tab-management-tray" onclick="event.stopPropagation()">
                        <button class="tab-tray-action-icon" onclick="window.appEngine.promptEditCategory('${cat.id}')">✏️</button>
                        <button class="tab-tray-action-icon" onclick="window.appEngine.deleteCategoryItemLink('${cat.id}')">🗑️</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        renderListsViewScreen(target) {
            const currentCategory = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!currentCategory) return this.navigateToView("categories");

            target.innerHTML = `
                <div style="max-width:800px; margin:0 auto;">
                    <div class="box-heading-accent">MANAGE VAULT CONTAINER: ${currentCategory.name}</div>
                    <form id="list-item-addition-form" onsubmit="window.appEngine.handleNewListItemSubmission(event)" style="background:var(--card-bg-dark); border:1px solid var(--border-stroke-dark); padding:20px; border-radius:8px; margin-bottom:20px;">
                        <div style="display:flex; gap:10px; margin-bottom:10px;">
                            <input type="text" id="item-input-title" required placeholder="Item title..." style="flex:2; padding:10px; background:var(--input-bg); border:1px solid var(--border-stroke-dark); color:#fff;">
                            <input type="number" id="item-input-rank" required min="1" max="10" placeholder="Rank (1-10)" style="flex:1; padding:10px; background:var(--input-bg); border:1px solid var(--border-stroke-dark); color:#fff;">
                        </div>
                        <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                            <label style="color:var(--gold-text); font-size:0.8rem; text-decoration:underline; cursor:pointer;">
                                Select Thumbnail (Img/Vid &le; 6s)
                                <input type="file" id="item-input-file" accept="image/*,video/*" onchange="window.appEngine.handleListItemMediaSelect(event)" style="display:none;">
                            </label>
                            <div id="item-crop-controls" class="hidden">
                                <button type="button" class="gold-gradient-ui-btn" style="padding:2px 6px; font-size:0.6rem;" onclick="window.appEngine.adjustMediaCenter('item', 'up')">▲</button>
                                <button type="button" class="gold-gradient-ui-btn" style="padding:2px 6px; font-size:0.6rem;" onclick="window.appEngine.adjustMediaCenter('item', 'down')">▼</button>
                            </div>
                            <span id="item-media-status" style="font-size:0.75rem; color:#6d7f99;"></span>
                        </div>
                        <button type="submit" class="gold-gradient-ui-btn" style="width:100%;">COMMIT SLOT ALLOCATION</button>
                    </form>
                    <div class="list-rows-vertical-stack" id="list-items-stack-node"></div>
                </div>
            `;

            const stack = document.getElementById("list-items-stack-node");
            const sortedItems = [...currentCategory.items].sort((a, b) => a.rank - b.rank);
            sortedItems.forEach(item => {
                const row = document.createElement("div");
                row.className = "list-row-item-card";
                
                // Affiliate Link Autogeneration Module Implementation
                let targetUrl = item.url;
                if (!targetUrl) {
                    const cleanTitle = encodeURIComponent(item.title);
                    targetUrl = `https://www.amazon.com/dp/s?k=${cleanTitle}&tag=toptensvault-20`;
                }

                const mediaOutput = item.thumbnail ? 
                    (item.thumbnail.startsWith("data:video") ? 
                        `<video src="${item.thumbnail}" autoplay loop muted playsinline class="row-circular-media" style="object-position: center calc(50% + ${item.yOffset || 0}px)"></video>` : 
                        `<img src="${item.thumbnail}" class="row-circular-media" style="object-position: center calc(50% + ${item.yOffset || 0}px)">`) 
                    : `<div class="row-circular-media" style="background:#232936;"></div>`;

                row.innerHTML = `
                    <div class="row-hashtag-accent">#${item.rank}</div>
                    <div class="row-item-title">${item.title}</div>
                    <a href="${targetUrl}" target="_blank" class="row-visit-anchor-link">Visit Reference Target</a>
                    <div style="position:relative;">${mediaOutput}</div>
                    <button class="row-item-delete-btn" onclick="window.appEngine.deleteSingleListItemRank(${item.rank})">🗑️ REMOVE</button>
                `;
                stack.appendChild(row);
            });
        }

        renderFriendsViewScreen(target) {
            target.innerHTML = `
                <div style="max-width:600px; margin:0 auto;">
                    <div class="box-heading-accent">TOP TENS ACCREDITED FRIENDS NETWORK</div>
                    <div style="display:flex; gap:10px; margin-bottom:20px;">
                        <input type="email" id="friend-target-email" placeholder="friend@domain.internal" style="flex:1; padding:10px; background:var(--input-bg); border:1px solid var(--border-stroke-dark); color:#fff;">
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.addNewFriendNode()">ADD FRIEND</button>
                    </div>
                    <div id="friends-list-node" style="display:flex; flex-direction:column; gap:10px;"></div>
                </div>
            `;
            const listNode = document.getElementById("friends-list-node");
            if (this.friendsMemory.length === 0) listNode.innerHTML = `<p style="color:#6d7f99; font-size:0.9rem;">No connections mapped within current structural tier.</p>`;
            this.friendsMemory.forEach(f => {
                const item = document.createElement("div");
                item.style = "background:var(--card-bg-dark); padding:15px; border:1px solid var(--border-stroke-dark); border-radius:6px; display:flex; justify-content:between; align-items:center;";
                item.innerHTML = `<span>${f}</span><button class="gold-gradient-ui-btn" style="padding:4px 8px; font-size:0.7rem;" onclick="window.appEngine.removeFriendNode('${f}')">DISCONNECT</button>`;
                listNode.appendChild(item);
            });
        }

        renderComparisonMatrixScreen(target) {
            target.innerHTML = `
                <div style="width:100%; overflow-x:auto;">
                    <div class="box-heading-accent">JUXTAPOSED COMPONENT MATRIX (27 VAULTS PARALLEL DISPLAY)</div>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; min-width:900px;" id="matrix-27-grid"></div>
                </div>
            `;
            const grid = document.getElementById("matrix-27-grid");
            for (let i = 1; i <= 27; i++) {
                const col = document.createElement("div");
                col.style = "background:var(--card-bg-dark); border:1px solid var(--border-stroke-dark); padding:10px; border-radius:6px;";
                col.innerHTML = `<h5 style="color:var(--gold-text); margin-bottom:8px;">Matrix Node Layer #${i} ${i===1?'(Self)':'(Friend Context)'}</h5>`;
                
                const currentCategory = this.vaultCategoriesMemory[0];
                if (currentCategory && currentCategory.items) {
                    const sorted = [...currentCategory.items].sort((a,b)=>a.rank-b.rank);
                    sorted.forEach(it => {
                        col.innerHTML += `<div style="font-size:0.75rem; padding:2px 0;">#${it.rank} ${it.title}</div>`;
                    });
                } else {
                    col.innerHTML += `<div style="color:#6d7f99; font-size:0.75rem;">No comparative record structures aligned.</div>`;
                }
                grid.appendChild(col);
            }
        }

        triggerSessionEntry(mode) {
            this.appSessionMode = mode;
            if (mode === "guest") {
                this.userProfileMetadata.email = "guest@toptens.internal";
            }
            this.navigateToView("categories");
            this.persistVaultState();
        }

        openAuthDrawer(mode) {
            this.authMode = mode;
            this.openDrawer("signin");
            this.toggleAuthViewMode(mode);
        }

        toggleAuthViewMode(mode) {
            this.authMode = mode;
            const title = document.getElementById("auth-drawer-title");
            const btn = document.getElementById("auth-submit-btn");
            if (mode === "login") {
                if (title) title.textContent = "VALIDATE VAULT CREDENTIALS";
                if (btn) btn.textContent = "EXECUTE SECURE LOGIN";
            } else {
                if (title) title.textContent = "INITIALIZE VAULT SIGN UP REGISTER";
                if (btn) btn.textContent = "SUBMIT REGISTRATION PROTOCOL";
            }
        }

        async handleAuthenticationRun(event) {
            event.preventDefault();
            const email = document.getElementById("auth-email-field").value;
            const pass = document.getElementById("auth-pass-field").value;
            const log = document.getElementById("auth-status-log-output");

            const specCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!specCheck.test(pass)) {
                log.innerHTML = `<span style="color:#ff4d4d;">Security Fault: Password requirement rejected (8-20 chars, 1 upper, 1 lower, 1 digit, 1 special).</span>`;
                return;
            }

            log.innerHTML = `<span style="color:var(--gold-text);">Processing request sequence...</span>`;
            
            const endpoint = this.authMode === "login" ? "/api/auth/login" : "/api/auth/register";
            try {
                const response = await fetch(`${this.workerApiBaseUrl}${endpoint}`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: pass })
                });
                const result = await response.json();

                if (!response.ok) {
                    log.innerHTML = `<span style="color:#ff4d4d;">${result.detail || "Authentication fault."}</span>`;
                    return;
                }

                if (this.authMode === "register") {
                    log.innerHTML = `<span style="color:#00e5ff;">Verification email dispatched automatically. Click link inside email text to confirm account status.<br><a href="${result.verificationLink}" target="_blank" style="color:var(--gold-text); text-decoration:underline;">[Simulated Link Target Execution Context]</a></span>`;
                } else {
                    this.appSessionMode = "authenticated";
                    this.userProfileMetadata.email = email;
                    localStorage.setItem("toptens_jwt_token", result.token);
                    await this.fetchVaultFromCloudflareWorker();
                    this.closeAllActiveDrawers();
                    this.navigateToView("categories");
                    this.syncProfileUIDrawers();
                    this.persistVaultState();
                }
            } catch (err) {
                log.innerHTML = `<span style="color:#ff4d4d;">Infrastructure connection loss.</span>`;
            }
        }

        promptCreateNewCategory() {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") {
                return this.rejectProtectedAction("Write access failure. Unverified profiles cannot persist elements to database layers.");
            }
            const cap = this.isPremiumTier ? 99 : 21;
            if (this.vaultCategoriesMemory.length >= cap) return alert(`Allocation limitation cap reached (${cap}). Upgrading expands space bounds.`);

            const name = prompt("Enter Custom Category Title Specification:");
            if (!name || !name.trim()) return;
            const finalized = this.resolveSemanticEquivalencies(name.trim());

            if (this.vaultCategoriesMemory.some(c => c.name.toLowerCase() === finalized.toLowerCase())) return alert("Collision Error: Concept signature exists.");

            this.vaultCategoriesMemory.unshift({ id: `cat_${Date.now()}`, name: finalized, icon: "📁", items: [] });
            this.persistVaultState();
            this.renderTargetViewState();
        }

        promptEditCategory(catId) {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") return this.rejectProtectedAction("Write violation block.");
            const cat = this.vaultCategoriesMemory.find(c => c.id === catId);
            if (!cat) return;
            const newName = prompt("Edit Category Name:", cat.name);
            if (!newName || !newName.trim()) return;
            cat.name = this.resolveSemanticEquivalencies(newName.trim());
            this.persistVaultState();
            this.renderTargetViewState();
        }

        resolveSemanticEquivalencies(targetName) {
            const clean = targetName.toLowerCase();
            for (const [canonical, variants] of Object.entries(this.conceptEquivalencyDictionary)) {
                if (clean === canonical || variants.includes(clean)) {
                    return canonical.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                }
            }
            return targetName;
        }

        deleteCategoryItemLink(catId) {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") return this.rejectProtectedAction("Write mutation clearance failure.");
            if (confirm("Execute removal of vector block?")) {
                this.vaultCategoriesMemory = this.vaultCategoriesMemory.filter(c => c.id !== catId);
                this.persistVaultState();
                this.renderTargetViewState();
            }
        }

        handleNewListItemSubmission(event) {
            event.preventDefault();
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") return this.rejectProtectedAction("Write mutation clearance failure.");
            
            const cat = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!cat) return;
            if (cat.items.length >= 10) return alert("Chassis specification boundary: Limit 10 items maximum per allocation list track.");

            const title = document.getElementById("item-input-title").value;
            const rank = parseInt(document.getElementById("item-input-rank").value, 10);

            if (cat.items.some(i => i.rank === rank)) return alert(`Slot position #${rank} occupied. Purge collision targets first.`);

            cat.items.push({
                rank, title: title.trim(), url: null,
                thumbnail: this.stagedItemMedia.data, yOffset: this.stagedItemMedia.yOffset
            });
            
            this.persistVaultState();
            this.stagedItemMedia = { data: "", yOffset: 0 };
            document.getElementById("item-crop-controls").classList.add("hidden");
            document.getElementById("item-media-status").textContent = "";
            this.renderTargetViewState();
        }

        handleListItemMediaSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.stagedItemMedia.data = e.target.result;
                this.stagedItemMedia.yOffset = 0;
                document.getElementById("item-crop-controls").classList.remove("hidden");
                document.getElementById("item-media-status").textContent = `Media ready (${file.name})`;
            };
            reader.readAsDataURL(file);
        }

        deleteSingleListItemRank(rankValue) {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") return this.rejectProtectedAction("Write mutation clearance failure.");
            const cat = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!cat) return;
            cat.items = cat.items.filter(i => i.rank !== rankValue);
            this.persistVaultState();
            this.renderTargetViewState();
        }

        handleAvatarAssetUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.userProfileMetadata.avatarData = e.target.result;
                this.userProfileMetadata.avatarYOffset = 0;
                document.getElementById("avatar-crop-controls").classList.remove("hidden");
                this.syncProfileUIDrawers();
                this.persistVaultState();
            };
            reader.readAsDataURL(file);
        }

        adjustMediaCenter(type, direction) {
            const amt = direction === "up" ? -5 : 5;
            if (type === "avatar") {
                this.userProfileMetadata.avatarYOffset += amt;
                this.syncProfileUIDrawers();
            } else {
                this.stagedItemMedia.yOffset += amt;
                document.getElementById("item-media-status").textContent = `Alignment shift counter: ${this.stagedItemMedia.yOffset}px`;
            }
        }

        saveProfileLedgerMetadata(event) {
            event.preventDefault();
            this.userProfileMetadata.name = document.getElementById("prof-name").value;
            this.userProfileMetadata.dob = document.getElementById("prof-dob").value;
            this.userProfileMetadata.hometown = document.getElementById("prof-home").value;
            this.userProfileMetadata.vocation = document.getElementById("prof-vocation").value;
            this.userProfileMetadata.phone = document.getElementById("prof-phone").value;
            this.userProfileMetadata.recovery = document.getElementById("prof-recovery").value;

            this.persistVaultState();
            alert("Matrix identity registers matching success.");
            this.closeAllActiveDrawers();
        }

        syncProfileUIDrawers() {
            document.getElementById("prof-name").value = this.userProfileMetadata.name || "";
            document.getElementById("prof-dob").value = this.userProfileMetadata.dob || "";
            document.getElementById("prof-home").value = this.userProfileMetadata.hometown || "";
            document.getElementById("prof-vocation").value = this.userProfileMetadata.vocation || "";
            document.getElementById("prof-email").value = this.userProfileMetadata.email || "";
            document.getElementById("prof-phone").value = this.userProfileMetadata.phone || "";
            document.getElementById("prof-recovery").value = this.userProfileMetadata.recovery || "";

            const preview = document.getElementById("profile-avatar-preview-box");
            const topIcon = document.getElementById("avatar-circle-display");
            const data = this.userProfileMetadata.avatarData;
            const offset = this.userProfileMetadata.avatarYOffset || 0;

            [preview, topIcon].forEach(el => {
                if (!el) return;
                if (data) {
                    el.style.backgroundImage = `url(${data})`;
                    el.style.backgroundPosition = `center calc(50% + ${offset}px)`;
                    el.style.backgroundSize = "cover";
                } else {
                    el.style.backgroundImage = "";
                }
            });
        }

        setApplicationTheme(mode) {
            this.appThemeSetting = mode;
            document.body.className = mode === "dark" ? "dark-theme-context" : "light-theme-context";
        }

        togglePrivacySettings() {
            this.isVaultPrivate = !this.isVaultPrivate;
            alert(`Privacy scope altered status target: ${this.isVaultPrivate ? 'PRIVATE BLOCK' : 'PUBLIC SHARED'}`);
            this.persistVaultState();
        }

        triggerPremiumUpgrade() {
            this.isPremiumTier = true;
            alert("Upgrade clearance confirmed. Vector spaces allocated expansion target set to 99 channels.");
            this.persistVaultState();
            this.renderTargetViewState();
        }

        openFriendsPage() {
            this.closeAllActiveDrawers();
            this.navigateToView("friends");
        }

        addNewFriendNode() {
            const email = document.getElementById("friend-target-email").value;
            if (!email || !email.trim()) return;
            if (!this.friendsMemory.includes(email.trim())) this.friendsMemory.push(email.trim());
            this.persistVaultState();
            this.renderFriendsViewScreen(document.getElementById("app-root-viewport"));
        }

        removeFriendNode(email) {
            this.friendsMemory = this.friendsMemory.filter(f => f !== email);
            this.persistVaultState();
            this.renderFriendsViewScreen(document.getElementById("app-root-viewport"));
        }

        executeComparisonMatrix() {
            this.closeAllActiveDrawers();
            this.navigateToView("compare");
        }

        executeMultiVaultFusion() {
            alert("FUSE SEQUENCE EXECUTION:\nFormula Parameters: R_avg = sum(Item_Rank * Weight) / sum(Weight).\nSynthesizing comparative record data streams into Master Configuration Layer.");
        }

        executeVaultWipeProcedure() {
            if (confirm("Wipe structural database entries and fall back to pristine stock records?")) {
                localStorage.clear();
                this.currentViewState = "landing";
                this.activeCategoryId = null;
                this.appSessionMode = "anonymous";
                this.isPremiumTier = false;
                this.isVaultPrivate = false;
                this.friendsMemory = [];
                this.userProfileMetadata = {
                    name: "", dob: "", hometown: "", vocation: "", email: "guest@toptens.internal", phone: "", recovery: "", avatarData: "", avatarYOffset: 0
                };
                this.loadDefaultStockAssets();
                this.syncProfileUIDrawers();
                this.renderTargetViewState();
                this.closeAllActiveDrawers();
                alert("Database reset executed successfully.");
            }
        }

        navigateToView(state) { this.currentViewState = state; this.renderTargetViewState(); }
        navigateBack() { this.navigateToView(this.currentViewState === "lists" || this.currentViewState === "friends" || this.currentViewState === "compare" ? "categories" : "landing"); }
        handleBrandClick() { this.navigateToView("landing"); }
        enterCategoryListView(catId) { this.activeCategoryId = catId; this.navigateToView("lists"); }
        openDrawer(id) {
            document.getElementById("global-drawer-overlay").classList.remove("hidden");
            document.getElementById(`drawer-${id}`).classList.add("open");
        }
        closeAllActiveDrawers() {
            document.getElementById("global-drawer-overlay").classList.add("hidden");
            document.querySelectorAll(".drawer-sliding-chassis").forEach(d => d.classList.remove("open"));
        }
        rejectProtectedAction(msg) { alert(msg); this.openAuthDrawer("login"); }
    }

    document.addEventListener("DOMContentLoaded", () => { new TopTensEngine().initializeEngine(); });
})();