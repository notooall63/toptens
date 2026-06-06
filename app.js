// File: D:/top-tens/frontend/app.js

/* ==========================================================================
   GLOBAL STATE DECLARATIONS & SYSTEM ARCHITECTURE CONFIGURATIONS
   ========================================================================== */
let MASTER_USER_VAULT_CACHE = {};
let CURRENT_USER_SESSION = null;
let WORKING_CATEGORY_KEY = null;
let SYSTEM_ACTIVE_VIEW_HISTORY = ["view-landing"];
const APP_TIER_CEILING = 21; 
const API_ENDPOINT = "https://top-tens-backend.swoodson96.workers.dev";

/* ==========================================================================
   SAFE EVENT LISTENER ATTACHMENT UTILITY
   ========================================================================== */
function safeSafeListener(id, event, callback) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(event, callback);
    } else {
        console.warn(`[System Notice] Element with ID '${id}' not found in DOM. Skipping binding.`);
    }
}

/* ==========================================================================
   INITIALIZATION & EVENT INITIAL INTERFACE MAPS
   ========================================================================== */
function initializeDOMEventMappings() {
    // Structural Navigation Mapping Triggers
    safeSafeListener("action-enter-vault", "click", () => {
        transitionViewContext("view-categories");
    });

    safeSafeListener("action-trigger-auth", "click", () => {
        openSlidingDrawer("drawer-auth");
    });

    safeSafeListener("header-back-btn", "click", () => {
        executeBackNavigationHistory();
    });

    // Category Creation Event Map Hook
    safeSafeListener("action-add-category", "click", triggerCreateCategoryWorkflow);

    // Drawer System Trigger Triggers
    safeSafeListener("profile-avatar-trigger", "click", () => {
        openSlidingDrawer("drawer-profile");
    });

    safeSafeListener("settings-burger-trigger", "click", () => {
        openSlidingDrawer("drawer-settings");
    });

    // Global Event Delegation for Dynamic Drawer Dismount Mechanics
    const overlay = document.getElementById("global-drawer-overlay");
    if (overlay) {
        overlay.addEventListener("click", closeAllDrawers);
    }
    document.querySelectorAll(".drawer-close-btn").forEach(b => {
        b.addEventListener("click", () => closeAllDrawers());
    });

    // Password Reveal Architecture Button Event
    safeSafeListener("auth-password-toggle", "click", () => {
        const input = document.getElementById("auth-password");
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    });

    // Network Authentication Protocol Pipeline Map
    safeSafeListener("action-execute-signup", "click", triggerAuthRegisterSequence);
    safeSafeListener("action-execute-signin", "click", triggerAuthLoginSequence);

    // Profile Settings Event Mappings
    safeSafeListener("action-save-profile", "click", persistProfileChangesToServer);
    safeSafeListener("profile-privacy-toggle", "click", toggleProfilePrivacyState);
    safeSafeListener("action-select-avatar-file", "click", () => {
        const fileInput = document.getElementById("upload-avatar-file-input");
        if (fileInput) fileInput.click();
    });
    
    const avatarInput = document.getElementById("upload-avatar-file-input");
    if (avatarInput) {
        avatarInput.addEventListener("change", processAvatarCropSequence);
    }

    // App Control Configurations Stack
    safeSafeListener("setting-toggle-theme", "click", toggleThemeMode);
    safeSafeListener("setting-upgrade-tier", "click", executeTierUpgradePaymentStream);
    safeSafeListener("setting-nav-friends", "click", () => {
        closeAllDrawers();
        transitionViewContext("view-friends");
    });
    safeSafeListener("setting-vault-wipe", "click", executeVaultWipeProtocol);

    // Item Action Triggers
    safeSafeListener("action-submit-item", "click", executeCreateItemRow);
    safeSafeListener("media-dropzone", "click", () => {
        const itemFileInput = document.getElementById("input-item-file");
        if (itemFileInput) itemFileInput.click();
    });
}

/* ==========================================================================
   CATEGORY APPLICATION WORKFLOW OPERATIONS
   ========================================================================== */
function triggerCreateCategoryWorkflow() {
    const currentCategoryCount = Object.keys(MASTER_USER_VAULT_CACHE).length;
    if (currentCategoryCount >= APP_TIER_CEILING) {
        alert(`Vault Limit Reached! The free tier is limited to ${APP_TIER_CEILING} categories. Please upgrade via Settings ($0.99/month) for up to 99 categories.`);
        return;
    }

    const categoryName = prompt("Enter the name for your new Custom Category:");
    if (!categoryName || categoryName.trim() === "") return;

    const categoryKey = categoryName.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");

    if (MASTER_USER_VAULT_CACHE[categoryKey]) {
        alert("A category with that name already exists inside your vault.");
        return;
    }

    const categoryEmoji = prompt("Enter a single emoji character for this category tab icon:", "📂");

    MASTER_USER_VAULT_CACHE[categoryKey] = {
        emoji: categoryEmoji && categoryEmoji.trim() !== "" ? categoryEmoji.trim() : "📂",
        title: categoryName.trim(),
        items: [] 
    };

    renderCategoriesMatrix();

    if (CURRENT_USER_SESSION) {
        synchronizeVaultWithBackendCloud();
    } else {
        console.log("Guest Mode active: custom category saved in volatile local session state space.");
    }
}

