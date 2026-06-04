// frontend/app.js

const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";
let currentUser = null;
let userToken = null;
let userTier = "free"; 
let currentCategories = {};
let activeCategoryName = null;
let currentTheme = "dark";

// Initialization Logic Hook
document.addEventListener("DOMContentLoaded", () => {
  initSparkleEngine();
  loadLocalState();
  bindGlobalListeners();
  routeView();
});

// Particle and Dynamic Sparkling Effects Engine
function initSparkleEngine() {
  const container = document.getElementById("sparkle-layer");
  setInterval(() => {
    const sparkle = document.createElement("div");
    sparkle.className = "pinpoint-sparkle";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.left = Math.random() * 100 + "%";
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1800);
  }, 120);
}

function loadLocalState() {
  userToken = localStorage.getItem("vault_token");
  currentUser = localStorage.getItem("vault_user");
  userTier = localStorage.getItem("vault_tier") || "free";
  
  const savedVault = localStorage.getItem("vault_categories_cache");
  if (savedVault) {
    currentCategories = JSON.parse(savedVault);
  } else {
    currentCategories = JSON.parse(JSON.stringify(defaultStockVault));
  }
  document.getElementById("max-category-count").innerText = (userTier === "premium") ? "99" : "21";
}

function bindGlobalListeners() {
  // Navigation Routing Triggers
  document.getElementById("btn-enter-vault").addEventListener("click", () => {
    document.getElementById("app-header").classList.remove("hidden");
    navigateTo("screen-categories");
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    const current = document.querySelector(".screen-view:not(.hidden)").id;
    if (current === "screen-list-items" || current === "screen-friends") {
      navigateTo("screen-categories");
    } else {
      document.getElementById("app-header").classList.add("hidden");
      navigateTo("screen-landing");
    }
  });

  // Drawer Intercept Handlers
  document.getElementById("btn-landing-signin").addEventListener("click", () => openDrawer("drawer-auth"));
  document.getElementById("btn-drawer-signin").addEventListener("click", () => openDrawer("drawer-auth"));
  document.getElementById("burger-menu-btn").addEventListener("click", () => openDrawer("drawer-settings"));
  document.getElementById("profile-avatar-btn").addEventListener("click", () => openDrawer("drawer-profile"));

  document.querySelectorAll(".drawer-close-x, #drawer-backdrop").forEach(el => {
    el.addEventListener("click", closeAllDrawers);
  });

  // Authentication Submission Interceptor
  document.getElementById("auth-form").addEventListener("submit", handleAuthentication);

  // Settings Panel Logic Triggers
  document.getElementById("btn-toggle-theme").addEventListener("click", toggleThemeMode);
  document.getElementById("btn-upgrade-tier").addEventListener("click", upgradeAccountTier);
  document.getElementById("btn-wipe-vault").addEventListener("click", triggerVaultWipeOut);
  document.getElementById("btn-add-custom-cat").addEventListener("click", addNewCustomCategoryPrompt);
}

function navigateTo(screenId) {
  document.querySelectorAll(".screen-view").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
  routeView();
}

function routeView() {
  const current = document.querySelector(".screen-view:not(.hidden)").id;
  const bg = document.getElementById("ambient-vault-bg");
  if (current === "screen-landing") {
    bg.style.opacity = "0.75";
    renderCategoriesGrid();
  } else if (current === "screen-categories") {
    bg.style.opacity = "0.35";
    renderCategoriesGrid();
  } else {
    bg.style.opacity = "0.15";
  }
}

// Side Drawers Core Handlers
function openDrawer(id) {
  closeAllDrawers();
  document.getElementById(id).classList.add("open");
  document.getElementById("drawer-backdrop").classList.remove("hidden");
}

function closeAllDrawers() {
  document.querySelectorAll(".side-drawer").forEach(d => d.classList.remove("open"));
  document.getElementById("drawer-backdrop").classList.add("hidden");
}

// Authentication Matrix Handlers
async function handleAuthentication(e) {
  e.preventDefault();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  // Enforce standard complexity constraints locally
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;<>.,?~-]).{8,20}$/;
  if (!passwordRegex.test(password)) {
    alert("Password profile constraints not satisfied.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (data.devVerificationUrl) {
      document.getElementById("dev-link-catcher").classList.remove("hidden");
      const anchor = document.getElementById("sandbox-anchor");
      anchor.href = data.devVerificationUrl;
      anchor.onclick = () => {
        // Automatically mock state injection inside development sandboxes
        localStorage.setItem("vault_token", "mock_jwt_pass");
        localStorage.setItem("vault_user", email);
        alert("Verification processed successfully. Account activated!");
        location.reload();
      };
    }
  } catch (err) {
    alert("Connection handshake failed.");
  }
}

