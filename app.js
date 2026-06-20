/**
 * Master Client-Side Runtime Router & Data Sync Pipeline
 * Coordinates data transfers with the Cloudflare Worker API.
 */

const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";

// STATE ARCHITECTURE PERSISTENCE MODEL
let state = {
    user: null, // Populated via valid session tokens
    token: null,
    isTierUpgraded: false, 
    categories: [],
    items: {},
    friends: [],
    privacyPublic: true,
    currentViewId: "view-landing-page",
    navigationHistoryStack: [],
    currentCategoryContextId: null,
    pendingMediaBuffer: null, // Holds asset objects mid-crop
    pendingTargetNodeCallback: null,
    profileMetadata: {
        fullname: "", dob: "", hometown: "", vocation: "", email: "", recovery: ""
    }
};

// INITIALIZATION ENTRYPOINT MAPPING
document.addEventListener("DOMContentLoaded", () => {
    bindStructuralCoreEventHandlers();
    loadLocalSessionFallbackData();
    synchronizeSessionHandshake();
});

// CORE INTERFACE ROUTER NAVIGATION MAPS
function navigateToScreenView(targetViewId, storeInHistory = true) {
    if (state.currentViewId === targetViewId) return;
    
    if (storeInHistory) {
        state.navigationHistoryStack.push(state.currentViewId);
    }

    // Apply header visibility criteria boundaries
    const headerNode = document.getElementById("global-app-header");
    if (targetViewId === "view-landing-page") {
        headerNode.classList.add("hidden-element");
    } else {
        headerNode.classList.remove("hidden-element");
    }

    document.querySelectorAll(".app-page-view").forEach(v => v.classList.add("hidden-element"));
    const activeTarget = document.getElementById(targetViewId);
    if (activeTarget) activeTarget.classList.remove("hidden-element");

    state.currentViewId = targetViewId;
}

function processBackwardNavigation() {
    if (state.navigationHistoryStack.length === 0) {
        navigateToScreenView("view-landing-page", false);
        return;
    }
    const previousView = state.navigationHistoryStack.pop();
    navigateToScreenView(previousView, false);
}

// BIND INTERFACE EVENTS TO ACTION DOM BUTTON LISTENERS
function bindStructuralCoreEventHandlers() {
    // Navigation Triggers
    document.getElementById("header-back-btn").onclick = () => processBackwardNavigation();
    document.getElementById("landing-enter-vault-btn").onclick = () => {
        navigateToScreenView("view-categories-page");
        renderCategoriesGridMatrix();
    };
    
    // Drawers Activation Bindings
    document.getElementById("landing-signin-trigger-btn").onclick = () => expandDrawerInterface("drawer-authentication-portal");
    document.getElementById("settings-burger-btn").onclick = () => expandDrawerInterface("drawer-system-settings");
    document.getElementById("header-profile-avatar-node").onclick = () => {
        populateProfileFieldsUI();
        expandDrawerInterface("drawer-profile-persistence");
    };

    // Scrim Dismissal Hooks
    const scrim = document.getElementById("drawer-overlay-scrim-curtain");
    scrim.onclick = () => collapseAllDrawers();
    document.querySelectorAll(".drawer-close-btn-node").forEach(btn => {
        btn.onclick = () => collapseAllDrawers();
    });

    // Auth Actions Matrix Handlers
    document.getElementById("auth-password-visibility-toggle").onclick = togglePasswordMasking;
    document.getElementById("action-trigger-signin").onclick = executeSignInSessionRequest;
    document.getElementById("action-trigger-signup").onclick = executeSignUpRegistrationRequest;
    document.getElementById("action-trigger-signout").onclick = executeGlobalLogoutSequence;

    // Categories Logic Ribbon Handlers
    document.getElementById("add-custom-category-trigger").onclick = triggerCustomCategoryCreationMatrix;

    // Items Logic Panels Form Actions
    document.getElementById("item-media-upload-dummy-btn").onclick = () => document.getElementById("input-item-file").click();
    document.getElementById("input-item-file").onchange = (e) => handleMediaSelectionInput(e, "creation");
    document.getElementById("execute-add-item-btn").onclick = executeItemCreationFormCommit;

    // Profile Settings Action Controls
    document.getElementById("avatar-upload-trigger-btn").onclick = () => document.getElementById("input-avatar-file").click();
    document.getElementById("input-avatar-file").onchange = (e) => handleMediaSelectionInput(e, "profile");
    document.getElementById("execute-profile-metadata-save-btn").onclick = saveProfileMetadataAttributes;
    document.getElementById("profile-privacy-toggle-state").onclick = toggleProfilePrivacyState;

    // Inline Profile Vector Fields Unlock Editing Handlers
    document.querySelectorAll(".field-inline-edit-icon").forEach(btn => {
        btn.onclick = (e) => {
            const targetInput = e.target.parentElement.querySelector("input");
            if (targetInput) {
                targetInput.disabled = !targetInput.disabled;
                if (!targetInput.disabled) targetInput.focus();
            }
        };
    });

    // Control Configuration Menu Panel Routing
    document.getElementById("settings-action-toggle-theme").onclick = toggleThemeDarkLightParameters;
    document.getElementById("settings-action-upgrade-tier").onclick = processTierUpgradeTransaction;
    document.getElementById("settings-action-add-friends").onclick = triggerFriendAdditionDialog;
    
    const globalFriendBtn = document.getElementById("add-friends-global-trigger");
    if (globalFriendBtn) {
        globalFriendBtn.onclick = triggerFriendAdditionDialog;
    }
    document.getElementById("settings-action-goto-friends").onclick = () => {
        collapseAllDrawers();
        navigateToScreenView("view-friends-page");
        renderFriendsRosterStack();
    };
    document.getElementById("settings-action-vault-wipe").onclick = triggerConfirmVaultWipe;
    document.getElementById("settings-action-logout").onclick = executeGlobalLogoutSequence;

    // Media Interceptor Modal Actions Hooks
    document.getElementById("modal-action-cancel-intercept").onclick = discardMediaInterceptModal;
    document.getElementById("modal-action-commit-intercept").onclick = commitMediaInterceptModal;
}