/* ==========================================================================
   RENDERING ENGINE HOOK OPERATIONS MATRIX
   ========================================================================== */
function renderCategoriesMatrix() {
    const grid = document.getElementById("categories-grid-hook");
    if (!grid) return;
    grid.innerHTML = "";
    
    Object.keys(MASTER_USER_VAULT_CACHE).forEach(key => {
        const cat = MASTER_USER_VAULT_CACHE[key];
        const totalItems = cat.items ? cat.items.length : 0;
        
        const card = document.createElement("div");
        card.className = "category-card-tab";
        card.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest(".category-management-row")) return;
            openCategoryItemsView(key);
        });

        card.innerHTML = `
            <span class="category-emoji">${cat.emoji || '📂'}</span>
            <div class="category-title-text">${cat.title}</div>
            <div class="category-item-counter">(${totalItems} items)</div>
            <div class="category-card-actions-wrapper">
                <button class="btn-card-util" onclick="executeCompareProtocol('${key}')">Compare</button>
                <button class="btn-card-util" onclick="executeFuseProtocol('${key}')">Fuse</button>
                <button class="btn-card-util public-btn" onclick="toggleCategoryPrivacy(event, '${key}')">Public</button>
            </div>
            <div class="category-management-row">
                <span class="icon-crud" onclick="editCategoryName(event, '${key}')">✏️</span>
                <span class="icon-crud" onclick="deleteCategoryElement(event, '${key}')">🗑️</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openCategoryItemsView(key) {
    WORKING_CATEGORY_KEY = key;
    const cat = MASTER_USER_VAULT_CACHE[key];
    const display = document.getElementById("current-category-title-display");
    if (display) display.innerText = cat.title;
    renderListItemsStack();
    transitionViewContext("view-list-items");
}

function renderListItemsStack() {
    const container = document.getElementById("items-list-hook");
    if (!container) return;
    container.innerHTML = "";
    const cat = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY];
    if (!cat) return;
    
    const items = (cat.items || []).sort((a,b) => a.rank - b.rank).slice(0, 10);

    items.forEach(item => {
        const row = document.createElement("div");
        row.className = "slot-row-tab";
        row.innerHTML = `
            <span class="slot-hashtag">#</span>
            <span class="slot-rank-num">${item.rank}</span>
            <span class="slot-item-title">${item.name}</span>
            <a href="${item.link}" target="_blank" class="slot-affiliate-link">Reference Link</a>
            <div class="slot-thumbnail-container">
                <img src="${item.media || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23d4af37\'><rect width=\'24\' height=\'24\' fill=\'%23222\'/></svg>'}" alt="Thumb">
            </div>
            <span class="icon-crud" style="margin-right:12px;" onclick="editListItem(event, ${item.rank})">✏️</span>
            <span class="icon-crud" onclick="deleteListItem(event, ${item.rank})">🗑️</span>
        `;
        container.appendChild(row);
    });
}

/* ==========================================================================
   VIEW LIFECYCLE ROUTING NAVIGATION MANAGEMENT STATE MACHINE ENGINE
   ========================================================================== */
function transitionViewContext(targetViewId) {
    document.querySelectorAll(".view-panel").forEach(panel => panel.classList.add("hidden"));
    
    const targetPanel = document.getElementById(targetViewId);
    if (targetPanel) targetPanel.classList.remove("hidden");
    
    const header = document.getElementById("app-header");
    if (header) {
        if (targetViewId === "view-landing") {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }
    }

    if (SYSTEM_ACTIVE_VIEW_HISTORY[SYSTEM_ACTIVE_VIEW_HISTORY.length - 1] !== targetViewId) {
        SYSTEM_ACTIVE_VIEW_HISTORY.push(targetViewId);
    }
}

function executeBackNavigationHistory() {
    if (SYSTEM_ACTIVE_VIEW_HISTORY.length <= 1) return;
    SYSTEM_ACTIVE_VIEW_HISTORY.pop(); 
    const lastView = SYSTEM_ACTIVE_VIEW_HISTORY[SYSTEM_ACTIVE_VIEW_HISTORY.length - 1] || "view-landing";
    transitionViewContext(lastView);
}

/* ==========================================================================
   DRAWER INTERACTION UTILITIES HOOKS CONTEXT
   ========================================================================== */
function openSlidingDrawer(drawerId) {
    const overlay = document.getElementById("global-drawer-overlay");
    const drawer = document.getElementById(drawerId);
    if (overlay) overlay.classList.add("active");
    if (drawer) drawer.classList.add("active");
}

function closeAllDrawers() {
    const overlay = document.getElementById("global-drawer-overlay");
    if (overlay) overlay.classList.remove("active");
    document.querySelectorAll(".sliding-drawer-panel").forEach(d => d.classList.remove("active"));
}

/* ==========================================================================
   STUBS & BACKWARD UTILITY COMPATIBILITY BRIDGE LAYERS
   ========================================================================== */
function persistProfileChangesToServer() { console.log("Profile changes tracked dynamically."); }
function toggleProfilePrivacyState() { console.log("Privacy matrix updated."); }
function processAvatarCropSequence() { console.log("Crop sequence process initialization completed."); }
function toggleThemeMode() { console.log("UI Core contrast theme inverted."); }
function executeTierUpgradePaymentStream() { console.log("Stripe routing sequence mapped to cloud."); }
function executeVaultWipeProtocol() { if(confirm("Clear local cache storage completely?")) { MASTER_USER_VAULT_CACHE = {}; renderCategoriesMatrix(); } }
function editCategoryName(e, key) { e.stopPropagation(); const n = prompt("Edit category title:", MASTER_USER_VAULT_CACHE[key].title); if(n) { MASTER_USER_VAULT_CACHE[key].title = n; renderCategoriesMatrix(); synchronizeVaultWithBackendCloud(); } }
function deleteCategoryElement(e, key) { e.stopPropagation(); if(confirm("Delete category option structurally?")) { delete MASTER_USER_VAULT_CACHE[key]; renderCategoriesMatrix(); synchronizeVaultWithBackendCloud(); } }
function executeCompareProtocol(key) { console.log(`Compare utility logic active for: ${key}`); }
function executeFuseProtocol(key) { console.log(`Fuse core compilation matching matrix active for: ${key}`); }
function toggleCategoryPrivacy(e, key) { e.stopPropagation(); console.log(`Privacy structural state toggled for card resource trace: ${key}`); }
function editListItem(e, rank) { console.log(`Editing target list array context offset: ${rank}`); }
function deleteListItem(e, rank) { console.log(`Purging list item entry from category stack block context offset: ${rank}`); }

/* ==========================================================================
   NETWORK CORE REST API ASYNC PIPELINES PROTOCOLS ENGINE
   ========================================================================== */
async function triggerAuthRegisterSequence() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const msgBox = document.getElementById("auth-status-msg");
    if (!msgBox) return;

    msgBox.classList.remove("hidden");
    msgBox.innerText = "Registering system security clearance context link...";

    try {
        const res = await fetch(`${API_ENDPOINT}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration Validation Error");

        msgBox.style.color = "var(--success-green)";
        msgBox.innerText = "Verification token sequence transmitted successfully!";
    } catch (err) {
        msgBox.style.color = "var(--error-red)";
        msgBox.innerText = err.message;
    }
}

