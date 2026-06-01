const stockData = {
    "Shoes": [
        { title: "Adidas Adiprene", rank: 1, link: "#", thumb: "vid1.mp4" },
        // ... (10 items)
    ],
    // ... (Repeat for 9 categories)
};

function initializeVault() {
    if (!localStorage.getItem('vault_data')) {
        localStorage.setItem('vault_data', JSON.stringify(stockData));
    }
}