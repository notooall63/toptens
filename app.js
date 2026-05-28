// ==========================================
// CORE APP ENGINE CONTROLLER (app.js)
// ==========================================
const API_BASE_URL = "http://127.0.0.1:8000";

// Standard Mock Data Initialization to Feed the Visual Grid
let currentCategories = [
    { id: "shoes", name: "Shoes", count: 10, icon: "👟" },
    { id: "restaurants", name: "Restaurants", count: 10, icon: "🍔" },
    { id: "books", name: "Books", count: 10, icon: "📚" }
];

document.addEventListener("DOMContentLoaded", () => {
    initDOMEventListeners();
    renderCategoriesGrid();
    checkExistingSessionIdentity();
});

function initDOMEventListeners() {
    const burgerBtn = document.getElementById("header-burger-menu-btn");
    const closeBtn = document.getElementById("drawer-close-button");
    const drawerOverlay = document.getElementById("app-drawer-overlay");
    const identitySaveBtn = document.getElementById("drawer-identity-save-btn");
    const authVerifySubmitBtn = document.getElementById("drawer-auth-verify-submit-btn");
    const authCancelBtn = document.getElementById("drawer-auth-cancel-btn");

    // Drawer Visibility Toggles
    if (burgerBtn) burgerBtn.addEventListener("click", () => drawerOverlay.classList.remove("hidden"));
    if (closeBtn) closeBtn.addEventListener("click", () => drawerOverlay.classList.add("hidden"));
    
    // Handshake Phase 1: Request Email Verification Token
    if (identitySaveBtn) {
        identitySaveBtn.addEventListener("click", async () => {
            const emailInput = document.getElementById("drawer-user-identity-email").value.trim();
            if (!emailInput) {
                alert("Please enter a valid email address to request handshake.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/request-handshake`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput })
                });

                const data = await response.json();
                if (response.ok) {
                    document.getElementById("drawer-password-hint").classList.remove("hidden");
                    document.getElementById("drawer-auth-box-wrapper").classList.remove("hidden");
                    identitySaveBtn.disabled = true;
                } else {
                    alert(`Handshake Failed: ${data.detail || "Unknown error"}`);
                }
            } catch (err) {
                console.error("API Connection Error:", err);
                alert("Could not reach the FastAPI engine backend server. Make sure main.py is running!");
            }
        });
    }

    // Handshake Phase 2: Verify Token and Lock Local State Session
    if (authVerifySubmitBtn) {
        authVerifySubmitBtn.addEventListener("click", async () => {
            const emailInput = document.getElementById("drawer-user-identity-email").value.trim();
            const tokenInput = document.getElementById("drawer-auth-password-input").value.trim();

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput, token: tokenInput })
                });

                const data = await response.json();
                if (response.ok) {
                    // Lock authenticated tokens into local storage partition
                    localStorage.setItem("vault_user_token", data.token);
                    localStorage.setItem("vault_user_email", data.email);
                    
                    applyAuthenticatedUIState(data.email);
                    resetHandshakeInputElements();
                } else {
                    alert(`Verification Error: ${data.detail}`);
                }
            } catch (err) {
                console.error("API Verification Connection Error:", err);
            }
        });
    }

    if (authCancelBtn) {
        authCancelBtn.addEventListener("click", () => resetHandshakeInputElements());
    }
}

function checkExistingSessionIdentity() {
    const activeEmail = localStorage.getItem("vault_user_email");
    if (activeEmail) {
        applyAuthenticatedUIState(activeEmail);
    }
}

function applyAuthenticatedUIState(email) {
    const usernameLabel = document.getElementById("drawer-profile-username-string");
    const tierBadge = document.getElementById("drawer-profile-tier-badge");
    const emailInput = document.getElementById("drawer-user-identity-email");

    if (usernameLabel) usernameLabel.textContent = email.split('@')[0];
    if (tierBadge) {
        tierBadge.textContent = "Active Vault Cloud Sync";
        tierBadge.className = "profile-status-badge verified-tier";
    }
    if (emailInput) {
        emailInput.value = email;
        emailInput.disabled = true;
    }
    const saveBtn = document.getElementById("drawer-identity-save-btn");
    if (saveBtn) saveBtn.classList.add("hidden");
}

function resetHandshakeInputElements() {
    document.getElementById("drawer-password-hint").classList.add("hidden");
    document.getElementById("drawer-auth-box-wrapper").classList.add("hidden");
    document.getElementById("drawer-auth-password-input").value = "";
    
    const saveBtn = document.getElementById("drawer-identity-save-btn");
    if (saveBtn) saveBtn.disabled = false;
}

function renderCategoriesGrid() {
    const gridContainer = document.getElementById("categories-grid-container");
    if (!gridContainer) return;
    
    gridContainer.innerHTML = "";
    currentCategories.forEach(cat => {
        const cardNode = document.createElement("div");
        cardNode.className = "category-matrix-card";
        cardNode.innerHTML = `
            <div class="card-icon-frame">${cat.icon}</div>
            <h4 class="card-title-string">${cat.name}</h4>
            <span class="card-item-counter">(${cat.count} items)</span>
        `;
        gridContainer.appendChild(cardNode);
    });
}