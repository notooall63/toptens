// File: D:/top-tens/frontend/app.js
// Directory: D:/top-tens/frontend/

console.log("[System Core] Initializing fine-tuned app.js execution loop...");

/* ==========================================================================
   GLOBAL STATE DECLARATIONS & SYSTEM ARCHITECTURE CONFIGURATIONS
   ========================================================================== */
let MASTER_USER_VAULT_CACHE = {};
let CURRENT_USER_SESSION = null;
let CURRENT_USER_EMAIL = null; // Tracked to ensure cloud cross-referencing maps correctly
let WORKING_CATEGORY_KEY = null;
let SYSTEM_ACTIVE_VIEW_HISTORY = ["view-landing"];
let APP_TIER_CEILING = 21; 
let STAGED_MEDIA_BASE64 = ""; // Holds the processing item thumbnail raw storage string
const API_ENDPOINT = "https://top-tens-backend.swoodson96.workers.dev";

/* ==========================================================================
   SAFE EVENT LISTENER ATTACHMENT UTILITY
   ========================================================================== */
function safeBindListener(id, event, callback) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(event, callback);
    } else {
        console.warn(`[DOM Warning] Element with ID '${id}' not found. Skipping.`);
    }
}

/* ==========================================================================
   INITIALIZATION & EVENT INITIAL INTERFACE MAPS
   ========================================================================== */
