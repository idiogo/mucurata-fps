/**
 * Skin System for Mucuratá FPS
 */

const SKINS = [
    { id: 'default', name: 'Padrão', color: '#3498db', secondary: '#2c3e50', price: 0 },
    { id: 'red', name: 'Vermelho', color: '#e74c3c', secondary: '#c0392b', price: 0 },
    { id: 'green', name: 'Verde', color: '#27ae60', secondary: '#1e8449', price: 0 },
    { id: 'purple', name: 'Roxo', color: '#9b59b6', secondary: '#7d3c98', price: 500 },
    { id: 'gold', name: 'Dourado', color: '#f39c12', secondary: '#d68910', price: 1000 },
    { id: 'black', name: 'Sombrio', color: '#2c3e50', secondary: '#1a252f', price: 800 },
    { id: 'pink', name: 'Rosa', color: '#ff69b4', secondary: '#db7093', price: 600 },
    { id: 'cyan', name: 'Ciano', color: '#00bcd4', secondary: '#00838f', price: 700 },
];

class SkinSelector {
    constructor() {
        this.currentIndex = 0;
        this.ownedSkins = this.loadOwnedSkins();
        this.selectedSkin = this.loadSelectedSkin();
        
        this.setupUI();
        this.setupEvents();
        this.updateSkin();
    }
    
    loadOwnedSkins() {
        const saved = localStorage.getItem('mucurata_skins');
        return saved ? JSON.parse(saved) : ['default', 'red', 'green']; // Free skins
    }
    
    saveOwnedSkins() {
        localStorage.setItem('mucurata_skins', JSON.stringify(this.ownedSkins));
    }
    
    loadSelectedSkin() {
        const saved = localStorage.getItem('mucurata_selected_skin');
        return saved || 'default';
    }
    
    saveSelectedSkin() {
        localStorage.setItem('mucurata_selected_skin', this.selectedSkin);
    }
    
    setupUI() {
        // Find current skin index
        this.currentIndex = SKINS.findIndex(s => s.id === this.selectedSkin);
        if (this.currentIndex === -1) this.currentIndex = 0;
    }
    
    setupEvents() {
        const prevBtn = document.getElementById('skin-prev');
        const nextBtn = document.getElementById('skin-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSkin());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSkin());
        }
    }
    
    prevSkin() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = SKINS.length - 1;
        }
        this.updateSkin();
    }
    
    nextSkin() {
        this.currentIndex++;
        if (this.currentIndex >= SKINS.length) {
            this.currentIndex = 0;
        }
        this.updateSkin();
    }
    
    updateSkin() {
        const skin = SKINS[this.currentIndex];
        const model = document.getElementById('character-model');
        const nameEl = document.getElementById('skin-name');
        
        if (model) {
            model.style.setProperty('--skin-color', skin.color);
            model.style.setProperty('--skin-secondary', skin.secondary);
        }
        
        if (nameEl) {
            const owned = this.ownedSkins.includes(skin.id);
            if (owned) {
                nameEl.textContent = skin.name;
                nameEl.style.color = '#fff';
                // Auto-select owned skin
                this.selectedSkin = skin.id;
                this.saveSelectedSkin();
            } else {
                nameEl.textContent = `${skin.name} (R$ ${skin.price})`;
                nameEl.style.color = '#f39c12';
            }
        }
    }
    
    buySkin(skinId) {
        const skin = SKINS.find(s => s.id === skinId);
        if (!skin) return false;
        
        if (this.ownedSkins.includes(skinId)) return true; // Already owned
        
        if (shopInstance && shopInstance.money >= skin.price) {
            shopInstance.money -= skin.price;
            shopInstance.saveMoney();
            shopInstance.updateMoneyDisplay();
            
            this.ownedSkins.push(skinId);
            this.saveOwnedSkins();
            this.updateSkin();
            return true;
        }
        
        return false;
    }
    
    getCurrentSkin() {
        return SKINS.find(s => s.id === this.selectedSkin) || SKINS[0];
    }
    
    getSkinColor() {
        return this.getCurrentSkin().color;
    }
}

// Global skin selector instance
let skinSelector = null;

function initSkins() {
    skinSelector = new SkinSelector();
    return skinSelector;
}
