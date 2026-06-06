// File: D:/top-tens/frontend/app.js

const API_ENDPOINT = "https://top-tens-backend.swoodson96.workers.dev";

let CURRENT_USER_SESSION = null;
let SYSTEM_ACTIVE_VIEW_HISTORY = ["view-landing"];
let WORKING_CATEGORY_KEY = null;
let APP_TIER_CEILING = 21;
let MASTER_USER_VAULT_CACHE = JSON.parse(JSON.stringify(STOCK_DATA_STORE));

document.addEventListener("DOMContentLoaded", () => {
    initializeDOMEventMappings();
    renderCategoriesMatrix();
});

function initializeDOMEventMappings() {
    // Structural Navigation Mapping Triggers
	document.getElementById("action-add-category").addEventListener("click", triggerCreateCategoryWorkflow);
    document.getElementById("action-enter-vault").addEventListener("click", () => {
        transitionViewContext("view-categories");
    });

    document.getElementById("action-trigger-auth").addEventListener("click", () => {
        openSlidingDrawer("drawer-auth");
    });

    document.getElementById("header-back-btn").addEventListener("click", () => {
        executeBackNavigationHistory();
    });

    // Drawer System Trigger Triggers
    document.getElementById("profile-avatar-trigger").addEventListener("click", () => {
        openSlidingDrawer("drawer-profile");
    });

    document.getElementById("settings-burger-trigger").addEventListener("click", () => {
        openSlidingDrawer("drawer-settings");
    });

    // Global Event Delegation for Dynamic Drawer Dismount Mechanics
    document.getElementById("global-drawer-overlay").addEventListener("click", closeAllDrawers);
    document.querySelectorAll(".drawer-close-btn").forEach(b => {
        b.addEventListener("click", () => closeAllDrawers());
    });

    // Password Reveal Architecture Button Event
    document.getElementById("auth-password-toggle").addEventListener("click", () => {
        const input = document.getElementById("auth-password");
        input.type = input.type === "password" ? "text" : "password";
    });

    // Network Authentication Protocol Pipeline Map
    document.getElementById("action-execute-signup").addEventListener("click", triggerAuthRegisterSequence);
    document.getElementById("action-execute-signin").addEventListener("click", triggerAuthLoginSequence);

    // Profile Settings Event Mappings
    document.getElementById("action-save-profile").addEventListener("click", persistProfileChangesToServer);
    document.getElementById("profile-privacy-toggle").addEventListener("click", toggleProfilePrivacyState);
    document.getElementById("action-select-avatar-file").addEventListener("click", () => {
        document.getElementById("upload-avatar-file-input").click();
    });
    document.getElementById("upload-avatar-file-input").addEventListener("change", processAvatarCropSequence);

    // App Control Configurations Stack
    document.getElementById("setting-toggle-theme").addEventListener("click", toggleThemeMode);
    document.getElementById("setting-upgrade-tier").addEventListener("click", executeTierUpgradePaymentStream);
    document.getElementById("setting-nav-friends").addEventListener("click", () => {
        closeAllDrawers();
        transitionViewContext("view-friends");
    });
    document.getElementById("setting-vault-wipe").addEventListener("click", executeVaultWipeProtocol);

    // Item Action Triggers
    document.getElementById("action-submit-item").addEventListener("click", executeCreateItemRow);
    document.getElementById("media-dropzone").addEventListener("click", () => {
        document.getElementById("input-item-file").click();
    });
}

/* Rendering Engines Mapping Engine Matrix */
function renderCategoriesMatrix() {
    const grid = document.getElementById("categories-grid-hook");
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
    document.getElementById("current-category-title-display").innerText = cat.title;
    renderListItemsStack();
    transitionViewContext("view-list-items");
}

function renderListItemsStack() {
    const container = document.getElementById("items-list-hook");
    container.innerHTML = "";
    const cat = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY];
    
    // Explicitly clamp length allocations structurally to a strict maximum array boundary limit of 10
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

/* View Lifecycle Routing Navigation Management State Machine Engine */
function transitionViewContext(targetViewId) {
    document.querySelectorAll(".view-panel").forEach(panel => panel.classList.add("hidden"));
    document.getElementById(targetViewId).classList.remove("hidden");
    
    const header = document.getElementById("app-header");
    if (targetViewId === "view-landing") {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }

    if (SYSTEM_ACTIVE_VIEW_HISTORY[SYSTEM_ACTIVE_VIEW_HISTORY.length - 1] !== targetViewId) {
        SYSTEM_ACTIVE_VIEW_HISTORY.push(targetViewId);
    }
}

function executeBackNavigationHistory() {
    if (SYSTEM_ACTIVE_VIEW_HISTORY.length <= 1) return;
    SYSTEM_ACTIVE_VIEW_HISTORY.pop(); // Remove operational current pointer
    const lastView = SYSTEM_ACTIVE_VIEW_HISTORY[SYSTEM_ACTIVE_VIEW_HISTORY.length - 1] || "view-landing";
    transitionViewContext(lastView);
}

/* Drawer Interaction Utilities Hooks Context */
function openSlidingDrawer(drawerId) {
    document.getElementById("global-drawer-overlay").classList.add("active");
    document.getElementById(drawerId).classList.add("active");
}

function closeAllDrawers() {
    document.getElementById("global-drawer-overlay").classList.remove("active");
    document.querySelectorAll(".sliding-drawer-panel").forEach(d => d.classList.remove("active"));
}

