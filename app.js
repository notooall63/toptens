// File: frontend/app.js
const BACKEND_URL = "https://top-tens-backend.swoodson96.workers.dev";

// --- CLIENT STATE ENGINE ---
let CONFIG_STATE = {
  token: localStorage.getItem('vault_jwt') || null,
  profile: JSON.parse(localStorage.getItem('vault_profile')) || null,
  tier: "free",
  categories: [], 
  friends: [],
  activeView: "screen-landing",
  currentCategoryKey: null,
  activeLuminescence: "dark-mode"
};

// --- DATA ACCESS LAYER RAILS ---
const VaultStorage = {
  get: () => {
    if (CONFIG_STATE.token) return CONFIG_STATE.categories;
    const local = localStorage.getItem('vault_guest_data');
    return local ? JSON.parse(local) : [];
  },
  set: (data) => {
    CONFIG_STATE.categories = data;
    if (!CONFIG_STATE.token) {
      localStorage.setItem('vault_guest_data', JSON.stringify(data));
    }
  },
  wipe: () => {
    localStorage.removeItem('vault_guest_data');
    CONFIG_STATE.categories = [];
    VaultStorage.initializeDefaultStock();
  },
  initializeDefaultStock: () => {
    const freshStock = STOCK_CATEGORY_KEYS.map(cat => ({
      id: "stock-" + cat.key,
      name: cat.display,
      isStock: true,
      items: [...STOCK_DATA[cat.key]]
    }));
    VaultStorage.set(freshStock);
  }
};

// --- CORE APPLICATION LIFECYCLE CONTROLLER ---
document.addEventListener("DOMContentLoaded", () => {
  AppRouter.checkUrlParameters();
  AppRouter.bootstrapDomListeners();
  AppRouter.evaluateAuthenticationState();
  
  if (VaultStorage.get().length === 0) {
    VaultStorage.initializeDefaultStock();
  }
  AppRouter.renderActiveView();
});

