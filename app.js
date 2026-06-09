(function() {
  const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";

  // Core Dynamic Application State Variables Tracking Matrix
  let appState = {
    userToken: localStorage.getItem("vault_token") || null,
    userEmail: localStorage.getItem("vault_email") || null,
    isPremium: localStorage.getItem("vault_premium") === "true",
    categories: [],
    profile: {
      name: "Guest User", dob: "", hometown: "", vocation: "", email: "", recovery: "", public: true, avatar: ""
    },
    friendsList: [
      { name: "AlphaRanker", mutualCats: 1, mutualItems: 9, avatar: "" },
      { name: "CryptoCollector", mutualCats: 1, mutualItems: 9, avatar: "" },
      { name: "OmegaLister", mutualCats: 0, mutualItems: 0, avatar: "" }
    ],
    currentView: "viewLanding",
    viewHistory: [],
    activeCategoryContextId: null,
    avatarCropBlob: null
  };

  // DOM Elements Caching Vector Mapping Matrix
  const views = {
    landing: document.getElementById("viewLanding"),
    categories: document.getElementById("viewCategories"),
    items: document.getElementById("viewListItems"),
    friends: document.getElementById("viewFriends"),
    analytics: document.getElementById("viewAnalyticsMatrix")
  };

  const globalHeader = document.getElementById("globalHeader");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const toastNotification = document.getElementById("toastNotification");
  const modalShade = document.getElementById("popupModalShade");

  /* ================= RUNTIME CORE BOOT INITIALIZATION ================= */
  async function initApplication() {
    setupGlobalEventListeners();
    setupBrowserHistoryListeners();
    handleUrlVerificationMetrics();
    
    if (appState.userToken) {
      showToast("Recovering authenticated edge synchronization session...");
      const pulled = await pullVaultStateFromEdge();
      if (pulled) {
        transitionToView("viewCategories");
        return;
      }
    }
    
    // Default Fallback to Base Schema Models Configuration Setup
    loadDefaultGuestFallbackState();
  }

  function loadDefaultGuestFallbackState() {
    appState.categories = JSON.parse(JSON.stringify(defaultStockCategories));
    appState.profile.name = "Guest User";
    appState.profile.email = "guest@toptens.internal";
    syncInterfaceStateElements();
  }

  function syncInterfaceStateElements() {
    document.getElementById("profName").value = appState.profile.name;
    document.getElementById("profDob").value = appState.profile.dob;
    document.getElementById("profHometown").value = appState.profile.hometown;
    document.getElementById("profVocation").value = appState.profile.vocation;
    document.getElementById("profEmail").value = appState.userEmail || appState.profile.email;
    document.getElementById("profRecovery").value = appState.profile.recovery;

    const headerAv = document.getElementById("headerAvatarPreview");
    const drawAv = document.getElementById("drawerAvatarPreviewFrame");
    const avSrc = appState.profile.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23c49333' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
    headerAv.style.backgroundImage = `url('${avSrc}')`;
    drawAv.style.backgroundImage = `url('${avSrc}')`;
  }

  /* ================= VIEW ENGINE ROUTER NAVIGATION ================= */
  function transitionToView(targetViewId, isPopStateNavigation = false) {
    Object.keys(views).forEach(k => views[k].classList.add("hidden"));
    document.getElementById("appMainViewport").classList.add("hidden");
    globalHeader.classList.add("hidden");

    if (targetViewId === "viewLanding") {
      views.landing.classList.remove("hidden");
      appState.viewHistory = [];
    } else {
      globalHeader.classList.remove("hidden");
      document.getElementById("appMainViewport").classList.remove("hidden");
      document.getElementById(targetViewId).classList.remove("hidden");
      
      if (appState.currentView !== targetViewId && !isPopStateNavigation) {
        appState.viewHistory.push(appState.currentView);
      }
    }

    // Push state tracking into browser address log metrics if navigation is code-driven
    if (!isPopStateNavigation) {
      if (history.state?.view !== targetViewId) {
        history.pushState({ view: targetViewId }, "", `#${targetViewId}`);
      }
    }

    appState.currentView = targetViewId;
    closeAllDrawers();

    if (targetViewId === "viewCategories") renderCategoriesGrid();
    if (targetViewId === "viewListItems") renderItemsVerticalStack();
    if (targetViewId === "viewFriends") renderFriendsStack();
  }

  function handleGlobalBackNavigation() {
    if (appState.viewHistory.length > 0) {
      const prev = appState.viewHistory.pop();
      // Ensure we bypass duplicate loops directly
      if (prev === appState.currentView) {
        handleGlobalBackNavigation();
        return;
      }
      // Trigger native browser back mutation to sync state timeline records
      history.back();
    } else {
      transitionToView("viewLanding");
    }
  }

  /* ================= BROWSER INTERCEPT AND STATE CAPTURE ENGINE ================= */
  function setupBrowserHistoryListeners() {
    // Intercept native backward/forward steps
    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.view) {
        // Sync app state history arrays safely on back manipulation
        if (appState.viewHistory.length > 0) {
          appState.viewHistory.pop();
        }
        transitionToView(event.state.view, true);
      } else {
        // Fallback ground floor baseline initialization
        transitionToView("viewLanding", true);
      }
    });

    // Establish base tracking metrics for initial viewport execution instances
    if (!history.state) {
      history.replaceState({ view: "viewLanding" }, "", "#viewLanding");
    }
  }

  /* ================= SYSTEM DATA RENDER MATRICES ================= */
  function renderCategoriesGrid() {
    const grid = document.getElementById("categoriesGridContainer");
    grid.innerHTML = "";

    appState.categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "category-tab-card";
      
      card.innerHTML = `
        <div class="category-icon-emoji">${cat.emoji || "📂"}</div>
        <div class="category-title">${cat.name}</div>
        <div class="category-count-label">(${cat.items.length} items)</div>
        <div class="card-functional-row">
          <button class="card-action-stub-btn btn-compare-trigger" data-id="${cat.id}">Compare</button>
          <button class="card-action-stub-btn btn-fuse-trigger" data-id="${cat.id}">Fuse</button>
          <button class="card-action-stub-btn btn-privacy-trigger" data-id="${cat.id}">
            ${cat.isPublic ? "Public" : "Private"}
          </button>
        </div>
        <div class="card-inline-management-icon-row">
          <span class="btn-edit-cat" data-id="${cat.id}">✏️</span>
          <span class="btn-remove-cat" data-id="${cat.id}">🗑️</span>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest(".card-inline-management-icon-row")) return;
        appState.activeCategoryContextId = cat.id;
        transitionToView("viewListItems");
      });

      grid.appendChild(card);
    });

    // Wire up category action bindings dynamically
    grid.querySelectorAll(".btn-compare-trigger").forEach(b => b.addEventListener("click", (e) => triggerCompareFlow(e.target.dataset.id)));
    grid.querySelectorAll(".btn-fuse-trigger").forEach(b => b.addEventListener("click", (e) => triggerFuseFlow(e.target.dataset.id)));
    grid.querySelectorAll(".btn-privacy-trigger").forEach(b => b.addEventListener("click", (e) => {
      const c = appState.categories.find(x => x.id === e.target.dataset.id);
      c.isPublic = !c.isPublic;
      showToast(`Category visibility shifted to: ${c.isPublic ? "Public" : "Private"}`);
      renderCategoriesGrid();
      persistStateToCloudEngine();
    }));
    grid.querySelectorAll(".btn-edit-cat").forEach(b => b.addEventListener("click", (e) => triggerEditCategory(e.target.dataset.id)));
    grid.querySelectorAll(".btn-remove-cat").forEach(b => b.addEventListener("click", (e) => triggerRemoveCategory(e.target.dataset.id)));
  }

  function renderItemsVerticalStack() {
    const currentCat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    if (!currentCat) return;

    document.getElementById("activeCategoryTitleLabel").innerText = currentCat.name.toUpperCase();
    const stack = document.getElementById("listItemsVerticalStack");
    stack.innerHTML = "";

    // Strictly sort list positions ascending down the stack line array
    const sortedItems = [...currentCat.items].sort((a,b) => a.rank - b.rank).slice(0, 10);

    sortedItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "item-horizontal-row";
      
      const thumbSrc = item.media || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%231d2636' viewBox='0 0 24 24'><rect width='24' height='24'/></svg>";

      row.innerHTML = `
        <div class="item-row-left-group">
          <span class="item-prominent-hashtag">#${item.rank}</span>
          <span class="item-display-title">${item.name}</span>
        </div>
        <a href="${item.link}" target="_blank" class="item-affiliate-deep-link">Reference Link</a>
        <div class="item-row-left-group">
          <div class="item-media-circle-thumbnail" style="background-image: url('${thumbSrc}')"></div>
          <span class="edit-item-trigger common-btn-pointer" data-rank="${item.rank}">✏️</span>
          <span class="remove-item-trigger common-btn-pointer" data-rank="${item.rank}">🗑️</span>
        </div>
      `;
      stack.appendChild(row);
    });

    stack.querySelectorAll(".edit-item-trigger").forEach(b => b.addEventListener("click", (e) => triggerEditItem(e.target.dataset.rank)));
    stack.querySelectorAll(".remove-item-trigger").forEach(b => b.addEventListener("click", (e) => triggerRemoveItem(e.target.dataset.rank)));
  }

  function renderFriendsStack() {
    const stack = document.getElementById("friendsVerticalStack");
    stack.innerHTML = "";

    appState.friendsList.forEach((fr, idx) => {
      const row = document.createElement("div");
      row.className = "friend-horizontal-row";
      const dummyAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23c49333' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/></svg>";
      
      row.innerHTML = `
        <div class="item-row-left-group">
          <span class="item-display-title">${fr.name}</span>
        </div>
        <span class="item-affiliate-deep-link">Mutual Categories: ${fr.mutualCats}</span>
        <span class="item-affiliate-deep-link">Mutual Items: ${fr.mutualItems}</span>
        <div class="item-row-left-group">
          <div class="item-media-circle-thumbnail" style="background-image: url('${fr.avatar || dummyAvatar}')"></div>
          <span class="edit-friend-trigger common-btn-pointer" data-idx="${idx}">✏️</span>
          <span class="remove-friend-trigger common-btn-pointer" data-idx="${idx}">🗑️</span>
        </div>
      `;
      stack.appendChild(row);
    });

    // Wire up friend management action bindings dynamically
    stack.querySelectorAll(".edit-friend-trigger").forEach(b => b.addEventListener("click", (e) => triggerEditFriend(e.target.dataset.idx)));
    stack.querySelectorAll(".remove-friend-trigger").forEach(b => b.addEventListener("click", (e) => triggerRemoveFriend(e.target.dataset.idx)));
  }

  /* ================= MATH ALGORITHMIC INJECTORS (COMPARE & FUSE) ================= */
  function triggerCompareFlow(categoryId) {
    const targetCat = appState.categories.find(c => c.id === categoryId);
    const boxStack = document.getElementById("friendSelectionCheckboxStack");
    boxStack.innerHTML = "";
    
    document.getElementById("friendModalActionHeadline").innerText = `Compare: ${targetCat.name}`;
    appState.friendsList.forEach(f => {
      boxStack.innerHTML += `
        <div class="modal-selection-item">
          <input type="checkbox" name="friendCompareTargets" value="${f.name}" id="chk_${f.name}">
          <label for="chk_${f.name}">${f.name}</label>
        </div>
      `;
    });

    openModalWindow("compare", categoryId);
  }

  function executeComparisonMatrixCalculation(categoryId, chosenFriends) {
    transitionToView("viewAnalyticsMatrix");
    document.getElementById("analyticsViewHeadline").innerText = `Juxtaposed Comparisons Matrix`;
    const box = document.getElementById("analyticsOutputContainer");
    box.innerHTML = "";

    const masterTable = document.createElement("table");
    masterTable.className = "analytics-grid-data-table";
    
    let headingRow = `<tr><th>Rank Position</th><th>Your List</th>`;
    chosenFriends.forEach(f => { headingRow += `<th>${f}'s Vault Variant</th>`; });
    headingRow += `</tr>`;
    masterTable.innerHTML += headingRow;

    const myCat = appState.categories.find(c => c.id === categoryId);

    for (let r = 1; r <= 10; r++) {
      const myItem = myCat.items.find(i => i.rank === r)?.name || "—";
      let rowHtml = `<tr><td><strong>#${r}</strong></td><td>${myItem}</td>`;
      chosenFriends.forEach(f => {
        rowHtml += `<td>Simulated ${myCat.name} Node Match</td>`;
      });
      rowHtml += `</tr>`;
      masterTable.innerHTML += rowHtml;
    }

    box.appendChild(masterTable);
  }

  function triggerFuseFlow(categoryId) {
    const targetCat = appState.categories.find(c => c.id === categoryId);
    const boxStack = document.getElementById("friendSelectionCheckboxStack");
    boxStack.innerHTML = "";
    
    document.getElementById("friendModalActionHeadline").innerText = `Weight-Fuse: ${targetCat.name}`;
    appState.friendsList.forEach(f => {
      boxStack.innerHTML += `
        <div class="modal-selection-item">
          <input type="checkbox" name="friendCompareTargets" value="${f.name}" id="chk_${f.name}">
          <label for="chk_${f.name}">${f.name} (Weight: 1.0)</label>
        </div>
      `;
    });

    openModalWindow("fuse", categoryId);
  }

  function executeFusedMatrixFormula(categoryId, chosenFriends) {
    transitionToView("viewAnalyticsMatrix");
    document.getElementById("analyticsViewHeadline").innerText = `Fused Master List Analytics`;
    const box = document.getElementById("analyticsOutputContainer");
    box.innerHTML = "";

    const myCat = appState.categories.find(c => c.id === categoryId);
    const scoringMap = {};

    myCat.items.forEach(item => {
      const score = 11 - item.rank;
      scoringMap[item.name] = (scoringMap[item.name] || 0) + score;
    });

    chosenFriends.forEach(f => {
      myCat.items.forEach((item, idx) => {
        if (idx < 7) { 
          const simulatedRank = ((idx + 3) % 10) + 1;
          const score = 11 - simulatedRank;
          scoringMap[item.name] = (scoringMap[item.name] || 0) + score;
        }
      });
    });

    const sortedFused = Object.keys(scoringMap).map(name => ({
      name, score: scoringMap[name]
    })).sort((a,b) => b.score - a.score).slice(0, 10);

    const orderedList = document.createElement("ol");
    orderedList.className = "analytics-fused-list";
    sortedFused.forEach((item, idx) => {
      orderedList.innerHTML += `<li><strong>${item.name}</strong> — Aggregated Linear Matrix Score: ${item.score} points</li>`;
    });

    box.appendChild(orderedList);
  }

  /* ================= SYSTEM LEVEL DATA MUTATION METHODS ================= */
  function triggerEditCategory(catId) {
    const cat = appState.categories.find(c => c.id === catId);
    const newName = prompt("Enter updated category title name:", cat.name);
    if (newName && newName.trim() !== "") {
      cat.name = newName.trim();
      renderCategoriesGrid();
      persistStateToCloudEngine();
    }
  }

  function triggerRemoveCategory(catId) {
    if (confirm("Are you sure you want to drop this custom item profile track?")) {
      appState.categories = appState.categories.filter(c => c.id !== catId);
      renderCategoriesGrid();
      persistStateToCloudEngine();
    }
  }

  document.getElementById("btnCommitAddItem").addEventListener("click", () => {
    const nameIn = document.getElementById("inputItemName");
    const rankIn = document.getElementById("inputItemRank");
    const fileIn = document.getElementById("inputItemFile");

    const rankVal = parseInt(rankIn.value);
    if (!nameIn.value || isNaN(rankVal) || rankVal < 1 || rankVal > 10) {
      showToast("Verification Error: Confirm valid input parameters (Rank limits 1-10)");
      return;
    }

    const targetCat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    
    targetCat.items = targetCat.items.filter(i => i.rank !== rankVal);

    const rootDomain = nameIn.value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const generatedAffiliateUrl = `https://${rootDomain || 'vault'}.com/tracking?affid=toptens26`;

    const newItemObj = {
      rank: rankVal,
      name: nameIn.value.trim(),
      media: "",
      link: generatedAffiliateUrl
    };

    if (fileIn.files && fileIn.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        newItemObj.media = e.target.result;
        targetCat.items.push(newItemObj);
        finalizeRender();
      };
      reader.readAsDataURL(fileIn.files[0]);
    } else {
      targetCat.items.push(newItemObj);
      finalizeRender();
    }

    function finalizeRender() {
      nameIn.value = "";
      rankIn.value = "";
      fileIn.value = "";
      renderItemsVerticalStack();
      persistStateToCloudEngine();
      showToast("Vault Item Track Position committed successfully.");
    }
  });

  function triggerEditItem(rankStr) {
    const rank = parseInt(rankStr);
    const cat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    const item = cat.items.find(i => i.rank === rank);
    const newTitle = prompt(`Update item title name for #${rank}:`, item.name);
    if (newTitle && newTitle.trim() !== "") {
      item.name = newTitle.trim();
      renderItemsVerticalStack();
      persistStateToCloudEngine();
    }
  }

  function triggerRemoveItem(rankStr) {
    const rank = parseInt(rankStr);
    const cat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    if (confirm(`Purge rank variant allocation row #${rank}?`)) {
      cat.items = cat.items.filter(i => i.rank !== rank);
      renderItemsVerticalStack();
      persistStateToCloudEngine();
    }
  }

  function triggerEditFriend(indexStr) {
    const idx = parseInt(indexStr);
    const friend = appState.friendsList[idx];
    if (!friend) return;

    const newName = prompt(`Update friend identifier name:`, friend.name);
    if (newName && newName.trim() !== "") {
      friend.name = newName.trim();
      renderFriendsStack();
      persistStateToCloudEngine();
      showToast("Friend directory mapping updated.");
    }
  }

  function triggerRemoveFriend(indexStr) {
    const idx = parseInt(indexStr);
    const friend = appState.friendsList[idx];
    if (!friend) return;

    if (confirm(`Sever network link and purge correlation tracking with ${friend.name}?`)) {
      appState.friendsList.splice(idx, 1);
      renderFriendsStack();
      persistStateToCloudEngine();
      showToast("Friend entity reference dropped cleanly.");
    }
  }

  /* ================= BACKEND CLOUDFLARE CLOUD NETWORK SYNC CONNECTOR ================= */
  async function persistStateToCloudEngine() {
    if (!appState.userToken) {
      localStorage.setItem("guest_categories_cache", JSON.stringify(appState.categories));
      return;
    }

    try {
      await fetch(`${API_BASE}/api/vault/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${appState.userToken}`
        },
        body: JSON.stringify({ state: { categories: appState.categories, profile: appState.profile, friendsList: appState.friendsList } })
      });
    } catch (err) {
      console.error("Synchronizer network handshake interrupted:", err);
    }
  }

  async function pullVaultStateFromEdge() {
    try {
      const res = await fetch(`${API_BASE}/api/vault/pull`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${appState.userToken}` }
      });
      if (res.status === 200) {
        const cloudState = await res.json();
        if (cloudState.categories) appState.categories = cloudState.categories;
        if (cloudState.profile) appState.profile = cloudState.profile;
        if (cloudState.friendsList) appState.friendsList = cloudState.friendsList;
        syncInterfaceStateElements();
        return true;
      }
    } catch {
      showToast("Edge recovery fetch timeout. Local backup initialized.");
    }
    return false;
  }

  async function handleUrlVerificationMetrics() {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("verify");
    if (verifyToken) {
      showToast("Processing account token confirmation metrics...");
      try {
        const response = await fetch(`${API_BASE}/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: verifyToken })
        });
        const payload = await response.json();
        if (response.status === 200) {
          localStorage.setItem("vault_token", payload.token);
          localStorage.setItem("vault_email", payload.email);
          appState.userToken = payload.token;
          appState.userEmail = payload.email;
          
          showToast("Account validated. Re-indexing architecture maps.");
          await pullVaultStateFromEdge();
          window.history.replaceState({}, document.title, window.location.pathname);
          transitionToView("viewCategories");
        } else {
          showToast(`Validation Failed: ${payload.error}`);
        }
      } catch {
        showToast("Network execution fault during verification processing.");
      }
    }
  }

  /* ================= INTERFACE VIEW COMPONENT LISTENERS ================= */
  function setupGlobalEventListeners() {
    document.getElementById("btnEnterVault").addEventListener("click", () => {
      const guestCache = localStorage.getItem("guest_categories_cache");
      if (guestCache) {
        appState.categories = JSON.parse(guestCache);
      }
      transitionToView("viewCategories");
    });
    
    document.getElementById("btnOpenAuth").addEventListener("click", () => openSlidingDrawer("drawerAuth"));
    document.getElementById("btnGlobalBack").addEventListener("click", handleGlobalBackNavigation);
    
    document.getElementById("btnBurgerMenu").addEventListener("click", () => openSlidingDrawer("drawerSettings"));
    document.getElementById("headerAvatarContainer").addEventListener("click", () => openSlidingDrawer("drawerProfile"));

    document.getElementById("btnTriggerAddCategory").addEventListener("click", () => {
      const allowedCap = appState.isPremium ? 99 : 21;
      if (appState.categories.length >= allowedCap) {
        showToast(`Free Tier Allocation Cap Hit (${allowedCap} allowed max). Upgrade system access options in Settings.`);
        return;
      }

      const title = prompt("Enter Custom Category Name/Title:");
      if (title && title.trim() !== "") {
        const cleanTitle = title.trim();
        appState.categories.push({
          id: "custom-" + Date.now(),
          name: cleanTitle,
          emoji: "📂",
          isPublic: true,
          items: []
        });
        renderCategoriesGrid();
        persistStateToCloudEngine();
      }
    });

    document.querySelectorAll(".edit-field-icon").forEach(icon => {
      icon.addEventListener("click", (e) => {
        const inputField = e.target.parentElement.querySelector("input");
        inputField.disabled = !inputField.disabled;
        if (!inputField.disabled) {
          inputField.focus();
          icon.innerText = "💾";
        } else {
          icon.innerText = "✏️";
          appState.profile.name = document.getElementById("profName").value;
          appState.profile.dob = document.getElementById("profDob").value;
          appState.profile.hometown = document.getElementById("profHometown").value;
          appState.profile.vocation = document.getElementById("profVocation").value;
          appState.profile.recovery = document.getElementById("profRecovery").value;
          persistStateToCloudEngine();
          showToast("Profile data field update cached.");
        }
      });
    });

    document.getElementById("btnSaveProfileData").addEventListener("click", () => {
      appState.profile.name = document.getElementById("profName").value;
      appState.profile.dob = document.getElementById("profDob").value;
      appState.profile.hometown = document.getElementById("profHometown").value;
      appState.profile.vocation = document.getElementById("profVocation").value;
      appState.profile.recovery = document.getElementById("profRecovery").value;
      persistStateToCloudEngine();
      syncInterfaceStateElements();
      showToast("All current profile metrics pushed to storage layers.");
      closeAllDrawers();
    });

    document.getElementById("inputAvatarFile").addEventListener("change", function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("imgAvatarCropPreview").src = e.target.result;
          openModalWindow("crop");
        };
        reader.readAsDataURL(this.files[0]);
      }
    });

    document.getElementById("btnCommitAvatarSizing").addEventListener("click", () => {
      const rawDataUrl = document.getElementById("imgAvatarCropPreview").src;
      appState.profile.avatar = rawDataUrl;
      syncInterfaceStateElements();
      persistStateToCloudEngine();
      closeModalWindow();
      showToast("Avatar image context optimized and saved.");
    });

    document.getElementById("btnTogglePasswordVisibility").addEventListener("click", () => {
      const field = document.getElementById("authPasswordField");
      field.type = field.type === "password" ? "text" : "password";
    });

    document.getElementById("btnExecuteSignUp").addEventListener("click", async () => {
      const email = document.getElementById("authEmailField").value;
      const pass = document.getElementById("authPasswordField").value;
      
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (!passRegex.test(pass)) {
        showToast("Error: Password criteria parameters mismatched.");
        return;
      }

      showToast("Deploying creation transaction to worker cluster...");
      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.status === 200) {
          alert(`Vault activation metrics initialized: ${data.message}`);
          closeAllDrawers();
        } else {
          showToast(`Creation Fault: ${data.error}`);
        }
      } catch {
        showToast("Edge server response verification error.");
      }
    });

    document.getElementById("btnExecuteSignIn").addEventListener("click", async () => {
      const email = document.getElementById("authEmailField").value;
      const pass = document.getElementById("authPasswordField").value;

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.status === 200) {
          localStorage.setItem("vault_token", data.token);
          localStorage.setItem("vault_email", data.email);
          appState.userToken = data.token;
          appState.userEmail = data.email;
          
          showToast("Handshake approved. Loading network synchronized variables.");
          await pullVaultStateFromEdge();
          transitionToView("viewCategories");
        } else {
          showToast(`Auth Failure: ${data.error}`);
        }
      } catch {
        showToast("Connection to backend node mapping missing.");
      }
    });

    document.getElementById("btnToggleThemeMode").addEventListener("click", (e) => {
      document.body.classList.toggle("light-variant");
      const statusActive = document.body.classList.contains("light-variant");
      e.target.innerText = statusActive ? "DARK MODE" : "LIGHT MODE";
    });

    document.getElementById("btnUpgradeTier").addEventListener("click", () => {
      appState.isPremium = true;
      localStorage.setItem("vault_premium", "true");
      showToast("System upgraded to Premium. Storage expansion cap set to 99 lists.");
      closeAllDrawers();
    });

    document.getElementById("btnNavigateFriends").addEventListener("click", () => {
      transitionToView("viewFriends");
    });

    document.getElementById("btnTriggerVaultWipe").addEventListener("click", () => {
      openModalWindow("wipe");
    });

    document.getElementById("btnConfirmVaultWipe").addEventListener("click", () => {
      localStorage.clear();
      appState.userToken = null;
      appState.userEmail = null;
      appState.isPremium = false;
      loadDefaultGuestFallbackState();
      closeModalWindow();
      closeAllDrawers();
      transitionToView("viewLanding");
      showToast("System complete initialization sequence wrapped. Default metrics restored.");
    });

    document.getElementById("btnCancelWipe").addEventListener("click", closeModalWindow);
    document.getElementById("btnCancelAvatarCommit").addEventListener("click", closeModalWindow);
    document.getElementById("btnCancelFriendAction").addEventListener("click", closeModalWindow);
    
    document.getElementById("btnSubmitFriendAction").addEventListener("click", () => {
      const selected = Array.from(document.querySelectorAll("input[name='friendCompareTargets']:checked")).map(c => c.value);
      const activeMode = document.getElementById("btnSubmitFriendAction").dataset.mode;
      const catCtx = document.getElementById("btnSubmitFriendAction").dataset.catId;

      if (selected.length === 0) {
        showToast("Operation suspended: Zero target network profile contexts selected.");
        return;
      }

      closeModalWindow();
      if (activeMode === "compare") executeComparisonMatrixCalculation(catCtx, selected);
      if (activeMode === "fuse") executeFusedMatrixFormula(catCtx, selected);
    });

    drawerOverlay.addEventListener("click", closeAllDrawers);
    document.querySelectorAll(".close-drawer-x").forEach(x => x.addEventListener("click", closeAllDrawers));
  }

  /* ================= VISUAL SYSTEM EFFECT WINDOW CONTROLS ================= */
  function openSlidingDrawer(drawerId) {
    closeAllDrawers();
    drawerOverlay.classList.remove("hidden");
    document.getElementById(drawerId).classList.remove("hidden");
  }

  function closeAllDrawers() {
    drawerOverlay.classList.add("hidden");
    document.querySelectorAll(".sliding-panel-drawer").forEach(d => d.classList.add("hidden"));
  }

  function openModalWindow(mode, targetCategoryId = null) {
    modalShade.classList.remove("hidden");
    document.querySelectorAll(".center-dialog-modal").forEach(m => m.classList.add("hidden"));
    
    if (mode === "crop") document.getElementById("modalAvatarCrop").classList.remove("hidden");
    if (mode === "wipe") document.getElementById("modalWipeConfirmation").classList.remove("hidden");
    if (mode === "compare" || mode === "fuse") {
      document.getElementById("modalFriendActionSelector").classList.remove("hidden");
      const subBtn = document.getElementById("btnSubmitFriendAction");
      subBtn.dataset.mode = mode;
      subBtn.dataset.catId = targetCategoryId;
    }
  }

  function closeModalWindow() {
    modalShade.classList.add("hidden");
  }

  function showToast(msg) {
    toastNotification.innerText = msg;
    toastNotification.classList.remove("hidden");
    setTimeout(() => {
      toastNotification.classList.add("hidden");
    }, 4500);
  }

  // Engage system boot routine sequences
  window.addEventListener("DOMContentLoaded", initApplication);
})();