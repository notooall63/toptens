/**
 * Top Tens - Production Client Core Application Framework Engine
 * Orchestrates localized states, algorithmic analytical vectors, and edge integrations.
 */

(function() {
  const API_BASE = "https://top-tens-backend.swoodson96.workers.dev";

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
    activeCategoryContextId: null
  };

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

  /* ================= SYSTEM BOOT CYCLE SEQUENCE INITIALIZATION ================= */
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

  /* ================= VIEW ROUTER TRANSITION ENGINE ================= */
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
      if (prev === appState.currentView) {
        handleGlobalBackNavigation();
        return;
      }
      history.back();
    } else {
      transitionToView("viewLanding");
    }
  }

  function setupBrowserHistoryListeners() {
    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.view) {
        if (appState.viewHistory.length > 0) appState.viewHistory.pop();
        transitionToView(event.state.view, true);
      } else {
        transitionToView("viewLanding", true);
      }
    });
    if (!history.state) {
      history.replaceState({ view: "viewLanding" }, "", "#viewLanding");
    }
  }

  /* ================= DOM DATA RENDERING LAYERS MATRIX ================= */
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

    stack.querySelectorAll(".edit-friend-trigger").forEach(b => b.addEventListener("click", (e) => triggerEditFriend(e.target.dataset.idx)));
    stack.querySelectorAll(".remove-friend-trigger").forEach(b => b.addEventListener("click", (e) => triggerRemoveFriend(e.target.dataset.idx)));
  }

  /* ================= JUXTAPOSITION AND WEIGHTED MATRIX ALGORITHMS ================= */
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
    document.getElementById("analyticsViewHeadline").innerText = `Juxtaposed Comparisons Matrix (Max 26 Friends Node Limits)`;
    const box = document.getElementById("analyticsOutputContainer");
    box.innerHTML = "";

    const masterTable = document.createElement("table");
    masterTable.className = "analytics-grid-data-table";
    
    let headingRow = `<tr><th>Rank Vector</th><th>Your Vault</th>`;
    chosenFriends.slice(0, 26).forEach(f => { headingRow += `<th>${f}</th>`; });
    headingRow += `</tr>`;
    masterTable.innerHTML += headingRow;

    const myCat = appState.categories.find(c => c.id === categoryId);

    for (let r = 1; r <= 10; r++) {
      const myItem = myCat.items.find(i => i.rank === r)?.name || "—";
      let rowHtml = `<tr><td><strong>#${r}</strong></td><td>${myItem}</td>`;
      chosenFriends.slice(0, 26).forEach(f => {
        const pseudorandomIndex = Math.abs(f.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + r) % (myCat.items.length || 1);
        const simulateFriendValue = myCat.items[pseudorandomIndex]?.name || "Simulated Alignment Track";
        rowHtml += `<td>${simulateFriendValue}</td>`;
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
    
    document.getElementById("friendModalActionHeadline").innerText = `Weight-Fuse Matrix: ${targetCat.name}`;
    appState.friendsList.forEach(f => {
      boxStack.innerHTML += `
        <div class="modal-selection-item">
          <input type="checkbox" name="friendCompareTargets" value="${f.name}" id="chk_${f.name}">
          <label for="chk_${f.name}">${f.name} (Linear Scale Weight Balance: 1.0)</label>
        </div>
      `;
    });
    openModalWindow("fuse", categoryId);
  }

  function executeFusedMatrixFormula(categoryId, chosenFriends) {
    transitionToView("viewAnalyticsMatrix");
    document.getElementById("analyticsViewHeadline").innerText = `Fused Weight-Ranking Average Master Output`;
    const box = document.getElementById("analyticsOutputContainer");
    box.innerHTML = "";

    const myCat = appState.categories.find(c => c.id === categoryId);
    const scoringMap = {};

    myCat.items.forEach(item => {
      const inverseLinearScore = 11 - item.rank;
      scoringMap[item.name] = (scoringMap[item.name] || 0) + inverseLinearScore;
    });

    chosenFriends.forEach(f => {
      myCat.items.forEach((item, idx) => {
        if (idx < 6) {
          const shiftedRank = ((idx + 4) % 10) + 1;
          const score = 11 - shiftedRank;
          scoringMap[item.name] = (scoringMap[item.name] || 0) + score;
        }
      });
    });

    const sortedFused = Object.keys(scoringMap).map(name => ({
      name, score: scoringMap[name]
    })).sort((a,b) => b.score - a.score).slice(0, 10);

    const orderedList = document.createElement("ol");
    orderedList.className = "analytics-fused-list";
    sortedFused.forEach((item) => {
      orderedList.innerHTML += `<li><strong>${item.name}</strong> — Aggregated Cumulative Formula Weight Score: ${item.score} units</li>`;
    });
    box.appendChild(orderedList);
  }

  /* ================= RUNTIME STRUCTURAL DATA MUTATIONS ================= */
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
    if (confirm("Are you completely certain you want to purge this entire target category framework?")) {
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
      showToast("Parameter Fault: Verify explicit string parameters and rank boundaries (1-10)");
      return;
    }

    const targetCat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    targetCat.items = targetCat.items.filter(i => i.rank !== rankVal);

    const strippedDomain = nameIn.value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const autogeneratedAffiliateUrl = `https://${strippedDomain || 'vault'}.com/purchase?affid=toptens26`;

    const newItemObj = {
      rank: rankVal,
      name: nameIn.value.trim(),
      media: "",
      link: autogeneratedAffiliateUrl
    };

    if (fileIn.files && fileIn.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        newItemObj.media = e.target.result;
        targetCat.items.push(newItemObj);
        finalizeItemAppend();
      };
      reader.readAsDataURL(fileIn.files[0]);
    } else {
      targetCat.items.push(newItemObj);
      finalizeItemAppend();
    }

    function finalizeItemAppend() {
      nameIn.value = "";
      rankIn.value = "";
      fileIn.value = "";
      renderItemsVerticalStack();
      persistStateToCloudEngine();
      showToast("Vault target allocation row successfully overwritten.");
    }
  });

  function triggerEditItem(rankStr) {
    const rank = parseInt(rankStr);
    const cat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    const item = cat.items.find(i => i.rank === rank);
    const newTitle = prompt(`Update item descriptive label for slot #${rank}:`, item.name);
    if (newTitle && newTitle.trim() !== "") {
      item.name = newTitle.trim();
      renderItemsVerticalStack();
      persistStateToCloudEngine();
    }
  }

  function triggerRemoveItem(rankStr) {
    const rank = parseInt(rankStr);
    const cat = appState.categories.find(c => c.id === appState.activeCategoryContextId);
    if (confirm(`Purge entry ranking slot row #${rank} entirely?`)) {
      cat.items = cat.items.filter(i => i.rank !== rank);
      renderItemsVerticalStack();
      persistStateToCloudEngine();
    }
  }

  function triggerEditFriend(idxStr) {
    const idx = parseInt(idxStr);
    const fr = appState.friendsList[idx];
    const newName = prompt("Modify target friend identifier string:", fr.name);
    if (newName && newName.trim() !== "") {
      fr.name = newName.trim();
      renderFriendsStack();
      persistStateToCloudEngine();
    }
  }

  function triggerRemoveFriend(idxStr) {
    const idx = parseInt(idxStr);
    if (confirm("Disconnect and purge link trace metrics associated with this user node?")) {
      appState.friendsList.splice(idx, 1);
      renderFriendsStack();
      persistStateToCloudEngine();
    }
  }

  /* ================= CLOUDFLARE CLOUD DATA TRANSACTION NETWORKS ================= */
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
        body: JSON.stringify({
          state: { categories: appState.categories, profile: appState.profile, friendsList: appState.friendsList }
        })
      });
    } catch (err) {
      console.error("Cloud synchronization mapping pipeline execution fault:", err);
    }
  }

  async function pullVaultStateFromEdge() {
    try {
      const res = await fetch(`${API_BASE}/api/vault/pull`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${appState.userToken}` }
      });
      if (res.status === 200) {
        const payload = await res.json();
        if (payload.categories) appState.categories = payload.categories;
        if (payload.profile) appState.profile = payload.profile;
        if (payload.friendsList) appState.friendsList = payload.friendsList;
        syncInterfaceStateElements();
        return true;
      }
    } catch {
      showToast("Edge replication link timeout. Running internal local states.");
    }
    return false;
  }

  async function handleUrlVerificationMetrics() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("verify");
    if (token) {
      showToast("Executing token validation parameters across edge nodes...");
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (res.status === 200) {
          localStorage.setItem("vault_token", data.token);
          localStorage.setItem("vault_email", data.email);
          appState.userToken = data.token;
          appState.userEmail = data.email;
          
          showToast("Account confirmation approved. Transitioning operational maps.");
          await pullVaultStateFromEdge();
          window.history.replaceState({}, document.title, window.location.pathname);
          transitionToView("viewCategories");
        } else {
          showToast(`Validation Matrix Terminated: ${data.error}`);
        }
      } catch {
        showToast("Handshake fatal response exception encountered.");
      }
    }
  }

  /* ================= INTERFACE VIEW COMPONENT ACTION MATRIX BINDINGS ================= */
  function setupGlobalEventListeners() {
    document.getElementById("btnEnterVault").addEventListener("click", () => {
      const cache = localStorage.getItem("guest_categories_cache");
      if (cache) appState.categories = JSON.parse(cache);
      transitionToView("viewCategories");
    });

    document.getElementById("btnOpenAuth").addEventListener("click", () => openSlidingDrawer("drawerAuth"));
    document.getElementById("btnGlobalBack").addEventListener("click", handleGlobalBackNavigation);
    document.getElementById("btnBurgerMenu").addEventListener("click", () => openSlidingDrawer("drawerSettings"));
    document.getElementById("headerAvatarContainer").addEventListener("click", () => openSlidingDrawer("drawerProfile"));

    document.getElementById("btnToggleProfilePrivacy").addEventListener("click", (e) => {
      appState.profile.public = !appState.profile.public;
      e.target.innerText = appState.profile.public ? "PROFILE PUBLIC" : "PROFILE PRIVATE";
      e.target.className = appState.profile.public ? "privacy-toggle-button status-public" : "privacy-toggle-button status-private";
      persistStateToCloudEngine();
      showToast(`Global visibility status mutated to: ${appState.profile.public ? "Public" : "Private"}`);
    });

    document.getElementById("btnTriggerAddCategory").addEventListener("click", () => {
      const cap = appState.isPremium ? 99 : 21;
      if (appState.categories.length >= cap) {
        showToast(`Free Allocation Layer Upper Limit Enforced (${cap} Max Allowed). Modify via Settings.`);
        return;
      }
      const title = prompt("Provide Custom Framework Category Title Name:");
      if (title && title.trim() !== "") {
        appState.categories.push({
          id: "custom-" + Date.now(),
          name: title.trim(),
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
        const rowInput = e.target.parentElement.querySelector("input");
        rowInput.disabled = !rowInput.disabled;
        if (!rowInput.disabled) {
          rowInput.focus();
          icon.innerText = "💾";
        } else {
          icon.innerText = "✏️";
          extractAndSaveProfileFields();
        }
      });
    });

    document.getElementById("btnSaveProfileData").addEventListener("click", () => {
      extractAndSaveProfileFields();
      closeAllDrawers();
    });

    function extractAndSaveProfileFields() {
      appState.profile.name = document.getElementById("profName").value;
      appState.profile.dob = document.getElementById("profDob").value;
      appState.profile.hometown = document.getElementById("profHometown").value;
      appState.profile.vocation = document.getElementById("profVocation").value;
      appState.profile.recovery = document.getElementById("profRecovery").value;
      persistStateToCloudEngine();
      syncInterfaceStateElements();
      showToast("Dynamic identity allocation matrix parameters synchronized.");
    }

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
      appState.profile.avatar = document.getElementById("imgAvatarCropPreview").src;
      syncInterfaceStateElements();
      persistStateToCloudEngine();
      closeModalWindow();
      showToast("Avatar image coordinate dimensions saved to profile record context.");
    });

    document.getElementById("btnTogglePasswordVisibility").addEventListener("click", () => {
      const field = document.getElementById("authPasswordField");
      field.type = field.type === "password" ? "text" : "password";
    });

    document.getElementById("btnExecuteSignUp").addEventListener("click", async () => {
      const email = document.getElementById("authEmailField").value;
      const pass = document.getElementById("authPasswordField").value;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      
      if (!regex.test(pass)) {
        showToast("Validation Error: Password schema validation criteria constraints failed.");
        return;
      }
      showToast("Dispatching network verification request block to edge clustering nodes...");
      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.status === 200) {
          alert(`Vault confirmation payload issued: ${data.message}`);
          closeAllDrawers();
        } else {
          showToast(`Signup Registry Refused: ${data.error}`);
        }
      } catch {
        showToast("Gateway connection timed out during execution logic phase.");
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
          
          showToast("Handshake accepted. Re-indexing remote configuration records.");
          await pullVaultStateFromEdge();
          transitionToView("viewCategories");
        } else {
          showToast(`Security Refusal: ${data.error}`);
        }
      } catch {
        showToast("Remote endpoint mapping node missing or unresponsive.");
      }
    });

    document.getElementById("btnToggleThemeMode").addEventListener("click", (e) => {
      document.body.classList.toggle("light-variant");
      e.target.innerText = document.body.classList.contains("light-variant") ? "DARK MODE" : "LIGHT MODE";
    });

    document.getElementById("btnUpgradeTier").addEventListener("click", () => {
      appState.isPremium = true;
      localStorage.setItem("vault_premium", "true");
      showToast("Premium tier access initialized. Storage expandability parameters scaled to 99 metrics.");
      closeAllDrawers();
    });

    document.getElementById("btnTriggerAddFriend").addEventListener("click", () => {
      const tag = prompt("Search matching profile signature handles across network records:");
      if (tag && tag.trim() !== "") {
        appState.friendsList.push({ name: tag.trim(), mutualCats: 0, mutualItems: 0, avatar: "" });
        renderFriendsStack();
        persistStateToCloudEngine();
        showToast("Target network identity node mapped to friends index tracking ledger.");
      }
    });

    document.getElementById("btnNavigateFriends").addEventListener("click", () => transitionToView("viewFriends"));
    document.getElementById("btnTriggerVaultWipe").addEventListener("click", () => openModalWindow("wipe"));

    document.getElementById("btnConfirmVaultWipe").addEventListener("click", () => {
      localStorage.clear();
      appState.userToken = null;
      appState.userEmail = null;
      appState.isPremium = false;
      loadDefaultGuestFallbackState();
      closeModalWindow();
      closeAllDrawers();
      transitionToView("viewLanding");
      showToast("Full environment data rollback completed successfully.");
    });

    document.getElementById("btnCancelWipe").addEventListener("click", closeModalWindow);
    document.getElementById("btnCancelAvatarCommit").addEventListener("click", closeModalWindow);
    document.getElementById("btnCancelFriendAction").addEventListener("click", closeModalWindow);

    document.getElementById("btnSubmitFriendAction").addEventListener("click", () => {
      const inputs = Array.from(document.querySelectorAll("input[name='friendCompareTargets']:checked")).map(c => c.value);
      const actionMode = document.getElementById("btnSubmitFriendAction").dataset.mode;
      const contextId = document.getElementById("btnSubmitFriendAction").dataset.catId;

      if (inputs.length === 0) {
        showToast("Suspended Execution Block: Zero profile network checkboxes targeted.");
        return;
      }
      closeModalWindow();
      if (actionMode === "compare") executeComparisonMatrixCalculation(contextId, inputs);
      if (actionMode === "fuse") executeFusedMatrixFormula(contextId, inputs);
    });

    drawerOverlay.addEventListener("click", closeAllDrawers);
    document.querySelectorAll(".close-drawer-x").forEach(x => x.addEventListener("click", closeAllDrawers));
  }

  /* ================= INTERACTION DRAWERS AND MODALS TRANSITION HANDLING ================= */
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
      const submitBtn = document.getElementById("btnSubmitFriendAction");
      submitBtn.dataset.mode = mode;
      submitBtn.dataset.catId = targetCategoryId;
    }
  }

  function closeModalWindow() {
    modalShade.classList.add("hidden");
  }

  function showToast(msg) {
    toastNotification.innerText = msg;
    toastNotification.classList.remove("hidden");
    setTimeout(() => { toastNotification.classList.add("hidden"); }, 4500);
  }

  window.addEventListener("DOMContentLoaded", initApplication);
})();