// SLIDING UTILITY DRAWER OVERLAY CONTROLLERS
function expandDrawerInterface(drawerId) {
    collapseAllDrawers();
    document.getElementById(drawerId).classList.add("drawer-expanded-state");
    const scrim = document.getElementById("drawer-overlay-scrim-curtain");
    scrim.className = "drawer-scrim-visible";
}

function collapseAllDrawers() {
    document.querySelectorAll(".sliding-drawer-container").forEach(d => d.classList.remove("drawer-expanded-state"));
    const scrim = document.getElementById("drawer-overlay-scrim-curtain");
    scrim.className = "drawer-scrim-hidden";
}

function togglePasswordMasking() {
    const fld = document.getElementById("auth-password-field");
    fld.type = (fld.type === "password") ? "text" : "password";
}

// THEME TOGGLE CONTROLLER
function toggleThemeDarkLightParameters() {
    const isLight = document.body.classList.toggle("light-mode-parameters");
    document.getElementById("settings-action-toggle-theme").innerText = isLight ? "Toggle Light/Dark Mode: LIGHT MODE" : "Toggle Light/Dark Mode: DARK MODE";
}

// AFFILIATE LINK GENERATION FACTORY ENGINE
function runAffiliateLinkFactoryEngine(itemName, customUrl = "") {
    if (customUrl.trim() !== "") return customUrl.trim();
    // Replaces whitespaces with URL safe strings
    const slug = encodeURIComponent(itemName.toLowerCase().replace(/\s+/g, "-"));
    return `https://click.linksynergy.com/fs-bin/click?id=top-tens&subid=0&offerid=1001&type=3&tmpid=21&RD_PARM1=https%3A%2F%2Fstore.search.dev%2Fitem%2F${slug}`;
}

// INPUT DATA LOCAL SEEDING BACKBONE LOADER
function loadLocalSessionFallbackData() {
    const cachedCategories = localStorage.getItem("toptens_categories");
    const cachedItems = localStorage.getItem("toptens_items");
    const cachedFriends = localStorage.getItem("toptens_friends");
    const cachedProfile = localStorage.getItem("toptens_profile");
    const cachedTier = localStorage.getItem("toptens_tier_upgrade");

    state.categories = cachedCategories ? JSON.parse(cachedCategories) : [...window.DEFAULT_STOCK_CATEGORIES];
    state.items = cachedItems ? JSON.parse(cachedItems) : { ...window.DEFAULT_STOCK_ITEMS };
    state.friends = cachedFriends ? JSON.parse(cachedFriends) : [...window.DEFAULT_STOCK_FRIENDS];
    state.isTierUpgraded = (cachedTier === "true");

    if (cachedProfile) {
        state.profileMetadata = JSON.parse(cachedProfile);
    }
    updateProfileAvatarHeaderView();
}

function updateProfileAvatarHeaderView() {
    const frame = document.getElementById("header-profile-avatar-node");
    if (state.profileMetadata.avatar) {
        frame.style.backgroundImage = `url('${state.profileMetadata.avatar}')`;
    } else {
        frame.style.backgroundImage = "none";
    }
}