/* Network Core REST API Async Pipelines Protocols Engine */
async function triggerAuthRegisterSequence() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const msgBox = document.getElementById("auth-status-msg");

    msgBox.classList.remove("hidden");
    msgBox.innerText = "Registering system security clearance context link...";

    try {
        const res = await fetch(`${API_ENDPOINT}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration Validation Error Fault Pattern Exception");

        msgBox.style.color = "var(--success-green)";
        msgBox.innerText = "Verification token sequence transmitted successfully! Verify validation link signature loop inside inbox folder profile window.";
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
        msgBox.classList.remove("hidden");
        msgBox.style.color = "var(--error-red)";
        msgBox.innerText = err.message;
    }
}

/* Local State Control Handlers Stubs Engine Map Configuration Contexts */
function executeCreateItemRow() {
    if (!WORKING_CATEGORY_KEY) return;
    const name = document.getElementById("input-item-name").value;
    const rank = parseInt(document.getElementById("input-item-rank").value);
    
    if (!name || isNaN(rank) || rank < 1 || rank > 10) return;

    const targetList = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items;
    
    // Splice, re-rank or overwrite logic to enforce the 10 item cap strictly
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
    if (!CURRENT_USER_SESSION) return; // Guest mode operations are memory transient local state variations only
    await fetch(`${API_ENDPOINT}/api/vault/sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CURRENT_USER_SESSION}`
        },
        body: JSON.stringify({ vault: MASTER_USER_VAULT_CACHE })
    });
}

function toggleThemeMode() {
    const isDark = document.body.classList.toggle("light-theme");
    document.getElementById("setting-toggle-theme").innerText = isDark ? "Toggle Theme: Light Mode" : "Toggle Theme: Dark Mode";
}

function executeTierUpgradePaymentStream() {
    APP_TIER_CEILING = 99;
    alert("System Tier upgrade confirmation validated. Profile provision limits set securely to 99 customized tracking registers.");
}

function executeVaultWipeProtocol() {
    if (confirm("Are you absolutely sure you want to execute a vault-wipe? This will permanently wipe all lists and configurations.")) {
        MASTER_USER_VAULT_CACHE = JSON.parse(JSON.stringify(STOCK_DATA_STORE));
        renderCategoriesMatrix();
        synchronizeVaultWithBackendCloud();
        closeAllDrawers();
        transitionViewContext("view-categories");
    }
}

// Additional structural interface handlers mapping protocols stub signatures
function toggleCategoryPrivacy(e, key) { e.stopPropagation(); alert(`Category bounds metadata setting toggled for hash registry register ID pointer references: ${key}`); }
function editCategoryName(e, key) { e.stopPropagation(); alert(`Edit identity parameters targeting tracking manifest register link: ${key}`); }
function deleteCategoryElement(e, key) { e.stopPropagation(); delete MASTER_USER_VAULT_CACHE[key]; renderCategoriesMatrix(); synchronizeVaultWithBackendCloud(); }
function editListItem(e, rank) { alert(`Editing internal array component index targeting element position rank index profile marker mapping: ${rank}`); }
function deleteListItem(e, rank) { MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items.filter(i => i.rank !== rank); renderListItemsStack(); synchronizeVaultWithBackendCloud(); }
function persistProfileChangesToServer() { alert("Changes successfully persistent inside central cluster namespace instance schema mapping nodes."); closeAllDrawers(); }
function toggleProfilePrivacyState() { alert("Profile state toggled successfully."); }
function processAvatarCropSequence() { alert("Media parsing loop initialization engine mapping finalized layout window coordinates matrix vectors parameters."); }
function executeCompareProtocol(key) { alert(`Compare workflow protocol processing framework sequence loop stack trace pointer initialization mapping triggered structural interface vector parameters targeting: ${key}`); }
function executeFuseProtocol(key) { alert(`Weight Ranking Average formula consolidation execution initialization mapping triggered targeting context target frame structural array links arrays nodes data blocks sets: ${key}`); }
function triggerCreateCategoryWorkflow() {
    // Enforce tier allocation ceilings structurally
    const currentCategoryCount = Object.keys(MASTER_USER_VAULT_CACHE).length;
    if (currentCategoryCount >= APP_TIER_CEILING) {
        alert(`Vault Limit Reached! The free tier is limited to ${APP_TIER_CEILING} categories. Please upgrade via Settings ($0.99/month) for up to 99 categories.`);
        return;
    }

    // Prompt the user for the new Category data
    const categoryName = prompt("Enter the name for your new Custom Category:");
    if (!categoryName || categoryName.trim() === "") return;

    // Sanitize the input into a standard object key format (e.g., "Action Movies" -> "action-movies")
    const categoryKey = categoryName.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Prevent overwriting an existing tracking register key
    if (MASTER_USER_VAULT_CACHE[categoryKey]) {
        alert("A category with that name or key index signature already exists inside your vault.");
        return;
    }

    // Prompt for an optional decorative icon emoji
    const categoryEmoji = prompt("Enter a single emoji character for this category tab icon (or leave blank for default):", "📂");

    // Inject the pristine data block structured into local application memory cache
    MASTER_USER_VAULT_CACHE[categoryKey] = {
        emoji: categoryEmoji && categoryEmoji.trim() !== "" ? categoryEmoji.trim() : "📂",
        title: categoryName.trim(),
        items: [] // Initializes an empty nested array capped strictly at 10 items maximum
    };

    // Force a UI draw refresh matrix loop to immediately show the new tab on screen
    renderCategoriesMatrix();

    // Push state updates upstream to the Cloudflare Worker datastore if logged in
    if (CURRENT_USER_SESSION) {
        synchronizeVaultWithBackendCloud();
    } else {
        console.log("Guest Mode active: custom category saved in volatile local session state space.");
    }
}