// Dynamic Categories and Tab Rendering Grid
function renderCategoriesGrid() {
  const grid = document.getElementById("categories-grid");
  grid.innerHTML = "";
  
  Object.keys(currentCategories).forEach(catName => {
    const card = document.createElement("div");
    card.className = "category-rounded-tab";
    card.innerHTML = `
      <div class="cat-tab-body">
        <h3>${catName}</h3>
        <p>(${currentCategories[catName].length} items)</p>
      </div>
      <div class="cat-tab-actions">
        <span class="action-ico edit-cat">✎</span>
        <span class="action-ico delete-cat">×</span>
      </div>
    `;
    
    card.querySelector(".cat-tab-body").addEventListener("click", () => loadListItemsView(catName));
    card.querySelector(".delete-cat").addEventListener("click", (e) => {
      e.stopPropagation();
      delete currentCategories[catName];
      saveVaultToStorage();
      renderCategoriesGrid();
    });
    grid.appendChild(card);
  });
}

function loadListItemsView(catName) {
  activeCategoryName = catName;
  document.getElementById("current-list-title").innerText = catName;
  renderItemSlots();
  navigateTo("screen-list-items");
}

// Custom Deep-Linking Affiliate Generation Engine
function autogenerateAffiliateLink(itemName) {
  const query = encodeURIComponent(itemName);
  return `https://www.amazon.com/s?k=${query}&tag=toptensvault-20`;
}

// Dynamic List Rendering Context
function renderItemSlots() {
  const container = document.getElementById("list-slots-container");
  container.innerHTML = "";
  const items = currentCategories[activeCategoryName] || [];

  items.forEach((item, index) => {
    const slot = document.createElement("div");
    slot.className = "item-row-slot";
    const affiliateUrl = autogenerateAffiliateLink(item.name);
    
    slot.innerHTML = `
      <div class="slot-left">
        <span class="slot-hashtag">#</span>
        <span class="slot-rank">${index + 1}</span>
        <span class="slot-name">${item.name}</span>
      </div>
      <div class="slot-right">
        <a href="${affiliateUrl}" target="_blank" class="affiliate-badge-link">PURCHASE</a>
        <div class="slot-thumbnail-frame">
          <img src="${item.media || 'AppIconTopTens.png'}" alt="Media">
        </div>
        <span class="action-ico remove-item">×</span>
      </div>
    `;
    
    slot.querySelector(".remove-item").addEventListener("click", () => {
      items.splice(index, 1);
      // Re-normalize dynamic slots positions
      items.forEach((it, i) => it.rank = i + 1);
      saveVaultToStorage();
      renderItemSlots();
    });
    container.appendChild(slot);
  });
}

// Custom Category Engine Context Hook
async function addNewCustomCategoryPrompt() {
  const limit = (userTier === "premium") ? 99 : 21;
  if (Object.keys(currentCategories).length >= limit) {
    alert("Vault limits reached. Upgrade infrastructure inside settings drawer.");
    return;
  }

  const inputName = prompt("Enter Custom Category Name:");
  if (!inputName) return;

  // Direct Semantic Recognition Handshake Execution
  try {
    const res = await fetch(`${API_BASE}/api/vault/normalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputName })
    });
    const data = await res.json();
    const targetName = data.resolved;

    if (currentCategories[targetName]) {
      alert(`Merged directly into matching operational vault: ${targetName}`);
      loadListItemsView(targetName);
    } else {
      currentCategories[inputName] = [];
      saveVaultToStorage();
      renderCategoriesGrid();
    }
  } catch {
    currentCategories[inputName] = [];
    saveVaultToStorage();
    renderCategoriesGrid();
  }
}

function saveVaultToStorage() {
  localStorage.setItem("vault_categories_cache", JSON.stringify(currentCategories));
  if (currentUser && userToken) {
    // If account profile is active, attempt background matrix cloud synchronization
    fetch(`${API_BASE}/api/vault/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ email: currentUser, categories: currentCategories })
    });
  }
}

// Drawer Settings Intercept Implementations
function toggleThemeMode() {
  const body = document.body;
  if (currentTheme === "dark") {
    currentTheme = "light";
    body.className = "light-mode";
    document.getElementById("btn-toggle-theme").innerText = "Theme: Light Mode";
  } else {
    currentTheme = "dark";
    body.className = "dark-mode";
    document.getElementById("btn-toggle-theme").innerText = "Theme: Dark Mode";
  }
}

function upgradeAccountTier() {
  userTier = "premium";
  localStorage.setItem("vault_tier", "premium");
  document.getElementById("max-category-count").innerText = "99";
  alert("Vault matrix capacity upgraded to 99 profiles! Ads removed.");
  closeAllDrawers();
}

function triggerVaultWipeOut() {
  if (!confirm("Are you sure you want to perform a hard data wipe on this Vault context?")) return;
  localStorage.removeItem("vault_categories_cache");
  currentCategories = JSON.parse(JSON.stringify(defaultStockVault));
  saveVaultToStorage();
  renderCategoriesGrid();
  closeAllDrawers();
  alert("Vault structure dropped. System stock dictionaries repopulated.");
}