function initializeDOMEventMappings() {
    console.log("[System Core] Mapping DOM Event Listeners...");

    safeBindListener("action-enter-vault", "click", () => {
        transitionViewContext("view-categories");
    });

    safeBindListener("action-trigger-auth", "click", () => {
        openSlidingDrawer("drawer-auth");
    });

    safeBindListener("header-back-btn", "click", () => {
        executeBackNavigationHistory();
    });

    safeBindListener("action-add-category", "click", triggerCreateCategoryWorkflow);

    // Precise Location: Inside initializeDOMEventMappings() in D:/top-tens/frontend/app.js
// Replace your avatar-trigger click and action-save-profile blocks with this synchronized engine:

    safeBindListener("profile-avatar-trigger", "click", () => {
        openSlidingDrawer("drawer-profile");
        // Automatically populate input boxes with saved cache records upon opening the drawer panel
        syncProfileDOMInputsFromCache();
    });

    safeBindListener("action-save-profile", "click", () => {
        // Target fields cleanly by structural DOM sequence matching your specific markup layout
        const scrollBody = document.querySelector(".drawer-body-scrollable") || document.querySelector("#drawer-profile .drawer-body");
        if (!scrollBody) return;

        const textInputs = scrollBody.querySelectorAll("input[type='text'], input:not([type]), textarea");
        
        if (!MASTER_USER_VAULT_CACHE._profile) {
            MASTER_USER_VAULT_CACHE._profile = { username: "", bio: "", avatar: "" };
        }
        
        // Save text records sequentially based on their placement order inside your profile layout fields
        if (textInputs.length >= 1) MASTER_USER_VAULT_CACHE._profile.username = textInputs[0].value.trim();
        if (textInputs.length >= 2) MASTER_USER_VAULT_CACHE._profile.bio = textInputs[1].value.trim();
        
        // Lock in the uploaded avatar base64 string permanently if one was staged
        if (window.STAGED_AVATAR_BASE64) {
            MASTER_USER_VAULT_CACHE._profile.avatar = window.STAGED_AVATAR_BASE64;
        }
        
        synchronizeVaultWithBackendCloud();
        alert("Premium profile parameters synchronized to cloud vault!");
        closeAllDrawers();
    });

    safeBindListener("settings-burger-trigger", "click", () => {
        openSlidingDrawer("drawer-settings");
    });

    const overlay = document.getElementById("global-drawer-overlay");
    if (overlay) {
        overlay.addEventListener("click", closeAllDrawers);
    }
    document.querySelectorAll(".drawer-close-btn").forEach(b => {
        b.addEventListener("click", () => closeAllDrawers());
    });

    safeBindListener("auth-password-toggle", "click", () => {
        const input = document.getElementById("auth-password");
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    });

    safeBindListener("action-execute-signup", "click", triggerAuthRegisterSequence);
    safeBindListener("action-execute-signin", "click", triggerAuthLoginSequence);

    // Profile Settings Event Mappings
    // Precise Location: Insert this right inside initializeDOMEventMappings() replacing the two placeholder profile alert listeners

    // Profile Settings Event Mappings - Core Production Implementation
    safeBindListener("action-save-profile", "click", () => {
        const usernameInput = document.getElementById("profile-username-input") || document.querySelector(".drawer-body-scrollable input[type='text']");
        const bioInput = document.getElementById("profile-bio-input") || document.querySelector(".drawer-body-scrollable textarea");
        
        // 1. Initialize user sub-object structure if it doesn't exist natively
        if (!MASTER_USER_VAULT_CACHE._profile) {
            MASTER_USER_VAULT_CACHE._profile = { username: "", bio: "", avatar: "" };
        }
        
        // 2. Extract values from input frames safely
        if (usernameInput) MASTER_USER_VAULT_CACHE._profile.username = usernameInput.value.trim();
        if (bioInput) MASTER_USER_VAULT_CACHE._profile.bio = bioInput.value.trim();
        
        // 3. Lock in any newly uploaded base64 avatar token 
        if (window.STAGED_AVATAR_BASE64) {
            MASTER_USER_VAULT_CACHE._profile.avatar = window.STAGED_AVATAR_BASE64;
        }
        
        // 4. Synchronize state with your backend Cloudflare Worker
        synchronizeVaultWithBackendCloud();
        
        alert("Premium profile parameters synchronized to cloud vault!");
        closeAllDrawers();
    });

    safeBindListener("profile-privacy-toggle", "click", (e) => {
        if (!MASTER_USER_VAULT_CACHE._profile) MASTER_USER_VAULT_CACHE._profile = {};
        MASTER_USER_VAULT_CACHE._profile.isPrivate = !MASTER_USER_VAULT_CACHE._profile.isPrivate;
        
        const btn = e.target;
        if (btn && btn.classList.contains("btn-toggle-switch")) {
            if (MASTER_USER_VAULT_CACHE._profile.isPrivate) {
                btn.innerText = "PRIVATE";
                btn.classList.add("private");
            } else {
                btn.innerText = "PUBLIC";
                btn.classList.remove("private");
            }
        }
        synchronizeVaultWithBackendCloud();
    });
    
    // Avatar Upload Pipeline
    safeBindListener("action-select-avatar-file", "click", () => {
        const fileInput = document.getElementById("upload-avatar-file-input");
        if (fileInput) fileInput.click();
    });
    
    const avatarInput = document.getElementById("upload-avatar-file-input");
    // File: D:/top-tens/frontend/app.js
// Precise Location: Replace the processAvatarLocalPreview function completely

function processAvatarLocalPreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;
        
        // Stash globally so the profile save trigger can access it
        window.STAGED_AVATAR_BASE64 = rawBase64;
        
        // Update elements instantly across your user layout screens
        const triggerImg = document.getElementById("profile-avatar-trigger");
        const drawerImg = document.getElementById("drawer-avatar-display-target");
        
        // If your landing avatar icon is inside an <img> tag wrapper
        if (triggerImg) {
            if (triggerImg.tagName === "IMG") {
                triggerImg.src = rawBase64;
            } else {
                // If it's a div layer container, update its background pattern instead
                triggerImg.style.backgroundImage = `url(${rawBase64})`;
                triggerImg.style.backgroundSize = "cover";
            }
        }
        if (drawerImg) drawerImg.src = rawBase64;
        
        console.log("[Avatar Engine] Image loaded into local memory cache buffer successfully.");
    };
    reader.readAsDataURL(file);
}

    // App Control Configurations Stack
    safeBindListener("setting-toggle-theme", "click", () => alert("Theme switching system processing context update."));
    safeBindListener("setting-upgrade-tier", "click", executeTierUpgradePaymentStream);
    safeBindListener("setting-nav-friends", "click", () => {
        closeAllDrawers();
        transitionViewContext("view-friends");
    });
    // Precise Location: Inside initializeDOMEventMappings() in D:/top-tens/frontend/app.js
