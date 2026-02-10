/**
 * Shop System for Mucuratá FPS
 */

class Shop {
    constructor() {
        this.money = this.loadMoney();
        this.ownedWeapons = this.loadOwnedWeapons();
        this.extraGrenades = 0;
        this.hasArmor = false;
        
        this.setupUI();
        this.setupEvents();
        this.updateUI();
    }
    
    loadMoney() {
        const saved = localStorage.getItem('mucurata_money');
        return saved ? parseInt(saved) : 500; // Start with R$ 500
    }
    
    saveMoney() {
        localStorage.setItem('mucurata_money', this.money.toString());
    }
    
    loadOwnedWeapons() {
        const saved = localStorage.getItem('mucurata_weapons');
        return saved ? JSON.parse(saved) : ['shotgun']; // Shotgun is free
    }
    
    saveOwnedWeapons() {
        localStorage.setItem('mucurata_weapons', JSON.stringify(this.ownedWeapons));
    }
    
    setupUI() {
        this.updateMoneyDisplay();
        this.updateShopItems();
    }
    
    setupEvents() {
        // Shop button
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.openShop());
        }
        
        // Close shop button
        const closeBtn = document.getElementById('close-shop');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeShop());
        }
        
        // Buy buttons
        document.querySelectorAll('.shop-item').forEach(item => {
            const buyBtn = item.querySelector('.buy-btn');
            if (buyBtn) {
                buyBtn.addEventListener('click', () => this.buyItem(item));
            }
        });
    }
    
    openShop() {
        const shopScreen = document.getElementById('shop-screen');
        if (shopScreen) {
            shopScreen.style.display = 'flex';
            this.updateUI();
        }
    }
    
    closeShop() {
        const shopScreen = document.getElementById('shop-screen');
        if (shopScreen) {
            shopScreen.style.display = 'none';
        }
    }
    
    buyItem(itemElement) {
        const weapon = itemElement.dataset.weapon;
        const item = itemElement.dataset.item;
        const price = parseInt(itemElement.dataset.price);
        
        if (this.money < price) {
            alert('Dinheiro insuficiente!');
            return;
        }
        
        if (weapon) {
            if (this.ownedWeapons.includes(weapon)) {
                return; // Already owned
            }
            
            this.money -= price;
            this.ownedWeapons.push(weapon);
            this.saveMoney();
            this.saveOwnedWeapons();
            
        } else if (item === 'grenade') {
            this.money -= price;
            this.extraGrenades += 3;
            this.saveMoney();
            
        } else if (item === 'armor') {
            this.money -= price;
            this.hasArmor = true;
            this.saveMoney();
        }
        
        this.updateUI();
    }
    
    addMoney(amount) {
        this.money += amount;
        this.saveMoney();
        this.updateMoneyDisplay();
    }
    
    updateUI() {
        this.updateMoneyDisplay();
        this.updateShopItems();
        this.updateWeaponSelection();
    }
    
    updateMoneyDisplay() {
        const displays = document.querySelectorAll('#player-money, #shop-money');
        displays.forEach(el => {
            if (el) el.textContent = this.money.toLocaleString('pt-BR');
        });
    }
    
    updateShopItems() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const weapon = item.dataset.weapon;
            const price = parseInt(item.dataset.price);
            const priceEl = item.querySelector('.item-price');
            const buyBtn = item.querySelector('.buy-btn');
            
            if (weapon && this.ownedWeapons.includes(weapon)) {
                item.classList.add('owned');
                if (priceEl) {
                    priceEl.textContent = '✓ DESBLOQUEADA';
                    priceEl.classList.add('owned');
                }
                if (buyBtn) {
                    buyBtn.style.display = 'none';
                }
            } else if (buyBtn) {
                buyBtn.disabled = this.money < price;
            }
        });
    }
    
    updateWeaponSelection() {
        // Update weapon buttons in main menu
        document.querySelectorAll('.weapon-btn').forEach(btn => {
            const weapon = btn.dataset.weapon;
            if (!this.ownedWeapons.includes(weapon)) {
                btn.classList.add('locked');
                btn.disabled = true;
                const desc = btn.querySelector('.weapon-desc');
                if (desc && !desc.dataset.original) {
                    desc.dataset.original = desc.textContent;
                    desc.textContent = '🔒 Compre na LOJA';
                    desc.style.color = '#e74c3c';
                }
            } else {
                btn.classList.remove('locked');
                btn.disabled = false;
                const desc = btn.querySelector('.weapon-desc');
                if (desc && desc.dataset.original) {
                    desc.textContent = desc.dataset.original;
                    desc.style.color = '';
                }
            }
        });
    }
    
    isWeaponOwned(weapon) {
        return this.ownedWeapons.includes(weapon);
    }
    
    getExtraGrenades() {
        const grenades = this.extraGrenades;
        this.extraGrenades = 0; // Reset after getting
        return grenades;
    }
    
    getArmor() {
        const armor = this.hasArmor;
        this.hasArmor = false; // Reset after getting
        return armor ? 50 : 0;
    }
    
    // Called when player kills enemy
    onKill() {
        this.addMoney(100);
    }
}

// Global shop instance
let shopInstance = null;

function initShop() {
    shopInstance = new Shop();
    return shopInstance;
}
