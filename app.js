document.addEventListener('DOMContentLoaded', () => {
    renderAppLayout();
});

function renderAppLayout() {
    const root = document.getElementById('app-root');
    if (!root) return;

    // Fetch the raw category objects from stockitems.js
    const categories = typeof getFreshStockCategories === 'function' 
        ? getFreshStockCategories() 
        : [];

    if (categories.length === 0) {
        root.innerHTML = `<div style="color: #ff4444; padding: 20px; text-align: center;">No categories found to display.</div>`;
        return;
    }

    // Map categories into dark grid containers matching your mobile preference
    let htmlContent = '';
    categories.forEach(category => {
        htmlContent += `
            <section class="category-group" style="margin-bottom: 30px; padding: 15px;">
                <h2 class="category-header" style="color: #ffd700; font-size: 1.4rem; margin-bottom: 5px;">${category.name}</h2>
                <p class="category-desc" style="color: #aaaaaa; font-size: 0.9rem; margin-bottom: 15px;">${category.description}</p>
                <div class="items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px;">
                    ${category.items.map(item => `
                        <div class="item-card" style="background: #111111; border: 1px solid #222222; border-radius: 8px; padding: 10px; text-align: center;">
                            <div class="rank-badge" style="color: #ffd700; font-weight: bold; margin-bottom: 5px;">#${item.rank}</div>
                            <img src="${item.thumbnail}" alt="${item.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" onerror="this.src='AppIconTopTens.jpg'">
                            <div class="item-title" style="font-size: 0.85rem; font-weight: 500; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: none;">${item.title}</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    });

    root.innerHTML = htmlContent;
}

function openDrawer(type) {
    document.querySelectorAll('.drawer-panel').forEach(d => d.classList.add('hidden'));
    const targetedDrawer = document.getElementById(`drawer-${type}`);
    if (targetedDrawer) targetedDrawer.classList.remove('hidden');
    
    const overlay = document.getElementById('app-drawer-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

const overlayEl = document.getElementById('app-drawer-overlay');
if (overlayEl) {
    overlayEl.addEventListener('click', (e) => {
        if (e.target.id === 'app-drawer-overlay') e.target.classList.add('hidden');
    });
}