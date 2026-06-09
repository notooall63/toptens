/**
 * Top Tens - Core Application Engine Script
 * Directory: D:/top-tens/frontend/app.js
 */

const API_BASE = "https://top-tens-backend.swoodson96.workers.dev"; // [cite: 2026-06-03]

// App State Matrix Configuration
let state = {
  userToken: null,
  isGuest: true,
  currentView: "view-landing",
  activeCategoryContext: null,
  tier: "free",
  profile: { fullName: "", dob: "", hometown: "", vocation: "", email: "", recovery: "", avatar: "", isPublic: true },
  vault: JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET)),
  friends: []
};

// Event Listeners Initialization Loop
document.addEventListener("DOMContentLoaded", () => {
  setupNavigationInterceptors();
  setupAuthMechanics();
  setupProfileMechanics();
  setupSettingsMechanics();
  setupCollectionMechanics();
  evaluateUrlParameters();
});

// Structural Routing Controller Matrix
function routeToView(viewId) {
  state.currentView = viewId;
  document.querySelectorAll(".router-view").forEach(el => el.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  const header = document.getElementById("global-app-header");
  if (viewId === "view-landing") {
    header.style.display = "none";
  } else {
    header.style.display = "flex";
  }
  
  // Real-time render dispatch maps
  if (viewId === "view-categories") renderCategoriesGridMatrix();
  if (viewId === "view-items-stack") renderItemsLinearStack();
  if (viewId === "view-friends-roster") renderFriendsRosterStack();
}

function setupNavigationInterceptors() {
  document.getElementById("header-back-control").addEventListener("click", () => {
    if (state.currentView === "view-categories") routeToView("view-landing");
    else if (state.currentView === "view-items-stack") routeToView("view-categories");
    else if (state.currentView === "view-friends-roster") routeToView("view-categories");
    else if (state.currentView === "view-compare-matrix") routeToView("view-categories");
    else if (state.currentView === "view-fuse-consolidation") routeToView("view-categories");
  });

  document.getElementById("btn-enter-vault-guest").addEventListener("click", () => {
    state.isGuest = true;
    state.tier = "free";
    state.vault = JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET));
    routeToView("view-categories");
  });
}

// Slide Out Drawer Management Orchestration
function uiOpenDrawer(drawerId) {
  document.getElementById("drawer-backdrop-shutter-layer").style.display = "block";
  document.getElementById(drawerId).classList.add("open");
}

function uiCloseActiveDrawer() {
  document.getElementById("drawer-backdrop-shutter-layer").style.display = "none";
  document.querySelectorAll(".universal-slide-out-drawer").forEach(el => el.classList.remove("open"));
}

document.getElementById("drawer-backdrop-shutter-layer").addEventListener("click", uiCloseActiveDrawer);

// Custom Dialog Box Interface Wizard Framework
function triggerSystemModalAlert(heading, bodyText, primaryActionText, primaryCallback, secondaryActionText = null, secondaryCallback = null) {
  document.getElementById("dialog-heading").innerText = heading;
  document.getElementById("dialog-body").innerText = bodyText;
  
  const actionsCluster = document.getElementById("dialog-actions-cluster");
  actionsCluster.innerHTML = "";

  const primBtn = document.createElement("button");
  primBtn.className = "luxury-action-cta";
  primBtn.style.width = "auto";
  primBtn.style.padding = "0 20px";
  primBtn.innerText = primaryActionText;
  primBtn.addEventListener("click", () => {
    document.getElementById("dialog-overlay-root-shutter-layer").classList.add("hidden-modal-layer");
    if (primaryCallback) primaryCallback();
  });
  actionsCluster.appendChild(primBtn);

  if (secondaryActionText) {
    const secBtn = document.createElement("button");
    secBtn.className = "luxury-action-cta system-wipe-destructive-btn";
    secBtn.style.width = "auto";
    secBtn.style.padding = "0 20px";
    secBtn.innerText = secondaryActionText;
    secBtn.addEventListener("click", () => {
      document.getElementById("dialog-overlay-root-shutter-layer").classList.add("hidden-modal-layer");
      if (secondaryCallback) secondaryCallback();
    });
    actionsCluster.appendChild(secBtn);
  }

  document.getElementById("dialog-overlay-root-shutter-layer").classList.remove("hidden-modal-layer");
}

