// File: D:/top-tens/frontend/app.js
const TopTensEngine = {
  apiBase: "https://top-tens-backend.swoodson96.workers.dev",
  token: null,
  isGuest: true,
  isPro: false,
  activeView: "landing",
  categories: [],
  friends: [],
  selectedCategoryIndex: null,
  currentAuthTab: "login",

  init() {
    this.cacheDom();
    this.bindEvents();
    this.loadLocalState();
    this.renderView();
  },

  cacheDom() {
    this.dom = {
      header: document.getElementById('app-header'),
      backBtn: document.getElementById('back-btn'),
      logoHome: document.getElementById('header-logo-home'),
      bgImage: document.getElementById('app-background-image'),
      enterVaultBtn: document.getElementById('enter-vault-btn'),
      landingSigninBtn: document.getElementById('landing-signin-btn'),
      burgerMenuBtn: document.getElementById('burger-menu-btn'),
      headerAvatar: document.getElementById('header-avatar'),
      headerAvatarImg: document.getElementById('header-avatar-img'),
      overlay: document.getElementById('global-overlay'),
      
      views: {
        landing: document.getElementById('view-landing'),
        categories: document.getElementById('view-categories'),
        items: document.getElementById('view-items'),
        friends: document.getElementById('view-friends'),
        compare: document.getElementById('view-compare')
      },
      
      drawers: {
        auth: document.getElementById('drawer-auth'),
        settings: document.getElementById('drawer-settings'),
        profile: document.getElementById('drawer-profile')
      },
      
      formAuth: document.getElementById('form-auth-engine'),
      authEmail: document.getElementById('auth-email'),
      authPassword: document.getElementById('auth-password'),
      authSubmitBtn: document.getElementById('auth-submit-btn'),
      authStatus: document.getElementById('auth-status-msg'),
      passwordReqs: document.getElementById('password-requirements'),
      switchLogin: document.getElementById('switch-login-tab'),
      switchRegister: document.getElementById('switch-register-tab'),
      settingsSigninTrigger: document.getElementById('settings-signin-trigger'),
      toggleThemeBtn: document.getElementById('toggle-theme-btn'),
      btnUpgradeTier: document.getElementById('btn-upgrade-tier'),
      btnVaultWipe: document.getElementById('btn-vault-wipe'),
      btnVaultSave: document.getElementById('btn-vault-save'),
      
      categoriesGrid: document.getElementById('categories-grid'),
      itemsListVertical: document.getElementById('items-list-vertical'),
      itemsViewTitle: document.getElementById('items-view-title'),
      addCategoryMasterBtn: document.getElementById('add-category-master-btn'),
      addItemMasterBtn: document.getElementById('add-item-master-btn'),
      
      profileSaveBtn: document.getElementById('profile-save-btn'),
      uploadAvatarFile: document.getElementById('upload-avatar-file'),
      profileDrawerAvatarImg: document.getElementById('profile-drawer-avatar-img'),
      
      mediaUploadModal: document.getElementById('media-upload-modal'),
      mediaPreviewBox: document.getElementById('media-preview-box'),
      inputItemMedia: document.getElementById('input-item-media'),
      mediaApplyBtn: document.getElementById('media-apply-btn'),
      mediaCancelBtn: document.getElementById('media-cancel-btn')
    };
  },

  bindEvents() {
    this.dom.enterVaultBtn.addEventListener('click', () => {
      this.isGuest = true;
      this.navigateTo("categories");
    });

    this.dom.landingSigninBtn.addEventListener('click', () => this.openDrawer('auth'));
    this.dom.burgerMenuBtn.addEventListener('click', () => this.openDrawer('settings'));
    this.dom.headerAvatar.addEventListener('click', () => this.openDrawer('profile'));
    this.dom.backBtn.addEventListener('click', () => this.handleBackNavigation());
    this.dom.logoHome.addEventListener('click', () => this.navigateTo("landing"));

    // Global Drawer Dismount Close Handling
    this.dom.overlay.addEventListener('click', () => this.closeAllDrawers());
    document.querySelectorAll('.drawer-close-x').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });

    // Authentication Toggling
    this.dom.switchLogin.addEventListener('click', () => this.setAuthTab("login"));
    this.dom.switchRegister.addEventListener('click', () => this.setAuthTab("register"));
    this.dom.formAuth.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    this.dom.settingsSigninTrigger.addEventListener('click', () => {
      this.closeAllDrawers();
      this.openDrawer('auth');
    });

    // Setup Actions
    this.dom.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
    this.dom.btnUpgradeTier.addEventListener('click', () => this.upgradeTier());
    this.dom.btnVaultWipe.addEventListener('click', () => this.vaultWipe());
    this.dom.btnVaultSave.addEventListener('click', () => this.saveVaultToCloud());
    this.dom.addCategoryMasterBtn.addEventListener('click', () => this.addNewCategoryPrompt());
    this.dom.addItemMasterBtn.addEventListener('click', () => this.addNewItemPrompt());
    
    // Avatar Upload Interface Handling
    this.dom.uploadAvatarFile.addEventListener('change', (e) => this.handleAvatarUpload(e));
    this.dom.profileSaveBtn.addEventListener('click', () => this.saveProfileDossier());
  },

  loadLocalState() {
    const savedToken = localStorage.getItem('__vault_jwt');
    const localCats = localStorage.getItem('__vault_cats');
    const theme = localStorage.getItem('__vault_theme') || 'dark';
    
    if (theme === 'light') {
      document.body.className = 'light-mode';
      this.dom.toggleThemeBtn.textContent = "LIGHT MODE";
    }

    if (savedToken) {
      this.token = savedToken;
      this.isGuest = false;
      this.dom.settingsSigninTrigger.classList.add('hidden');
      this.dom.btnVaultSave.classList.remove('hidden');
    }

    if (localCats) {
      this.categories = JSON.parse(localCats);
    } else {
      this.categories = JSON.parse(JSON.stringify(STOCK_VAULT_DEFAULTS));
    }
  },

  navigateTo(viewName) {
    this.activeView = viewName;
    this.renderView();
  },

  handleBackNavigation() {
    if (this.activeView === "items") this.navigateTo("categories");
    else if (this.activeView === "categories") this.navigateTo("landing");
    else if (this.activeView === "friends" || this.activeView === "compare") this.navigateTo("categories");
  },

  renderView() {
    // Structural Visibility Evaluation
    Object.keys(this.dom.views).forEach(key => {
      if (key === this.activeView) this.dom.views[key].classList.remove('hidden');
      else this.dom.views[key].classList.add('hidden');
    });

    if (this.activeView === "landing") {
      this.dom.header.classList.add('hidden');
      this.dom.bgImage.style.opacity = "0.65";
      document.getElementById('sidebar-ad-left').classList.add('hidden');
      document.getElementById('sidebar-ad-right').classList.add('hidden');
    } else {
      this.dom.header.classList.remove('hidden');
      this.dom.bgImage.style.opacity = "0.08";
      
      // Toggle Ad rails when empty but keep structural space scaled
      document.getElementById('sidebar-ad-left').classList.remove('hidden');
      document.getElementById('sidebar-ad-right').classList.remove('hidden');

      if (this.activeView === "categories") {
        this.dom.backBtn.classList.add('hidden');
        this.renderCategoriesGrid();
      } else {
        this.dom.backBtn.classList.remove('hidden');
        if (this.activeView === "items") this.renderItemsList();
      }
    }
  },

  openDrawer(type) {
    this.closeAllDrawers();
    this.dom.drawers[type].classList.add('open');
    this.dom.overlay.style.display = 'block';
  },

  closeAllDrawers() {
    Object.keys(this.dom.drawers).forEach(key => this.dom.drawers[key].classList.remove('open'));
    this.dom.overlay.style.display = 'none';
  },

  setAuthTab(tab) {
    this.currentAuthTab = tab;
    if (tab === "login") {
      this.dom.switchLogin.classList.add('active');
      this.dom.switchRegister.classList.remove('active');
      this.dom.passwordReqs.classList.add('hidden');
    } else {
      this.dom.switchRegister.classList.add('active');
      this.dom.switchLogin.classList.remove('active');
      this.dom.passwordReqs.classList.remove('hidden');
    }
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const email = this.dom.authEmail.value;
    const password = this.dom.authPassword.value;
    
    const endpoint = this.currentAuthTab === "login" ? "/api/auth/login" : "/api/auth/register";
    
    this.dom.authSubmitBtn.disabled = true;
    this.dom.authStatus.textContent = "Processing transmission...";

    try {
      const res = await fetch(`${this.apiBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Execution fault");

      if (this.currentAuthTab === "register") {
        this.dom.authStatus.style.color = "#00e5ff";
        this.dom.authStatus.textContent = "Verification link sent! Click the link in your email to unlock your vault.";
      } else {
        this.token = data.token;
        this.isGuest = false;
        localStorage.setItem('__vault_jwt', this.token);
        this.dom.authStatus.style.color = "#22c55e";
        this.dom.authStatus.textContent = "Vault validated! Decrypting configurations...";
        setTimeout(() => {
          this.closeAllDrawers();
          this.dom.settingsSigninTrigger.classList.add('hidden');
          this.dom.btnVaultSave.classList.remove('hidden');
          this.pullVaultFromCloud();
        }, 1000);
      }
    } catch (err) {
      this.dom.authStatus.style.color = "#dc2626";
      this.dom.authStatus.textContent = err.message;
    } finally {
      this.dom.authSubmitBtn.disabled = false;
    }
  },

  renderCategoriesGrid() {
    this.dom.categoriesGrid.innerHTML = "";
    this.categories.forEach((cat, idx) => {
      const tab = document.createElement('div');
      tab.className = "category-tab";
      
      const leftWrap = document.createElement('div');
      leftWrap.className = "cat-left-info";
      leftWrap.addEventListener('click', () => {
        this.selectedCategoryIndex = idx;
        this.navigateTo("items");
      });

      const nameSpan = document.createElement('span');
      nameSpan.className = "cat-name";
      nameSpan.textContent = cat.name;
      leftWrap.appendChild(nameSpan);

      const editBtn = document.createElement('div');
      editBtn.className = "edit-icon-corner";
      editBtn.textContent = "✎";
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.modifyCategoryPrompt(idx);
      });

      tab.appendChild(leftWrap);
      tab.appendChild(editBtn);
      this.dom.categoriesGrid.appendChild(tab);
    });
  },

  renderItemsList() {
    const cat = this.categories[this.selectedCategoryIndex];
    this.dom.itemsViewTitle.textContent = cat.name.toUpperCase();
    this.dom.itemsListVertical.innerHTML = "";

    // Maximum cap of 10 list item references
    cat.items.sort((a,b) => a.rank - b.rank);
    cat.items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "item-slot-row";

      const left = document.createElement('div');
      left.className = "item-slot-left";
      
      const hash = document.createElement('span');
      hash.className = "item-hashtag";
      hash.textContent = `#${item.rank}`;

      const title = document.createElement('span');
      title.className = "item-title";
      title.textContent = item.name;

      left.appendChild(hash);
      left.appendChild(title);

      const right = document.createElement('div');
      right.className = "item-slot-right";

      // Affiliate Autogeneration Protocol Layer
      const affLink = document.createElement('a');
      affLink.className = "affiliate-badge";
      affLink.target = "_blank";
      affLink.href = `https://www.amazon.com/s?k=${encodeURIComponent(item.name)}&tag=toptensvault-20`;
      affLink.textContent = "PURCHASE";

      // Thumbnail framework
      const thumb = document.createElement('div');
      thumb.className = "thumbnail-media-icon";
      if (item.media) {
        if (item.media.startsWith('data:video')) {
          thumb.innerHTML = `<video src="${item.media}" autoplay loop muted playinline></video>`;
        } else {
          thumb.innerHTML = `<img src="${item.media}" alt="Thumb">`;
        }
      }
      thumb.addEventListener('click', () => this.openMediaModal(idx));

      const delBtn = document.createElement('div');
      delBtn.className = "edit-icon-corner";
      delBtn.textContent = "✕";
      delBtn.addEventListener('click', () => this.removeItemSlot(idx));

      right.appendChild(affLink);
      right.appendChild(thumb);
      right.appendChild(delBtn);

      row.appendChild(left);
      row.appendChild(right);
      this.dom.itemsListVertical.appendChild(row);
    });
  },

  addNewCategoryPrompt() {
    const limit = this.isPro ? 99 : 21;
    if (this.categories.length >= limit) {
      alert(`Storage layout optimization limit reached for tier level (${limit}). Upgrade for extended partitions.`);
      return;
    }
    const name = prompt("Specify signature vault category title:");
    if (!name) return;
    this.categories.push({ name, items: [] });
    this.persistLocalCache();
    this.renderCategoriesGrid();
  },

  modifyCategoryPrompt(idx) {
    const target = this.categories[idx];
    const act = prompt("Enter 'DEL' to extract item grid completely, or type new title identification text:", target.name);
    if (!act) return;
    if (act.trim() === "DEL") {
      this.categories.splice(idx, 1);
    } else {
      this.categories[idx].name = act.trim();
    }
    this.persistLocalCache();
    this.renderCategoriesGrid();
  },

  addNewItemPrompt() {
    const cat = this.categories[this.selectedCategoryIndex];
    if (cat.items.length >= 10) {
      alert("Sub-tier slot lists possess a fixed limitation boundary of exactly 10 arrays.");
      return;
    }
    const name = prompt("Input Item Name / Title:");
    if (!name) return;
    const rankStr = prompt("Assign priority slot rating weight (1-10):", cat.items.length + 1);
    const rank = parseInt(rankStr) || 10;

    cat.items.push({ name, rank, media: null });
    this.persistLocalCache();
    this.renderItemsList();
  },

  removeItemSlot(idx) {
    this.categories[this.selectedCategoryIndex].items.splice(idx, 1);
    this.persistLocalCache();
    this.renderItemsList();
  },

  openMediaModal(itemIdx) {
    this.currentEditingItemIndex = itemIdx;
    this.dom.mediaUploadModal.classList.remove('hidden');
    this.dom.mediaPreviewBox.innerHTML = "";
  },

  handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.dom.profileDrawerAvatarImg.src = evt.target.result;
      this.dom.headerAvatarImg.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  },

  persistLocalCache() {
    localStorage.setItem('__vault_cats', JSON.stringify(this.categories));
  },

  toggleTheme() {
    const current = document.body.classList.toggle('light-mode');
    localStorage.setItem('__vault_theme', current ? 'light' : 'dark');
    this.dom.toggleThemeBtn.textContent = current ? "LIGHT MODE" : "DARK MODE";
  },

  upgradeTier() {
    this.isPro = true;
    alert("Vault expanded to secure high tier priority parameters: Ad boundaries dropped. 99 storage nodes enabled.");
    this.dom.btnUpgradeTier.textContent = "PRO VAULT UNLOCKED";
    this.dom.btnUpgradeTier.disabled = true;
  },

  vaultWipe() {
    if (confirm("Execute hard layout wipe sequence? This clears all personal configurations.")) {
      localStorage.clear();
      this.token = null;
      this.isGuest = true;
      this.categories = JSON.parse(JSON.stringify(STOCK_VAULT_DEFAULTS));
      this.loadLocalState();
      this.navigateTo("landing");
      this.closeAllDrawers();
    }
  },

  async saveVaultToCloud() {
    if (this.isGuest || !this.token) return;
    try {
      const res = await fetch(`${this.apiBase}/api/vault/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        body: JSON.stringify({ categories: this.categories })
      });
      if (res.ok) alert("Data synchronized across cloud vaults.");
    } catch (e) { console.error("Cloud synchronization mismatch", e); }
  },

  async pullVaultFromCloud() {
    if (!this.token) return;
    try {
      const res = await fetch(`${this.apiBase}/api/vault/sync`, {
        headers: { "Authorization": `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.categories) {
          this.categories = data.categories;
          this.persistLocalCache();
          if (this.activeView === "categories") this.renderCategoriesGrid();
        }
      }
    } catch(e) { console.error(e); }
  }
};

document.addEventListener("DOMContentLoaded", () => TopTensEngine.init());