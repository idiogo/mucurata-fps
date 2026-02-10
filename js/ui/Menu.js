/**
 * Menu Controller for Favela Wars FPS
 */

class MenuController {
    constructor() {
        this.selectedTeam = null;
        this.selectedMap = null;
        this.selectedWeapon = null;
        
        this.init();
    }
    
    init() {
        // Initialize shop system
        initShop();
        
        // Initialize skin selector
        initSkins();
        
        // Team selection
        const teamButtons = document.querySelectorAll('.team-btn');
        teamButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectTeam(btn.dataset.team, btn));
        });
        
        // Map selection
        const mapButtons = document.querySelectorAll('.map-btn');
        mapButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectMap(btn.dataset.map, btn));
        });
        
        // Weapon selection
        const weaponButtons = document.querySelectorAll('.weapon-btn');
        weaponButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectWeapon(btn.dataset.weapon, btn));
        });
        
        // Start game
        const startBtn = document.getElementById('start-game');
        startBtn.addEventListener('click', () => this.startGame());
        
        // Pause menu
        document.getElementById('resume-btn').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.resume();
            }
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.restart();
            }
        });
        
        document.getElementById('quit-btn').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.returnToMenu();
            }
        });
        
        // Game over menu
        document.getElementById('play-again-btn').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.restart();
            }
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.returnToMenu();
            }
        });
        
        // Store reference
        window.menuController = this;
    }
    
    selectTeam(team, button) {
        // Remove selection from all team buttons
        document.querySelectorAll('.team-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select this team
        button.classList.add('selected');
        this.selectedTeam = team;
        
        // Show map selection
        document.getElementById('map-section').style.display = 'block';
        
        // Check if can start
        this.checkCanStart();
        
        // Play sound effect
        this.playSelectSound();
    }
    
    selectMap(map, button) {
        // Remove selection from all map buttons
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select this map
        button.classList.add('selected');
        this.selectedMap = map;
        
        // Show weapon selection
        document.getElementById('weapon-section').style.display = 'block';
        
        // Check if can start
        this.checkCanStart();
        
        // Play sound effect
        this.playSelectSound();
    }
    
    selectWeapon(weapon, button) {
        // Check if weapon is owned
        if (shopInstance && !shopInstance.isWeaponOwned(weapon)) {
            return; // Can't select locked weapon
        }
        
        // Remove selection from all weapon buttons
        document.querySelectorAll('.weapon-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select this weapon
        button.classList.add('selected');
        this.selectedWeapon = weapon;
        
        // Check if can start
        this.checkCanStart();
        
        // Play sound effect
        this.playSelectSound();
    }
    
    checkCanStart() {
        const startBtn = document.getElementById('start-game');
        
        if (this.selectedTeam && this.selectedMap && this.selectedWeapon) {
            startBtn.style.display = 'inline-block';
        } else {
            startBtn.style.display = 'none';
        }
    }
    
    async startGame() {
        if (!this.selectedTeam || !this.selectedMap || !this.selectedWeapon) return;
        
        // Map weapon selection to weapon type
        const weaponMap = {
            'shotgun': WeaponTypes.SHOTGUN,
            'sniper': WeaponTypes.SNIPER,
            'ar15': WeaponTypes.AR15
        };
        
        const weaponType = weaponMap[this.selectedWeapon];
        
        // Hide menu
        document.getElementById('main-menu').style.display = 'none';
        
        // Start game with selected map
        if (window.gameInstance) {
            await window.gameInstance.start(this.selectedTeam, weaponType, this.selectedMap);
        }
    }
    
    reset() {
        this.selectedTeam = null;
        this.selectedMap = null;
        this.selectedWeapon = null;
        
        // Reset UI
        document.querySelectorAll('.team-btn, .map-btn, .weapon-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('map-section').style.display = 'none';
        document.getElementById('weapon-section').style.display = 'none';
        document.getElementById('start-game').style.display = 'none';
    }
    
    playSelectSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            
            gainNode.gain.value = 0.1;
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported
        }
    }
}