// Replace the old safeBindListener("setting-vault-wipe", ...) block with this version:

    safeBindListener("setting-vault-wipe", "click", () => {
        if (confirm("Reset layout to factory defaults and clear custom vault overrides?")) { 
            // 1. Locate the master original stock source layout
            const stockSource = window.INITIAL_STOCK_VAULT || window.stockItems || window.STOCK_ITEMS || window.initialStockItems;
            
            if (stockSource) {
                // 2. Perform a deep clone to safely re-populate your 9 categories layout natively
                MASTER_USER_VAULT_CACHE = JSON.parse(JSON.stringify(stockSource));
                console.log("[Vault Reset] Successfully restored clean master stock layout items.");
            } else {
                MASTER_USER_VAULT_CACHE = {};
                console.warn("[Vault Reset] Clear complete, but stock backup template array was inaccessible.");
            }
            
            // 3. Clear temporary file-staging caches
            window.STAGED_AVATAR_BASE64 = null;
            
            // 4. Force immediate DOM matrix layout refreshes
            renderCategoriesMatrix(); 
            synchronizeVaultWithBackendCloud();
            alert("Vault wiped successfully! Stock categories have been fully repopulated.");
        }
    });

    // Item Action Triggers Harmonized to HTML Dropzone Layout
    safeBindListener("action-submit-item", "click", executeCreateItemRow);
    
    // Single Invocation Event Listener: Eliminates the Double File-Manager Activation Bug completely
    safeBindListener("media-dropzone", "click", (e) => {
        if (e.target.id === "input-item-file") return; 
        const itemFileInput = document.getElementById("input-item-file");
        if (itemFileInput) itemFileInput.click();
    });

    const itemFileInput = document.getElementById("input-item-file");
    if (itemFileInput) {
        itemFileInput.addEventListener("change", processItemMediaLocalStaging);
    }
} // <-- FIXED: Added the critical structural closing loop bracket here!

/* ==========================================================================
   CATEGORY APPLICATION WORKFLOW OPERATIONS
   ========================================================================== */
function triggerCreateCategoryWorkflow() {
    const currentCategoryCount = Object.keys(MASTER_USER_VAULT_CACHE).length;
    if (currentCategoryCount >= APP_TIER_CEILING) {
        alert(`Vault Limit Reached! Your current tier limit is ${APP_TIER_CEILING} categories. Please upgrade via Settings ($0.99/month) for up to 99 categories.`);
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
    synchronizeVaultWithBackendCloud();
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
        card.style.cursor = "pointer";
        card.innerHTML = getCategoryCardTemplate(key, cat, totalItems);
        
        card.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest(".category-management-row") || e.target.closest(".icon-crud")) return;
            openCategoryItemsView(key);
        });

        grid.appendChild(card);
    });
}

function getCategoryCardTemplate(key, cat, totalItems) {
    return `
        <span class="category-emoji">${cat.emoji || '📂'}</span>
        <div class="category-title-text">${cat.title}</div>
        <div class="category-item-counter">(${totalItems} items)</div>
        <div class="category-card-actions-wrapper">
            <button class="btn-card-util" onclick="event.stopPropagation(); alert('Comparing tracking arrays...')">Compare</button>
            <button class="btn-card-util" onclick="event.stopPropagation(); alert('Fusing matching registry data...')">Fuse</button>
            <button class="btn-card-util public-btn" onclick="event.stopPropagation(); alert('Privacy state updated.')">Public</button>
        </div>
        <div class="category-management-row">
            <span class="icon-crud" onclick="event.stopPropagation(); window.editCategoryName(event, '${key}')">✏️</span>
            <span class="icon-crud" onclick="event.stopPropagation(); window.deleteCategoryElement(event, '${key}')">🗑️</span>
        </div>
    `;
}

// Fixed Bracket Closure for item viewing states
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
        
        const defaultThumb = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4af37'><rect width='24' height='24' fill='%23222'/><text x='50%' y='65%' font-size='12' text-anchor='middle' fill='%23d4af37'>📦</text></svg>";
        const itemImage = item.media || defaultThumb;
        
        const computedAffiliateLink = item.link && item.link !== "https://google.com" && item.link !== ""
            ? item.link 
            : `https://www.amazon.com/s?k=${encodeURIComponent(item.name)}&tag=toptensvault-20`;

        row.innerHTML = `
            <span class="slot-hashtag">#</span>
            <span class="slot-rank-num">${item.rank}</span>
            <span class="slot-item-title" style="flex: 2; margin-left: 10px;">${item.name}</span>
            <a href="${computedAffiliateLink}" target="_blank" class="slot-affiliate-link" style="color: #d4af37; text-decoration: underline; font-size: 12px; margin-right: 15px; display: inline-block;">Shop Item</a>
            <div class="slot-thumbnail-container" style="width:40px; height:40px; border-radius:4px; overflow:hidden; background:#222; margin-right: 15px; border: 1px solid #333;">
                <img src="${itemImage}" alt="Thumb" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <span class="icon-crud" style="margin-right:12px; cursor:pointer;" onclick="window.editListItem(event, ${item.rank})">✏️</span>
            <span class="icon-crud" style="cursor:pointer;" onclick="window.deleteListItem(event, ${item.rank})">🗑️</span>
        `;
        container.appendChild(row);
    });
}