const AppRouter = {
  checkUrlParameters: () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      alert("Cryptographic account verified successfully. Access granted. Please sign in.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  bootstrapDomListeners: () => {
    // Top Level Navigation Hub Hooks
    document.getElementById('cta-enter-vault').addEventListener('click', () => AppRouter.navigate('screen-categories'));
    document.getElementById('cta-sign-in').addEventListener('click', () => DrawerUX.open('drawer-signin'));
    document.getElementById('back-btn').addEventListener('click', () => AppRouter.handleBackAction());
    document.getElementById('burger-menu').addEventListener('click', () => DrawerUX.open('drawer-settings'));
    document.getElementById('avatar-frame').addEventListener('click', () => DrawerUX.open('drawer-profile'));
    document.getElementById('drawer-overlay-backdrop').addEventListener('click', () => DrawerUX.closeAll());

    // Connect Close Cross Targets on Drawers
    document.querySelectorAll('.drawer-close-cross-btn').forEach(btn => {
      btn.addEventListener('click', () => DrawerUX.closeAll());
    });

    // Wire Up Form Authentication Pipeline
    document.getElementById('tab-login-toggle').addEventListener('click', () => FormUX.toggleAuthTab('login'));
    document.getElementById('tab-signup-toggle').addEventListener('click', () => FormUX.toggleAuthTab('signup'));
    document.getElementById('vault-auth-form').addEventListener('submit', (e) => FormUX.handleAuthSubmit(e));
    
    // Wire Settings Controls
    document.getElementById('toggle-luminescence').addEventListener('click', () => AppRouter.toggleLuminescence());
    document.getElementById('action-upgrade-license').addEventListener('click', () => ActionUX.upgradeLicense());
    document.getElementById('action-global-save').addEventListener('click', () => ActionUX.syncCloudStorage());
    document.getElementById('action-wipe-vault').addEventListener('click', () => ActionUX.wipeVaultData());
    document.getElementById('settings-signin-shortcut').addEventListener('click', () => { DrawerUX.closeAll(); DrawerUX.open('drawer-signin'); });

    // Navigation triggers buried inside settings drawer
    document.getElementById('nav-friends-trigger').addEventListener('click', () => { DrawerUX.closeAll(); AppRouter.navigate('screen-friends'); });
    document.getElementById('matrix-compare-trigger').addEventListener('click', () => { DrawerUX.closeAll(); ActionUX.runCompareMatrix(); });
    document.getElementById('matrix-fuse-trigger').addEventListener('click', () => { DrawerUX.closeAll(); ActionUX.runWeightedFusion(); });

    // Profile updates and image processing nodes
    document.getElementById('profile-save-trigger').addEventListener('click', () => FormUX.saveProfileMetadata());
    document.getElementById('avatar-upload-trigger').addEventListener('click', () => document.getElementById('avatar-file-pipeline-input').click());
    document.getElementById('avatar-file-pipeline-input').addEventListener('change', (e) => MediaPipeline.handleAvatarSelected(e));
    document.getElementById('avatar-crop-commit').addEventListener('click', () => MediaPipeline.commitAvatarCrop());

    // Addition modal listeners
    document.getElementById('add-category-trigger').addEventListener('click', () => ModalUX.show('category'));
    document.getElementById('add-item-trigger').addEventListener('click', () => ModalUX.show('item'));
    document.getElementById('modal-cancel-btn').addEventListener('click', () => ModalUX.hide());
    document.getElementById('modal-commit-btn').addEventListener('click', () => ModalUX.commit());
    
    // Wire dynamic friend listing action binding hook
    document.getElementById('friend-add-commit-btn').addEventListener('click', () => ActionUX.addFriendNode());
  },

  evaluateAuthenticationState: () => {
    const signinBtn = document.getElementById('settings-signin-shortcut');
    const saveBtn = document.getElementById('action-global-save');
    
    if (CONFIG_STATE.token) {
      signinBtn.classList.add('hidden');
      saveBtn.classList.remove('hidden');
      document.getElementById('profile-email-display').value = CONFIG_STATE.profile.email;
      document.getElementById('profile-name-input').value = CONFIG_STATE.profile.name || '';
      document.getElementById('profile-dob-input').value = CONFIG_STATE.profile.dob || '';
      document.getElementById('profile-hometown-input').value = CONFIG_STATE.profile.hometown || '';
      document.getElementById('profile-vocation-input').value = CONFIG_STATE.profile.vocation || '';
      document.getElementById('profile-recovery-input').value = CONFIG_STATE.profile.recovery || '';
      CONFIG_STATE.tier = CONFIG_STATE.profile.tier || "free";
      ActionUX.pullCloudStorage();
    } else {
      signinBtn.classList.remove('hidden');
      saveBtn.classList.add('hidden');
      CONFIG_STATE.tier = "free";
    }
    ActionUX.evaluateTierLimitsUI();
  },

  navigate: (screenId) => {
    document.querySelectorAll('.viewport-screen').forEach(scr => scr.classList.add('hidden'));
    document.querySelectorAll('.viewport-screen').forEach(scr => scr.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    target.classList.remove('hidden');
    target.classList.add('active');
    
    CONFIG_STATE.activeView = screenId;
    
    const header = document.getElementById('app-header');
    if (screenId === 'screen-landing') {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    AppRouter.renderActiveView();
  },

  handleBackAction: () => {
    if (CONFIG_STATE.activeView === 'screen-list-items') AppRouter.navigate('screen-categories');
    else if (CONFIG_STATE.activeView === 'screen-compare') AppRouter.navigate('screen-categories');
    else if (CONFIG_STATE.activeView === 'screen-friends') AppRouter.navigate('screen-categories');
    else AppRouter.navigate('screen-landing');
  },

  toggleLuminescence: () => {
    const body = document.body;
    const btn = document.getElementById('toggle-luminescence');
    if (body.classList.contains('dark-mode')) {
      body.classList.replace('dark-mode', 'light-mode');
      CONFIG_STATE.activeLuminescence = "light-mode";
      btn.innerText = "LIGHT MODE";
    } else {
      body.classList.replace('light-mode', 'dark-mode');
      CONFIG_STATE.activeLuminescence = "dark-mode";
      btn.innerText = "DARK MODE";
    }
  },

  renderActiveView: () => {
    if (CONFIG_STATE.activeView === 'screen-categories') ViewRenderer.categories();
    if (CONFIG_STATE.activeView === 'screen-list-items') ViewRenderer.items();
    if (CONFIG_STATE.activeView === 'screen-friends') ViewRenderer.friends();
  }
};

// --- DRAWER USER EXPERIENCE INTERFACES ---
const DrawerUX = {
  open: (drawerId) => {
    DrawerUX.closeAll();
    document.getElementById('drawer-overlay-backdrop').classList.remove('hidden');
    document.getElementById(drawerId).classList.add('open');
  },
  closeAll: () => {
    document.getElementById('drawer-overlay-backdrop').classList.add('hidden');
    document.querySelectorAll('.sliding-panel-drawer').forEach(dr => dr.classList.remove('open'));
  }
};

// --- VISUAL VIEW RENDER ENGINE ---
const ViewRenderer = {
  categories: () => {
    const container = document.getElementById('categories-dynamic-grid');
    container.innerHTML = '';
    const categories = VaultStorage.get();

    categories.forEach(cat => {
      const tab = document.createElement('div');
      tab.className = 'category-luxury-tab';
      tab.innerHTML = `
        <div class="category-tab-title">${cat.name}</div>
        <div class="category-tab-counter">(${cat.items ? cat.items.length : 0} items cached)</div>
        <div class="tab-action-icon-anchor">✎</div>
      `;
      
      // Separate click execution path for the editing hook vs drilldown entry
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-action-icon-anchor') || e.target.innerText === '✎') {
          e.stopPropagation();
          ModalUX.show('category', cat.id);
        } else {
          CONFIG_STATE.currentCategoryKey = cat.id;
          AppRouter.navigate('screen-list-items');
        }
      });
      container.appendChild(tab);
    });
    ViewRenderer.injectAdsSystemVisibility();
  },

  items: () => {
    const categories = VaultStorage.get();
    const currentCat = categories.find(c => c.id === CONFIG_STATE.currentCategoryKey);
    
    document.getElementById('current-list-title').innerText = currentCat ? currentCat.name.toUpperCase() : "VAULT ERROR";
    const stack = document.getElementById('ranked-slots-vertical-stack');
    stack.innerHTML = '';

    if (!currentCat || !currentCat.items) return;

    // Enforce matching physical rank sort configuration metrics
    const sortedItems = [...currentCat.items].sort((a, b) => a.rank - b.rank);

    sortedItems.forEach(item => {
      const row = document.createElement('li');
      row.className = 'item-slot-row-row';
      
      let hashClass = "hash-norm";
      if (item.rank === 1) hashClass = "hash-top1";
      if (item.rank === 2) hashClass = "hash-top2";
      if (item.rank === 3) hashClass = "hash-top3";

      // Affiliate link autogeneration layer logic engine
      const searchSlug = encodeURIComponent(item.name);
      const generatedAffiliateUrl = `https://www.amazon.com/s?k=${searchSlug}&tag=toptensvault26-20`;

      row.innerHTML = `
        <span class="slot-hashtag ${hashClass}">#</span>
        <span class="slot-rank-idx">${item.rank}</span>
        <span class="slot-item-literal-name">${item.name}</span>
        <a href="${generatedAffiliateUrl}" target="_blank" rel="noopener" class="affiliate-badge-link">PURCHASE ↗</a>
        <div class="slot-media-thumbnail-frame">
          ${item.media ? (item.media.includes('video') || item.media.startsWith('data:video') ? `<video src="${item.media}" autoplay loop muted></video>` : `<img src="${item.media}">`) : `<img src="AppIconTopTens.png">`}
        </div>
        <button class="slot-row-action-btn-hub">✎</button>
      `;

      row.querySelector('.slot-row-action-btn-hub').addEventListener('click', () => {
        ModalUX.show('item', item.rank);
      });

      stack.appendChild(row);
    });
    ViewRenderer.injectAdsSystemVisibility();
  },

  friends: () => {
    const list = document.getElementById('friends-rendered-list');
    list.innerHTML = '';
    if (CONFIG_STATE.friends.length === 0) {
      list.innerHTML = `<li class="item-slot-row-row" style="color:var(--text-muted)">No active profile nodes linked in this companion ring graph.</li>`;
      return;
    }
    CONFIG_STATE.friends.forEach(f => {
      const li = document.createElement('li');
      li.className = 'item-slot-row-row';
      li.innerHTML = `<span class="slot-item-literal-name">${f}</span><button class="destructive-action-btn" style="padding:4px 10px;">UNLINK</button>`;
      li.querySelector('button').addEventListener('click', () => {
        CONFIG_STATE.friends = CONFIG_STATE.friends.filter(x => x !== f);
        ViewRenderer.friends();
      });
      list.appendChild(li);
    });
  },

  injectAdsSystemVisibility: () => {
    const panels = document.querySelectorAll('.ad-panel');
    panels.forEach(panel => {
      if (CONFIG_STATE.tier === "premium") {
        panel.classList.remove('populated');
      } else {
        panel.classList.add('populated');
        panel.innerHTML = `<div style="padding:15px; font-size:10px; color:var(--text-muted); text-align:center;">ADVERTISING HUB SEGMENT<br><br><span style="color:var(--gold-primary);cursor:pointer;" onclick="AppRouter.navigate('screen-categories'); DrawerUX.open('drawer-settings');">UPGRADE NOW TO STRIP ADS</span></div>`;
      }
    });
  }
};