// CLOUD INTERFACE SESSION AUTHENTICATION HANDLING PIPELINES
async function synchronizeSessionHandshake() {
    const token = localStorage.getItem("toptens_jwt_token");
    if (!token || token === "null" || token === "undefined") {
        // Enforce safe guest boundary if no valid token exists
        return;
    }
    
    try {
        const resp = await fetch(`${API_BASE}/api/auth/verify-session`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (resp.status === 200) {
            const data = await resp.json();
            state.user = data.user.email;
            state.token = token;
            await pullCloudVaultPayload();
            
            // Sync profile data across devices during session handshake validation
            try {
                const profileResp = await fetch(`${API_BASE}/api/vault/pull-profile`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (profileResp.status === 200) {
                    const profileData = await profileResp.json();
                    if (profileData) {
                        state.profileMetadata = profileData;
                        localStorage.setItem("toptens_profile", JSON.stringify(profileData));
                        updateProfileAvatarHeaderView();
                    }
                }
            } catch (pErr) {
                console.warn("Unable to pull down synchronized cloud profile data.");
            }
        } else {
            // Drop invalid token blocks entirely
            localStorage.removeItem("toptens_jwt_token");
            executeGlobalLogoutSequence();
        }
    } catch (e) {
        console.warn("API handshake matrix offline. Operating in isolated offline database mode.");
    }
}

async function executeSignInSessionRequest() {
    const email = document.getElementById("auth-email-field").value;
    const password = document.getElementById("auth-password-field").value;
    const banner = document.getElementById("auth-status-feedback-display");

    if (!email || !password) return;

    try {
        const resp = await fetch(`${API_BASE}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();

        if (resp.status === 200) {
            state.token = data.token;
            state.user = data.user.email;
            localStorage.setItem("toptens_jwt_token", data.token);
            
            // Populate profile metadata fields instantly on login from backend response
            if (data.profileMetadata) {
                state.profileMetadata = data.profileMetadata;
                localStorage.setItem("toptens_profile", JSON.stringify(data.profileMetadata));
                updateProfileAvatarHeaderView();
            }

            banner.className = "realtime-status-banner-box status-success";
            banner.innerText = "Session validated successfully.";
            
            await pullCloudVaultPayload();
            setTimeout(() => {
                collapseAllDrawers();
                navigateToScreenView("view-categories-page");
                renderCategoriesGridMatrix();
            }, 1000);
        } else {
            banner.className = "realtime-status-banner-box status-error";
            banner.innerText = data.error || "Authentication credential error.";
        }
    } catch (e) {
        banner.className = "realtime-status-banner-box status-error";
        banner.innerText = "Cloud server interface offline.";
    }
}

async function executeSignUpRegistrationRequest() {
    const email = document.getElementById("auth-email-field").value;
    const password = document.getElementById("auth-password-field").value;
    const banner = document.getElementById("auth-status-feedback-display");

    // Password criteria constraint mapping verification regex
    const regexConstraint = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x21-\x7E])[A-Za-z\d\x21-\x7E]{8,20}$/;
    if (!regexConstraint.test(password)) {
        banner.className = "realtime-status-banner-box status-error";
        banner.innerText = "Password does not match system complexity boundaries.";
        return;
    }

    try {
        const resp = await fetch(`${API_BASE}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();

        if (resp.status === 202) {
            banner.className = "realtime-status-banner-box status-success";
            banner.innerText = "Activation token transmitted. Polling network state activation link hook...";
            
            // Poll for verification to simulate real-time registration mapping transitions
            let pollTimer = setInterval(async () => {
                const pResp = await fetch(`${API_BASE}/api/auth/poll-verification?email=${encodeURIComponent(email)}`);
                const pData = await pResp.json();
                if (pData.verified) {
                    clearInterval(pollTimer);
                    state.token = pData.token;
                    state.user = pData.user.email;
                    localStorage.setItem("toptens_jwt_token", pData.token);
                    banner.innerText = "Account confirmed verified! Access unlocked.";
                    await pushCloudVaultSynchronization();
                    setTimeout(() => {
                        collapseAllDrawers();
                        navigateToScreenView("view-categories-page");
                        renderCategoriesGridMatrix();
                    }, 1200);
                }
            }, 2500);
        } else {
            banner.className = "realtime-status-banner-box status-error";
            banner.innerText = data.error || "Registration rejected.";
        }
    } catch (e) {
        banner.className = "realtime-status-banner-box status-error";
        banner.innerText = "Database connection error.";
    }
}

function executeGlobalLogoutSequence() {
    // 1. Explicitly break memory references by clearing all keys instantly
    localStorage.clear();
    
    // 2. Extra Insurance: Explicitly destroy target token items to prevent cache preservation on quick reloads
    localStorage.removeItem("toptens_jwt_token");
    localStorage.removeItem("toptens_profile");
    localStorage.removeItem("toptens_categories");
    localStorage.removeItem("toptens_items");
    localStorage.removeItem("toptens_tier_upgrade");

    // 3. Clear out the global tracking state parameters entirely
    state.user = null;
    state.token = null;
    state.isTierUpgraded = false;
    state.categories = [...window.DEFAULT_STOCK_CATEGORIES];
    state.items = { ...window.DEFAULT_STOCK_ITEMS };
    state.friends = [];
    state.navigationHistoryStack = [];
    state.currentCategoryContextId = null;
    state.profileMetadata = { fullname: "", dob: "", hometown: "", vocation: "", email: "", recovery: "", avatar: "" };

    // 4. Scrub the email, password, and feedback message elements off the login panel
    const emailField = document.getElementById("auth-email-field");
    const passwordField = document.getElementById("auth-password-field");
    const feedbackBanner = document.getElementById("auth-status-feedback-display");
    
    if (emailField) emailField.value = "";
    if (passwordField) passwordField.value = "";
    if (feedbackBanner) {
        feedbackBanner.className = "realtime-status-banner-box";
        feedbackBanner.innerText = "";
    }

    // 5. Update UI View components and drop the sliding drawers cleanly
    updateProfileAvatarHeaderView();
    collapseAllDrawers();
    navigateToScreenView("view-landing-page", false);

    // 6. Alert confirmation before the hard page refresh to clear asynchronous race conditions
    setTimeout(() => {
        window.location.reload();
    }, 150);
}

// STORAGE DATA METRIC TRANSFER ENGINE CLOSURES
async function pushCloudVaultSynchronization() {
    if (!state.user || !state.token) {
        // Enforce guest state persistence rules
        localStorage.setItem("toptens_categories", JSON.stringify(state.categories));
        localStorage.setItem("toptens_items", JSON.stringify(state.items));
        return;
    }
    try {
        await fetch(`${API_BASE}/api/vault/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.token}` },
            body: JSON.stringify({ categories: state.categories, items: state.items })
        });
    } catch (e) { console.warn("Failed to sync matrix state with cluster."); }
}

async function pullCloudVaultPayload() {
    if (!state.token) return;
    try {
        const resp = await fetch(`${API_BASE}/api/vault/pull`, {
            headers: { "Authorization": `Bearer ${state.token}` }
        });
        if (resp.status === 200) {
            const data = await resp.json();
            if (data.categories && data.categories.length > 0) state.categories = data.categories;
            if (data.items && Object.keys(data.items).length > 0) state.items = data.items;
            localStorage.setItem("toptens_categories", JSON.stringify(state.categories));
            localStorage.setItem("toptens_items", JSON.stringify(state.items));
            if (state.currentViewId === "view-categories-page") renderCategoriesGridMatrix();
        }
    } catch (e) { console.warn("Failed to pull down persistent cloud data profiles."); }
}

// PAGE 2 ENGINE: CATEGORIES LAYOUT MATRIX
function renderCategoriesGridMatrix() {
    const grid = document.getElementById("categories-grid-matrix");
    grid.innerHTML = "";

    state.categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-elongated-card";
        card.onclick = (e) => {
            // Discard execution bubble path if targeting control layers
            if (e.target.closest("button") || e.target.closest(".node-utilities-corner-cluster")) return;
            openItemsListViewContext(cat.id);
        };

        const itemCount = state.items[cat.id] ? state.items[cat.id].length : 0;

        card.innerHTML = `
            <div class="category-emoji-frame">${cat.emoji || "📁"}</div>
            <div class="category-title-label">${cat.name}</div>
            <div class="category-counter-subtext">(${itemCount} items)</div>
            <div class="category-card-actions-row">
                <button class="inline-action-pill-btn" onclick="executeComparePipeline('${cat.id}', '${cat.name}')">Compare</button>
                <button class="inline-action-pill-btn" onclick="executeFusePipeline('${cat.id}', '${cat.name}')">Fuse</button>
                <button class="inline-action-pill-btn ${cat.private ? '' : 'active-state'}" onclick="toggleCategoryPrivacyState('${cat.id}', this)">
                    ${cat.private ? 'Private' : 'Public'}
                </button>
            </div>
            <div class="node-utilities-corner-cluster">
                <span class="icon-action-node-trigger" onclick="triggerCategoryRenamingMatrix('${cat.id}')">✏️</span>
                <span class="icon-action-node-trigger" onclick="deleteCategoryFromMatrix('${cat.id}')">🗑️</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function triggerCustomCategoryCreationMatrix() {
    const cap = state.isTierUpgraded ? 99 : 21;
    if (state.categories.length >= cap) {
        alert(`Account registration limits tier hit. Active category threshold maximum size is ${cap} configurations.`);
        return;
    }
    const title = prompt("Specify Unique Custom Category Identifier String Name:");
    if (!title || !title.trim()) return;

    const emoji = prompt("Assign Single Character Glyph Emoji Symbol:", "📊") || "📊";
    const newId = "cat_" + Date.now();
    
    state.categories.push({ id: newId, name: title.trim(), emoji: emoji.substring(0,2), private: false });
    state.items[newId] = [];
    
    pushCloudVaultSynchronization();
    renderCategoriesGridMatrix();
}

function triggerCategoryRenamingMatrix(catId) {
    const target = state.categories.find(c => c.id === catId);
    if (!target) return;
    const newName = prompt("Modify category label token name text string values:", target.name);
    if (newName && newName.trim()) {
        target.name = newName.trim();
        pushCloudVaultSynchronization();
        renderCategoriesGridMatrix();
    }
}

function deleteCategoryFromMatrix(catId) {
    if (!confirm("Confirm hard removal deletion structural execution pipeline rule?")) return;
    state.categories = state.categories.filter(c => c.id !== catId);
    delete state.items[catId];
    pushCloudVaultSynchronization();
    renderCategoriesGridMatrix();
}

function toggleCategoryPrivacyState(catId, btnNode) {
    const target = state.categories.find(c => c.id === catId);
    if (!target) return;
    target.private = !target.private;
    btnNode.classList.toggle("active-state", !target.private);
    btnNode.innerText = target.private ? "Private" : "Public";
    pushCloudVaultSynchronization();
}

// PAGE 3 ENGINE: LIST ITEMS MATRIX VIEWPORT CONTAINER LAYOUTS
function openItemsListViewContext(catId) {
    state.currentCategoryContextId = catId;
    navigateToScreenView("view-items-page");
    renderItemsStack();
}

function renderItemsStack() {
    const container = document.getElementById("items-rows-stack-container");
    container.innerHTML = "";
    
    const contextList = state.items[state.currentCategoryContextId] || [];
    
    // Explicit dynamic programmatic sorting tracking logic parameters
    const orderedItems = [...contextList].sort((a, b) => a.rank - b.rank);

    orderedItems.forEach((item) => {
        const row = document.createElement("div");
        row.className = "item-row-strip";

        const affLink = runAffiliateLinkFactoryEngine(item.name, item.customUrl);

        row.innerHTML = `
            <div class="item-prominent-hash">#${item.rank}</div>
            <div class="item-numerical-rank" style="display:none;">${item.rank}</div>
            <div class="item-core-title">${item.name}</div>
            <a href="${affLink}" target="_blank" rel="noopener" class="item-reference-hyperlink">Reference Link</a>
            <div class="circular-media-thumbnail" id="thumb-node-element-${item.id}">
                ${renderThumbnailMediaAssetStringNode(item.media)}
            </div>
            <div class="node-utilities-corner-cluster" style="position:static;">
                <span class="icon-action-node-trigger" onclick="triggerInlineItemEditingSequence('${item.id}')">✏️</span>
                <span class="icon-action-node-trigger" onclick="deleteItemFromInventoryMatrix('${item.id}')">🗑️</span>
            </div>
        `;
        container.appendChild(row);
    });
}

function renderThumbnailMediaAssetStringNode(mediaStr) {
    if (!mediaStr) return "";
    if (mediaStr.startsWith("data:video/")) {
        return `<video src="${mediaStr}" muted loop autoplay playsinline></video>`;
    }
    return `<div style="width:100%; height:100%; background-image:url('${mediaStr}'); background-size:cover; background-position:center;"></div>`;
}

// HIGH-FIDELITY INTERCEPTOR MEDIA UPLOADER PROCESSING ENGINE
function handleMediaSelectionInput(event, pipelineContextId) {
    const file = event.target.files[0];
    if (!file) return;

    // Enforce 6-second video duration limits natively
    if (file.type.startsWith("video/")) {
        const tempVideoNode = document.createElement("video");
        tempVideoNode.preload = "metadata";
        tempVideoNode.src = URL.createObjectURL(file);
        
        tempVideoNode.onloadedmetadata = function() {
            URL.revokeObjectURL(tempVideoNode.src);
            if (tempVideoNode.duration > 6.1) {
                alert("Validation failure limit hit. Selected media file length duration maps longer than 6 seconds bounds.");
                event.target.value = "";
                return;
            }
            launchInterceptorModalCropCanvas(file, pipelineContextId);
        };
    } else {
        launchInterceptorModalCropCanvas(file, pipelineContextId);
    }
}

function launchInterceptorModalCropCanvas(file, pipelineContextId) {
    const modal = document.getElementById("media-crop-preview-modal-overlay");
    const imgNode = document.getElementById("modal-dynamic-preview-target-image");
    const vidNode = document.getElementById("modal-dynamic-preview-target-video");
    
    imgNode.classList.add("hidden-element");
    vidNode.classList.add("hidden-element");
    imgNode.src = "";
    vidNode.src = "";

    state.pendingMediaBuffer = file;
    state.pendingTargetNodeCallback = pipelineContextId;

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        modal.classList.remove("hidden-element");
        if (file.type.startsWith("video/")) {
            vidNode.src = e.target.getSelection ? "" : e.target.result;
            vidNode.src = e.target.result;
            vidNode.classList.remove("hidden-element");
        } else {
            imgNode.src = e.target.result;
            imgNode.classList.remove("hidden-element");
        }
    };
    fileReader.readAsDataURL(file);
}

function discardMediaInterceptModal() {
    document.getElementById("media-crop-preview-modal-overlay").classList.add("hidden-element");
    state.pendingMediaBuffer = null;
    state.pendingTargetNodeCallback = null;
}

function commitMediaInterceptModal() {
    const file = state.pendingMediaBuffer;
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const finalBase64String = e.target.result;

        if (typeof state.pendingTargetNodeCallback === "string" && state.pendingTargetNodeCallback.startsWith("inline_edit_")) {
            const itemId = state.pendingTargetNodeCallback.replace("inline_edit_", "");
            const list = state.items[state.currentCategoryContextId] || [];
            const item = list.find(i => i.id === itemId);
            if (item) {
                item.media = finalBase64String;
                renderItemsStack();
            }
        } else if (state.pendingTargetNodeCallback === "profile") {
            state.profileMetadata.avatar = finalBase64String;
            document.getElementById("profile-drawer-avatar-preview").style.backgroundImage = `url('${finalBase64String}')`;
            updateProfileAvatarHeaderView();
        } else if (state.pendingTargetNodeCallback === "creation") {
            state.creationPendingMediaStringBase64 = finalBase64String;
            document.getElementById("item-media-upload-dummy-btn").innerText = "Asset Buffered";
        }
        discardMediaInterceptModal();
    };
    fileReader.readAsDataURL(file);
}

function executeItemCreationFormCommit() {
    const titleInp = document.getElementById("input-item-title");
    const rankInp = document.getElementById("input-item-rank");
    const urlInp = document.getElementById("input-item-custom-url");

    const title = titleInp.value.trim();
    const rank = parseInt(rankInp.value);
    const customUrl = urlInp.value.trim();

    if (!title || isNaN(rank) || rank < 1 || rank > 10) {
        alert("Enforced list arrays require accurate title descriptions mapped alongside valid sequence ranks (1-10).");
        return;
    }

    const contextList = state.items[state.currentCategoryContextId] || [];
    if (contextList.length >= 10) {
        alert("Hard bounds operational matrix cap overflow error. Top Tens items indices sizes max length limits are locked to exactly 10 allocation tracks.");
        return;
    }

    const newItem = {
        id: "item_" + Date.now(),
        name: title,
        rank: rank,
        customUrl: customUrl,
        media: state.creationPendingMediaStringBase64 || ""
    };

    contextList.push(newItem);
    state.items[state.currentCategoryContextId] = contextList;

    // Reset Form Elements State Layer Bounds
    titleInp.value = "";
    rankInp.value = "";
    urlInp.value = "";
    state.creationPendingMediaStringBase64 = null;
    document.getElementById("item-media-upload-dummy-btn").innerText = "Upload Media";

    pushCloudVaultSynchronization();
    renderItemsStack();
}

async function triggerInlineItemEditingSequence(itemId) {
    const list = state.items[state.currentCategoryContextId] || [];
    const item = list.find(i => i.id === itemId);
    if (!item) return;

    const nextTitle = prompt("Modify Item Identity Title Text:", item.name);
    if (nextTitle === null) return; 

    const nextRankStr = prompt("Assign Modified Item Numerical Rank (1-10):", item.rank);
    if (nextRankStr === null) return;
    const nextRank = parseInt(nextRankStr);

    const nextUrl = prompt("Modify Custom Affiliate Forward Target Redirection URL (Leave empty to revert to autogeneration rules):", item.customUrl);
    if (nextUrl === null) return;

    if (confirm("Would you like to rewrite or completely replace the video loops or static layout graphics assigned to this node's asset slot?")) {
        const inlineFileInput = document.getElementById("input-item-file");
        
        // Temporarily hijack file change target handlers pointing back to item id reference matrix pointers
        inlineFileInput.onchange = (e) => handleMediaSelectionInput(e, `inline_edit_${item.id}`);
        inlineFileInput.click();
        
        // Restore downstream baseline structural capture listeners after thread stack window clears
        setTimeout(() => {
            document.getElementById("input-item-file").onchange = (ev) => handleMediaSelectionInput(ev, "creation");
        }, 1000);
    }

    item.name = nextTitle.trim() || item.name;
    if (!isNaN(nextRank) && nextRank >= 1 && nextRank <= 10) item.rank = nextRank;
    item.customUrl = nextUrl.trim();

    pushCloudVaultSynchronization();
    renderItemsStack();
}

function deleteItemFromInventoryMatrix(itemId) {
    if (!confirm("Remove item node from tracking schema lists completely?")) return;
    let list = state.items[state.currentCategoryContextId] || [];
    list = list.filter(i => i.id !== itemId);
    state.items[state.currentCategoryContextId] = list;
    pushCloudVaultSynchronization();
    renderItemsStack();
}

// PAGE 4 ENGINE: VERIFIED FRIENDS COMPARTMENT MATRIX CONTROLLERS
function renderFriendsRosterStack() {
    const container = document.getElementById("friends-rows-stack-container");
    container.innerHTML = "";

    state.friends.forEach((friend, idx) => {
        const row = document.createElement("div");
        row.className = "friend-row-strip";

        // Simulates common attribute map matches across data fields
        const mutualCategories = Math.floor(Math.random() * 3) + 1;
        const mutualItems = Math.floor(Math.random() * 7) + 3;

        row.innerHTML = `
            <div class="item-core-title" style="font-family:monospace; color:var(--app-burnished-gold); font-size:1.1rem;">${friend.name}</div>
            <div style="font-size:0.85rem; color:var(--app-text-muted);">Mutual Categories: ${mutualCategories}</div>
            <div style="font-size:0.85rem; color:var(--app-text-muted);">Mutual Items: ${mutualItems}</div>
            <div class="circular-media-thumbnail" style="background-image:url('${friend.avatar || 'AppIconTopTens.png'}');"></div>
            <div class="node-utilities-corner-cluster" style="position:static;">
                <span class="icon-action-node-trigger" onclick="deleteFriendFromRoster(${idx})">🗑️</span>
            </div>
        `;
        container.appendChild(row);
    });
}

async function triggerFriendAdditionDialog() {
    const name = prompt("Enter the exact Top Tens Profile Name of the verified user to link:");
    if (!name || !name.trim()) return;

    // Enforce case-insensitive matching support for safer validation runs
    const formattedTargetHandle = name.trim().toLowerCase();

    // Block non-logged-in sandboxed users from fabricating fake peers
    if (!state.token) {
        alert("Authentication Required: You must be logged in to a verified account to search and connect with other live Top Tens users.");
        return;
    }

    try {
        // Drop a direct query verification payload to your Cloudflare network layer
        const resp = await fetch(`${API_BASE}/api/friends/add`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${state.token}`
            },
            body: JSON.stringify({ friendProfileName: formattedTargetHandle })
        });

        const data = await resp.json();
		
        if (!resp.ok) {
            alert(data.error || "Failed to process target validation lookups.");
            return;
        }

        // UNIFIED SUCCESS ENGINE GATEKEEPER: Executes only on certified server validation match
        if (resp.status === 200 && data.success) {
            const targetName = data.friendName || data.username;
            
            if (!targetName) {
                alert("Server Validation Error: Account records corrupted. Unable to parse peer's Profile Name.");
                return;
            }

            // Avoid adding duplicate visual items to your client view array
            if (Array.isArray(state.friends) && state.friends.some(f => f.name && f.name.toLowerCase() === targetName.toLowerCase())) {
                alert("Connection Matrix Notice: This user tracking map is already linked to your roster.");
                return;
            }

            // Compute mutual overlapping intersection matrices
            let mutualCount = 0;
            const friendItems = data.vaultData?.items || {};
            
            // Cross-reference current user state against friend item names
            if (state.items && typeof state.items === 'object') {
                Object.keys(state.items).forEach(catId => {
                    const userCatItems = state.items[catId] || [];
                    userCatItems.forEach(uItem => {
                        if (!uItem || !uItem.name) return;
                        
                        // Scan friend items across all categories for any matching strings
                        Object.keys(friendItems).forEach(fCatId => {
                            const fCatItems = friendItems[fCatId] || [];
                            if (fCatItems.some(fItem => fItem && fItem.name && fItem.name.trim().toLowerCase() === uItem.name.trim().toLowerCase())) {
                                mutualCount++;
                            }
                        });
                    });
                });
            }

            // Construct the fully fleshed out data node structure for state tracking
            const newFriendNode = {
                name: targetName,
                avatar: data.friendAvatar || "",
                email: data.friendEmail || "",
                mutualItemsCount: mutualCount,
                vaultData: data.vaultData || { categories: [], items: {} }
            };

            // Initialize or safeguard array instances cleanly
            if (!Array.isArray(state.friends)) {
                state.friends = [];
            }
            
            // Double-check fallback filter tracking to protect the memory state array entries
            state.friends = state.friends.filter(f => f.name.toLowerCase() !== targetName.toLowerCase());
            state.friends.push(newFriendNode);
            localStorage.setItem("toptens_friends", JSON.stringify(state.friends));

            alert(`Successfully synced with ${targetName}! Found ${mutualCount} mutual matching item targets.`);
            
            // Re-render your social or friends UI view component matrix here
            if (state.currentViewId === "view-friends-page" && typeof renderFriendsRosterStack === 'function') {
                renderFriendsRosterStack();
            } else if (typeof renderSocialDashboardMatrix === 'function') {
                renderSocialDashboardMatrix();
            } else if (state.currentViewId === "view-social-page" && typeof renderSocialPage === 'function') {
                renderSocialPage();
            }
        } else {
            // Rejects input cleanly if handle doesn't exist on Cloudflare's master register table
            alert(`User Not Found: "${name.trim()}" is not a registered Top Tens user. Please check the spelling of their Profile Name.`);
        }
    } catch (err) {
        console.error("Network error executing friend synchronization layer:", err);
        alert("Connection Failure: Unable to reach the Top Tens validation servers. Check backend network status pipelines.");
    }
}

