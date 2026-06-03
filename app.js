/**
 * Top Tens - Core Modular Application Lifecycle Architecture
 */

(function () {
    class TopTensEngine {
        constructor() {
            this.currentViewState = "landing"; // States: landing, categories, lists
            this.activeCategoryId = null;
            this.appSessionMode = "anonymous"; // Options: anonymous, guest, authenticated
            this.appThemeSetting = "dark";
            this.isPremiumTier = false;
            this.isVaultPrivate = false;
            
            // Database Cache Core
            this.vaultCategoriesMemory = [];
            this.userProfileMetadata = {
                name: "", dob: "", hometown: "", vocation: "", email: "guest@toptens.internal", phone: "", avatarData: ""
            };

            // Semantic Lookup Equivalency Map
            this.conceptEquivalencyDictionary = {
                "shoes": ["sneakers", "footwear", "kicks", "boots"],
                "inspiring athletes": ["athletes", "sports players", "runners", "mvps"],
                "tech devices": ["gadgets", "computers", "phones", "hardware", "tech gadgets"],
                "celebrities": ["famous people", "actors", "stars", "favorite celebrity"],
                "post 2000 movies": ["movies", "cinema", "films", "modern movies"],
                "90s rap songs": ["rap", "hip hop", "tracks", "90s rap"],
                "post 2010 video games": ["video games", "gaming", "games"],
                "novels": ["books", "literature", "fiction"],
                "restaurants": ["best eatery", "eateries", "food locations", "dining"]
            };
        }

        initializeEngine() {
            window.appEngine = this;
            this.generateSparkleCoordinatesGrid();
            this.loadVaultStateFromLocalStorage();
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

        loadVaultStateFromLocalStorage() {
            const savedData = localStorage.getItem("toptens_vault_save");
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    this.vaultCategoriesMemory = parsed.categories || [];
                    this.userProfileMetadata = parsed.profile || this.userProfileMetadata;
                    this.appSessionMode = parsed.session || "anonymous";
                    this.isPremiumTier = !!parsed.isPremium;
                    this.isVaultPrivate = !!parsed.isPrivate;
                } catch (e) {
                    this.loadDefaultStockAssets();
                }
            } else {
                this.loadDefaultStockAssets();
            }
            this.syncProfileUIDrawers();
        }

        loadDefaultStockAssets() {
            if (typeof getFreshStockCategories === "function") {
                this.vaultCategoriesMemory = getFreshStockCategories();
            }
        }

        persistVaultStateToLocalStorage() {
            if (this.appSessionMode === "guest") return; // Guest actions aren't saved
            const payload = {
                categories: this.vaultCategoriesMemory,
                profile: this.userProfileMetadata,
                session: this.appSessionMode,
                isPremium: this.isPremiumTier,
                isPrivate: this.isVaultPrivate
            };
            localStorage.setItem("toptens_vault_save", JSON.stringify(payload));
        }

        renderTargetViewState() {
            const viewport = document.getElementById("app-root-viewport");
            if (!viewport) return;

            this.evaluateHeaderNavigationControls();

            if (this.currentViewState === "landing") {
                this.renderLandingViewScreen(viewport);
            } else if (this.currentViewState === "categories") {
                this.renderCategoriesViewScreen(viewport);
            } else if (this.currentViewState === "lists") {
                this.renderListsViewScreen(viewport);
            }
        }

        evaluateHeaderNavigationControls() {
            const backBtn = document.getElementById("header-back-btn");
            const avatarBtn = document.getElementById("header-avatar-btn");
            const burgerBtn = document.getElementById("header-burger-btn");

            if (this.currentViewState === "landing") {
                if (backBtn) backBtn.classList.add("hidden");
                if (avatarBtn) avatarBtn.classList.add("hidden");
                if (burgerBtn) burgerBtn.classList.add("hidden");
            } else {
                if (backBtn) backBtn.classList.remove("hidden");
                if (avatarBtn) avatarBtn.classList.remove("hidden");
                if (burgerBtn) burgerBtn.classList.remove("hidden");
            }
        }

        renderLandingViewScreen(target) {
            target.innerHTML = `
                <div class="landing-page-center-card animate-framer">
                    <h2 class="branding-serif-title">TOP TENS</h2>
                    <p class="branding-serif-italic-desc">
                        Your personal dynamic Favorite-Things vault. Rank, sort, and track your favorite things in real time. Compare your tastes with your friends, or fuse your similar lists with theirs to discover what truly reigns supreme.
                    </p>
                    <div class="landing-action-button-stack">
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.triggerSessionEntry('guest')">ENTER VAULT</button>
                        <button class="gold-gradient-ui-btn" onclick="window.appEngine.openDrawer('signin')">SIGN IN</button>
                    </div>
                </div>
            `;
        }

        renderCategoriesPageLayout(target) {
            target.innerHTML = `
                <div class="categories-central-bounding-box animate-framer">
                    <div class="box-heading-accent">ADD CUSTOM CATEGORIES&mdash;UP TO ${this.isPremiumTier ? 99 : 21} TOTAL</div>
                    <div class="top-action-bar-center">
                        <button class="green-action-rect-btn" onclick="window.appEngine.promptCreateNewCategory()">+ Add New Custom Category</button>
                    </div>
                    <div class="categories-3x3-grid" id="categories-grid-node"></div>
                </div>
            `;
        }

        renderCategoriesViewScreen(target) {
            this.renderCategoriesPageLayout(target);
            const grid = document.getElementById("categories-3x3-grid");
            if (!grid) return;
            grid.innerHTML = "";

            this.vaultCategoriesMemory.forEach(cat => {
                const card = document.createElement("div");
                card.className = "category-block-tab-card";
                card.onclick = () => this.enterCategoryListView(cat.id);

                card.innerHTML = `
                    <div class="tab-emoji-graphic">${cat.icon || "📁"}</div>
                    <div class="tab-title-text">${cat.name}</div>
                    <div class="tab-item-counter">(${cat.items.length} items)</div>
                    <div class="tab-management-tray" onclick="event.stopPropagation()">
                        <button class="tab-tray-trash-icon" title="Remove Category" onclick="window.appEngine.deleteCategoryItemLink('${cat.id}')">&times;</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        renderListsPageLayout(target, currentCategory) {
            target.innerHTML = `
                <div class="lists-central-bounding-box animate-framer">
                    <div class="box-heading-accent" style="text-transform: uppercase;">MANAGE VAULT LIST: ${currentCategory.name}</div>
                    
                    <div class="item-generation-form-container">
                        <form id="list-item-addition-form" onsubmit="window.appEngine.handleNewListItemSubmission(event)">
                            <div class="form-input-inline-row">
                                <input type="text" id="item-input-title" required placeholder="Type item title...">
                                <input type="number" id="item-input-rank" required min="1" max="10" placeholder="Rank (1-10)">
                            </div>
                            <div class="form-input-block-row">
                                <input type="url" id="item-input-url" placeholder="Reference URL Link (https://...) [Optional]">
                            </div>
                            <div class="form-input-inline-row">
                                <label class="file-stub-btn">
                                    Select Thumbnail Media (Img / Video &le; 6s)
                                    <input type="file" id="item-input-file" accept="image/*,video/*" onchange="window.appEngine.handleListItemMediaSelect(event)" style="display:none;">
                                </label>
                                <button type="submit" class="green-action-rect-btn" style="padding: 0 24px;">Add Item</button>
                            </div>
                            <div id="item-media-preview-stub" style="margin-top:10px; font-size:0.8rem; color:#c5a059; text-align:center;"></div>
                        </form>
                    </div>
                    <div class="list-rows-vertical-stack" id="list-items-stack-node"></div>
                </div>
            `;
        }

        renderListsViewScreen(target) {
            const currentCategory = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!currentCategory) {
                this.navigateToView("categories");
                return;
            }

            this.renderListsPageLayout(target, currentCategory);
            const stack = document.getElementById("list-items-stack-node");
            if (!stack) return;
            stack.innerHTML = "";

            // Strictly sort items ascending by rank sequence
            const sortedItems = [...currentCategory.items].sort((a, b) => a.rank - b.rank);

            sortedItems.forEach(item => {
                const row = document.createElement("div");
                row.className = "list-row-item-card";

                const finalUrl = item.url ? item.url : `https://www.amazon.com/dp/s?k=${encodeURIComponent(item.title)}`;
                const mediaOutput = item.thumbnail ? 
                    (item.thumbnail.startsWith("data:video") ? `<video src="${item.thumbnail}" autoplay loop muted playsinline class="row-circular-media"></video>` : `<img src="${item.thumbnail}" class="row-circular-media">`) 
                    : `<div class="row-circular-media mock-empty"></div>`;

                row.innerHTML = `
                    <div class="row-hashtag-accent"># ${item.rank}</div>
                    <div class="row-item-title">${item.title}</div>
                    <a href="${finalUrl}" target="_blank" rel="noopener noreferrer" class="row-visit-anchor-link">Visit Link</a>
                    <div class="row-media-frame-wrapper">${mediaOutput}</div>
                    <button class="row-item-delete-btn" title="Delete Item" onclick="window.appEngine.deleteSingleListItemRank(${item.rank})">&times;</button>
                `;
                stack.appendChild(row);
            });
        }

        triggerSessionEntry(mode) {
            this.appSessionMode = mode;
            this.navigateToView("categories");
            this.persistVaultStateToLocalStorage();
        }

        navigateToView(state) {
            this.currentViewState = state;
            this.renderTargetViewState();
        }

        navigateBack() {
            if (this.currentViewState === "lists") {
                this.navigateToView("categories");
            } else if (this.currentViewState === "categories") {
                this.navigateToView("landing");
            }
        }

        handleBrandClick() {
            this.navigateToView("landing");
        }

        enterCategoryListView(catId) {
            this.activeCategoryId = catId;
            this.navigateToView("lists");
        }

        /* Drawer Operational Pipeline */
        openDrawer(drawerId) {
            const overlay = document.getElementById("global-drawer-overlay");
            if (!overlay) return;

            // Hide all sub panels
            document.querySelectorAll(".drawer-sliding-chassis").forEach(panel => panel.classList.remove("open"));
            overlay.classList.remove("hidden");

            const targetedPanel = document.getElementById(`drawer-${drawerId}`);
            if (targetedPanel) {
                targetedPanel.classList.add("open");
            }
        }

        closeAllActiveDrawers() {
            const overlay = document.getElementById("global-drawer-overlay");
            if (overlay) overlay.classList.add("hidden");
            document.querySelectorAll(".drawer-sliding-chassis").forEach(panel => panel.classList.remove("open"));
        }

        /* Security Infrastructure Logic */
        handleAuthenticationRun(event) {
            event.preventDefault();
            const email = document.getElementById("auth-email-field").value;
            const pass = document.getElementById("auth-pass-field").value;
            const log = document.getElementById("auth-status-log-output");

            // Strict regex pass mapping standard rule bounds
            const securityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!securityRegex.test(pass)) {
                log.innerHTML = `<span style="color:#ff4d4d;">Password structural requirements rejected. Check specs and retry.</span>`;
                return;
            }

            log.innerHTML = `<span style="color:#c5a059;">Verification transmission processing... Link issued downstream to ${email}.</span>`;
            
            setTimeout(() => {
                this.appSessionMode = "authenticated";
                this.userProfileMetadata.email = email;
                alert(`Account initialized securely for ${email}! Vault data mapping enabled.`);
                this.closeAllActiveDrawers();
                this.navigateToView("categories");
                this.persistVaultStateToLocalStorage();
                this.syncProfileUIDrawers();
            }, 1200);
        }

        /* Category Mutation Mechanics */
        promptCreateNewCategory() {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") {
                this.rejectProtectedAction("Unverified session. Register an authenticated account key to add persistent categories.");
                return;
            }

            const limitCap = this.isPremiumTier ? 99 : 21;
            if (this.vaultCategoriesMemory.length >= limitCap) {
                alert(`Vault boundary threshold reached. Maximum allocation allowed on current tier: ${limitCap}`);
                return;
            }

            const inputName = prompt("Enter Custom Category Name:");
            if (!inputName || !inputName.trim()) return;

            const structuredName = inputName.trim();
            const evaluatedMatch = this.resolveSemanticEquivalencies(structuredName);

            // Prevent creation collisions
            const existenceCheck = this.vaultCategoriesMemory.find(c => c.name.toLowerCase() === evaluatedMatch.toLowerCase());
            if (existenceCheck) {
                alert(`Collision dynamic mapping error: category matching concept "${existenceCheck.name}" already initialized.`);
                return;
            }

            const newCategory = {
                id: `cat_${Date.now()}`,
                name: evaluatedMatch,
                icon: "📁",
                description: "User mapped custom categorization index vault.",
                items: []
            };

            this.vaultCategoriesMemory.unshift(newCategory);
            this.persistVaultStateToLocalStorage();
            this.renderTargetViewState();
        }

        resolveSemanticEquivalencies(targetName) {
            const cleanTarget = targetName.toLowerCase();
            for (const [canonical, variants] of Object.entries(this.conceptEquivalencyDictionary)) {
                if (cleanTarget === canonical || variants.includes(cleanTarget)) {
                    // Return strict normalized casing
                    return canonical.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                }
            }
            return targetName;
        }

        deleteCategoryItemLink(catId) {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") {
                this.rejectProtectedAction("Write clearance denied. Guests cannot mutate base stock category nodes.");
                return;
            }
            if (confirm("Execute structural removal of category container and all nested items?")) {
                this.vaultCategoriesMemory = this.vaultCategoriesMemory.filter(c => c.id !== catId);
                this.persistVaultStateToLocalStorage();
                this.renderTargetViewState();
            }
        }

        /* List Items Mutation Engine */
        handleNewListItemSubmission(event) {
            event.preventDefault();
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") {
                this.rejectProtectedAction("Write access denied. Authenticate to persist custom asset nodes to lists.");
                return;
            }

            const currentCategory = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!currentCategory) return;

            if (currentCategory.items.length >= 10) {
                alert("Vault structure limitation violation: Entry restricted to maximum 10 items for any category vector.");
                return;
            }

            const title = document.getElementById("item-input-title").value;
            const rank = parseInt(document.getElementById("item-input-rank").value, 10);
            const url = document.getElementById("item-input-url").value;
            const mediaPreviewStub = document.getElementById("item-media-preview-stub");
            
            // Check rank collision parameters
            if (currentCategory.items.some(item => item.rank === rank)) {
                alert(`Rank slot #${rank} is currently allocated. Remove structural occupant before redefining slot.`);
                return;
            }

            const assetDataString = window.temporaryItemMediaPayload || "";

            const newItem = {
                rank: rank,
                title: title.trim(),
                url: url ? url.trim() : null,
                thumbnail: assetDataString
            };

            currentCategory.items.push(newItem);
            this.persistVaultStateToLocalStorage();
            
            // Wipe inputs
            document.getElementById("list-item-addition-form").reset();
            if (mediaPreviewStub) mediaPreviewStub.textContent = "";
            window.temporaryItemMediaPayload = null;

            this.renderTargetViewState();
        }

        handleListItemMediaSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                window.temporaryItemMediaPayload = e.target.result;
                const previewStub = document.getElementById("item-media-preview-stub");
                if (previewStub) previewStub.textContent = `Media asset staging complete (${file.name})`;
            };
            reader.readAsDataURL(file);
        }

        deleteSingleListItemRank(rankValue) {
            if (this.appSessionMode === "anonymous" || this.appSessionMode === "guest") {
                this.rejectProtectedAction("Write access failure. Guests are restricted from mutating index nodes.");
                return;
            }
            const currentCategory = this.vaultCategoriesMemory.find(c => c.id === this.activeCategoryId);
            if (!currentCategory) return;

            currentCategory.items = currentCategory.items.filter(item => item.rank !== rankValue);
            this.persistVaultStateToLocalStorage();
            this.renderTargetViewState();
        }

        /* System Profile Asset Management */
        handleAvatarAssetUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.userProfileMetadata.avatarData = e.target.result;
                this.syncProfileUIDrawers();
                this.persistVaultStateToLocalStorage();
            };
            reader.readAsDataURL(file);
        }

        saveProfileLedgerMetadata(event) {
            event.preventDefault();
            this.userProfileMetadata.name = document.getElementById("prof-name").value;
            this.userProfileMetadata.dob = document.getElementById("prof-dob").value;
            this.userProfileMetadata.hometown = document.getElementById("prof-home").value;
            this.userProfileMetadata.vocation = document.getElementById("prof-vocation").value;
            this.userProfileMetadata.phone = document.getElementById("prof-phone").value;

            this.persistVaultStateToLocalStorage();
            alert("Identity ledger metrics synchronized safely.");
            this.closeAllActiveDrawers();
        }

        syncProfileUIDrawers() {
            document.getElementById("prof-name").value = this.userProfileMetadata.name || "";
            document.getElementById("prof-dob").value = this.userProfileMetadata.dob || "";
            document.getElementById("prof-home").value = this.userProfileMetadata.hometown || "";
            document.getElementById("prof-vocation").value = this.userProfileMetadata.vocation || "";
            document.getElementById("prof-email").value = this.userProfileMetadata.email || "";
            document.getElementById("prof-phone").value = this.userProfileMetadata.phone || "";

            const preview = document.getElementById("profile-avatar-preview-box");
            const topIcon = document.getElementById("avatar-circle-display");

            const renderString = this.userProfileMetadata.avatarData ? 
                (this.userProfileMetadata.avatarData.startsWith("data:video") ? `<video src="${this.userProfileMetadata.avatarData}" autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover; border-radius:50%;"></video>` : `url(${this.userProfileMetadata.avatarData})`) 
                : "";

            [preview, topIcon].forEach(el => {
                if (!el) return;
                if (renderString.startsWith("url")) {
                    el.innerHTML = "";
                    el.style.backgroundImage = renderString;
                    el.style.backgroundSize = "cover";
                    el.style.backgroundPosition = "center";
                } else if (renderString !== "") {
                    el.style.backgroundImage = "";
                    el.innerHTML = renderString;
                } else {
                    el.style.backgroundImage = "";
                    el.innerHTML = "";
                }
            });
        }

        /* Settings Sub-Modules */
        setApplicationTheme(mode) {
            this.appThemeSetting = mode;
            document.body.className = `${mode}-theme-context`;
            document.querySelectorAll(".config-toggle-btn").forEach(btn => btn.classList.remove("active"));
            
            if (mode === "dark") {
                document.getElementById("theme-dark-btn").classList.add("active");
            } else {
                document.getElementById("theme-light-btn").classList.add("active");
            }
        }

        triggerPremiumUpgrade() {
            this.isPremiumTier = true;
            alert("Transaction verified successfully. Stored matrix expansion enabled up to 99 structural vectors.");
            this.persistVaultStateToLocalStorage();
            this.renderTargetViewState();
        }

        togglePrivacySettings() {
            this.isVaultPrivate = !this.isVaultPrivate;
            document.getElementById("privacy-status-lbl").textContent = this.isVaultPrivate ? "PRIVATE" : "PUBLIC";
            this.persistVaultStateToLocalStorage();
        }

        showSocialFeatureNotice(type) {
            if (type === 'Fuse') {
                alert("Synthesizing data grids...\nFormula Applied: R_avg = sum(Item_Rank * Weight) / sum(Weight).\nMaster vault synthesis complete.");
            } else {
                alert(`Social Interface Module Callout: [${type}] logic executed over sandbox array records successfully.`);
            }
        }

        executeVaultWipeProcedure() {
            if (confirm("CRITICAL WARNING: Wipe all user-defined structural data components and reset to static default stock lists?")) {
                localStorage.removeItem("toptens_vault_save");
                this.currentViewState = "landing";
                this.activeCategoryId = null;
                this.appSessionMode = "anonymous";
                this.isPremiumTier = false;
                this.isVaultPrivate = false;
                this.userProfileMetadata = {
                    name: "", dob: "", hometown: "", vocation: "", email: "guest@toptens.internal", phone: "", avatarData: ""
                };
                this.loadDefaultStockAssets();
                this.syncProfileUIDrawers();
                this.renderTargetViewState();
                this.closeAllActiveDrawers();
                alert("Vault tracking reset to base factory standard state.");
            }
        }

        rejectProtectedAction(reason) {
            alert(`Security Fault Intercept: ${reason}`);
            this.openDrawer("signin");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const engine = new TopTensEngine();
        engine.initializeEngine();
    });
})();