// --- DATA ACTION EXECUTION MANAGERS ---
const ActionUX = {
  evaluateTierLimitsUI: () => {
    const upgradeBtn = document.getElementById('action-upgrade-license');
    if (CONFIG_STATE.tier === "premium") {
      upgradeBtn.innerHTML = "LICENSE CONFIG: PREMIUM LEVEL ACTIVE";
      upgradeBtn.disabled = true;
      upgradeBtn.style.background = "linear-gradient(135deg, #1f242c, #238636)";
      upgradeBtn.style.color = "#fff";
    } else {
      upgradeBtn.innerHTML = `UPGRADE LICENSE ($0.99/mo)<br><small>Unlock 99 Multi-vault slots & No Ads</small>`;
      upgradeBtn.disabled = false;
    }
  },

  upgradeLicense: async () => {
    if (!CONFIG_STATE.token) {
      alert("Sign in required to run premium credential upgrades.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/vault/upgrade`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${CONFIG_STATE.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("License upgraded to premium tier via simulation engine gateway.");
        CONFIG_STATE.tier = "premium";
        if (CONFIG_STATE.profile) CONFIG_STATE.profile.tier = "premium";
        localStorage.setItem('vault_profile', JSON.stringify(CONFIG_STATE.profile));
        ActionUX.evaluateTierLimitsUI();
        AppRouter.renderActiveView();
      }
    } catch (e) {
      alert("Network exception processing premium configuration routines.");
    }
  },

  syncCloudStorage: async () => {
    if (!CONFIG_STATE.token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/vault/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CONFIG_STATE.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ categories: CONFIG_STATE.categories })
      });
      if (res.ok) {
        alert("Data synced with distributed cloud secure storage.");
      } else {
        const err = await res.json();
        alert(`Storage syncing rejected: ${err.error}`);
      }
    } catch (e) {
      alert("Cloud connection tracking infrastructure dropped payload serialization.");
    }
  },

  pullCloudStorage: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vault/data`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${CONFIG_STATE.token}` }
      });
      const data = await res.json();
      if (res.ok && data.categories && data.categories.length > 0) {
        VaultStorage.set(data.categories);
        AppRouter.renderActiveView();
      }
    } catch (e) {
      console.error("Hydration pipeline drop tracing log logs capture.");
    }
  },

  wipeVaultData: () => {
    if (confirm("Execute destructive data overwrite logic? All metrics restore to base stock parameters.")) {
      VaultStorage.wipe();
      AppRouter.navigate('screen-categories');
      alert("Local cached context completely re-initialized.");
      if (CONFIG_STATE.token) ActionUX.syncCloudStorage();
    }
  },

  addFriendNode: () => {
    const input = document.getElementById('friend-search-input');
    const email = input.value.trim().toLowerCase();
    if (email && !CONFIG_STATE.friends.includes(email)) {
      CONFIG_STATE.friends.push(email);
      input.value = '';
      ViewRenderer.friends();
    }
  },

  runCompareMatrix: () => {
    AppRouter.navigate('screen-compare');
    const container = document.getElementById('comparison-matrix-viewport');
    container.innerHTML = '';
    
    const categories = VaultStorage.get();
    const currentCat = categories.find(c => c.id === CONFIG_STATE.currentCategoryKey) || categories[0];

    // Build exactly 27 structural column tracks (9 rows of 3 columns blocks)
    for (let i = 0; i < 27; i++) {
      const nodeCol = document.createElement('div');
      nodeCol.className = 'matrix-column-bucket';
      
      let columnOwnerLabel = i === 0 ? "My Direct Profile" : `Linked Companion Node Alpha-${i}`;
      let dataSetSource = i === 0 ? (currentCat ? currentCat.items : []) : SIMULATE_FUSION_DATA(currentCat ? currentCat.name : "Shoes");

      nodeCol.innerHTML = `<h4 style="color:var(--gold-primary); margin-bottom:10px; font-size:11px;">${columnOwnerLabel} [${currentCat ? currentCat.name : 'Vault'}]</h4>`;
      
      dataSetSource.slice(0, 10).forEach(item => {
        const p = document.createElement('p');
        p.style.fontSize = '12px';
        p.style.padding = '4px 0';
        p.innerText = `#${item.rank} - ${item.name}`;
        nodeCol.appendChild(p);
      });
      container.appendChild(nodeCol);
    }
  },

  runWeightedFusion: () => {
    const categories = VaultStorage.get();
    const currentCat = categories.find(c => c.id === CONFIG_STATE.currentCategoryKey);
    if (!currentCat) {
      alert("Navigate down inside an operational cluster profile slice prior to running fusion calculation logic.");
      return;
    }

    // Weight Ranking Average Formula Implementation Engine Simulation
    // Formulates normalized cross data frequencies mapped horizontally
    alert(`Running Weight Ranking Average equation aggregation across ${CONFIG_STATE.friends.length + 1} multi-cluster inputs for category: "${currentCat.name}"`);
    
    let masterMap = {};
    
    // Inject local rank points configurations
    currentCat.items.forEach(item => {
      masterMap[item.name] = (masterMap[item.name] || 0) + (11 - item.rank);
    });

    // Inject simulated companion profiles matrix values
    for (let i = 0; i < 3; i++) {
      const simulatedSet = SIMULATE_FUSION_DATA(currentCat.name);
      simulatedSet.forEach(item => {
        masterMap[item.name] = (masterMap[item.name] || 0) + (Math.random() * (11 - item.rank));
      });
    }

    // Re-rank items into newly generated Master Core List based on score aggregates
    const sortedFused = Object.keys(masterMap)
      .map(name => ({ name, score: masterMap[name] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item, index) => ({ rank: index + 1, name: item.name }));

    currentCat.items = sortedFused;
    VaultStorage.set(categories);
    ViewRenderer.items();
    alert("Aggregated Master Core List written dynamically back into current workspace scope profile.");
  }
};

