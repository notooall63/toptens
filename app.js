document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('.category-list-view');
    console.log("Looking for container:", appContainer);

    fetch('schema.json')
        .then(res => res.json())
        .then(data => {
            console.log("JSON Data found:", data);
            appContainer.innerHTML = ''; // Clear "Loading..." or old content

            data.categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'category-card';
                card.innerText = cat.name;
                appContainer.appendChild(card);
            });
        })
        .catch(err => console.error("Fetch error:", err));
});
