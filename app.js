/**
 * Top Tens - Production Front-End Orchestration & Synchronous State Engine
 * Directory: D:/top-tens/frontend/app.js
 */

const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";

let state = {
  userToken: null,
  isGuest: true,
  currentView: "view-landing",
  viewHistory: ["view-landing"],
  activeCategoryContext: null,
  tier: "free",
  profile: { fullName: "", dob: "", hometown: "", vocation: "", email: "", recovery: "", avatar: "", isPublic: true },
  vault: JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET)),
  friends: []
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigationInterceptors();
  setupAuthMechanics();
  setupProfileMechanics();
  setupSettingsMechanics();
  setupCollectionMechanics();
  evaluateUrlParameters();
});

function routeToView(viewId) {
  state.currentView = viewId;
  if (state.viewHistory[state.viewHistory.length - 1] !== viewId) {
    state.viewHistory.push(viewId);
  }

  document.querySelectorAll(".router-view").forEach(el => el.classList.remove("active"));
  const activeViewEl = document.getElementById(viewId);
  if (activeViewEl) activeViewEl.classList.add("active");

  const header = document.getElementById("global-app-header");
  if (viewId === "view-landing") {
    header.style.display = "none";
  } else {
    header.style.display = "flex";
  }
  
  if (viewId === "view-categories") renderCategoriesGridMatrix();
  if (viewId === "view-items-stack") renderItemsLinearStack();
  if (viewId === "view-friends-roster") renderFriendsRosterStack();
}

function setupNavigationInterceptors() {
  document.getElementById("header-back-control").addEventListener("click", () => {
    if (state.viewHistory.length > 1) {
      state.viewHistory.pop(); // Drop active index boundary
      const prevView = state.viewHistory.pop(); // Pop tracking history safely
      routeToView(prevView);
    } else {
      routeToView("view-landing");
    }
  });

  document.getElementById("btn-enter-vault-guest").addEventListener("click", () => {
    state.isGuest = true;
    state.tier = "free";
    state.vault = JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET));
    routeToView("view-categories");
  });
}

function uiOpenDrawer(drawerId) {
  document.getElementById("drawer-backdrop-shutter-layer").style.display = "block";
  document.getElementById(drawerId).classList.add("open");
}

function uiCloseActiveDrawer() {
  document.getElementById("drawer-backdrop-shutter-layer").style.display = "none";
  document.querySelectorAll(".universal-slide-out-drawer").forEach(el => el.classList.remove("open"));
}

document.getElementById("drawer-backdrop-shutter-layer").addEventListener("click", uiCloseActiveDrawer);

function triggerSystemModalAlert(heading, bodyText, primaryActionText = "OK", primaryCallback = null, secondaryActionText = null, secondaryCallback = null) {
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

function setupAuthMechanics() {
  document.getElementById("btn-trigger-auth-drawer").addEventListener("click", () => uiOpenDrawer("drawer-auth"));
  
  const passwordField = document.getElementById("auth-password-field");
  document.getElementById("auth-password-reveal-toggle-btn").addEventListener("click", () => {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  });

  function validatePasswordComplexity(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(pw);
  }

  document.getElementById("btn-execute-signup-challenge").addEventListener("click", async () => {
    const email = document.getElementById("auth-email-field").value.trim();
    const password = passwordField.value;

    if (!email || !validatePasswordComplexity(password)) {
      triggerSystemModalAlert("COMPLIANCE EXCEPTION", "Password configuration fails parameters validation requirements.");
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

      triggerSystemModalAlert("VERIFICATION SENT", "Check email inbox for activation link token to complete system verification setup.");
      uiCloseActiveDrawer();
    } catch (err) {
      triggerSystemModalAlert("REGISTRATION EXCEPTION", err.message);
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
      triggerSystemModalAlert("AUTHENTICATION ERROR", err.message);
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
    console.error("Sync pipeline throughput serialization exception logic execution drop.");
  }
}

function evaluateUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("verified") === "true") {
    triggerSystemModalAlert("VERIFIED", "Account node validated successfully. Use credentials parameters inside the portal drawer.");
    uiOpenDrawer("drawer-auth");
    document.getElementById("auth-email-field").value = params.get("email") || "";
  }
}

function setupProfileMechanics() {
  document.getElementById("header-profile-avatar-trigger").addEventListener("click", () => uiOpenDrawer("drawer-profile"));
  
  document.getElementById("profile-avatar-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      triggerSystemModalAlert("CONFIRM CHANNELS", "Publish avatar adjustment layout window configurations?", "COMMIT", () => {
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
    e.target.innerText = state.profile.isPublic ? "Profile Public" : "Profile Private";
    e.target.classList.toggle("toggle-active");
  });

  document.getElementById("btn-commit-profile-mutations").addEventListener("click", () => {
    state.profile.fullName = document.getElementById("profile-fullname-field").value;
    state.profile.dob = document.getElementById("profile-dob-field").value;
    state.profile.hometown = document.getElementById("profile-hometown-field").value;
    state.profile.vocation = document.getElementById("profile-vocation-field").value;
    state.profile.recovery = document.getElementById("profile-recovery-field").value;
    
    document.querySelectorAll("#drawer-profile input").forEach(input => { if(input.id !== "profile-email-field") input.disabled = true; });
    performCloudSynchronizeSequence();
    uiCloseActiveDrawer();
  });
}