async function triggerAuthLoginSequence() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const msgBox = document.getElementById("auth-status-msg");

    try {
        const res = await fetch(`${API_ENDPOINT}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authorization Error");

        CURRENT_USER_SESSION = data.token;
        MASTER_USER_VAULT_CACHE = data.vault || MASTER_USER_VAULT_CACHE;
        
        renderCategoriesMatrix();
        closeAllDrawers();
        transitionViewContext("view-categories");
    } catch (err) {
        if (msgBox) {
            msgBox.classList.remove("hidden");
            msgBox.style.color = "var(--error-red)";
            msgBox.innerText = err.message;
        }
    }
}

/* ==========================================================================
   LOCAL STATE CONTROL HANDLERS STUBS ENGINE MAP CONFIGURATION CONTEXTS
   ========================================================================== */
function executeCreateItemRow() {
    if (!WORKING_CATEGORY_KEY) return;
    const name = document.getElementById("input-item-name").value;
    const rank = parseInt(document.getElementById("input-item-rank").value);
    
    if (!name || isNaN(rank) || rank < 1 || rank > 10) return;

    const targetList = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items;
    
    const existingIndex = targetList.findIndex(i => i.rank === rank);
    if (existingIndex !== -1) {
        targetList[existingIndex] = { rank, name, link: "https://google.com", media: "" };
    } else if (targetList.length >= 10) {
        targetList.pop();
        targetList.push({ rank, name, link: "https://google.com", media: "" });
    } else {
        targetList.push({ rank, name, link: "https://google.com", media: "" });
    }

    renderListItemsStack();
    synchronizeVaultWithBackendCloud();
}

async function synchronizeVaultWithBackendCloud() {
    if (!CURRENT_USER_SESSION) return; 
    await fetch(`${API_ENDPOINT}/api/vault/sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CURRENT_USER_SESSION}`
        },
        body: JSON.stringify({ vault: MASTER_USER_VAULT_CACHE })
    });
}

// Global initialization window hook sequence
window.addEventListener("DOMContentLoaded", () => {
    initializeDOMEventMappings();
    renderCategoriesMatrix();
});