/* ==========================================================================
   DYNAMIC INTERACTION EDIT/DELETE ROUTINES FOR STRUCTURAL ELEMENTS
   ========================================================================== */
window.editCategoryName = function(e, key) {
    const n = prompt("Edit category title:", MASTER_USER_VAULT_CACHE[key].title);
    if(n && n.trim() !== "") {
        MASTER_USER_VAULT_CACHE[key].title = n.trim();
        renderCategoriesMatrix();
        synchronizeVaultWithBackendCloud();
    }
};

window.deleteCategoryElement = function(e, key) {
    if(confirm("Are you sure you want to permanently delete this category element?")) {
        delete MASTER_USER_VAULT_CACHE[key];
        renderCategoriesMatrix();
        synchronizeVaultWithBackendCloud();
    }
};

window.editListItem = function(e, rank) {
    if (!WORKING_CATEGORY_KEY) return;
    const targetList = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items || [];
    const itemIndex = targetList.findIndex(i => i.rank === rank);
    if (itemIndex === -1) return;

    const newName = prompt("Edit item name:", targetList[itemIndex].name);
    if (!newName || newName.trim() === "") return;

    const newMedia = prompt("Paste raw image URL address or leave blank to keep current thumbnail:", targetList[itemIndex].media);

    targetList[itemIndex].name = newName.trim();
    if (newMedia !== null && newMedia.trim() !== "") {
        targetList[itemIndex].media = newMedia.trim();
    }

    renderListItemsStack();
    synchronizeVaultWithBackendCloud();
};

window.deleteListItem = function(e, rank) {
    if (!WORKING_CATEGORY_KEY) return;
    if (!confirm(`Remove rank #${rank} list item row target?`)) return;

    let targetList = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items || [];
    MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items = targetList.filter(i => i.rank !== rank);

    renderListItemsStack();
    synchronizeVaultWithBackendCloud();
};

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
    const precedingView = SYSTEM_ACTIVE_VIEW_HISTORY[SYSTEM_ACTIVE_VIEW_HISTORY.length - 1] || "view-landing";
    
    document.querySelectorAll(".view-panel").forEach(panel => panel.classList.add("hidden"));
    const targets = document.getElementById(precedingView);
    if (targets) targets.classList.remove("hidden");
    
    const header = document.getElementById("app-header");
    if (header) {
        if (precedingView === "view-landing") {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }
    }
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
   LOCAL SUBSCRIPTION CONFIGURATIONS & MEDIA INTERFACE PROCESSORS
   ========================================================================== */
function executeTierUpgradePaymentStream() {
    APP_TIER_CEILING = 99;
    alert("Subscription Processed Successfully! Profile limits unlocked natively. Your custom category ceiling is now expanded to 99 items.");
    closeAllDrawers();
}

function processAvatarLocalPreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const triggerImg = document.getElementById("profile-avatar-trigger");
        const drawerImg = document.getElementById("drawer-avatar-display-target");
        if (triggerImg) triggerImg.src = e.target.result;
        if (drawerImg) drawerImg.src = e.target.result;
        alert("Avatar image preview updated successfully!");
    };
    reader.readAsDataURL(file);
}

function processItemMediaLocalStaging(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        STAGED_MEDIA_BASE64 = e.target.result;
        const label = document.getElementById("upload-label");
        if (label) label.innerText = `Staged: ${file.name.slice(0, 15)}...`;
    };
    reader.readAsDataURL(file);
}

/* ==========================================================================
   NETWORK CORE REST API ASYNC PIPELINES PROTOCOLS ENGINE
   ========================================================================== */
