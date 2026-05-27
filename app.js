document.addEventListener('DOMContentLoaded', () => {
    const views = {
        landing: document.getElementById('landing-page'),
        categories: document.getElementById('dashboard-page'),
        lists: document.getElementById('lists-page'),
        items: document.getElementById('items-page')
    };

    const grids = { cat: document.getElementById('category-grid'), list: document.getElementById('lists-grid') };
    const itemsList = document.getElementById('items-list');
    const modal = document.getElementById('image-modal');
    const previewImg = document.getElementById('preview-img');

    let categories = [
        { name: "Restaurants", lists: { "Steakhouses": Array.from({length:10}, () => ({name: "Empty Slot", link: "Add Link", thumb: ""})) } },
        { name: "Movies", lists: { "Sci-Fi": Array.from({length:10}, () => ({name: "Empty Slot", link: "Add Link", thumb: ""})) } },
        { name: "Travel", lists: { "Europe": Array.from({length:10}, () => ({name: "Empty Slot", link: "Add Link", thumb: ""})) } }
    ];

    let currentCat = null, currentListName = null, pendingThumbIndex = null;
    let clickTimer = null;

    function navigateTo(id) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        const target = views[id];
        if (target) target.classList.add('active');
        window.scrollTo(0,0);
    }

    function renderCategories() {
        grids.cat.innerHTML = '';
        categories.forEach((cat, idx) => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.textContent = cat.name;
            btn.onclick = () => {
                if (!clickTimer) {
                    clickTimer = setTimeout(() => { 
                        clickTimer = null; 
                        currentCat = cat; 
                        renderLists(); 
                        navigateTo('lists'); 
                    }, 250);
                } else {
                    clearTimeout(clickTimer); clickTimer = null;
                    const n = prompt("Rename Category:", cat.name);
                    if (n) { cat.name = n.trim(); renderCategories(); }
                }
            };
            grids.cat.appendChild(btn);
        });
    }

    function renderLists() {
        grids.list.innerHTML = '';
        document.getElementById('list-header-title').textContent = `Top Tens—${currentCat.name}`;
        Object.keys(currentCat.lists).forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.textContent = name;
            btn.onclick = () => {
                currentListName = name; renderItems(); navigateTo('items');
            };
            grids.list.appendChild(btn);
        });
    }

    function renderItems() {
        itemsList.innerHTML = '';
        document.getElementById('item-header-title').textContent = `Top Tens—${currentListName}`;
        const data = currentCat.lists[currentListName];

        data.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'rank-item';
            
            const numWrap = document.createElement('div');
            numWrap.innerHTML = `<span class="hash-blue">#</span><span class="rank-number">${idx + 1}</span>`;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = item.name;
            nameSpan.ondblclick = () => {
                const n = prompt("Rename Item:", item.name);
                if (n) { item.name = n.trim(); renderItems(); }
            };

            const linkSpan = document.createElement('span');
            linkSpan.className = 'item-link';
            linkSpan.textContent = item.link;
            linkSpan.onclick = () => {
                const l = prompt("Paste URL:", item.link === "Add Link" ? "" : item.link);
                if (l) { item.link = l.trim(); renderItems(); }
            };

            const thumbBtn = document.createElement('div');
            thumbBtn.className = 'item-thumb-btn';
            thumbBtn.innerHTML = item.thumb ? `<img src="${item.thumb}">` : `<span style="font-size:10px; color:#444">IMG</span>`;
            thumbBtn.onclick = () => {
                const imgUrl = prompt("Enter Image URL:");
                if (imgUrl) { pendingThumbIndex = idx; previewImg.src = imgUrl; modal.style.display = 'flex'; }
            };

            row.appendChild(numWrap); row.appendChild(nameSpan); row.appendChild(linkSpan); row.appendChild(thumbBtn);
            itemsList.appendChild(row);
        });
    }

    // Connect the GO button
    document.getElementById('go-btn').onclick = () => {
        renderCategories();
        navigateTo('categories');
    };

    // Modal buttons
    document.getElementById('modal-confirm').onclick = () => {
        currentCat.lists[currentListName][pendingThumbIndex].thumb = previewImg.src;
        modal.style.display = 'none'; renderItems();
    };
    document.getElementById('modal-cancel').onclick = () => modal.style.display = 'none';

    // Global Back buttons
    document.querySelectorAll('.header-back-btn').forEach(b => {
        b.onclick = () => {
            if (views.items.classList.contains('active')) navigateTo('lists');
            else if (views.lists.classList.contains('active')) navigateTo('categories');
            else navigateTo('landing');
        };
    });
});
