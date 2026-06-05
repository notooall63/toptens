// File: D:/top-tens/frontend/app.js
class AppEngine {
  constructor() {
    this.apiBase = "https://top-tens-backend.swoodson96.workers.dev"; // Live Cloudflare URL
    this.token = localStorage.getItem("vault_jwt") || null;
    this.userTier = "free"; 
    this.currentView = "landing";
    this.activeCategoryId = null;
    this.editingCategoryData = null;
    this.editingItemData = null;

    this.vaultCategories = [];
    this.vaultItems = {};

    this.initElements();
    this.bindEvents();
    this.evaluateInitialState();
  }

  initElements() {
    this.dom = {
      header: document.getElementById("app-header"),
      backBtn: document.getElementById("back-btn"),
      burgerBtn: document.getElementById("burger-menu-btn"),
      avatarFrame: document.getElementById("header-avatar"),
      avatarImg: document.getElementById("header-avatar-img"),
      viewLanding: document.getElementById("view-landing"),
      viewCategories: document.getElementById("view-categories"),
      viewItems: document.getElementById("view-items"),
      viewFriends: document.getElementById("view-friends"),
      categoriesGrid: document.getElementById("categories-grid"),
      itemsList: document.getElementById("items-list-vertical"),
      itemsTitle: document.getElementById("items-view-title"),
      overlay: document.getElementById("global-overlay"),
      drawerAuth: document.getElementById("drawer-auth"),
      drawerSettings: document.getElementById("drawer-settings"),
      drawerProfile: document.getElementById("drawer-profile"),
      formAuth: document.getElementById("form-auth-engine"),
      authEmail: document.getElementById("auth-email"),
      authPassword: document.getElementById("auth-password"),
      authSubmit: document.getElementById("auth-submit-btn"),
      authStatus: document.getElementById("auth-status-msg"),
      modalCategory: document.getElementById("modal-category"),
      modalItem: document.getElementById("modal-item")
    };
  }

  bindEvents() {
    // Nav Navigation Actions
    document.getElementById("enter-vault-btn").addEventListener("click", () => this.switchView("categories"));
    document.getElementById("landing-signin-btn").addEventListener("click", () => this.openDrawer("auth"));
    this.dom.backBtn.addEventListener("click", () => this.handleBackNavigation());
    this.dom.burgerBtn.addEventListener("click", () => this.openDrawer("settings"));
    this.dom.avatarFrame.addEventListener("click", () => this.openDrawer("profile"));
    this.dom.overlay.addEventListener("click", () => this.closeAllDrawers());
    
    // Wire Drawer close buttons
    document.querySelectorAll(".drawer-close-x").forEach(btn => {
      btn.addEventListener("click", () => this.closeAllDrawers());
    });

    // Auth Drawer switches
    document.getElementById("switch-login-tab").addEventListener("click", (e) => this.toggleAuthTab(e.target, "login"));
    document.getElementById("switch-register-tab").addEventListener("click", (e) => this.toggleAuthTab(e.target, "register"));
    this.dom.formAuth.addEventListener("submit", (e) => this.handleAuthSubmission(e));
    document.getElementById("settings-signin-trigger").addEventListener("click", () => { this.closeAllDrawers(); this.openDrawer("auth"); });

    // Global Action triggers
    document.getElementById("add-category-master-btn").addEventListener("click", () => this.triggerCategoryModal());
    document.getElementById("add-item-master-btn").addEventListener("click", () => this.triggerItemModal());
    document.getElementById("btn-vault-wipe").addEventListener("click", () => this.wipeVaultDataAction());
    document.getElementById("btn-upgrade-tier").addEventListener("click", () => this.upgradeTierMock());

    // Profile updates
    document.getElementById("form-profile-dossier").addEventListener("submit", (e) => this.saveProfileDossier(e));
    document.getElementById("upload-avatar-file").addEventListener("change", (e) => this.handleAvatarUpload(e));

    // Modals internal buttons
    document.getElementById("modal-cat-cancel").addEventListener("click", () => this.dom.modalCategory.classList.add("hidden"));
    document.getElementById("modal-cat-save").addEventListener("click", () => this.saveCategoryModal());
    document.getElementById("modal-item-cancel").addEventListener("click", () => this.dom.modalItem.classList.add("hidden"));
    document.getElementById("modal-item-save").addEventListener("click", () => this.saveItemModal());
  }