async function triggerAuthRegisterSequence() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const msgBox = document.getElementById("auth-status-msg");
    if (!msgBox) return;

    msgBox.classList.remove("hidden");
    msgBox.innerText = "Registering verification sequence parameters...";

    try {
        const res = await fetch(`${API_ENDPOINT}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration Validation Error");

        msgBox.style.color = "var(--success-green)";
        msgBox.innerText = "Verification link delivered! Check your email inbox tracker.";
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
        CURRENT_USER_EMAIL = email.trim();
        
        if (data.vault && Object.keys(data.vault).length > 0) {
            MASTER_USER_VAULT_CACHE = data.vault;
        } else {
            console.log("[Data Guard] Clean account registered. Keeping initial layout values.");
        }
        
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
    
    const nameInput = document.getElementById("input-item-name");
    const rankInput = document.getElementById("input-item-rank");
    const linkInput = document.getElementById("input-item-link");
    const mediaUrlInput = document.getElementById("input-item-media-url");

    if (!nameInput || !rankInput) return;

    const name = nameInput.value;
    const rank = parseInt(rankInput.value);
    
    if (!name || isNaN(rank) || rank < 1 || rank > 10) {
        alert("Please specify a valid item name and rank value matching scale 1-10.");
        return;
    }

    if (!MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items) {
        MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items = [];
    }

    const targetList = MASTER_USER_VAULT_CACHE[WORKING_CATEGORY_KEY].items;
    
    const newItem = { 
        rank: rank, 
        name: name.trim(), 
        link: linkInput ? linkInput.value.trim() : "",
        media: STAGED_MEDIA_BASE64 || (mediaUrlInput ? mediaUrlInput.value.trim() : "")
    };
    
    const existingIndex = targetList.findIndex(i => i.rank === rank);
    if (existingIndex !== -1) {
        targetList[existingIndex] = newItem;
    } else {
        targetList.push(newItem);
    }

    nameInput.value = "";
    rankInput.value = "";
    if (linkInput) linkInput.value = "";
    if (mediaUrlInput) mediaUrlInput.value = "";
    
    STAGED_MEDIA_BASE64 = "";
    const label = document.getElementById("upload-label");
    if (label) label.innerText = "📷 Upload Local Device Image Token File";

    renderListItemsStack();
    synchronizeVaultWithBackendCloud();
}

async function synchronizeVaultWithBackendCloud() {
    if (!CURRENT_USER_SESSION || !CURRENT_USER_EMAIL) return; 
    try {
        await fetch(`${API_ENDPOINT}/api/vault/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CURRENT_USER_SESSION}`,
                "X-User-Email": CURRENT_USER_EMAIL
            },
            body: JSON.stringify({ vault: MASTER_USER_VAULT_CACHE })
        });
    } catch(e) {
        console.error("Cloud synchronization stream error:", e);
    }
}

/* ==========================================================================
   APPLICATION ENTRY ENGINE BOOTSTRAPPER
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    initializeDOMEventMappings();
    
    const stockSource = window.INITIAL_STOCK_VAULT || window.stockItems || window.STOCK_ITEMS || window.initialStockItems;
    
    if (stockSource && Object.keys(MASTER_USER_VAULT_CACHE).length === 0) {
        // Deep clone data map representation into active execution space cleanly
        MASTER_USER_VAULT_CACHE = JSON.parse(JSON.stringify(stockSource));
        console.log("[Data Sync] Successfully loaded stock categories layout matrix into memory.");
    } else if (Object.keys(MASTER_USER_VAULT_CACHE).length === 0) {
        console.warn("[Data Sync] Warning: Could not locate stock items variable template frame inside window space.");
    }
    
    renderCategoriesMatrix();
    
    // 🌟 Run your initial data check script instantly to populate your text data configurations upon application initialization loop completion
    syncProfileDOMInputsFromCache();
});
// Precise Location: Append this helper function to the absolute bottom of D:/top-tens/frontend/app.js

function syncProfileDOMInputsFromCache() {
    const profile = MASTER_USER_VAULT_CACHE._profile;
    if (!profile) return;

    const scrollBody = document.querySelector(".drawer-body-scrollable") || document.querySelector("#drawer-profile .drawer-body");
    if (!scrollBody) return;

    const textInputs = scrollBody.querySelectorAll("input[type='text'], input:not([type]), textarea");
    
    // Write text details back into the physical text fields natively
    if (textInputs.length >= 1 && profile.username) textInputs[0].value = profile.username;
    if (textInputs.length >= 2 && profile.bio) textInputs[1].value = profile.bio;

    // Persist your avatar image layout source targets natively across render pipelines
    if (profile.avatar) {
        const triggerImg = document.getElementById("profile-avatar-trigger");
        const drawerImg = document.getElementById("drawer-avatar-display-target") || scrollBody.querySelector(".cropper-circle img");
        
        if (triggerImg) {
            if (triggerImg.tagName === "IMG") {
                triggerImg.src = profile.avatar;
            } else {
                triggerImg.style.backgroundImage = `url(${profile.avatar})`;
                triggerImg.style.backgroundSize = "cover";
            }
        }
        if (drawerImg) drawerImg.src = profile.avatar;
    }
}