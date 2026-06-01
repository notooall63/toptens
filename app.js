document.addEventListener('DOMContentLoaded', () => {
    initializeVault();
});

function openDrawer(type) {
    document.querySelectorAll('.drawer-panel').forEach(d => d.classList.add('hidden'));
    document.getElementById(`drawer-${type}`).classList.remove('hidden');
    document.getElementById('app-drawer-overlay').classList.remove('hidden');
}

document.getElementById('app-drawer-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'app-drawer-overlay') e.target.classList.add('hidden');
});