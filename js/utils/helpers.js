/**
 * Utility Functions for Favela Wars FPS
 */

const Utils = {
    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Random element from array
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array (Fisher-Yates)
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * Distance between two Vector3
     */
    distance(v1, v2) {
        return BABYLON.Vector3.Distance(v1, v2);
    },

    /**
     * Check if point is in field of view
     */
    isInFOV(origin, direction, target, fovAngle) {
        const toTarget = target.subtract(origin).normalize();
        const dot = BABYLON.Vector3.Dot(direction, toTarget);
        return dot > Math.cos(fovAngle * Math.PI / 180 / 2);
    },

    /**
     * Convert degrees to radians
     */
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    },

    /**
     * Convert radians to degrees
     */
    radToDeg(radians) {
        return radians * 180 / Math.PI;
    },

    /**
     * Ease out cubic
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    /**
     * Ease in out cubic
     */
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    /**
     * Create procedural texture color
     */
    createColor(r, g, b) {
        return new BABYLON.Color3(r / 255, g / 255, b / 255);
    },

    /**
     * Create simple material with color
     */
    createMaterial(scene, name, color, roughness = 0.8) {
        const mat = new BABYLON.PBRMaterial(name, scene);
        mat.albedoColor = color;
        mat.roughness = roughness;
        mat.metallic = 0;
        return mat;
    },

    /**
     * Create brick/wall texture procedurally
     */
    createBrickTexture(scene, width = 512, height = 512) {
        const texture = new BABYLON.DynamicTexture("brickTexture", { width, height }, scene);
        const ctx = texture.getContext();
        
        // Base color
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 0, width, height);
        
        // Draw bricks
        const brickWidth = 60;
        const brickHeight = 25;
        const mortarSize = 4;
        
        for (let y = 0; y < height; y += brickHeight + mortarSize) {
            const offset = (Math.floor(y / (brickHeight + mortarSize)) % 2) * (brickWidth / 2);
            for (let x = -brickWidth; x < width + brickWidth; x += brickWidth + mortarSize) {
                const bx = x + offset;
                const colorVar = Math.random() * 30 - 15;
                const r = Math.min(255, Math.max(0, 139 + colorVar));
                const g = Math.min(255, Math.max(0, 115 + colorVar));
                const b = Math.min(255, Math.max(0, 85 + colorVar));
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(bx, y, brickWidth, brickHeight);
            }
        }
        
        texture.update();
        return texture;
    },

    /**
     * Create concrete texture procedurally
     */
    createConcreteTexture(scene, width = 512, height = 512) {
        const texture = new BABYLON.DynamicTexture("concreteTexture", { width, height }, scene);
        const ctx = texture.getContext();
        
        // Base color
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, width, height);
        
        // Add noise
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 40;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Add some cracks
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            let x = Math.random() * width;
            let y = Math.random() * height;
            ctx.moveTo(x, y);
            for (let j = 0; j < 5; j++) {
                x += (Math.random() - 0.5) * 100;
                y += Math.random() * 50;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        texture.update();
        return texture;
    },

    /**
     * Create corrugated metal texture
     */
    createMetalTexture(scene, width = 256, height = 256) {
        const texture = new BABYLON.DynamicTexture("metalTexture", { width, height }, scene);
        const ctx = texture.getContext();
        
        // Gradient base
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4a4a4a');
        gradient.addColorStop(0.5, '#666666');
        gradient.addColorStop(1, '#4a4a4a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add corrugation lines
        for (let y = 0; y < height; y += 8) {
            ctx.fillStyle = y % 16 === 0 ? '#555' : '#777';
            ctx.fillRect(0, y, width, 4);
        }
        
        // Rust spots
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 20 + 5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        
        texture.update();
        return texture;
    },

    /**
     * Format time as MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Play sound with optional 3D positioning - REALISTIC SOUNDS
     */
    playSound(scene, name, position = null, volume = 1) {
        try {
            const audioContext = BABYLON.Engine.audioEngine?.audioContext;
            if (!audioContext) return;
            
            const now = audioContext.currentTime;
            
            switch(name) {
                case 'shoot':
                    this.playGunshotSound(audioContext, now, volume);
                    break;
                case 'reload':
                    this.playReloadSound(audioContext, now, volume);
                    break;
                case 'hit':
                    this.playHitSound(audioContext, now, volume);
                    break;
                case 'explosion':
                    this.playExplosionSound(audioContext, now, volume);
                    break;
            }
        } catch (e) {
            // Audio not supported or blocked
        }
    },
    
    /**
     * Realistic gunshot sound - layered noise + low thump
     */
    playGunshotSound(ctx, now, volume) {
        // Layer 1: Sharp crack (white noise burst)
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4 * volume, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);
        
        // Layer 2: Low frequency thump
        const thump = ctx.createOscillator();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(150, now);
        thump.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        const thumpGain = ctx.createGain();
        thumpGain.gain.setValueAtTime(0.6 * volume, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        thump.connect(thumpGain);
        thumpGain.connect(ctx.destination);
        thump.start(now);
        thump.stop(now + 0.2);
        
        // Layer 3: Mechanical click
        const click = ctx.createOscillator();
        click.type = 'square';
        click.frequency.value = 2000;
        
        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(0.1 * volume, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        
        click.connect(clickGain);
        clickGain.connect(ctx.destination);
        click.start(now);
        click.stop(now + 0.03);
    },
    
    /**
     * Reload sound - metallic clicks
     */
    playReloadSound(ctx, now, volume) {
        // Magazine release click
        const click1 = ctx.createOscillator();
        click1.type = 'square';
        click1.frequency.value = 3000;
        
        const click1Gain = ctx.createGain();
        click1Gain.gain.setValueAtTime(0.15 * volume, now);
        click1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        click1.connect(click1Gain);
        click1Gain.connect(ctx.destination);
        click1.start(now);
        click1.stop(now + 0.05);
        
        // Magazine insert
        const click2 = ctx.createOscillator();
        click2.type = 'triangle';
        click2.frequency.value = 800;
        
        const click2Gain = ctx.createGain();
        click2Gain.gain.setValueAtTime(0.2 * volume, now + 0.15);
        click2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        click2.connect(click2Gain);
        click2Gain.connect(ctx.destination);
        click2.start(now + 0.15);
        click2.stop(now + 0.25);
        
        // Slide rack
        const slide = ctx.createOscillator();
        slide.type = 'sawtooth';
        slide.frequency.setValueAtTime(200, now + 0.3);
        slide.frequency.linearRampToValueAtTime(400, now + 0.35);
        
        const slideGain = ctx.createGain();
        slideGain.gain.setValueAtTime(0.1 * volume, now + 0.3);
        slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        slide.connect(slideGain);
        slideGain.connect(ctx.destination);
        slide.start(now + 0.3);
        slide.stop(now + 0.45);
    },
    
    /**
     * Hit marker sound
     */
    playHitSound(ctx, now, volume) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },
    
    /**
     * Explosion sound - massive low frequency boom
     */
    playExplosionSound(ctx, now, volume) {
        // Layer 1: Deep boom
        const boom = ctx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(80, now);
        boom.frequency.exponentialRampToValueAtTime(20, now + 0.5);
        
        const boomGain = ctx.createGain();
        boomGain.gain.setValueAtTime(0.8 * volume, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        boom.connect(boomGain);
        boomGain.connect(ctx.destination);
        boom.start(now);
        boom.stop(now + 1);
        
        // Layer 2: Noise crackle
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5 * volume, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        noiseSource.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);
        
        // Layer 3: Mid frequency rumble
        const rumble = ctx.createOscillator();
        rumble.type = 'sawtooth';
        rumble.frequency.value = 100;
        
        const rumbleGain = ctx.createGain();
        rumbleGain.gain.setValueAtTime(0.3 * volume, now);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        
        rumble.connect(rumbleGain);
        rumbleGain.connect(ctx.destination);
        rumble.start(now);
        rumble.stop(now + 0.7);
    }
};

// Freeze to prevent modification
Object.freeze(Utils);
