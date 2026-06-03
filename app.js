document.addEventListener('DOMContentLoaded', () => {
    // ================= STATE CONFIGURATIONS =================
    let currentUserSession = null; // Stored user configuration context
    let currentActiveCategoryKey = null;
    let localCacheVault = JSON.parse(localStorage.getItem('vault_cache_data'));

    // Modal cropping session state variables
    let cropTargetContext = null; 
    let currentPositioningX = 0;
    let currentPositioningY = 0;
    let isDraggingMedia = false;
    let startingDragX, startingDragY;

    // Core Node Layer Lookups
    const landingPage = document.getElementById('landing-page');
    const appInterface = document.getElementById('app-interface');
    const categoriesView = document.getElementById('categories-view');
    const listView = document.getElementById('list-view');

    // Drawer System Elements
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawers = document.querySelectorAll('.app-drawer');
    const btnLandingSignin = document.getElementById('btn-landing-signin');
    const btnSettingsSignin = document.getElementById('btn-settings-signin');
    const btnAvatar = document.getElementById('btn-avatar');
    const btnBurger = document.getElementById('btn-burger');

    // Initialize Local Storage Cache if Empty
    if (!localCacheVault) {
        localCacheVault = JSON.parse(JSON.stringify(stockItems));
        localStorage.setItem('vault_cache_data', JSON.stringify(localCacheVault));
    }

    // ================= SPARKLE RENDERING SYSTEM =================
    function initSparkleGenerator() {
        const canvas = document.getElementById('sparkle-canvas');
        const count = 35;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'sparkle-pinpoint';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            star.style.animationDuration = `${2 + Math.random() * 4}s`;
            canvas.appendChild(star);
        }
    }
    initSparkleGenerator();

    /* ================= CATEGORY LINGUISTIC MAPPING PATTERNS ================= */
    function normalizeCategoryKey(inputName) {
        const term = inputName.toLowerCase().trim();
        if (/shoe|sneaker|footwear/i.test(term)) return "Shoes";
        if (/athlete|sports|runner/i.test(term)) return "Inspiring Athletes";
        if (/tech|device|gadget|phone|computer/i.test(term)) return "Tech Devices";
        if (/celebrity|famous|actor|star/i.test(term)) return "Celebrities";
        if (/movie|film/i.test(term) && /2000/.test(term)) return "Post 2000 Movies";
        if (/rap|hiphop|song/i.test(term) && /90/.test(term)) return "90s Rap Songs";
        if (/video game|gaming/i.test(term) && /2010/.test(term)) return "Post 2010 Video Games";
        if (/novel|book|literature/i.test(term)) return "Novels";
        if (/restaurant|eatery|dining|food/i.test(term)) return "Restaurants";
        return inputName; // Fallback mapping match
    }

    /* ================= ROUTING NAVIGATION GRAPHICS ================= */
    function routeGlobalLayer(target) {
        if (target === 'landing') {
            landingPage.classList.add('active');
            appInterface.classList.remove('active');
        } else {
            landingPage.classList.remove('active');
            appInterface.classList.add('active');
            routeSubView('categories');
        }
    }

    function routeSubView(subTarget) {
        if (subTarget === 'categories') {
            categoriesView.classList.add('active');
            listView.classList.remove('active');
            document.getElementById('btn-back').classList.add('hidden');
            renderCategoriesGrid();
        } else {
            categoriesView.classList.remove('active');
            listView.classList.add('active');
            document.getElementById('btn-back').classList.remove('hidden');
        }
    }

    /* ================= DRAWER ANIMATION HANDLERS ================= */
    function openLeftDrawer(drawerId) {
        closeAllDrawers();
        drawerOverlay.classList.add('active');
        document.getElementById(drawerId).classList.add('active');
    }

    function closeAllDrawers() {
        drawerOverlay.classList.remove('active');
        drawers.forEach(d => d.classList.remove('active'));
    }

    drawerOverlay.addEventListener('click', closeAllDrawers);
    document.querySelectorAll('.close-drawer-btn').forEach(b => b.addEventListener('click', closeAllDrawers));

    // Drawer Triggers
    document.getElementById('btn-enter').addEventListener('click', () => routeGlobalLayer('app'));
    btnLandingSignin.addEventListener('click', () => openLeftDrawer('drawer-signin'));
    btnSettingsSignin.addEventListener('click', () => openLeftDrawer('drawer-signin'));
    btnBurger.addEventListener('click', () => openLeftDrawer('drawer-settings'));
    btnAvatar.addEventListener('click', () => openLeftDrawer('drawer-profile'));
    document.getElementById('btn-back').addEventListener('click', () => routeSubView('categories'));

    /* ================= REGISTER & LOGIN AUTH MODULES ================= */
    const authForm = document.getElementById('auth-form');
    let dynamicAuthContext = 'login';

    document.getElementById('tab-login').addEventListener('click', (e) => {
        dynamicAuthContext = 'login';
        e.target.classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
        document.getElementById('auth-submit-btn').textContent = "Execute Access";
    });

    document.getElementById('tab-register').addEventListener('click', (e) => {
        dynamicAuthContext = 'register';
        e.target.classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
        document.getElementById('auth-submit-btn').textContent = "Submit Registration Request";
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const feedback = document.getElementById('auth-message');

        if (dynamicAuthContext === 'register') {
            // Password Constraint Checker Implementation
            const complexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!complexRegex.test(password)) {
                feedback.style.color = 'var(--accent-danger)';
                feedback.textContent = "Password failure: Requirements unmet.";
                return;
            }
            
            // Simulating Worker Registration Email Verification Link Dispatch
            feedback.style.color = 'var(--gold-pure)';
            feedback.textContent = "Verification link successfully issued to your email endpoint.";
            
            // Establish simulated session tracking context state
            setTimeout(() => { authenticateUserSession(email); }, 1500);
        } else {
            // Simulating Cloudflare Workers API validation pathway
            authenticateUserSession(email);
        }
    });

    function authenticateUserSession(email) {
        currentUserSession = { email: email, name: email.split('@')[0] };
        document.getElementById('avatar-display').textContent = currentUserSession.name.charAt(0).toUpperCase();
        document.getElementById('profile-display-name').textContent = currentUserSession.name;
        document.getElementById('profile-display-status').textContent = "Verified Live Account";
        document.getElementById('prof-email').value = email;
        document.getElementById('btn-logout').classList.remove('hidden');
        document.getElementById('auth-message').textContent = "";
        authForm.reset();
        closeAllDrawers();
        routeGlobalLayer('app');
    }

    document.getElementById('btn-logout').addEventListener('click', () => {
        currentUserSession = null;
        document.getElementById('avatar-display').textContent = "G";
        document.getElementById('profile-display-name').textContent = "Guest Node";
        document.getElementById('profile-display-status').textContent = "Read-Only Session";
        document.getElementById('btn-logout').classList.add('hidden');
        closeAllDrawers();
    });

    /* ================= LOCAL STORAGE RENDERING ENGINE ================= */
    function renderCategoriesGrid() {
        const grid = document.getElementById('categories-grid');
        grid.innerHTML = '';
        
        Object.keys(localCacheVault).forEach(catKey => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <h3>${catKey}</h3>
                <p>${localCacheVault[catKey].length} Loaded Entities</p>
                <div class="category-modifiers">
                    <button class="card-mod-btn ren">✎</button>
                    <button class="card-mod-btn del">✕</button>
                </div>
            `;
            
            // Event Interceptors
            card.querySelector('.category-modifiers').addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid opening the list detail view when clicking modifier buttons
            });

            card.querySelector('.card-mod-btn.ren').addEventListener('click', () => renameCategory(catKey));
            card.querySelector('.card-mod-btn.del').addEventListener('click', () => removeCategory(catKey));
            card.addEventListener('click', () => displayListView(catKey));
            grid.appendChild(card);
        });
    }

    function renameCategory(oldKey) {
        const target = prompt("Provide new identifier label:", oldKey);
        if (!target || target.trim() === oldKey) return;
        const normalized = normalizeCategoryKey(target);
        
        localCacheVault[normalized] = localCacheVault[oldKey];
        delete localCacheVault[oldKey];
        saveStateToLocalStorage();
        renderCategoriesGrid();
    }

    function removeCategory(key) {
        if (!confirm(`Confirm absolute deletion of category: ${key}?`)) return;
        delete localCacheVault[key];
        saveStateToLocalStorage();
        renderCategoriesGrid();
    }

    document.getElementById('btn-add-category').addEventListener('click', () => {
        const title = prompt("Enter new category target title name:");
        if (!title) return;
        const mappedKey = normalizeCategoryKey(title);
        
        if (localCacheVault[mappedKey]) {
            alert("This identity token structural map already exists.");
            return;
        }
        localCacheVault[mappedKey] = [];
        saveStateToLocalStorage();
        renderCategoriesGrid();
    });

    /* ================= LIST IMPLEMENTATION DETAILS ENGINE ================= */
    function displayListView(categoryKey) {
        currentActiveCategoryKey = categoryKey;
        document.getElementById('current-list-title').textContent = categoryKey;
        const container = document.getElementById('items-list');
        container.innerHTML = '';

        const collection = localCacheVault[categoryKey] || [];
        
        // Sorting sequence guarantees explicit tier positions
        collection.sort((a, b) => a.rank - b.rank);

        collection.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'list-item-row';
            row.innerHTML = `
                <div class="item-rank-block">
                    <span class="item-hashtag">#</span>
                    <span class="item-number">${item.rank}</span>
                </div>
                <div class="circular-media-frame">
                    <img src="${item.thumb || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23333\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'12\'/></svg>'}" alt="Thumb">
                </div>
                <div class="item-core-details">
                    <span class="item-title-text">${item.name}</span>
                    <a href="${item.link}" target="_blank" class="item-affiliate-link">Affiliate Source Node →</a>
                </div>
                <div class="item-row-actions">
                    <button class="row-action-btn ren">✎</button>
                    <button class="row-action-btn del">✕</button>
                </div>
            `;

            row.querySelector('.row-action-btn.ren').addEventListener('click', () => editListItem(index));
            row.querySelector('.row-action-btn.del').addEventListener('click', () => removeListItem(index));
            container.appendChild(row);
        });

        routeSubView('list');
    }

    document.getElementById('btn-add-item').addEventListener('click', () => {
        const targetList = localCacheVault[currentActiveCategoryKey] || [];
        if (targetList.length >= 10) {
            alert("Absolute tier ceiling enforced: Max limit of 10 list entities reached.");
            return;
        }

        const name = prompt("Enter entity label item title name:");
        if (!name) return;

        // Auto Affiliate Engine Link Generator Strategy
        const generatedLink = `https://amazon.com/s?k=${encodeURIComponent(name)}&tag=vaultfallback-20`;

        targetList.push({
            rank: targetList.length + 1,
            name: name,
            link: generatedLink,
            thumb: null
        });

        saveStateToLocalStorage();
        displayListView(currentActiveCategoryKey);
    });

    function editListItem(index) {
        const item = localCacheVault[currentActiveCategoryKey][index];
        const newName = prompt("Modify item title name:", item.name);
        if (!newName) return;
        item.name = newName;
        saveStateToLocalStorage();
        displayListView(currentActiveCategoryKey);
    }

    function removeListItem(index) {
        if (!confirm("Remove entity from list?")) return;
        localCacheVault[currentActiveCategoryKey].splice(index, 1);
        
        // Re-calculate ranks cleanly to prevent list structural fragmentation
        localCacheVault[currentActiveCategoryKey].forEach((item, idx) => {
            item.rank = idx + 1;
        });

        saveStateToLocalStorage();
        displayListView(currentActiveCategoryKey);
    }

    function saveStateToLocalStorage() {
        // Intercept action if user context is unrecognized guest status
        if (!currentUserSession) return; 
        localStorage.setItem('vault_cache_data', JSON.stringify(localCacheVault));
    }

    /* ================= SETTINGS OPTIONS PANELS ================= */
    document.getElementById('btn-vault-wipe').addEventListener('click', () => {
        if (!confirm("Execute full database wipe? This will restore all stock defaults.")) return;
        localCacheVault = JSON.parse(JSON.stringify(stockItems));
        if (currentUserSession) {
            localStorage.setItem('vault_cache_data', JSON.stringify(localCacheVault));
        }
        alert("Vault wiped successfully.");
        routeSubView('categories');
        closeAllDrawers();
    });

    // Theme Switch Selection Engine
    document.getElementById('btn-theme-dark').addEventListener('click', (e) => {
        document.documentElement.removeAttribute('data-theme');
        e.target.classList.add('active');
        document.getElementById('btn-theme-light').classList.remove('active');
    });

    document.getElementById('btn-theme-light').addEventListener('click', (e) => {
        document.documentElement.setAttribute('data-theme', 'light');
        e.target.classList.add('active');
        document.getElementById('btn-theme-dark').classList.remove('active');
    });

    /* ================= EDITABLE MEDIA LAYOUT INTERFACE MODALS ================= */
    const cropModal = document.getElementById('crop-modal');
    const cropImgTarget = document.getElementById('crop-modal-target-img');
    const fileUploadTrigger = document.getElementById('avatar-file-upload');

    fileUploadTrigger.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            cropImgTarget.src = event.target.result;
            cropModal.classList.add('active');
            
            // Normalize crop structural frame metrics
            currentPositioningX = 0; currentPositioningY = 0;
            cropImgTarget.style.transform = `translate(0px, 0px)`;
        };
        reader.readAsDataURL(file);
    });

    // Mouse & Touch Event Listeners for Handling Media Repositioning Triggers
    cropImgTarget.addEventListener('mousedown', (e) => {
        isDraggingMedia = true;
        startingDragX = e.clientX - currentPositioningX;
        startingDragY = e.clientY - currentPositioningY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingMedia) return;
        currentPositioningX = e.clientX - startingDragX;
        currentPositioningY = e.clientY - startingDragY;
        cropImgTarget.style.transform = `translate(${currentPositioningX}px, ${currentPositioningY}px)`;
    });

    window.addEventListener('mouseup', () => { isDraggingMedia = false; });

    document.getElementById('btn-crop-commit').addEventListener('click', () => {
        document.getElementById('profile-avatar-img').src = cropImgTarget.src;
        cropModal.classList.remove('active');
    });

    document.getElementById('btn-crop-cancel').addEventListener('click', () => {
        cropModal.classList.remove('active');
    });

    // Run Stage Initialization Execution Target Loop
    renderCategoriesGrid();
});