// Credentials Gateway Auth System Mechanics
function setupAuthMechanics() {
  document.getElementById("btn-trigger-auth-drawer").addEventListener("click", () => uiOpenDrawer("drawer-auth"));
  
  const passwordField = document.getElementById("auth-password-field");
  document.getElementById("auth-password-reveal-toggle-btn").addEventListener("click", () => {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  });

  // Strict Parameter Password Regex Validation Loop
  function validatePasswordComplexity(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(pw);
  }

  document.getElementById("btn-execute-signup-challenge").addEventListener("click", async () => {
    const email = document.getElementById("auth-email-field").value.trim();
    const password = passwordField.value;

    if (!email || !validatePasswordComplexity(password)) {
      triggerSystemModalAlert("COMPLIANCE EXCEPTION", "Password configuration fails validation constraints.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      triggerSystemModalAlert("VERIFICATION DISPATCHED", "An activation dispatch token link has been channeled to your email. Confirm link to initialize vault access.");
      uiCloseActiveDrawer();
    } catch (err) {
      triggerSystemModalAlert("REGISTRATION FAILED", err.message);
    }
  });

  document.getElementById("btn-execute-signin-challenge").addEventListener("click", async () => {
    const email = document.getElementById("auth-email-field").value.trim();
    const password = passwordField.value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      processAuthenticatedSession(data);
    } catch (err) {
      triggerSystemModalAlert("AUTHENTICATION TIMEOUT", err.message);
    }
  });
}

function processAuthenticatedSession(authData) {
  state.userToken = authData.token;
  state.isGuest = false;
  state.tier = authData.user.tier;
  state.vault = Object.keys(authData.user.vault).length ? authData.user.vault : JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET));
  state.profile = authData.user.profile;
  state.profile.email = authData.user.email;
  state.friends = authData.user.friends || [];

  // Hydrate fields
  document.getElementById("profile-fullname-field").value = state.profile.fullName || "";
  document.getElementById("profile-dob-field").value = state.profile.dob || "";
  document.getElementById("profile-hometown-field").value = state.profile.hometown || "";
  document.getElementById("profile-vocation-field").value = state.profile.vocation || "";
  document.getElementById("profile-email-field").value = state.profile.email || "";
  document.getElementById("profile-recovery-field").value = state.profile.recovery || "";
  
  if (state.profile.avatar) {
    document.getElementById("header-profile-avatar-trigger").style.backgroundImage = `url(${state.profile.avatar})`;
    document.getElementById("profile-drawer-avatar-preview-window").style.backgroundImage = `url(${state.profile.avatar})`;
  }

  uiCloseActiveDrawer();
  routeToView("view-categories");
}

async function performCloudSynchronizeSequence() {
  if (state.isGuest || !state.userToken) return;
  try {
    await fetch(`${API_BASE}/api/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${state.userToken}`
      },
      body: JSON.stringify({ vault: state.vault, profile: state.profile, tier: state.tier, friends: state.friends })
    });
  } catch (e) {
    console.error("Cloud synchronization stream bottleneck detected.");
  }
}

function evaluateUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("verified") === "true") {
    triggerSystemModalAlert("ACCOUNT ACTIVATED", "Cryptographic validation identity checked. Use credentials to initialize secure entry drawer.");
    uiOpenDrawer("drawer-auth");
    document.getElementById("auth-email-field").value = params.get("email") || "";
  }
}

