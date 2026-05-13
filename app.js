document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('.category-list-view');

    function loadCategories() {
        fetch('schema.json')
            .then(res => res.json())
            .then(data => {
                appContainer.innerHTML = '';
                // Ensure we are in list view mode
                appContainer.className = 'category-list-view';

                data.categories.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'category-card';
                    card.innerText = cat.name;
                    
                    // New: Click to see the lists in this category
                    card.onclick = () => showItemsGrid(cat);
                    
                    appContainer.appendChild(card);
                });
            });
    }

    function showItemsGrid(category) {
        appContainer.innerHTML = '';
        // Switch class for grid styling
        appContainer.className = 'items-grid-view';

        // Add a back button
        const backBtn = document.createElement('div');
        backBtn.className = 'category-card';
        backBtn.innerText = '← Back';
        backBtn.onclick = () => loadCategories();
        appContainer.appendChild(backBtn);

        category.lists.forEach(list => {
            const listCard = document.createElement('div');
            listCard.className = 'category-card';
            listCard.innerHTML = `<strong>${list.title}</strong>`;
            
            // For now, let's just log the items when clicked
            listCard.onclick = () => console.log(list.items);
            
            appContainer.appendChild(listCard);
        });
    }

    loadCategories();
});
