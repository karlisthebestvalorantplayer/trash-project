/**
 * Game Configuration
 * Adjust these settings to customize your game experience
 */

const GameConfig = {
    // Player Settings
    player: {
        walkSpeed: 7,           // Units per second
        sprintSpeed: 14,        // Units per second
        jumpForce: 8,           // Jump strength
        gravity: 20,            // Gravity strength
        mouseSensitivity: 0.003, // Camera sensitivity (0.001 - 0.01)
        botStrafeSpeed: 4       // Default target strafing speed
    },

    // Weapon Settings
    weapons: {
        vandal: {
            enabled: true,
            damage: 39,
            fireRate: 0.1,      // Seconds between shots
            maxAmmo: 25,
            reserveAmmo: 120,
            recoil: 0,          // 0 = NO RECOIL
            accuracy: 1.0       // 1.0 = 100% accuracy
        },
        phantom: {
            enabled: true,
            damage: 35,
            fireRate: 0.08,
            maxAmmo: 30,
            reserveAmmo: 120,
            recoil: 0,
            accuracy: 1.0
        },
        operator: {
            enabled: true,
            damage: 150,
            fireRate: 0.6,
            maxAmmo: 5,
            reserveAmmo: 25,
            recoil: 0,
            accuracy: 1.0
        }
    },

    // Aurora Sky Settings
    aurora: {
        enabled: true,
        colors: {
            colorA: 0x00ff88,   // Cyan
            colorB: 0xff00ff,   // Magenta
            colorC: 0x00aaff    // Blue
        },
        speed: 0.5,             // Animation speed multiplier (0.1 - 2.0)
        intensity: 1.0          // Color intensity (0.5 - 2.0)
    },

    // Graphics Settings
    graphics: {
        shadowsEnabled: true,
        shadowMapResolution: 2048,  // 1024, 2048, 4096
        antialias: true,
        fogEnabled: true,
        fogColor: 0x000000,
        fogStart: 0,
        fogEnd: 5000
    },

    // HUD Settings
    hud: {
        showFPS: true,
        showRecoilIndicator: true,
        showCrosshair: true,
        weaponDisplayVisible: true,
        showDot: true
    },

    // Audio Settings
    audio: {
        gunFireVolume: 0.3,     // 0 - 1
        reloadVolume: 0.2,
        ambientVolume: 0.1
    },

    // Gameplay Settings
    gameplay: {
        startHealth: 100,
        maxHealth: 100,
        reloadTime: 2.5,        // Seconds
        bulletLifetime: 5,      // Seconds before bullet disappears
        bulletMaxDistance: 500  // Units
    },

    // Level Settings
    level: {
        buildingCount: 4,
        platformCount: 5,
        spawnPoint: { x: 0, y: 1.6, z: 0 }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