// Profile Automation Infrastructure
function setupProfileMechanics() {
  document.getElementById("header-profile-avatar-trigger").addEventListener("click", () => uiOpenDrawer("drawer-profile"));
  
  document.getElementById("profile-avatar-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      // Inline processing loop mockup for image positioning confirmation wizards
      triggerSystemModalAlert("CONFIRM AVATAR ORIENTATION", "Commit positioning coordinates to canvas profile window?", "PUBLISH AVATAR", () => {
        state.profile.avatar = event.target.result;
        document.getElementById("header-profile-avatar-trigger").style.backgroundImage = `url(${state.profile.avatar})`;
        document.getElementById("profile-drawer-avatar-preview-window").style.backgroundImage = `url(${state.profile.avatar})`;
        performCloudSynchronizeSequence();
      });
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("btn-profile-visibility-toggle").addEventListener("click", (e) => {
    state.profile.isPublic = !state.profile.isPublic;
    e.target.innerText = state.profile.isPublic ? "PROFILE PUBLIC" : "PROFILE PRIVATE";
    e.target.classList.toggle("toggle-active");
  });

  document.getElementById("btn-commit-profile-mutations").addEventListener("click", () => {
    state.profile.fullName = document.getElementById("profile-fullname-field").value;
    state.profile.dob = document.getElementById("profile-dob-field").value;
    state.profile.hometown = document.getElementById("profile-hometown-field").value;
    state.profile.vocation = document.getElementById("profile-vocation-field").value;
    state.profile.recovery = document.getElementById("profile-recovery-field").value;
    
    // Explicit lock parameters step
    document.querySelectorAll("#drawer-profile input").forEach(input => { if(input.id !== "profile-email-field") input.disabled = true; });
    performCloudSynchronizeSequence();
    uiCloseActiveDrawer();
  });
}

function uiUnlockField(id) {
  document.getElementById(id).disabled = false;
  document.getElementById(id).focus();
}

// Application Settings Systems Configuration Panel Elements
function setupSettingsMechanics() {
  document.getElementById("header-burger-control").addEventListener("click", () => uiOpenDrawer("drawer-settings"));
  
  document.getElementById("btn-toggle-ui-color-theme").addEventListener("click", (e) => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");
    e.target.innerText = body.classList.contains("light-mode") ? "DARK MODE" : "LIGHT MODE";
  });

  document.getElementById("btn-trigger-tier-upgrade").addEventListener("click", () => {
    triggerSystemModalAlert("UPGRADE CONFIRMATION", "Expand processing bandwidth limits to 99 customized category indexes for $0.99/mo?", "PROCEED COMPUTE", () => {
      state.tier = "premium";
      document.getElementById("tier-allocation-text").innerText = `Tier Allocation Matrix: ${Object.keys(state.vault).length} / 99 Slots Used`;
      performCloudSynchronizeSequence();
    });
  });

  document.getElementById("btn-settings-route-to-friends-search").addEventListener("click", () => { uiCloseActiveDrawer(); routeToView("view-friends-roster"); setTimeout(() => triggerFriendSearchInterfacePopupWizard(), 300); });
  document.getElementById("btn-settings-route-to-friends-page").addEventListener("click", () => { uiCloseActiveDrawer(); routeToView("view-friends-roster"); });

  document.getElementById("btn-trigger-vault-wipe-sequence").addEventListener("click", () => {
    triggerSystemModalAlert("ARE YOU ABSOLUTELY SURE?", "This runtime function execution clears all multi-tenant structures back to base factory matrices.", "CONFIRM CORE SHUTDOWN", () => {
      state.vault = JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET));
      performCloudSynchronizeSequence();
      routeToView("view-categories");
    }, "ABORT", null);
  });
}