function deleteFriendFromRoster(indexIdx) {
    if (!confirm("Disconnect target peer tracking path variables completely?")) return;
    state.friends.splice(indexIdx, 1);
    localStorage.setItem("toptens_friends", JSON.stringify(state.friends));
    if (typeof renderFriendsRosterStack === 'function') renderFriendsRosterStack();
}

// COMPUTATIONAL LOGIC CORES: JUXTAPOSITION MATRIX AND AVERAGE COMBINATIONS FUSION
function executeComparePipeline(categoryId, categoryTitle) {
    navigateToScreenView("view-compare-matrix-page");
    const container = document.getElementById("compare-matrix-scroller");
    container.innerHTML = "";

    document.getElementById("compare-matrix-view-headline").innerText = `Juxtaposed Comparisons Matrix: ${categoryTitle}`;

    // Column A: Source Base Layout Dataset
    const myCol = document.createElement("div");
    myCol.className = "matrix-column-node-sheet";
    myCol.innerHTML = `<h4 class="matrix-column-headline">Your Local Vault</h4>`;
    
    const myItems = state.items[categoryId] || [];
    myItems.sort((a,b)=>a.rank - b.rank).forEach(it => {
        myCol.innerHTML += `<div class="matrix-mini-row"><span class="matrix-mini-rank">#${it.rank}</span> ${it.name}</div>`;
    });
    container.appendChild(myCol);

    // Dynamic evaluation compilation map across network bindings structures
    state.friends.forEach(fr => {
        const frCol = document.createElement("div");
        frCol.className = "matrix-column-node-sheet";
        frCol.innerHTML = `<h4 class="matrix-column-headline">${fr.name} Array</h4>`;
        
        // Use real sync data if it exists; otherwise use mock structure details fallback rules
        const friendVaultItems = fr.vaultData?.items?.[categoryId] || [];
        
        if (friendVaultItems.length > 0) {
            friendVaultItems.sort((a,b)=>a.rank - b.rank).forEach(it => {
                frCol.innerHTML += `<div class="matrix-mini-row"><span class="matrix-mini-rank">#${it.rank}</span> ${it.name}</div>`;
            });
        } else {
            // Simulates randomized structural offsets if no sync vault data matches this specific tracking register channel yet
            const mockDerivatives = myItems.map(it => ({
                rank: it.rank,
                name: Math.random() > 0.5 ? it.name : `${it.name} Alternative Variant Node`
            }));

            mockDerivatives.forEach(it => {
                frCol.innerHTML += `<div class="matrix-mini-row"><span class="matrix-mini-rank">#${it.rank}</span> ${it.name}</div>`;
            });
        }
        container.appendChild(frCol);
    });
}

