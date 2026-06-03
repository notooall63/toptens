document.addEventListener('DOMContentLoaded', () => {
    // Structural UI View State Management
    let currentLayoutView = 'landing';
    let currentActiveListKey = null;

    // Core View Layer References
    const landingPage = document.getElementById('landing-page');
    const appInterface = document.getElementById('app-interface');
    const categoriesView = document.getElementById('categories-view');
    const listView = document.getElementById('list-view');

    // Trigger Node Targets
    const btnEnter = document.getElementById('btn-enter');
    const btnBack = document.getElementById('btn-back');
    const btnLandingSignin = document.getElementById('btn-landing-signin');
    const btnSettingsSignin = document.getElementById('btn-settings-signin');
    const btnAvatar = document.getElementById('btn-avatar');
    const btnBurger = document.getElementById('btn-burger');
    const authForm = document.getElementById('auth-form');

    // Drawer System Structure Mounts
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerSignin = document.getElementById('drawer-signin');
    const drawerSettings = document.getElementById('drawer-settings');
    const drawerProfile = document.getElementById('drawer-profile');
    const closeDrawerButtons = document.querySelectorAll('.close-drawer-btn');

    // System Environment Switch Toggles
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    const toggleCompact = document.getElementById('toggle-compact');

    /* ================= FRAMEWORK ROUTING CONTROLLERS ================= */
    function routeToGlobalLayer(targetLayer) {
        if (targetLayer === 'landing') {
            landingPage.classList.add('active');
            appInterface.classList.remove('active');
            currentLayoutView = 'landing';
        } else if (targetLayer === 'app') {
            landingPage.classList.remove('active');
            appInterface.classList.add('active');
            routeToSubView('categories');
        }
    }

    function routeToSubView(targetSubView) {
        if (targetSubView === 'categories') {
            categoriesView.classList.add('active');
            listView.classList.remove('active');
            btnBack.classList.add('hidden');
            currentLayoutView = 'categories';
        } else if (targetSubView === 'list') {
            categoriesView.classList.remove('active');
            listView.classList.add('active');
            btnBack.classList.remove('hidden');
            currentLayoutView = 'list';
        }
    }

    /* ================= FRAMEWORK DRAWER ROUTERS ================= */
    function openDrawer(drawerNode) {
        // Enforce execution isolation by clearing open overlays prior to initialization
        closeAllDrawers();
        drawerOverlay.classList.add('active');
        drawerNode.classList.add('active');
    }

    function closeAllDrawers() {
        drawerOverlay.classList.remove('active');
        drawerSignin.classList.remove('active');
        drawerSettings.classList.remove('active');
        drawerProfile.classList.remove('active');
    }

    /* ================= APPLIED CONTENT BUILDERS ================= */
    function populateCategoriesGrid() {
        const gridContainer = document.getElementById('categories-grid');
        gridContainer.innerHTML = '';

        Object.keys(stockItems).forEach(categoryKey => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <h3>${categoryKey}</h3>
                <p class="item-meta">${stockItems[categoryKey].length} structured trackable targets</p>
            `;
            card.addEventListener('click', () => {
                populateListDetailsView(categoryKey);
            });
            gridContainer.appendChild(card);
        });
    }

    function populateListDetailsView(categoryKey) {
        currentActiveListKey = categoryKey;
        document.getElementById('current-list-title').textContent = categoryKey;
        
        const listContainer = document.getElementById('items-list');
        listContainer.innerHTML = '';

        const dataCollection = stockItems[categoryKey] || [];
        dataCollection.forEach(item => {
            const listRow = document.createElement('div');
            listRow.className = 'list-item-row';
            listRow.innerHTML = `
                <div class="rank-badge">#${item.rank}</div>
                <div class="item-details">
                    <strong>${item.name} <span class="item-meta">(${item.symbol})</span></strong>
                    <span class="item-meta">${item.value}</span>
                </div>
            `;
            listContainer.appendChild(listRow);
        });

        routeToSubView('list');
    }

    /* ================= BINDINGS & EVENT STRUCTS ================= */
    
    // System Layer Direct Bindings
    btnEnter.addEventListener('click', () => routeToGlobalLayer('app'));
    btnBack.addEventListener('click', () => routeToSubView('categories'));

    // Drawer System Action Map Links
    btnLandingSignin.addEventListener('click', () => openDrawer(drawerSignin));
    btnSettingsSignin.addEventListener('click', () => openDrawer(drawerSignin));
    btnAvatar.addEventListener('click', () => openDrawer(drawerProfile));
    btnBurger.addEventListener('click', () => openDrawer(drawerSettings));

    // Global Interactive Dismiss Triggers
    drawerOverlay.addEventListener('click', closeAllDrawers);
    closeDrawerButtons.forEach(buttonNode => buttonNode.addEventListener('click', closeAllDrawers));

    // Interactive Theme Configuration Drivers
    toggleDarkMode.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });

    toggleCompact.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
    });

    // Mock Authentication Logic Pipeline
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('auth-username').value.trim();
        const fallbackInitial = usernameInput.charAt(0).toUpperCase() || 'U';
        
        // Mutate context profile cards
        document.getElementById('profile-username').textContent = usernameInput;
        document.getElementById('profile-status').textContent = "Verified Live Session";
        document.getElementById('avatar-display').textContent = fallbackInitial;
        document.getElementById('profile-avatar-large').textContent = fallbackInitial;
        document.getElementById('btn-logout').classList.remove('hidden');
        
        const messagingNode = document.getElementById('auth-message');
        messagingNode.style.color = 'var(--accent-color)';
        messagingNode.textContent = "Session established.";
        
        setTimeout(() => {
            messagingNode.textContent = "";
            closeAllDrawers();
            authForm.reset();
        }, 900);
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        document.getElementById('profile-username').textContent = "Guest User";
        document.getElementById('profile-status').textContent = "Local Session";
        document.getElementById('avatar-display').textContent = "U";
        document.getElementById('profile-avatar-large').textContent = "U";
        document.getElementById('btn-logout').classList.add('hidden');
        closeAllDrawers();
    });

    /* ================= INITIALIZATION RUNSTAGE ================= */
    populateCategoriesGrid();
});