// Collection Allocation Presentation Matrix Layers
function setupCollectionMechanics() {
  document.getElementById("btn-add-custom-category-wizard").addEventListener("click", () => {
    const activeLimit = state.tier === "premium" ? 99 : 21;
    if (Object.keys(state.vault).length >= activeLimit) {
      triggerSystemModalAlert("CAPACITY EXCEEDED", "Upgrade matrix constraints to process further storage vectors.");
      return;
    }

    triggerSystemModalAlert("NEW CATEGORY IDENTIFIER", "Enter descriptor tags below:", "CREATE NODE", () => {
      // Modal mock dynamic configuration prompt mapping helper inside template alerts
      const mockInput = prompt("Enter Category Title String:");
      if (mockInput && mockInput.trim()) {
        const catName = mockInput.trim();
        if(!state.vault[catName]) {
          state.vault[catName] = [];
          renderCategoriesGridMatrix();
          performCloudSynchronizeSequence();
        }
      }
    });
  });

  document.getElementById("btn-commit-item-row").addEventListener("click", () => {
    const titleField = document.getElementById("input-item-title-field");
    const rankField = document.getElementById("input-item-rank-field");
    const fileField = document.getElementById("input-item-media-field");

    const name = titleField.value.trim();
    const rank = parseInt(rankField.value);

    if(!name || isNaN(rank) || rank < 1 || rank > 10) {
      triggerSystemModalAlert("DATA INPUT BOUND EXCEPTION", "Input configurations fail constraint maps.");
      return;
    }

    const itemsCollection = state.vault[state.activeCategoryContext] || [];
    if (itemsCollection.length >= 10) {
      triggerSystemModalAlert("SLOT LIMIT", "Maximum element capacities locked at 10 items.");
      return;
    }

    const file = fileField.files[0];
    const affiliateLink = generateAutomatedAffiliateLink(name);

    const proceedWithSave = (mediaDataStr = "") => {
      itemsCollection.push({ rank, name, link: affiliateLink, media: mediaDataStr });
      titleField.value = "";
      rankField.value = "";
      fileField.value = "";
      renderItemsLinearStack();
      performCloudSynchronizeSequence();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => proceedWithSave(e.target.result);
      reader.readAsDataURL(file);
    } else {
      proceedWithSave();
    }
  });
}

function renderCategoriesGridMatrix() {
  const target = document.getElementById("categories-grid-matrix-target");
  target.innerHTML = "";

  const activeLimit = state.tier === "premium" ? 99 : 21;
  document.getElementById("tier-allocation-text").innerText = `Tier Allocation Matrix: ${Object.keys(state.vault).length} / ${activeLimit} Slots Used`;

  Object.keys(state.vault).forEach(categoryName => {
    const tab = document.createElement("div");
    tab.className = "category-elongated-rectangle-tab";
    
    // Explicitly safe navigation intercept context locks
    tab.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest(".category-mutation-icon-anchor-cluster")) return;
      state.activeCategoryContext = categoryName;
      routeToView("view-items-stack");
    });

    const itemsLength = state.vault[categoryName].length;

    tab.innerHTML = `
      <div class="category-core-metadata-block">
        <div class="category-title-label">${categoryName}</div>
        <div class="category-item-count">(${itemsLength} items)</div>
      </div>
      <div class="category-embedded-action-row">
        <button class="mini-utility-btn" onclick="triggerCompareFlow('${categoryName}')">Compare</button>
        <button class="mini-utility-btn" onclick="triggerFuseFlow('${categoryName}')">Fuse</button>
        <button class="mini-utility-btn">Public</button>
      </div>
      <div class="category-mutation-icon-anchor-cluster">
        <span class="mutation-icon-action-btn" onclick="event.stopPropagation(); triggerRenameCategoryWizard('${categoryName}')">✏️</span>
        <span class="mutation-icon-action-btn" onclick="event.stopPropagation(); triggerRemoveCategoryWizard('${categoryName}')">🗑️</span>
      </div>
    `;
    target.appendChild(tab);
  });
}

function triggerRenameCategoryWizard(oldName) {
  const newName = prompt("Enter mutations for label assignment string:", oldName);
  if (newName && newName.trim() && newName !== oldName) {
    state.vault[newName.trim()] = state.vault[oldName];
    delete state.vault[oldName];
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  }
}

function triggerRemoveCategoryWizard(name) {
  triggerSystemModalAlert("DELETION CONSTRAINTS MATCHED", `Confirm dropping collection allocation tree node [${name}]?`, "DROP NODE", () => {
    delete state.vault[name];
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  });
}