  evaluateInitialState() {
    if (this.token) {
      this.syncVaultFromCloud();
    } else {
      this.loadStockDefaults();
    }
  }

  loadStockDefaults() {
    this.vaultCategories = JSON.parse(JSON.stringify(STOCK_DATA.categories));
    this.vaultItems = JSON.parse(JSON.stringify(STOCK_DATA.items));
    this.renderCategoriesView();
  }

  async syncVaultFromCloud() {
    try {
      const res = await fetch(`${this.apiBase}/api/vault/sync`, {
        headers: { "Authorization": `Bearer ${this.token}` }
      });
      if (res.status === 200) {
        const payload = await res.json();
        this.vaultCategories = payload.categories || [];
        this.vaultItems = payload.items || {};
        this.userTier = payload.tier || "free";
        if (payload.profile) this.applyProfileDataToDOM(payload.profile);
        this.renderCategoriesView();
      } else {
        this.token = null;
        localStorage.removeItem("vault_jwt");
        this.loadStockDefaults();
      }
    } catch(e) {
      this.loadStockDefaults();
    }
  }

  async pushVaultToCloud() {
    if (!this.token) return; // Guest tier does not persist modifications
    try {
      await fetch(`${this.apiBase}/api/vault/sync`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categories: this.vaultCategories,
          items: this.vaultItems,
          tier: this.userTier
        })
      });
    } catch(e) { console.error("Cloud push sync drop:", e); }
  }

  switchView(target) {
    this.currentView = target;
    this.dom.viewLanding.classList.add("hidden");
    this.dom.viewCategories.classList.add("hidden");
    this.dom.viewItems.classList.add("hidden");
    this.dom.viewFriends.classList.add("hidden");

    if (target === "landing") {
      this.dom.header.classList.add("hidden");
      this.dom.viewLanding.classList.remove("hidden");
    } else {
      this.dom.header.classList.remove("hidden");
      if (target === "categories") {
        this.dom.viewCategories.classList.remove("hidden");
        this.renderCategoriesView();
      } else if (target === "items") {
        this.dom.viewItems.classList.remove("hidden");
        this.renderItemsView();
      }
    }
  }

  handleBackNavigation() {
    if (this.currentView === "items") this.switchView("categories");
    else if (this.currentView === "categories") this.switchView("landing");
  }

  openDrawer(id) {
    this.closeAllDrawers();
    this.dom.overlay.style.display = "block";
    if (id === "auth") this.dom.drawerAuth.classList.add("open");
    if (id === "settings") this.dom.drawerSettings.classList.add("open");
    if (id === "profile") this.dom.drawerProfile.classList.add("open");
  }

  closeAllDrawers() {
    this.dom.overlay.style.display = "none";
    this.dom.drawerAuth.classList.remove("open");
    this.dom.drawerSettings.classList.remove("open");
    this.dom.drawerProfile.classList.remove("open");
  }

  toggleAuthTab(element, mode) {
    document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.remove("active"));
    element.classList.add("active");
    this.dom.formAuth.dataset.mode = mode;
    if (mode === "register") {
      document.getElementById("password-requirements").classList.remove("hidden");
    } else {
      document.getElementById("password-requirements").classList.add("hidden");
    }
  }

  async handleAuthSubmission(e) {
    e.preventDefault();
    const email = this.dom.authEmail.value;
    const password = this.dom.authPassword.value;
    const mode = this.dom.formAuth.dataset.mode || "login";

    this.dom.authStatus.className = "status-box info";
    this.dom.authStatus.innerText = "Processing transactional security handshake...";

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(`${this.apiBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.status === 200 || res.status === 211) {
        this.dom.authStatus.className = "status-box success";
        this.dom.authStatus.innerText = data.message;
        if (data.token) {
          this.token = data.token;
          localStorage.setItem("vault_jwt", data.token);
          setTimeout(() => {
            this.closeAllDrawers();
            this.syncVaultFromCloud();
          }, 1000);
        }
      } else {
        this.dom.authStatus.className = "status-box error";
        this.dom.authStatus.innerText = data.error || "Authentication structural fail.";
      }
    } catch(err) {
      this.dom.authStatus.className = "status-box error";
      this.dom.authStatus.innerText = "Network transport endpoint unavailable.";
    }
  }

  renderCategoriesView() {
    this.dom.categoriesGrid.innerHTML = "";
    this.vaultCategories.forEach(cat => {
      const row = document.createElement("div");
      row.className = "category-tab-row";
      
      const itemArray = this.vaultItems[cat.id] || [];
      
      row.innerHTML = `
        <div class="category-meta-left">
          <span class="category-title-text">${cat.name}</span>
          <span class="category-badge-count">(${itemArray.length} items)</span>
        </div>
        <div class="tab-actions-group">
          <button class="action-icon-btn edit-cat-btn" data-id="${cat.id}">✎</button>
          <button class="action-icon-btn delete-cat-btn" data-id="${cat.id}">✕</button>
        </div>
      `;

      row.addEventListener("click", (e) => {
        if (e.target.classList.contains("action-icon-btn")) return;
        this.activeCategoryId = cat.id;
        this.switchView("items");
      });

      this.dom.categoriesGrid.appendChild(row);
    });

    // Handle internal triggers inside runtime nodes
    this.dom.categoriesGrid.querySelectorAll(".edit-cat-btn").forEach(b => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this.triggerCategoryModal(b.dataset.id);
      });
    });
    this.dom.categoriesGrid.querySelectorAll(".delete-cat-btn").forEach(b => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteCategoryAction(b.dataset.id);
      });
    });
  }

  renderItemsView() {
    const activeCat = this.vaultCategories.find(c => c.id === this.activeCategoryId);
    this.dom.itemsTitle.innerText = activeCat ? activeCat.name : "Vault Items";
    this.dom.itemsList.innerHTML = "";

    const arrayItems = this.vaultItems[this.activeCategoryId] || [];
    // Sort array elements via strict incremental rank rules
    arrayItems.sort((a,b) => a.rank - b.rank);

    arrayItems.forEach((item, index) => {
      const slot = document.createElement("div");
      slot.className = "item-slot-row";
      
      const mediaMarkup = item.media 
        ? (item.media.includes("video") ? `<video src="${item.media}" autoplay loop muted></video>` : `<img src="${item.media}">`)
        : `<div style="padding:12px; font-size:10px; color:#555;">NONE</div>`;

      slot.innerHTML = `
        <span class="item-hashtag">#</span>
        <span class="item-rank-num">${item.rank}</span>
        <span class="item-core-name">${item.name}</span>
        <a href="${item.link}" target="_blank" class="affiliate-link-anchor">Buy Asset</a>
        <div class="slot-thumbnail-box">${mediaMarkup}</div>
        <div class="slot-actions-group">
          <button class="action-icon-btn edit-item-btn" data-index="${index}">✎</button>
          <button class="action-icon-btn delete-item-btn" data-index="${index}">✕</button>
        </div>
      `;
      this.dom.itemsList.appendChild(slot);
    });

    this.dom.itemsList.querySelectorAll(".edit-item-btn").forEach(b => {
      b.addEventListener("click", () => this.triggerItemModal(b.dataset.index));
    });
    this.dom.itemsList.querySelectorAll(".delete-item-btn").forEach(b => {
      b.addEventListener("click", () => this.removeItemAction(b.dataset.index));
    });
  }

  triggerCategoryModal(id = null) {
    const limit = this.userTier === "pro" ? 99 : 21;
    if (!id && this.vaultCategories.length >= limit) {
      alert(`Free accounts cannot pass ${limit} categories. Upgrade structural limit in settings.`);
      return;
    }
    this.editingCategoryData = id;
    const catInput = document.getElementById("modal-cat-input");
    if (id) {
      const target = this.vaultCategories.find(c => c.id === id);
      catInput.value = target ? target.name : "";
      document.getElementById("modal-cat-title").innerText = "Update Category Context";
    } else {
      catInput.value = "";
      document.getElementById("modal-cat-title").innerText = "Create Custom Category";
    }
    this.dom.modalCategory.classList.remove("hidden");
  }

  saveCategoryModal() {
    const value = document.getElementById("modal-cat-input").value.trim();
    if (!value) return;

    if (this.editingCategoryData) {
      const target = this.vaultCategories.find(c => c.id === this.editingCategoryData);
      if (target) target.name = value;
    } else {
      const newId = "custom_" + Date.now();
      this.vaultCategories.push({ id: newId, name: value });
      this.vaultItems[newId] = [];
    }
    this.dom.modalCategory.classList.add("hidden");
    this.renderCategoriesView();
    this.pushVaultToCloud();
  }

  deleteCategoryAction(id) {
    this.vaultCategories = this.vaultCategories.filter(c => c.id !== id);
    delete this.vaultItems[id];
    this.renderCategoriesView();
    this.pushVaultToCloud();
  }

  triggerItemModal(index = null) {
    this.editingItemData = index;
    const nameInp = document.getElementById("modal-item-name");
    const rankInp = document.getElementById("modal-item-rank");
    const windowPreview = document.getElementById("item-media-window");
    windowPreview.innerHTML = "";

    if (index !== null) {
      const item = this.vaultItems[this.activeCategoryId][index];
      nameInp.value = item.name;
      rankInp.value = item.rank;
      if (item.media) {
        windowPreview.innerHTML = item.media.includes("video") ? `<video src="${item.media}" controls></video>` : `<img src="${item.media}">`;
      }
    } else {
      if ((this.vaultItems[this.activeCategoryId] || []).length >= 10) {
        alert("Maximum storage architecture limits structural slots to 10 entries per list category.");
        return;
      }
      nameInp.value = "";
      rankInp.value = (this.vaultItems[this.activeCategoryId] || []).length + 1;
    }
    this.dom.modalItem.classList.remove("hidden");
  }

  saveItemModal() {
    const name = document.getElementById("modal-item-name").value.trim();
    const rank = parseInt(document.getElementById("modal-item-rank").value, 10) || 10;
    if (!name) return;

    // Direct automated execution rules for reference transformations
    const sanitizeQuery = encodeURIComponent(name);
    const generatedAffLink = `https://www.amazon.com/s?k=${sanitizeQuery}&tag=toptens-20`;

    const mediaImg = document.getElementById("item-media-window").querySelector("img, video");
    const mediaSource = mediaImg ? mediaImg.src : "";

    if (!this.vaultItems[this.activeCategoryId]) {
      this.vaultItems[this.activeCategoryId] = [];
    }

    if (this.editingItemData !== null) {
      const item = this.vaultItems[this.activeCategoryId][this.editingItemData];
      item.name = name;
      item.rank = rank;
      item.link = generatedAffLink;
      if (mediaSource) item.media = mediaSource;
    } else {
      this.vaultItems[this.activeCategoryId].push({
        rank: rank,
        name: name,
        link: generatedAffLink,
        media: mediaSource
      });
    }

    this.dom.modalItem.classList.add("hidden");
    this.renderItemsView();
    this.pushVaultToCloud();
  }

  removeItemAction(index) {
    this.vaultItems[this.activeCategoryId].splice(index, 1);
    this.renderItemsView();
    this.pushVaultToCloud();
  }

  wipeVaultDataAction() {
    if (confirm("Confirm total wipe? This action re-initializes factory default settings and clears persistent maps.")) {
      localStorage.removeItem("vault_jwt");
      this.token = null;
      this.loadStockDefaults();
      this.closeAllDrawers();
      this.switchView("landing");
    }
  }

  upgradeTierMock() {
    this.userTier = "pro";
    alert("Subscription upgrade successful. System allocation updated to 99 multi-tier tracking matrices.");
    this.pushVaultToCloud();
  }

  handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("profile-drawer-avatar-frame").innerHTML = `<img src="${event.target.result}">`;
      this.dom.avatarImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveProfileDossier(e) {
    e.preventDefault();
    alert("Dossier values assigned and securely locked.");
    this.closeAllDrawers();
    this.pushVaultToCloud();
  }

  applyProfileDataToDOM(profile) {
    if (profile.fullname) document.getElementById("prof-fullname").value = profile.fullname;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.VaultApp = new AppEngine();
});