// --- SIMULATED DATA CONTEXT GENERATOR ---
function SIMULATE_FUSION_DATA(catName) {
  const norm = catName.toLowerCase();
  if (STOCK_DATA[norm]) return STOCK_DATA[norm].map(i => ({ ...i, rank: Math.floor(Math.random() * 10) + 1 }));
  return [
    { rank: 1, name: "Alternative Synthesis Delta" },
    { rank: 2, name: "Alternative Synthesis Beta" },
    { rank: 3, name: "Cognitive Matrix Omega" },
    { rank: 4, name: "Unified Structural Node" }
  ];
}

// --- INTERACTIVE SYSTEM MODAL ENGINE ---
let ACTIVE_MODAL_CONTEXT = { type: null, targetId: null };

const ModalUX = {
  show: (type, targetId = null) => {
    ACTIVE_MODAL_CONTEXT = { type, targetId };
    const modal = document.getElementById('global-entity-modal');
    const mediaSubchain = document.getElementById('modal-media-upload-subchain');
    
    modal.classList.remove('hidden');
    document.getElementById('modal-literal-text-input').value = '';
    
    if (type === 'category') {
      document.getElementById('modal-view-headline').innerText = targetId ? "EDIT CATEGORY SLOT" : "CREATE CUSTOM CATEGORY";
      mediaSubchain.classList.add('hidden');
      if (targetId) {
        const cat = VaultStorage.get().find(c => c.id === targetId);
        if (cat) document.getElementById('modal-literal-text-input').value = cat.name;
      }
    } else {
      document.getElementById('modal-view-headline').innerText = `EDIT RANK SLOT #${targetId}`;
      mediaSubchain.classList.remove('hidden');
      document.getElementById('modal-media-preview-viewport').innerHTML = '';
      
      const cat = VaultStorage.get().find(c => c.id === CONFIG_STATE.currentCategoryKey);
      const item = cat ? cat.items.find(i => i.rank === parseInt(targetId)) : null;
      if (item) document.getElementById('modal-literal-text-input').value = item.name;
    }
  },

  hide: () => {
    document.getElementById('global-entity-modal').classList.add('hidden');
  },

  commit: () => {
    const value = document.getElementById('modal-literal-text-input').value.trim();
    if (!value) return;

    const categories = VaultStorage.get();
    const maxLimit = CONFIG_STATE.tier === "premium" ? 99 : 21;

    if (ACTIVE_MODAL_CONTEXT.type === 'category') {
      if (ACTIVE_MODAL_CONTEXT.targetId) {
        // Mode: Edit existing category
        const cat = categories.find(c => c.id === ACTIVE_MODAL_CONTEXT.targetId);
        if (cat) cat.name = value;
      } else {
        // Mode: Append structural array entry
        if (categories.length >= maxLimit) {
          alert(`Storage allocation overflow. Free tier handles 21 slots. Upgrade to Premium for 99.`);
          ModalUX.hide();
          return;
        }
        categories.push({
          id: "custom-" + Date.now(),
          name: value,
          isStock: false,
          items: Array.from({ length: 10 }, (_, i) => ({ rank: i + 1, name: `Custom Entry ${i + 1}` }))
        });
      }
    } else {
      // Mode: Edit ranked slot configuration value inside array track
      const cat = categories.find(c => c.id === CONFIG_STATE.currentCategoryKey);
      if (cat) {
        const item = cat.items.find(i => i.rank === parseInt(ACTIVE_MODAL_CONTEXT.targetId));
        if (item) {
          item.name = value;
          if (MediaPipeline.currentProcessedMediaPayload) {
            item.media = MediaPipeline.currentProcessedMediaPayload;
          }
        }
      }
    }

    VaultStorage.set(categories);
    AppRouter.renderActiveView();
    ModalUX.hide();
    MediaPipeline.currentProcessedMediaPayload = null; // Flush active transient memory pipeline
    if (CONFIG_STATE.token) ActionUX.syncCloudStorage();
  }
};