function renderItemsLinearStack() {
  const target = document.getElementById("items-linear-stack-target-output");
  target.innerHTML = "";
  
  const items = state.vault[state.activeCategoryContext] || [];
  // Direct ascending logic placement sequence mapping rules sorting routines
  items.sort((a,b) => a.rank - b.rank);

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item-row-wrapper-node";
    
    const thumbSrc = item.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect width='44' height='44' fill='%23111'/></svg>";

    row.innerHTML = `
      <div class="item-leading-rank-index"><span>#</span>${item.rank}</div>
      <div class="item-core-title-label">${item.name}</div>
      <a href="${item.link}" target="_blank" class="item-anchor-reference-link">Reference Link</a>
      <img src="${thumbSrc}" class="item-circular-thumbnail-frame">
      <div style="display:flex; gap:12px;">
        <span style="cursor:pointer;" onclick="triggerItemEditWizard(${index})">✏️</span>
        <span style="cursor:pointer;" onclick="triggerItemRemovalWizard(${index})">🗑️</span>
      </div>
    `;
    target.appendChild(row);
  });
}

function triggerItemEditWizard(index) {
  const item = state.vault[state.activeCategoryContext][index];
  const newName = prompt("Modify item title context name:", item.name);
  if(newName) {
    item.name = newName.trim();
    item.link = generateAutomatedAffiliateLink(item.name);
    renderItemsLinearStack();
    performCloudSynchronizeSequence();
  }
}

function triggerItemRemovalWizard(index) {
  state.vault[state.activeCategoryContext].splice(index, 1);
  renderItemsLinearStack();
  performCloudSynchronizeSequence();
}

// Social Networking Layer Logic System
function renderFriendsRosterStack() {
  const target = document.getElementById("friends-roster-stack-target-output");
  target.innerHTML = "";

  state.friends.forEach(friend => {
    const row = document.createElement("div");
    row.className = "item-row-wrapper-node";
    
    let commonCategoriesCount = 0;
    let commonItemsCount = 0;

    Object.keys(state.vault).forEach(userCat => {
      if (friend.vault && friend.vault[userCat]) {
        commonCategoriesCount++;
        const friendItems = friend.vault[userCat];
        state.vault[userCat].forEach(userItem => {
          if (friendItems.some(fi => fi.name.toLowerCase().trim() === userItem.name.toLowerCase().trim())) {
            commonItemsCount++;
          }
        });
      }
    });

    const friendAvatar = friend.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><circle cx='22' cy='22' r='20' fill='%23222'/></svg>";

    row.innerHTML = `
      <div class="item-core-title-label" style="color:var(--gold-primary);">${friend.name}</div>
      <div style="font-size:12px; color:var(--text-muted);">Shared Categories: ${commonCategoriesCount}</div>
      <div style="font-size:12px; color:var(--text-muted);">Shared Items: ${commonItemsCount}</div>
      <img src="${friendAvatar}" class="item-circular-thumbnail-frame">
    `;
    target.appendChild(row);
  });
}

function triggerFriendSearchInterfacePopupWizard() {
  const targetQuery = prompt("Query network profile database directory handle string:");
  if (!targetQuery) return;

  fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(targetQuery)}`)
    .then(res => res.json())
    .then(results => {
      if(results.length === 0) {
        triggerSystemModalAlert("EMPTY SET", "No visible records match the string queries.");
        return;
      }
      const potentialFriend = results[0];
      triggerSystemModalAlert("PROFILE MATRIX FOUND", `Connect profile reference [${potentialFriend.name}] to account hierarchy matrix trees?`, "APPEND LINK VECTOR", () => {
        state.friends.push(potentialFriend);
        renderFriendsRosterStack();
        performCloudSynchronizeSequence();
      });
    });
}

// Cross-Network Aggregation and Fusion Mathematics Engines
window.triggerCompareFlow = function(categoryName) {
  const potentialMatches = state.friends.filter(f => f.vault && f.vault[categoryName]);
  if(potentialMatches.length === 0) {
    triggerSystemModalAlert("NO NETWORK OVERLAP", "No connecting peer matrices contain parsing nodes matching this specific signature.");
    return;
  }

  // Auto-checks dynamic cluster overlap mappings down up to 26 peers automatically
  const targetedColumns = [{ name: "Your Vault (Self)", items: state.vault[categoryName] || [] }];
  potentialMatches.slice(0, 26).forEach(match => {
    targetedColumns.push({ name: `${match.name}'s Vault`, items: match.vault[categoryName] });
  });

  routeToView("view-compare-matrix");
  document.getElementById("compare-matrix-heading").innerText = `NETWORK TRANS-COMPARISON MATRIX: ${categoryName.toUpperCase()}`;
  
  const container = document.getElementById("compare-matrix-horizontal-scroll-container");
  container.innerHTML = "";

  targetedColumns.forEach(column => {
    const colPanel = document.createElement("div");
    colPanel.className = "comparison-column-panel";
    
    let collectionRowsHTML = "";
    const sortedItems = [...column.items].sort((a,b) => a.rank - b.rank);

    for (let r = 1; r <= 10; r++) {
      const found = sortedItems.find(i => parseInt(i.rank) === r);
      collectionRowsHTML += `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.02); font-size:13px;">
          <span style="color:var(--gold-primary); font-weight:700;">#${r}</span>
          <span style="color:#ffffff; text-align:right;">${found ? found.name : '---'}</span>
        </div>
      `;
    }

    colPanel.innerHTML = `
      <h3 style="font-family:var(--font-serif); color:var(--neon-blue); font-size:15px; text-align:center; margin-bottom:16px; border-bottom:1px solid var(--border-dark); padding-bottom:8px;">${column.name}</h3>
      <div>${collectionRowsHTML}</div>
    `;
    container.appendChild(colPanel);
  });
};