function executeFusePipeline(categoryId, categoryTitle) {
    navigateToScreenView("view-fuse-matrix-page");
    const container = document.getElementById("fuse-matrix-rows-container");
    container.innerHTML = "";

    document.getElementById("fuse-matrix-view-headline").innerText = `Synthesized Weighted Rank Average Master: ${categoryTitle}`;

    const baselineItems = state.items[categoryId] || [];
    if (baselineItems.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--app-text-muted);">Unable to process combinations across blank metric spaces.</p>`;
        return;
    }

    // Mathematical Weighted Matrix Score Interpolations Engine
    let weightScoringMapMap = {};
    
    // Process local array paths layers inputs parameters scoring scales rules variables
    baselineItems.forEach(it => {
        if (!weightScoringMapMap[it.name]) weightScoringMapMap[it.name] = { scoreAccumulator: 0, trackingHits: 0 };
        weightScoringMapMap[it.name].scoreAccumulator += (11 - it.rank) * 1.5; // Heavy weight amplification modifiers assignments
        weightScoringMapMap[it.name].trackingHits++;
    });

    // Extract consolidated matrix listings elements
    let masterCompiledFuseList = Object.keys(weightScoringMapMap).map(name => {
        return { name: name, globalWeightRank: weightScoringMapMap[name].scoreAccumulator };
    });

    masterCompiledFuseList.sort((a, b) => b.globalWeightRank - a.globalWeightRank);

    masterCompiledFuseList.slice(0, 10).forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "item-row-strip";
        row.innerHTML = `
            <div class="item-prominent-hash">M#${index + 1}</div>
            <div class="item-core-title" style="color:var(--app-electric-blue); font-weight:700;">${item.name}</div>
            <div style="font-size:0.8rem; font-family:monospace; color:var(--app-burnished-gold);">Synthesized Vector Score Matrix: ${Math.floor(item.globalWeightRank)} points</div>
        `;
        container.appendChild(row);
    });
}

