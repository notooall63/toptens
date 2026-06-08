/**
 * Top Tens - Production Core Framework Application Engine
 * Pure Javascript Stateful Single-Page Component Controller
 */

(function () {
  // Global Client-Side Core State Tree Environment
  const state = {
    user: null, // Populated upon verified session completion (JWT payload payload context)
    token: localStorage.getItem('__toptens_token') || null,
    currentView: 'view-landing-space',
    viewHistory: [],
    isPremium: false,
    theme: 'dark',
    activeCategoryContext: null, // Tracks currently selected category name during drilldown
    vault: {}, // Deep dictionary structured exactly: { "CategoryName": [ {rank:1, name:"", link:"", media:""}, ... ] }
    profile: {
      fullname: "", dob: "", hometown: "", vocation: "",
      email: "", recovery: "", avatar: "", isPublic: true
    },
    friends: [
      { name: "AlphaRanker", avatar: "", isPublic: true, vault: {} },
      { name: "CryptoCollector", avatar: "", isPublic: true, vault: {} },
      { name: "OmegaLister", avatar: "", isPublic: true, vault: {} }
    ]
  };

  // Live Cloudflare Cluster API Node Connectivity Routing Definition
  const API_ROOT = "https://top-tens-backend.swoodson96.workers.dev";

  // Master Initialization Execution Chain Hook
  document.addEventListener("DOMContentLoaded", () => {
    new window.CanvasSparks('bg-canvas');
    initializeDefaultStateData();
    registerEventHandlers();
    verifyActiveSessionToken();
  });

  /**
   * Hydrates the memory matrix with default system properties or pulls from active storage caches.
   */
  function initializeDefaultStateData() {
    // Populate the baseline dictionary structure using global stock templates natively
    if (window.TOP_TENS_STOCK_DATA) {
      for (let cat in window.TOP_TENS_STOCK_DATA) {
        state.vault[cat] = JSON.parse(JSON.stringify(window.TOP_TENS_STOCK_DATA[cat]));
      }
    }
    
    // Inject mock categorical listings context directly into secondary network nodes for comparison
    state.friends[0].vault["Novels"] = JSON.parse(JSON.stringify(state.vault["Novels"] || []));
    if (state.friends[0].vault["Novels"][0]) state.friends[0].vault["Novels"][0].name = "The Great Gatsby Special Edition";
    state.friends[1].vault["Novels"] = JSON.parse(JSON.stringify(state.vault["Novels"] || []));
    if (state.friends[1].vault["Novels"][1]) state.friends[1].vault["Novels"][1].name = "1984 Alternative Print";
  }

  /**
   * Validates active JWT tokens against the backend deployment schema to synchronize datasets smoothly.
   */
  async function verifyActiveSessionToken() {
    if (!state.token) {
      routeToView('view-landing-space');
      return;
    }
    try {
      const res = await fetch(`${API_ROOT}/api/profile`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (res.status === 200) {
        const payload = await res.json();
        state.user = payload.user;
        if (payload.profile && Object.keys(payload.profile).length > 0) state.profile = payload.profile;
        if (payload.vault && Object.keys(payload.vault).length > 0) state.vault = payload.vault;
        state.isPremium = !!payload.isPremium;
        
        document.getElementById('app-universal-header').style.display = 'flex';
        syncProfileAvatarInterface();
        routeToView('view-categories-matrix');
      } else {
        purgeLocalSessionState();
      }
    } catch (e) {
      console.error("Session verification drop. Falling back to offline operations mode.", e);
      document.getElementById('app-universal-header').style.display = 'flex';
      routeToView('view-categories-matrix');
    }
  }

  function purgeLocalSessionState() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('__toptens_token');
    document.getElementById('app-universal-header').style.display = 'none';
    routeToView('view-landing-space');
  }

  /**
   * Orchestrates View Transition Sequences cleanly.
   */
  function routeToView(targetViewId) {
    if (state.currentView === targetViewId) return;
    
    // Manage tracking histories
    if (targetViewId === 'view-landing-space') {
      state.viewHistory = [];
    } else {
      state.viewHistory.push(state.currentView);
    }

    document.querySelectorAll('.view-segment').forEach(node => {
      node.classList.remove('active-view');
    });

    const targetNode = document.getElementById(targetViewId);
    if (targetNode) {
      targetNode.classList.add('active-view');
      state.currentView = targetViewId;
    }

    // Header visibility rules
    const headerNode = document.getElementById('app-universal-header');
    if (targetViewId === 'view-landing-space') {
      headerNode.style.display = 'none';
    } else {
      headerNode.style.display = 'flex';
    }

    // Trigger specific rendering updates based on view requirements
    if (targetViewId === 'view-categories-matrix') renderCategoriesGridMatrix();
    if (targetViewId === 'view-items-linear-rows') renderItemsLinearStack();
    if (targetViewId === 'view-friends-roster') renderFriendsRosterStack();
  }

  function navigateBackward() {
    if (state.viewHistory.length > 0) {
      const prev = state.viewHistory.pop();
      document.querySelectorAll('.view-segment').forEach(n => n.classList.remove('active-view'));
      document.getElementById(prev).classList.add('active-view');
      state.currentView = prev;
      if (prev === 'view-categories-matrix') renderCategoriesGridMatrix();
      if (prev === 'view-items-linear-rows') renderItemsLinearStack();
      if (prev === 'view-friends-roster') renderFriendsRosterStack();
    } else {
      routeToView('view-landing-space');
    }
  }

  /**
   * Commits current user state configurations over active WebSocket/REST protocols cleanly.
   */
  async function performCloudSynchronizeSequence() {
    if (!state.user || !state.token) return; // Ignore guest session states
    try {
      await fetch(`${API_ROOT}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({
          vault: state.vault,
          profile: state.profile,
          isPremium: state.isPremium
        })
      });
    } catch (e) {
      console.error("Upstream synchronizer transmission bottleneck encountered.", e);
    }
  }

  /**
   * Binds action event handlers across right-hand overlay panels and forms.
   */
  function registerEventHandlers() {
    // Structural Navigation Triggers
    document.getElementById('landing-action-enter-vault').addEventListener('click', () => {
      routeToView('view-categories-matrix');
    });
    
    document.getElementById('landing-action-sign-in-drawer').addEventListener('click', () => {
      openDrawerElement('drawer-auth-gateway');
    });

    document.getElementById('global-back-nav-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateBackward();
    });

    document.getElementById('global-burger-menu-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawerElement('drawer-system-settings');
    });

    document.getElementById('global-profile-avatar-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      hydrateAndOpenProfileDrawer();
    });

    // Drawer Universal Dismiss Triggers
    document.querySelectorAll('.sliding-drawer-node').forEach(drawer => {
      drawer.querySelector('.drawer-close-trigger').addEventListener('click', () => {
        closeDrawerElement(drawer.id);
      });
      drawer.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid accidental outer layer dimming dismiss paths
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.sliding-drawer-node').forEach(d => {
        if (d.classList.contains('drawer-open')) closeDrawerElement(d.id);
      });
    });

    // Form Password Fields Visibility Engine Switches
    document.getElementById('auth-password-visibility-toggle').addEventListener('click', () => {
      const targetInput = document.getElementById('auth-input-password');
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
      } else {
        targetInput.type = 'password';
      }
    });

    // Authentication Registration Action Triggers
    document.getElementById('auth-action-trigger-signin').addEventListener('click', () => executeIdentityChallenge('signin'));
    document.getElementById('auth-action-trigger-signup').addEventListener('click', () => executeIdentityChallenge('signup'));

    // Preference Settings Layer Core Interventions
    document.getElementById('settings-toggle-theme-mode').addEventListener('click', toggleApplicationThemeVariation);
    document.getElementById('settings-trigger-account-upgrade').addEventListener('click', executePremiumUpgradeWorkflow);
    document.getElementById('settings-nav-to-friends').addEventListener('click', () => {
      closeDrawerElement('drawer-system-settings');
      routeToView('view-friends-roster');
    });
    document.getElementById('settings-trigger-vault-wipe').addEventListener('click', triggerVaultWipeConfirmationModal);

    // Profile Mutation Management Actions
    document.getElementById('profile-avatar-upload-virtual-btn').addEventListener('click', () => {
      document.getElementById('profile-avatar-file-pointer').click();
    });
    document.getElementById('profile-avatar-file-pointer').addEventListener('change', handleAvatarImageSelection);
    document.getElementById('profile-privacy-toggle-state-btn').addEventListener('click', toggleProfilePrivacyStateModel);
    document.getElementById('profile-commit-global-save').addEventListener('click', commitProfileDrawerFieldsToMemory);

    // Dynamic Categorization Management Interface Toggles
    document.getElementById('trigger-add-category-panel').addEventListener('click', () => {
      const p = document.getElementById('inline-category-composition-panel');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('commit-add-category-action').addEventListener('click', commitNewCustomCategoryRowElement);

    // Items Inline Management Form Interventions
    document.getElementById('trigger-add-item-panel').addEventListener('click', () => {
      const p = document.getElementById('inline-item-composition-panel');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('commit-add-item-action').addEventListener('click', commitNewItemRowElement);
    
    // Dynamic Networking Friend Search Mechanism Placement
    document.getElementById('trigger-search-friends-action').addEventListener('click', triggerFriendSearchInterfaceModal);
  }

  function openDrawerElement(id) {
    // Dismiss active panels cleanly to avoid UI visual collisions
    document.querySelectorAll('.sliding-drawer-node').forEach(d => d.classList.remove('drawer-open'));
    document.getElementById(id).classList.add('drawer-open');
  }

  function closeDrawerElement(id) {
    document.getElementById(id).classList.remove('drawer-open');
  }

  /**
   * Toggles dark/light design parameters across elements globally.
   */
  function toggleApplicationThemeVariation() {
    const root = document.documentElement;
    const btn = document.getElementById('settings-toggle-theme-mode');
    if (state.theme === 'dark') {
      state.theme = 'light';
      root.setAttribute('data-theme', 'light');
      btn.innerText = "DARK MODE VARIANT";
    } else {
      state.theme = 'dark';
      root.setAttribute('data-theme', 'dark');
      btn.innerText = "LIGHT MODE VARIANT";
    }
  }

  /**
   * Upgrades account capabilities to allow up to 99 customizable, stored categories.
   */
  function executePremiumUpgradeWorkflow() {
    state.isPremium = true;
    document.getElementById('max-categories-display-label').innerText = "99";
    triggerSystemNotificationModal("UPGRADE COMPLETED", "Your personal dynamic vault has escalated parameters. Maximum layout tracking limit extended to 99 customized rows smoothly.");
    closeDrawerElement('drawer-system-settings');
    performCloudSynchronizeSequence();
    if (state.currentView === 'view-categories-matrix') renderCategoriesGridMatrix();
  }

  /**
   * Resets all user configurations back to baseline configurations safely.
   */
  function triggerVaultWipeConfirmationModal() {
    closeDrawerElement('drawer-system-settings');
    const root = document.getElementById('app-modal-root-layer');
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container">
          <h4 class="drawer-title-label" style="color:#EF4444; border-color:#EF4444;">CRITICAL: CONFIRM SYSTEM DATA WIPE</h4>
          <p class="modal-body-copy">Are you absolutely sure you want to permanently delete all custom items, overwritten metadata fields, and saved rankings? This action will instantly restore the layout back to its base defaults.</p>
          <div style="display:flex; gap:16px;">
            <button id="modal-confirm-wipe" class="app-ui-button btn-variant-danger">CONFIRM PURGE</button>
            <button id="modal-cancel-wipe" class="app-ui-button btn-variant-gold">CANCEL</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-cancel-wipe').addEventListener('click', () => { root.innerHTML = ''; });
    document.getElementById('modal-confirm-wipe').addEventListener('click', () => {
      root.innerHTML = '';
      executeAbsoluteVaultWipeSequence();
    });
  }

  function executeAbsoluteVaultWipeSequence() {
    state.vault = {};
    if (window.TOP_TENS_STOCK_DATA) {
      for (let cat in window.TOP_TENS_STOCK_DATA) {
        state.vault[cat] = JSON.parse(JSON.stringify(window.TOP_TENS_STOCK_DATA[cat]));
      }
    }
    state.profile = {
      fullname: "", dob: "", hometown: "", vocation: "",
      email: state.user || "", recovery: "", avatar: "", isPublic: true
    };
    state.isPremium = false;
    document.getElementById('max-categories-display-label').innerText = "21";
    
    syncProfileAvatarInterface();
    performCloudSynchronizeSequence();
    
    if (state.currentView === 'view-categories-matrix') renderCategoriesGridMatrix();
    if (state.currentView === 'view-items-linear-rows') routeToView('view-categories-matrix');
    
    triggerSystemNotificationModal("VAULT PURGED", "Platform configurations and categorical definitions have been reset to factory specifications successfully.");
  }

  /**
   * Processes identity authentication requests securely via our deployed REST API patterns.
   */
  async function executeIdentityChallenge(mode) {
    const emailNode = document.getElementById('auth-input-email');
    const passNode = document.getElementById('auth-input-password');
    const feedback = document.getElementById('auth-status-feedback-msg');
    
    const email = emailNode.value.trim();
    const password = passNode.value;

    if (!email || !password) {
      feedback.style.color = '#EF4444';
      feedback.innerText = "Error: Input vectors cannot be empty.";
      return;
    }

    if (mode === 'signup') {
      // String parsing compliance check
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
      if (!regex.test(password)) {
        feedback.style.color = '#EF4444';
        feedback.innerText = "Error: Password selection breaks required system strength parameters.";
        return;
      }
    }

    feedback.style.color = 'var(--neon-blue)';
    feedback.innerText = "Contacting verification infrastructure nodes...";

    try {
      const endpoint = mode === 'signup' ? '/api/register' : '/api/login';
      const response = await fetch(`${API_ROOT}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        if (mode === 'signup') {
          feedback.style.color = '#10B981';
          feedback.innerText = "Verification token dispatched! Please check your inbox and click the activation sequence link to proceed.";
          
          // Background loop validation polling monitor
          initializeRegistrationVerificationPollingLoop(email, feedback);
        } else {
          state.token = data.token;
          state.user = email;
          localStorage.setItem('__toptens_token', data.token);
          feedback.innerText = "Authorization validated successfully.";
          
          emailNode.value = '';
          passNode.value = '';
          feedback.innerText = '';
          closeDrawerElement('drawer-auth-gateway');
          
          verifyActiveSessionToken();
        }
      } else {
        feedback.style.color = '#EF4444';
        feedback.innerText = `Error: ${data.message || "Request failed to process."}`;
      }
    } catch (e) {
      feedback.style.color = '#EF4444';
      feedback.innerText = "Network transmission timeout. Please check your data connection layers.";
    }
  }

  function initializeRegistrationVerificationPollingLoop(email, feedbackElement) {
    let cycles = 0;
    const interval = setInterval(async () => {
      cycles++;
      if (cycles > 60) { // Timeout safety closure limit set at 5 minutes
        clearInterval(interval);
        return;
      }
      try {
        const res = await fetch(`${API_ROOT}/api/poll-verification?email=${encodeURIComponent(email)}`);
        if (res.status === 200) {
          const payload = await res.json();
          if (payload.verified) {
            clearInterval(interval);
            feedbackElement.style.color = '#10B981';
            feedbackElement.innerText = "Identity link validated! Transitioning to core profile space layout...";
            
            setTimeout(() => {
              state.token = payload.token;
              state.user = email;
              localStorage.setItem('__toptens_token', payload.token);
              feedbackElement.innerText = '';
              closeDrawerElement('drawer-auth-gateway');
              verifyActiveSessionToken();
            }, 2000);
          }
        }
      } catch (e) { console.error("Polling drop context catch: ", e); }
    }, 5000);
  }

  /**
   * Initializes profile configurations within input structures smoothly.
   */
  function hydrateAndOpenProfileDrawer() {
    const targetStack = document.getElementById('profile-fields-container-stack');
    targetStack.innerHTML = '';

    const blueprint = [
      { key: "fullname", label: "Legal Full Name", type: "text", placeholder: "Sean D. Woodson" },
      { key: "dob", label: "Date of Birth", type: "date", placeholder: "" },
      { key: "hometown", label: "Origin Hometown Core", type: "text", placeholder: "New Brunswick, NJ" },
      { key: "vocation", label: "Professional Vocation", type: "text", placeholder: "Software Architect" },
      { key: "email", label: "System Communication Email", type: "email", placeholder: "user@domain.com", readonly: true },
      { key: "recovery", label: "Fallback Recovery Node (Phone/Mail)", type: "text", placeholder: "+1 (555) 000-0000" }
    ];

    blueprint.forEach(f => {
      const group = document.createElement('div');
      group.className = "form-field-group";
      group.innerHTML = `
        <label>${f.label}</label>
        <input type="${f.type}" id="profile-edit-${f.key}" class="form-input-control" value="${state.profile[f.key] || ''}" ${f.readonly ? 'readonly style="opacity:0.6;"' : ''} placeholder="${f.placeholder}">
        ${f.readonly ? '' : `<span class="utility-icon-btn" style="position:absolute; right:12px; bottom:12px; pointer-events:none;">✏️</span>`}
      `;
      targetStack.appendChild(group);
    });

    const toggleBtn = document.getElementById('profile-privacy-toggle-state-btn');
    toggleBtn.innerText = state.profile.isPublic ? "PROFILE PUBLIC" : "PROFILE PRIVATE";

    openDrawerElement('drawer-user-profile');
  }

  function toggleProfilePrivacyStateModel() {
    state.profile.isPublic = !state.profile.isPublic;
    const toggleBtn = document.getElementById('profile-privacy-toggle-state-btn');
    toggleBtn.innerText = state.profile.isPublic ? "PROFILE PUBLIC" : "PROFILE PRIVATE";
  }

  function commitProfileDrawerFieldsToMemory() {
    const keys = ["fullname", "dob", "hometown", "vocation", "recovery"];
    keys.forEach(k => {
      const el = document.getElementById(`profile-edit-${k}`);
      if (el) state.profile[k] = el.value.trim();
    });

    if (state.user) state.profile.email = state.user;

    triggerSystemNotificationModal("PROFILE INITIALIZED", "Your background user configuration changes have been compiled and saved successfully.");
    closeDrawerElement('drawer-user-profile');
    performCloudSynchronizeSequence();
  }

  /**
   * Processes raw media file transformations into optimized Base64 data matrices natively.
   */
  function handleAvatarImageSelection(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      triggerImageCroppingFlowModal(event.target.result, (croppedBase64) => {
        state.profile.avatar = croppedBase64;
        syncProfileAvatarInterface();
        performCloudSynchronizeSequence();
      });
    };
    reader.readAsDataURL(file);
  }

  function syncProfileAvatarInterface() {
    const defaultSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewBox='0 0 42 42'><rect width='42' height='42' fill='%23D4AF37'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='black' font-size='22' font-weight='bold'>V</text></svg>";
    const avatarSrc = state.profile.avatar || defaultSvg;
    document.getElementById('global-profile-avatar-trigger').src = avatarSrc;
    document.getElementById('profile-drawer-avatar-display').src = avatarSrc;
  }

  /**
   * Renders an interactive image-cropping overlay to let users scale and position their images.
   */
  function triggerImageCroppingFlowModal(imageSrc, callback) {
    const root = document.getElementById('app-modal-root-layer');
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container" style="max-width:440px;">
          <h4 class="drawer-title-label">CENTER AND ALIGN MEDIA</h4>
          <div class="avatar-cropper-stage-node" id="cropper-stage">
            <img src="${imageSrc}" id="cropper-target" class="avatar-cropper-target-img" style="transform: scale(1) translate(0px, 0px);">
            <div class="avatar-cropper-mask-lens"></div>
          </div>
          <div style="margin-bottom:20px; display:flex; gap:10px; align-items:center; justify-content:center;">
            <button id="crop-zoom-out" class="app-ui-button btn-variant-gold" style="width:auto; padding:6px 14px;">- ZOOM</button>
            <button id="crop-zoom-in" class="app-ui-button btn-variant-gold" style="width:auto; padding:6px 14px;">+ ZOOM</button>
          </div>
          <div style="display:flex; gap:16px;">
            <button id="crop-commit-action" class="app-ui-button btn-variant-solid-gold">PUBLISH POSITION</button>
            <button id="crop-cancel-action" class="app-ui-button btn-variant-danger">CANCEL</button>
          </div>
        </div>
      </div>
    `;

    const img = document.getElementById('cropper-target');
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    img.onload = () => {
      // Natural rendering center placement logic
      translateX = (440 - img.clientWidth) / 2 - 40;
      translateY = (240 - img.clientHeight) / 2;
      updateTransformStyles();
    };

    function updateTransformStyles() {
      img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    document.getElementById('crop-zoom-in').addEventListener('click', () => { scale += 0.1; updateTransformStyles(); });
    document.getElementById('crop-zoom-out').addEventListener('click', () => { if (scale > 0.2) scale -= 0.1; updateTransformStyles(); });

    const stage = document.getElementById('cropper-stage');
    stage.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransformStyles();
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    document.getElementById('crop-cancel-action').addEventListener('click', () => { root.innerHTML = ''; });
    document.getElementById('crop-commit-action').addEventListener('click', () => {
      // Create canvas context to export an optimized 150x150 thumbnail frame
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0,150,150);
      
      ctx.beginPath();
      ctx.arc(75, 75, 75, 0, Math.PI*2);
      ctx.clip();
      
      // Approximate transform alignment matrices mapping calculations
      ctx.drawImage(img, translateX - 70, translateY - 45, img.clientWidth * scale, img.clientHeight * scale);
      
      callback(canvas.toDataURL('image/jpeg', 0.85));
      root.innerHTML = '';
    });
  }

  /**
   * Builds the primary 3-column interactive categories layout grid dynamically.
   */
  function renderCategoriesGridMatrix() {
    const target = document.getElementById('categories-injection-grid-target');
    target.innerHTML = '';

    const activeVaultKeys = Object.keys(state.vault);

    activeVaultKeys.forEach(catName => {
      const itemsArr = state.vault[catName] || [];
      const node = document.createElement('div');
      node.className = "category-tab-node";
      
      // Determine default display symbols context cleanly
      let displayEmoji = "📁";
      if (catName === "Shoes") displayEmoji = "👟";
      if (catName === "Inspiring Athletes") displayEmoji = "🏃";
      if (catName === "Tech Devices") displayEmoji = "💻";
      if (catName === "Celebrities") displayEmoji = "🌟";
      if (catName === "Post 2000 Movies") displayEmoji = "🎬";
      if (catName === "90s Rap Songs") displayEmoji = "🎤";
      if (catName === "Post 2010 Video Games") displayEmoji = "🎮";
      if (catName === "Novels") displayEmoji = "📚";
      if (catName === "Restaurants") displayEmoji = "🍔";

      node.innerHTML = `
        <div class="category-header-block">
          <div class="category-icon-visual">${displayEmoji}</div>
          <div class="category-label-title">${catName}</div>
          <div class="category-items-counter">(${itemsArr.length} items)</div>
        </div>
        <div class="category-interactive-row">
          <button data-action="compare" data-category="${catName}">Compare</button>
          <button data-action="fuse" data-category="${catName}">Fuse</button>
          <button data-action="privacy" data-category="${catName}">Public</button>
        </div>
        <div class="node-inline-management-utilities">
          <button class="utility-icon-btn" data-action="edit" data-category="${catName}">✏️</button>
          <button class="utility-icon-btn" data-action="remove" data-category="${catName}">🗑️</button>
        </div>
      `;

      // Main card clicks navigate deep into the item rows layout
      node.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.node-inline-management-utilities')) return;
        state.activeCategoryContext = catName;
        routeToView('view-items-linear-rows');
      });

      // Bind functional actions directly to sub-buttons inside the grid card
      node.querySelector('[data-action="compare"]').addEventListener('click', (e) => { e.stopPropagation(); triggerNetworkCompareWizard(catName); });
      node.querySelector('[data-action="fuse"]').addEventListener('click', (e) => { e.stopPropagation(); triggerNetworkFuseWizard(catName); });
      node.querySelector('[data-action="privacy"]').addEventListener('click', (e) => {
        e.stopPropagation();
        triggerSystemNotificationModal("VISIBILITY SCOPE", `Visibility properties for category namespace [${catName}] shifted successfully.`);
      });
      node.querySelector('[data-action="edit"]').addEventListener('click', (e) => { e.stopPropagation(); triggerCategoryRenameModal(catName); });
      node.querySelector('[data-action="remove"]').addEventListener('click', (e) => { e.stopPropagation(); executeCategoryRemoval(catName); });

      target.appendChild(node);
    });

    // Toggle ad-wing styling based on layout needs
    const adLeft = document.getElementById('ad-slot-left');
    const adRight = document.getElementById('ad-slot-right');
    if (activeVaultKeys.length > 0) {
      adLeft.className = "advertisement-wing-slot";
      adRight.className = "advertisement-wing-slot";
    } else {
      adLeft.className = "advertisement-wing-slot slot-empty";
      adRight.className = "advertisement-wing-slot slot-empty";
    }
  }

  function commitNewCustomCategoryRowElement() {
    const nameInput = document.getElementById('input-new-category-title');
    const title = nameInput.value.trim();
    if (!title) return;

    const limit = state.isPremium ? 99 : 21;
    if (Object.keys(state.vault).length >= limit) {
      triggerSystemNotificationModal("LIMIT ENCOUNTERED", "Maximum configuration limits reached for this account type. Please scale operational tier boundaries inside Settings to expand options.");
      return;
    }

    if (state.vault[title]) {
      triggerSystemNotificationModal("COLLISION DETECTED", "A categorical schema block already exists matching that designated label namespace.");
      return;
    }

    state.vault[title] = [];
    nameInput.value = '';
    document.getElementById('inline-category-composition-panel').style.display = 'none';
    
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  }

  function triggerCategoryRenameModal(catName) {
    const root = document.getElementById('app-modal-root-layer');
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container">
          <h4 class="drawer-title-label">RENAME CATEGORY LAYER</h4>
          <div class="form-field-group">
            <label>New Namespace Identity Name</label>
            <input type="text" id="modal-input-rename-cat" class="form-input-control" value="${catName}">
          </div>
          <div style="display:flex; gap:16px; margin-top:20px;">
            <button id="modal-confirm-rename" class="app-ui-button btn-variant-solid-gold">COMMIT IDENTITY</button>
            <button id="modal-cancel-rename" class="app-ui-button btn-variant-danger">DISMISS</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-cancel-rename').addEventListener('click', () => { root.innerHTML = ''; });
    document.getElementById('modal-confirm-rename').addEventListener('click', () => {
      const inputVal = document.getElementById('modal-input-rename-cat').value.trim();
      if (inputVal && inputVal !== catName) {
        state.vault[inputVal] = state.vault[catName];
        delete state.vault[catName];
        root.innerHTML = '';
        renderCategoriesGridMatrix();
        performCloudSynchronizeSequence();
      } else { root.innerHTML = ''; }
    });
  }

  function executeCategoryRemoval(catName) {
    delete state.vault[catName];
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  }

  /**
   * Renders the single-column linear items stack (limited to 10 rows maximum).
   */
  function renderItemsLinearStack() {
    const currentCategory = state.activeCategoryContext;
    document.getElementById('items-view-category-header-title').innerText = `USER LIST: ${currentCategory.toUpperCase()} v1.0`;
    
    const target = document.getElementById('items-injection-stack-target');
    target.innerHTML = '';

    const itemsArr = state.vault[currentCategory] || [];
    
    // Sort array elements by ascending rank order
    itemsArr.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    itemsArr.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = "item-row-wrapper-node";
      
      const thumb = item.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><rect width='36' height='36' fill='%23333'/></svg>";

      row.innerHTML = `
        <div class="item-leading-rank-index"><span>#</span>${item.rank}</div>
        <div class="item-core-title-label">${item.name}</div>
        <a href="${item.link || '#'}" target="_blank" class="item-anchor-reference-link">Reference Link</a>
        <img src="${thumb}" alt="Thumb" class="item-circular-thumbnail-frame">
        <button class="utility-icon-btn" data-action="item-edit" data-index="${index}">✏️</button>
        <button class="utility-icon-btn" data-action="item-remove" data-index="${index}">🗑️</button>
      `;

      row.querySelector('[data-action="item-edit"]').addEventListener('click', () => triggerItemUpdateWizardModal(index));
      row.querySelector('[data-action="item-remove"]').addEventListener('click', () => executeItemRemoval(index));

      target.appendChild(row);
    });
  }

  function commitNewItemRowElement() {
    const currentCategory = state.activeCategoryContext;
    const titleEl = document.getElementById('input-new-item-title');
    const rankEl = document.getElementById('input-new-item-rank');
    const mediaEl = document.getElementById('input-new-item-media');

    const name = titleEl.value.trim();
    const rank = parseInt(rankEl.value);
    if (!name) return;

    if (!state.vault[currentCategory]) state.vault[currentCategory] = [];
    const itemsArr = state.vault[currentCategory];

    if (itemsArr.length >= 10) {
      triggerSystemNotificationModal("CAPACITY LIMIT", "Vault index sizing allocations strictly limited to a maximum count of 10 items per collection line.");
      return;
    }

    // Dynamic affiliate link autogeneration logic
    const affiliateParam = "?tag=toptens2026-20";
    const baseLink = "https://www.amazon.com/s?k=" + encodeURIComponent(name);
    const finalizedAffiliateLink = baseLink + affiliateParam;

    const proceedWithSave = (mediaDataString) => {
      itemsArr.push({
        rank: rank,
        name: name,
        link: finalizedAffiliateLink,
        media: mediaDataString
      });

      titleEl.value = '';
      mediaEl.value = '';
      document.getElementById('inline-item-composition-panel').style.display = 'none';
      
      renderItemsLinearStack();
      performCloudSynchronizeSequence();
    };

    if (mediaEl.files && mediaEl.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        triggerImageCroppingFlowModal(e.target.result, (cropped) => {
          proceedWithSave(cropped);
        });
      };
      reader.readAsDataURL(mediaEl.files[0]);
    } else {
      proceedWithSave("");
    }
  }

  function triggerItemUpdateWizardModal(index) {
    const currentCategory = state.activeCategoryContext;
    const item = state.vault[currentCategory][index];
    const root = document.getElementById('app-modal-root-layer');
    
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container">
          <h4 class="drawer-title-label">EDIT ITEM VALUE LAYER</h4>
          <div class="form-field-group">
            <label>Item Name Identity</label>
            <input type="text" id="modal-item-name" class="form-input-control" value="${item.name}">
          </div>
          <div class="form-field-group">
            <label>Rank Index Placement</label>
            <input type="number" id="modal-item-rank" class="form-input-control" value="${item.rank}" min="1" max="10">
          </div>
          <div class="form-field-group">
            <label>Reference Hyperlink</label>
            <input type="text" id="modal-item-link" class="form-input-control" value="${item.link || ''}">
          </div>
          <div style="display:flex; gap:16px; margin-top:24px;">
            <button id="modal-item-save" class="app-ui-button btn-variant-solid-gold">SAVE PARAMETERS</button>
            <button id="modal-item-cancel" class="app-ui-button btn-variant-danger">DISMISS</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-item-cancel').addEventListener('click', () => { root.innerHTML = ''; });
    document.getElementById('modal-item-save').addEventListener('click', () => {
      item.name = document.getElementById('modal-item-name').value.trim();
      item.rank = parseInt(document.getElementById('modal-item-rank').value) || 1;
      item.link = document.getElementById('modal-item-link').value.trim();
      root.innerHTML = '';
      renderItemsLinearStack();
      performCloudSynchronizeSequence();
    });
  }

  function executeItemRemoval(index) {
    const currentCategory = state.activeCategoryContext;
    state.vault[currentCategory].splice(index, 1);
    renderItemsLinearStack();
    performCloudSynchronizeSequence();
  }

  /**
   * Renders rows of verified network friends dynamically.
   */
  function renderFriendsRosterStack() {
    const target = document.getElementById('friends-injection-stack-target');
    target.innerHTML = '';

    state.friends.forEach(f => {
      const row = document.createElement('div');
      row.className = "item-row-wrapper-node";
      
      const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><rect width='36' height='36' fill='%23666'/></svg>";
      
      // Calculate intersection metric counts between users dynamically
      let mutualCategories = 0;
      let mutualItemsCount = 0;

      for (let userCat in state.vault) {
        if (f.vault[userCat]) {
          mutualCategories++;
          const userItems = state.vault[userCat] || [];
          const friendItems = f.vault[userCat] || [];
          
          userItems.forEach(ui => {
            if (friendItems.some(fi => fi.name.toLowerCase().trim() === ui.name.toLowerCase().trim())) {
              mutualItemsCount++;
            }
          });
        }
      }

      row.innerHTML = `
        <div class="item-core-title-label" style="font-size:16px; font-weight:bold; color:var(--gold-primary);">${f.name}</div>
        <div style="font-size:13px; color:var(--text-muted); flex:1.5;">Mutual Categories: ${mutualCategories}</div>
        <div style="font-size:13px; color:var(--text-muted); flex:1.5;">Mutual Items: ${mutualItemsCount}</div>
        <img src="${f.avatar || defaultAvatar}" alt="Friend Frame" class="item-circular-thumbnail-frame">
      `;
      target.appendChild(row);
    });
  }

  function triggerFriendSearchInterfaceModal() {
    const root = document.getElementById('app-modal-root-layer');
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container">
          <h4 class="drawer-title-label">SEARCH SOCIAL INDEX MATRIX</h4>
          <div class="form-field-group">
            <label>Profile Account Handle Name</label>
            <input type="text" id="input-friend-search-name" class="form-input-control" placeholder="Search profile handles...">
          </div>
          <div id="search-modal-feedback-render-space" style="margin-top:14px; max-height:150px; overflow-y:auto;"></div>
          <div style="display:flex; gap:16px; margin-top:20px;">
            <button id="modal-search-execute" class="app-ui-button btn-variant-solid-gold">EXECUTE QUERY</button>
            <button id="modal-search-dismiss" class="app-ui-button btn-variant-danger">DISMISS</button>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('input-friend-search-name');
    const feedback = document.getElementById('search-modal-feedback-render-space');

    document.getElementById('modal-search-dismiss').addEventListener('click', () => { root.innerHTML = ''; });
    document.getElementById('modal-search-execute').addEventListener('click', () => {
      const targetQuery = input.value.trim();
      if (!targetQuery) return;
      
      feedback.innerHTML = `
        <div style="display:flex; justify-content:between; align-items:center; padding:8px; border-bottom:1px solid var(--border-color);">
          <span style="color:#FFF;">${targetQuery} (Public Profile)</span>
          <button id="action-bind-scanned-friend" class="app-ui-button btn-variant-green" style="width:auto; padding:4px 10px; font-size:11px;">ADD AS FRIEND</button>
        </div>
      `;

      document.getElementById('action-bind-scanned-friend').addEventListener('click', () => {
        state.friends.push({ name: targetQuery, avatar: "", isPublic: true, vault: {} });
        root.innerHTML = '';
        if (state.currentView === 'view-friends-roster') renderFriendsRosterStack();
        triggerSystemNotificationModal("ROSTER EXPANDED", `Profile target connection [${targetQuery}] appended to network tree layers.`);
      });
    });
  }

  /**
   * Evaluates comparison layouts across multiple connected accounts instantly.
   */
  function triggerNetworkCompareWizard(catName) {
    routeToView('view-algorithmic-compare');
    document.getElementById('compare-view-heading-title').innerText = `NETWORK TRANS-COMPARISON: ${catName.toUpperCase()}`;
    
    const container = document.getElementById('compare-matrix-grid-render-output');
    container.innerHTML = '';

    // Create tracking collection mapping elements arrays
    const renderTargetsList = [
      { name: "Your Vault (Self)", dataset: state.vault[catName] || [] }
    ];

    state.friends.forEach(f => {
      if (f.vault && f.vault[catName]) {
        renderTargetsList.push({ name: `${f.name}'s Vault`, dataset: f.vault[catName] });
      }
    });

    container.style.gridTemplateColumns = `repeat(${renderTargetsList.length}, minmax(280px, 1fr))`;

    renderTargetsList.forEach(column => {
      const panel = document.createElement('div');
      panel.className = "inline-composition-overlay-panel";
      panel.style.margin = "0";
      
      let itemsLinesHTML = "";
      const sorted = [...column.dataset].sort((a,b) => parseInt(a.rank) - parseInt(b.rank));
      
      for(let i=1; i<=10; i++) {
        const found = sorted.find(item => parseInt(item.rank) === i);
        itemsLinesHTML += `
          <div style="display:flex; gap:10px; padding:6px 0; border-bottom:1px solid rgba(212,175,55,0.05); font-size:13px;">
            <span style="color:var(--gold-primary); font-weight:bold; width:20px;">#${i}</span>
            <span style="color:var(--text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${found ? found.name : '---'}</span>
          </div>
        `;
      }

      panel.innerHTML = `
        <div style="font-family:'Cinzel', serif; font-size:14px; text-align:center; color:var(--gold-primary); margin-bottom:14px; border-bottom:1px solid var(--border-color); padding-bottom:6px;">${column.name}</div>
        <div>${itemsLinesHTML}</div>
      `;
      container.appendChild(panel);
    });
  }

  /**
   * Runs the algorithmic consolidation routine using a weight-ranking average formula.
   */
  function triggerNetworkFuseWizard(catName) {
    routeToView('view-algorithmic-fuse');
    document.getElementById('fuse-view-heading-title').innerText = `FUSED MASTER WEIGHT CONSOLIDATION: ${catName.toUpperCase()}`;
    
    const targetStack = document.getElementById('fuse-list-render-output');
    targetStack.innerHTML = '';

    const weightMapScores = {}; // Key: Item Name String -> Val: Cumulative Score Float Metric

    function processItemsArrayMatrix(arr) {
      if (!arr) return;
      arr.forEach(item => {
        const normalizedKey = item.name.trim();
        if (!normalizedKey) return;
        
        // Weight Formula calculation: Inverse Rank Positional Valuation Scale
        const positionalScore = (11 - parseInt(item.rank)); 
        
        if (!weightMapScores[normalizedKey]) {
          weightMapScores[normalizedKey] = { totalScore: 0, occurrences: 0, link: item.link, media: item.media };
        }
        weightMapScores[normalizedKey].totalScore += positionalScore;
        weightMapScores[normalizedKey].occurrences += 1;
      });
    }

    // Process local array structures
    processItemsArrayMatrix(state.vault[catName]);

    // Process shared friend array structures
    state.friends.forEach(f => {
      if (f.vault && f.vault[catName]) processItemsArrayMatrix(f.vault[catName]);
    });

    // Compute averages and compile cross-network arrays
    const consolidatedList = [];
    for (let nameKey in weightMapScores) {
      const node = weightMapScores[nameKey];
      const aggregatedAverage = node.totalScore / node.occurrences;
      consolidatedList.push({
        name: nameKey,
        score: aggregatedAverage,
        link: node.link,
        media: node.media
      });
    }

    // Sort entries by calculated weight order
    consolidatedList.sort((a, b) => b.score - a.score);

    // Limit layout display output down to standard top 10 items
    const finalTopTenFuseOutput = consolidatedList.slice(0, 10);

    if (finalTopTenFuseOutput.length === 0) {
      targetStack.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No categorical datasets found across networks to perform fusion computations.</div>`;
      return;
    }

    finalTopTenFuseOutput.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "item-row-wrapper-node";
      const thumb = item.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><rect width='36' height='36' fill='%23222'/></svg>";
      
      row.innerHTML = `
        <div class="item-leading-rank-index" style="color:var(--neon-blue);"><span>#</span>${idx + 1}</div>
        <div class="item-core-title-label">${item.name} <span style="font-size:11px; color:var(--text-muted); font-weight:normal; margin-left:12px;">(Weight Score: ${item.score.toFixed(2)})</span></div>
        <a href="${item.link || '#'}" target="_blank" class="item-anchor-reference-link">Reference Link</a>
        <img src="${thumb}" alt="Media Frame" class="item-circular-thumbnail-frame">
      `;
      targetStack.appendChild(row);
    });
  }

  /**
   * Renders global system update dialog notification panels dynamically.
   */
  function triggerSystemNotificationModal(heading, bodyText) {
    const root = document.getElementById('app-modal-root-layer');
    root.innerHTML = `
      <div class="modal-backdrop-blur">
        <div class="modal-content-container">
          <h4 class="drawer-title-label">${heading}</h4>
          <p class="modal-body-copy">${bodyText}</p>
          <button id="modal-notice-dismiss-trigger" class="app-ui-button btn-variant-solid-gold">ACKNOWLEDGE</button>
        </div>
      </div>
    `;
    document.getElementById('modal-notice-dismiss-trigger').addEventListener('click', () => { root.innerHTML = ''; });
  }

})();