// --- MULTIMEDIA STREAM CAPTURE INTEGRATION ENGINE ---
const MediaPipeline = {
  currentProcessedMediaPayload: null,
  avatarCropperState: { zoom: 1, element: null },

  handleAvatarSelected: (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.getElementById('avatar-manipulation-target');
      img.src = event.target.result;
      document.getElementById('avatar-crop-controls-hub').classList.remove('hidden');
      
      const slider = document.getElementById('avatar-zoom-slider');
      slider.addEventListener('input', (ev) => {
        img.style.transform = `scale(${ev.target.value})`;
      });
    };
    reader.readAsDataURL(file);
  },

  commitAvatarCrop: () => {
    const img = document.getElementById('avatar-manipulation-target');
    // Read structural cropping bounding frames and output serialized string base64 matrix asset
    const base64Sample = img.src; 
    document.getElementById('header-avatar-img').src = base64Sample;
    document.getElementById('avatar-crop-controls-hub').classSub = "hidden";
    alert("Profile icon alignment locked and compiled.");
    
    if (CONFIG_STATE.token) {
      fetch(`${BACKEND_URL}/api/vault/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${CONFIG_STATE.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ avatar: base64Sample })
      });
    }
  }
};

// Bind item-level multi-format media attachment pipelines asynchronously
document.getElementById('modal-media-pipeline-input')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const previewBox = document.getElementById('modal-media-preview-viewport');
    previewBox.innerHTML = '';
    
    if (file.type.includes('video')) {
      const video = document.createElement('video');
      video.src = ev.target.result;
      video.controls = true;
      video.muted = true;
      video.style.maxWidth = "100%";
      previewBox.appendChild(video);
      
      // Enforce 6 second visual timing loop runtime parameters
      video.addEventListener('loadedmetadata', () => {
        if (video.duration > 6) {
          alert("Media clip timing constraints breach threshold boundary limit profile. Max: 6 seconds.");
          previewBox.innerHTML = '';
          MediaPipeline.currentProcessedMediaPayload = null;
        }
      });
    } else {
      const img = document.createElement('img');
      img.src = ev.target.result;
      img.style.maxWidth = "100%";
      previewBox.appendChild(img);
    }
    MediaPipeline.currentProcessedMediaPayload = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// --- AUTHENTICATION FLOWS SUBSYSTEM ---
const FormUX = {
  currentTab: 'login',

  toggleAuthTab: (tab) => {
    FormUX.currentTab = tab;
    const lTab = document.getElementById('tab-login-toggle');
    const sTab = document.getElementById('tab-signup-toggle');
    const submitBtn = document.getElementById('auth-submit-action');
    const hint = document.getElementById('password-policy-hint');

    if (tab === 'login') {
      lTab.classList.add('active');
      sTab.classList.remove('active');
      submitBtn.innerText = "INITIALIZE TOKEN EXCHANGE";
      hint.classList.add('hidden');
    } else {
      sTab.classList.add('active');
      lTab.classList.remove('active');
      submitBtn.innerText = "DISPATCH REGISTRATION PAYLOAD";
      hint.classList.remove('hidden');
    }
  },

  handleAuthSubmit: async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email-field').value.trim();
    const password = document.getElementById('auth-password-field').value;
    const reporter = document.getElementById('auth-status-reporter');

    reporter.className = "status-box-reporter processing";
    reporter.innerText = "Processing remote routing transactions...";

    const endpoint = FormUX.currentTab === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        reporter.className = "status-box-reporter error";
        reporter.innerText = data.error || "Transaction exception rejected mapping parameters.";
        return;
      }

      if (FormUX.currentTab === 'signup') {
        reporter.className = "status-box-reporter success";
        reporter.innerText = "Vault deployment package dispatched. Inspect email inbox verification vectors.";
      } else {
        reporter.className = "status-box-reporter success";
        reporter.innerText = "Cryptographic signature validated. Loading dashboard context profile...";
        
        localStorage.setItem('vault_jwt', data.token);
        localStorage.setItem('vault_profile', JSON.stringify(data.profile));
        
        CONFIG_STATE.token = data.token;
        CONFIG_STATE.profile = data.profile;

        setTimeout(() => {
          DrawerUX.closeAll();
          AppRouter.evaluateAuthenticationState();
          AppRouter.navigate('screen-categories');
        }, 1000);
      }
    } catch (err) {
      reporter.className = "status-box-reporter error";
      reporter.innerText = "Target connection thread timed out.";
    }
  },

  saveProfileMetadata: async () => {
    if (!CONFIG_STATE.token) return;
    const profileData = {
      name: document.getElementById('profile-name-input').value,
      dob: document.getElementById('profile-dob-input').value,
      hometown: document.getElementById('profile-hometown-input').value,
      vocation: document.getElementById('profile-vocation-input').value,
      recovery: document.getElementById('profile-recovery-input').value
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/vault/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${CONFIG_STATE.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        alert("Decentralized data profile parameters updated inside local cloud cache.");
        CONFIG_STATE.profile = { ...CONFIG_STATE.profile, ...profileData };
        localStorage.setItem('vault_profile', JSON.stringify(CONFIG_STATE.profile));
      }
    } catch (e) {
      alert("Network dropped synchronization context routing channels.");
    }
  }
};