function uiUnlockField(id) {
  document.getElementById(id).disabled = false;
  document.getElementById(id).focus();
}

function setupSettingsMechanics() {
  document.getElementById("header-burger-control").addEventListener("click", () => uiOpenDrawer("drawer-settings"));
  
  document.getElementById("btn-toggle-ui-color-theme").addEventListener("click", (e) => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");
    e.target.innerText = body.classList.contains("light-mode") ? "Dark Mode" : "Light Mode";
  });

  document.getElementById("btn-trigger-tier-upgrade").addEventListener("click", () => {
    triggerSystemModalAlert("UPGRADE CORES", "Extend bandwidth thresholds up to 99 customized arrays?", "UPGRADE", () => {
      state.tier = "premium";
      document.getElementById("tier-allocation-text").innerText = `Tier Allocation Matrix: ${Object.keys(state.vault).length} / 99 Slots Used`;
      performCloudSynchronizeSequence();
    });
  });

  document.getElementById("btn-settings-route-to-friends-search").addEventListener("click", () => { uiCloseActiveDrawer(); routeToView("view-friends-roster"); setTimeout(() => triggerFriendSearchInterfacePopupWizard(), 300); });
  document.getElementById("btn-settings-route-to-friends-page").addEventListener("click", () => { uiCloseActiveDrawer(); routeToView("view-friends-roster"); });

  document.getElementById("btn-trigger-vault-wipe-sequence").addEventListener("click", () => {
    triggerSystemModalAlert("ARE YOU SURE?", "This runtime action clears storage nodes and defaults matrices.", "CONFIRM WIPE", () => {
      state.vault = JSON.parse(JSON.stringify(TOP_TENS_STOCK_DATASET));
      performCloudSynchronizeSequence();
      routeToView("view-categories");
    }, "ABORT", null);
  });
}

