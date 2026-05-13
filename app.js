document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const categoryView = document.getElementById('category-view');
    const gridView = document.getElementById('grid-view');
    const enterBtn = document.getElementById('enter-button');

    // View Swapping Logic
    enterBtn.onclick = () => {
        landingPage.classList.add('hidden');
        categoryView.classList.remove('hidden');
        loadCategories();
    };

    function loadCategories() {
        const container = document.querySelector('.category-list-view');
        fetch('schema.json')
            .then(res => res.json())
            .then(data => {
                container.innerHTML = '';
                data.categories.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'category-card';
                    card.innerText = cat.name;
                    card.onclick = () => showGrid(cat);
                    container.appendChild(card);
                });
            });
    }

    function showGrid(category) {
        categoryView.classList.add('hidden');
        gridView.classList.remove('hidden');
        document.getElementById('grid-title').innerText = category.name;
        // Logic to populate the items-grid-view goes here...
    }
});
