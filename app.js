document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app-wrapper');

    function renderList(categoryData) {
        container.innerHTML = `
            <header class="main-header">
                <div class="logo-section">
                    <img src="icon.jpg" class="nav-icon">
                    <span>USER LIST: ${categoryData.name} V1.0</span>
                </div>
                <div class="active-indicator">● ACTIVE</div>
            </header>
            <div id="list-body"></div>
        `;

        const body = document.getElementById('list-body');
        categoryData.lists[0].items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'list-row';
            row.innerHTML = `
                <div class="rank">${index + 1}</div>
                <div class="item-content">${item}</div>
                <div class="status-block"></div>
            `;
            body.appendChild(row);
        });
    }

    // Initial load for testing
    fetch('schema.json').then(res => res.json()).then(data => {
        renderList(data.categories[0]);
    });
});