// PROFILE DRAWER INTERFACE FORM BINDERS
function populateProfileFieldsUI() {
    const p = state.profileMetadata;
    document.getElementById("profile-field-fullname").value = p.fullname || "";
    document.getElementById("profile-field-dob").value = p.dob || "";
    document.getElementById("profile-field-hometown").value = p.hometown || "";
    document.getElementById("profile-field-vocation").value = p.vocation || "";
    document.getElementById("profile-field-email").value = p.email || state.user || "unlinked@guest.mode";
    document.getElementById("profile-field-recovery").value = p.recovery || "";

    const previewNode = document.getElementById("profile-drawer-avatar-preview");
    if (p.avatar) {
        previewNode.style.backgroundImage = `url('${p.avatar}')`;
    } else {
        previewNode.style.backgroundImage = "none";
    }
}

async function saveProfileMetadataAttributes() {
    const inputFullname = document.getElementById("profile-field-fullname").value.trim();
    
    // Validate uniqueness of profile display handles if logged into a sync state session
    if (inputFullname && state.user && state.token) {
        try {
            const checkResp = await fetch(`${API_BASE}/api/profile/check-name?fullname=${encodeURIComponent(inputFullname)}`, {
                headers: { "Authorization": `Bearer ${state.token}` }
            });
            const checkData = await checkResp.json();
            
            // Block change tracking if name matches another account's recorded value maps
            if (checkResp.status === 200 && checkData.taken && checkData.ownerEmail !== state.user) {
                alert(`Profile Name Taken: The identifier string "${inputFullname}" is already assigned to a different registered account. Please choose a unique layout name.`);
                return;
            }
        } catch (e) {
            console.warn("Name replication check system uncontactable. Progressing under fallback rules.");
        }
    }

    state.profileMetadata.fullname = inputFullname;
    state.profileMetadata.dob = document.getElementById("profile-field-dob").value;
    state.profileMetadata.hometown = document.getElementById("profile-field-hometown").value;
    state.profileMetadata.vocation = document.getElementById("profile-field-vocation").value;
    state.profileMetadata.email = document.getElementById("profile-field-email").value;
    state.profileMetadata.recovery = document.getElementById("profile-field-recovery").value;

    localStorage.setItem("toptens_profile", JSON.stringify(state.profileMetadata));
    
    document.querySelectorAll(".editable-tab-field-container input").forEach(i => i.disabled = true);
    
    if (state.user && state.token) {
        fetch(`${API_BASE}/api/profile/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.token}` },
            body: JSON.stringify(state.profileMetadata)
        }).then(() => console.log("Profile updates committed directly to live DB nodes storage."));
    }
    
    alert("Profile parameters successfully registered to processing core.");
    collapseAllDrawers();
}

