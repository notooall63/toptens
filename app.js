document.addEventListener('DOMContentLoaded', () => {
    renderAppLayout();
});

function renderAppLayout() {
    const root = document.getElementById('app-root');
    if (!root) return;

    const categories = typeof getFreshStockCategories === 'function' 
        ? getFreshStockCategories() 
        : [];

    if (categories.length === 0) {
        root.innerHTML = `<div class="error-message">No categories found to display.</div>`;
        return;
    }

    let htmlContent = '';
    categories.forEach(category => {
        htmlContent += `
            <section class="category-group">
                <div class="category-info">
                    <h2 class="category-header">${category.name}</h2>
                    <p class="category-desc">${category.description}</p>
                </div>
                <div class="items-grid">
                    ${category.items.map(item => `
                        <div class="item-card">
                            <div class="rank-badge">#${item.rank}</div>
                            <div class="thumbnail-wrapper">
                                <img src="${item.thumbnail}" alt="${item.title}" class="card-thumb" onerror="this.style.display='none'">
                            </div>
                            <div class="item-title-box">
                                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="item-link">${item.title}</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    });

    root.innerHTML = htmlContent;
}

/* Drawer UI Mechanics */
function openDrawer(type) {
    // Hide all panels first
    document.querySelectorAll('.drawer-panel').forEach(panel => panel.classList.add('hidden'));
    
    // Reveal target panel
    const targetedPanel = document.getElementById(`drawer-${type}`);
    if (targetedPanel) {
        targetedPanel.classList.remove('hidden');
        document.getElementById('app-drawer-overlay').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
}

function closeAllDrawers() {
    document.getElementById('app-drawer-overlay').classList.add('hidden');
    document.querySelectorAll('.drawer-panel').forEach(panel => panel.classList.add('hidden'));
    document.body.style.overflow = ''; // Restore layout scroll
}

function handleBackdropClick(event) {
    if (event.target.id === 'app-drawer-overlay') {
        closeAllDrawers();
    }
}