window.triggerFuseFlow = function(categoryName) {
  const eligiblePeers = state.friends.filter(f => f.vault && f.vault[categoryName]);
  
  routeToView("view-algorithmic-fuse");
  document.getElementById("fuse-consolidation-heading").innerText = `FUSED MASTER WEIGHT CONSOLIDATION: ${categoryName.toUpperCase()}`;
  
  const outputContainer = document.getElementById("fuse-consolidation-stack-output");
  outputContainer.innerHTML = "";

  // Map Scoring Formula Initialization Loop
  const compoundWeightScores = {};

  function processCollectionMatrix(arr) {
    if (!arr) return;
    arr.forEach(item => {
      const key = item.name.trim();
      if (!key) return;
      // Weight Formula: Inverse Rank Positional Scale positional metric tracking formula
      const positionalValue = (11 - parseInt(item.rank));
      if (!compoundWeightScores[key]) {
        compoundWeightScores[key] = { totalScore: 0, occurrences: 0, link: item.link, media: item.media };
      }
      compoundWeightScores[key].totalScore += positionalValue;
      compoundWeightScores[key].occurrences += 1;
    });
  }

  processCollectionMatrix(state.vault[categoryName]);
  eligiblePeers.forEach(peer => processCollectionMatrix(peer.vault[categoryName]));

  const compiledAggregationList = [];
  for (let identifier in compoundWeightScores) {
    const node = compoundWeightScores[identifier];
    compiledAggregationList.push({
      name: identifier,
      score: node.totalScore / node.occurrences,
      link: node.link,
      media: node.media
    });
  }

  // Mathematical sorting sequence configuration mapping metrics across descending float weights
  compiledAggregationList.sort((a,b) => b.score - a.score);
  const finalTopTenOutput = compiledAggregationList.slice(0, 10);

  if (finalTopTenOutput.length === 0) {
    outputContainer.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No dataset intersections discovered. Mapping sequence terminated.</div>`;
    return;
  }

  finalTopTenOutput.forEach((fusedItem, idx) => {
    const row = document.createElement("div");
    row.className = "item-row-wrapper-node";
    const thumbSrc = fusedItem.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect width='44' height='44' fill='%23222'/></svg>";

    row.innerHTML = `
      <div class="item-leading-rank-index" style="color:var(--gold-primary);"><span>#</span>${idx + 1}</div>
      <div class="item-core-title-label">${fusedItem.name} <span style="font-size:12px; color:var(--text-muted); font-weight:normal; margin-left:12px;">(Weight Vector Score: ${fusedItem.score.toFixed(2)})</span></div>
      <a href="${fusedItem.link}" target="_blank" class="item-anchor-reference-link">Reference Link</a>
      <img src="${thumbSrc}" class="item-circular-thumbnail-frame">
    `;
    outputContainer.appendChild(row);
  });
};