function setupCollectionMechanics() {
  document.getElementById("btn-add-custom-category-wizard").addEventListener("click", () => {
    const activeLimit = state.tier === "premium" ? 99 : 21;
    if (Object.keys(state.vault).length >= activeLimit) {
      triggerSystemModalAlert("LIMIT REACHED", "Upgrade profile layer bandwidth tiers.");
      return;
    }

    const catName = prompt("Enter Custom Category Name/Title:");
    if (catName && catName.trim()) {
      const trimmed = catName.trim();
      if (!state.vault[trimmed]) {
        state.vault[trimmed] = [];
        renderCategoriesGridMatrix();
        performCloudSynchronizeSequence();
      }
    }
  });

  document.getElementById("btn-commit-item-row").addEventListener("click", () => {
    const titleField = document.getElementById("input-item-title-field");
    const rankField = document.getElementById("input-item-rank-field");
    const fileField = document.getElementById("input-item-media-field");

    const name = titleField.value.trim();
    const rank = parseInt(rankField.value);

    if (!name || isNaN(rank) || rank < 1 || rank > 10) {
      triggerSystemModalAlert("VALIDATION EXCEPTION", "Input properties error bounds mapping checks.");
      return;
    }

    const itemsCollection = state.vault[state.activeCategoryContext] || [];
    if (itemsCollection.length >= 10) {
      triggerSystemModalAlert("VAULT FULL", "Maximum limits capped explicitly at 10 indexing arrays.");
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
  const newName = prompt("Modify category index configuration array handle:", oldName);
  if (newName && newName.trim() && newName !== oldName) {
    state.vault[newName.trim()] = state.vault[oldName];
    delete state.vault[oldName];
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  }
}

function triggerRemoveCategoryWizard(name) {
  triggerSystemModalAlert("CONFIRM REMOVAL", `Drop category node tree allocation [${name}] permanently?`, "DROP NODE", () => {
    delete state.vault[name];
    renderCategoriesGridMatrix();
    performCloudSynchronizeSequence();
  });
}

function renderItemsLinearStack() {
  const target = document.getElementById("items-linear-stack-target-output");
  target.innerHTML = "";
  
  const items = state.vault[state.activeCategoryContext] || [];
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
      <div style="display:flex; gap:12px; z-index:20;">
        <span style="cursor:pointer;" onclick="triggerItemEditWizard(${index})">✏️</span>
        <span style="cursor:pointer;" onclick="triggerItemRemovalWizard(${index})">🗑️</span>
      </div>
    `;
    target.appendChild(row);
  });
}

function triggerItemEditWizard(index) {
  const item = state.vault[state.activeCategoryContext][index];
  const newName = prompt("Modify element identity string name mapping:", item.name);
  if (newName) {
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

function renderFriendsRosterStack() {
  const target = document.getElementById("friends-roster-stack-target-output");
  target.innerHTML = "";

  if (state.friends.length === 0) {
    target.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">Friends database configuration links empty.</div>`;
    return;
  }

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
  const targetQuery = prompt("Search for friends by username handle:");
  if (!targetQuery) return;

  fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(targetQuery)}`)
    .then(res => res.json())
    .then(results => {
      if (results.length === 0) {
        triggerSystemModalAlert("NO RECORDS", "No matching public profiles verified.");
        return;
      }
      const potentialFriend = results[0];
      triggerSystemModalAlert("FOUND MATCH", `Add profile layer vector link [${potentialFriend.name}]?`, "ADD", () => {
        state.friends.push(potentialFriend);
        renderFriendsRosterStack();
        performCloudSynchronizeSequence();
      });
    });
}

window.triggerCompareFlow = function(categoryName) {
  const potentialMatches = state.friends.filter(f => f.vault && f.vault[categoryName]);
  
  const targetedColumns = [{ name: "Your Vault (Self)", items: state.vault[categoryName] || [] }];
  potentialMatches.slice(0, 26).forEach(match => {
    targetedColumns.push({ name: `${match.name}'s Vault`, items: match.vault[categoryName] });
  });

  routeToView("view-compare-matrix");
  document.getElementById("compare-matrix-heading").innerText = `Network Trans-Comparison Matrix: ${categoryName.toUpperCase()}`;
  
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
  
  routeToView("view-fuse-consolidation");
  document.getElementById("fuse-consolidation-heading").innerText = `Fused Master Weight Consolidation: ${categoryName.toUpperCase()}`;
  
  const outputContainer = document.getElementById("fuse-consolidation-stack-output");
  outputContainer.innerHTML = "";

  const compoundWeightScores = {};

  function processCollectionMatrix(arr) {
    if (!arr) return;
    arr.forEach(item => {
      const key = item.name.trim();
      if (!key) return;
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

  compiledAggregationList.sort((a,b) => b.score - a.score);
  const finalTopTenOutput = compiledAggregationList.slice(0, 10);

  if (finalTopTenOutput.length === 0) {
    outputContainer.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No common network metrics to compute.</div>`;
    return;
  }

  finalTopTenOutput.forEach((fusedItem, idx) => {
    const row = document.createElement("div");
    row.className = "item-row-wrapper-node";
    const thumbSrc = fusedItem.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect width='44' height='44' fill='%23222'/></svg>";

    row.innerHTML = `
      <div class="item-leading-rank-index" style="color:var(--gold-primary);"><span>#</span>${idx + 1}</div>
      <div class="item-core-title-label">${fusedItem.name} <span style="font-size:12px; color:var(--text-muted); font-weight:normal; margin-left:12px;">(Score: ${fusedItem.score.toFixed(2)})</span></div>
      <a href="${fusedItem.link}" target="_blank" class="item-anchor-reference-link">Reference Link</a>
      <img src="${thumbSrc}" class="item-circular-thumbnail-frame">
    `;
    outputContainer.appendChild(row);
  });
};