function toggleProfilePrivacyState() {
    state.privacyPublic = !state.privacyPublic;
    const node = document.getElementById("profile-privacy-toggle-state");
    node.innerText = state.privacyPublic ? "PUBLIC ACCESS" : "PRIVATE COVERT";
    node.className = state.privacyPublic ? "gold-action-button miniature-btn" : "gold-action-button miniature-btn variant-dark-btn";
}

// EXPANDED CAP RULES ADJUSTMENT HOOKS (UPGRADES & DESTRUCTION TRIGGERS)
function processTierUpgradeTransaction() {
    if (state.isTierUpgraded) {
        alert("Account structure index validation verified: Expanded storage node matrices allocation tracks are already unlocked.");
        return;
    }
    if (confirm("Execute background structural initialization sandbox route for Tier Upgrade expandability ($0.99/mo processing mapping channels allocation bounds)?")) {
        state.isTierUpgraded = true;
        localStorage.setItem("toptens_tier_upgrade", "true");
        alert("Transaction complete. Maximum track limits expanded up to 99 customized tracking registers slots.");
        collapseAllDrawers();
        if (state.currentViewId === "view-categories-page") renderCategoriesGridMatrix();
    }
}

function triggerConfirmVaultWipe() {
    const confirmPrompt = prompt("CRITICAL CORE HARD RESET ACTION SEQUENCER INTERCEPT TRIGGER. To completely scrub all tracking records arrays and roll back database clusters to zero default values maps, type exactly \"CONFIRM WIPE\" down in the window box:");
    if (confirmPrompt === "CONFIRM WIPE") {
        localStorage.clear();
        state.user = null;
        state.token = null;
        state.isTierUpgraded = false;
        
        loadLocalSessionFallbackData();
        collapseAllDrawers();
        navigateToScreenView("view-landing-page", false);
        state.navigationHistoryStack = [];
        
        alert("Structural data arrays cleared successfully. Factory matrix baseline defaults restored.");
    } else {
        alert("Validation mismatch verification code failure. Deletion scrubbing loop dropped.");
    }
}