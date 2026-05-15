/**
 * Weapon System
 * Handles weapons, skins, firing, and weapon mechanics
 * 0 RECOIL - 100% ACCURACY WHILE MOVING
 */

class WeaponSystem {
    constructor() {
        this.currentWeapon = null;
        this.weapons = {};
        this.ammo = {};
        this.isReloading = false;
        this.reloadTime = 0;
        this.maxReloadTime = 2.5;
    }

    /**
     * Initialize all weapons with their skins
     */
    initializeWeapons(scene) {
        // VANDAL WEAPON
        this.weapons.vandal = {
            name: 'Vandal',
            damage: 39,
            fireRate: 0.1, // seconds between shots
            maxAmmo: 25,
            reserveAmmo: 120,
            currentAmmo: 25,
            accuracy: 1.0, // 100% accuracy
            recoil: 0.0, // 0 RECOIL
            mesh: null,
            muzzleOffset: new THREE.Vector3(0, 0, 0),
            skins: ['Classic', 'Prime', 'Glitchpop', 'Ion'],
            currentSkin: 'Prime',
            stats: {
                headshot: 156,
                bodyshot: 39,
                legshot: 31
            }
        };

        // PHANTOM (Assault Rifle)
        this.weapons.phantom = {
            name: 'Phantom',
            damage: 35,
            fireRate: 0.08,
            maxAmmo: 30,
            reserveAmmo: 120,
            currentAmmo: 30,
            accuracy: 1.0,
            recoil: 0.0,
            mesh: null,
            muzzleOffset: new THREE.Vector3(0, 0, 0),
            skins: ['Classic', 'Nightmarket', 'RGX', 'Oni'],
            currentSkin: 'RGX',
            stats: {
                headshot: 140,
                bodyshot: 35,
                legshot: 28
            }
        };

        // OPERATOR (Heavy Sniper)
        this.weapons.operator = {
            name: 'Operator',
            damage: 150,
            fireRate: 0.6,
            maxAmmo: 5,
            reserveAmmo: 25,
            currentAmmo: 5,
            accuracy: 1.0,
            recoil: 0.0,
            mesh: null,
            muzzleOffset: new THREE.Vector3(0, 0, 0),
            skins: ['Classic', 'Elderflame', 'Araxys'],
            currentSkin: 'Araxys',
            stats: {
                headshot: 255,
                bodyshot: 150,
                legshot: 127
            }
        };

        this.currentWeapon = this.weapons.vandal;
        this.ammo.current = this.currentWeapon.currentAmmo;
        this.ammo.reserve = this.currentWeapon.reserveAmmo;

        // Create weapon meshes
        this.createWeaponMeshes(scene);
    }

    /**
     * Create 3D meshes for weapons with flashy skins
     */
    createWeaponMeshes(scene) {
        // Vandal mesh
        const vandalGroup = new THREE.Group();
        const vandalBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.1, 0.8),
            this.getSkinMaterial('Vandal', 'Prime')
        );
        vandalBody.position.set(0.3, -0.2, -1.5);
        vandalGroup.add(vandalBody);

        // Add scope/rail
        const scope = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.08, 0.3),
            new THREE.MeshStandardMaterial({ 
                color: 0xff00ff,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0xff00ff,
                emissiveIntensity: 0.3
            })
        );
        scope.position.set(0.3, 0.05, -1.2);
        vandalGroup.add(scope);

        // Add muzzle flash effect
        const muzzle = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({
                color: 0xffaa00,
                emissive: 0xff6600,
                emissiveIntensity: 0.5
            })
        );
        muzzle.position.set(0.3, -0.2, -0.4);
        muzzle.rotation.z = Math.PI / 2;
        vandalGroup.add(muzzle);

        this.weapons.vandal.mesh = vandalGroup;

        // Phantom mesh (Assault Rifle view model)
        const phantomGroup = new THREE.Group();
        const phantomBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.12, 0.8),
            this.getSkinMaterial('Phantom', 'RGX')
        );
        phantomBody.position.set(0.35, -0.25, -1.2);
        phantomGroup.add(phantomBody);

        const phantomStock = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.1, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.35 })
        );
        phantomStock.position.set(-0.04, -0.28, -0.7);
        phantomGroup.add(phantomStock);

        const phantomGrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.18, 0.12),
            new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.7, roughness: 0.4 })
        );
        phantomGrip.position.set(0.18, -0.45, -0.95);
        phantomGrip.rotation.x = Math.PI / 10;
        phantomGroup.add(phantomGrip);

        const phantomMagazine = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.22, 0.28),
            new THREE.MeshStandardMaterial({ color: 0x1f1f1f, metalness: 0.8, roughness: 0.4 })
        );
        phantomMagazine.position.set(0.08, -0.35, -1.05);
        phantomMagazine.rotation.x = -Math.PI / 12;
        phantomGroup.add(phantomMagazine);

        const phantomHandguard = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.1, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 })
        );
        phantomHandguard.position.set(0.35, -0.15, -0.84);
        phantomGroup.add(phantomHandguard);

        const phantomBarrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12),
            new THREE.MeshStandardMaterial({ color: 0x202020, metalness: 0.9, roughness: 0.2 })
        );
        phantomBarrel.position.set(0.35, -0.16, -0.25);
        phantomBarrel.rotation.x = Math.PI / 2;
        phantomGroup.add(phantomBarrel);

        const phantomMuzzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12),
            new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.95, roughness: 0.15 })
        );
        phantomMuzzle.position.set(0.35, -0.16, 0.15);
        phantomMuzzle.rotation.x = Math.PI / 2;
        phantomGroup.add(phantomMuzzle);

        const phantomSight = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.06, 0.22),
            new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.9, roughness: 0.1, emissive: 0x00ffff, emissiveIntensity: 0.25 })
        );
        phantomSight.position.set(0.35, -0.08, -0.65);
        phantomGroup.add(phantomSight);

        const phantomDetail = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.08, 0.32),
            new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.25 })
        );
        phantomDetail.position.set(0.35, -0.1, -0.98);
        phantomGroup.add(phantomDetail);

        this.weapons.phantom.mesh = phantomGroup;

        // Operator mesh
        const operatorGroup = new THREE.Group();
        const operatorBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.15, 1.2),
            this.getSkinMaterial('Operator', 'Araxys')
        );
        operatorBody.position.set(0.3, -0.2, -1.7);
        operatorGroup.add(operatorBody);

        const operatorScope = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16),
            new THREE.MeshStandardMaterial({
                color: 0xff3333,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xff3333,
                emissiveIntensity: 0.6
            })
        );
        operatorScope.position.set(0.3, 0.1, -1.0);
        operatorGroup.add(operatorScope);

        this.weapons.operator.mesh = operatorGroup;
    }

    /**
     * Get skin material for weapon
     */
    getSkinMaterial(weaponName, skinName) {
        const skinConfigs = {
            'Vandal': {
                'Classic': { color: 0x333333, metalness: 0.5, roughness: 0.5 },
                'Prime': { color: 0xff00ff, metalness: 0.9, roughness: 0.1, emissive: 0xff00ff, emissiveIntensity: 0.5 },
                'Glitchpop': { color: 0x00ff00, metalness: 0.8, roughness: 0.2, emissive: 0x00ff00 },
                'Ion': { color: 0x00aaff, metalness: 0.95, roughness: 0.05, emissive: 0x00aaff, emissiveIntensity: 0.7 }
            },
            'Phantom': {
                'Classic': { color: 0x222222, metalness: 0.4, roughness: 0.6 },
                'Nightmarket': { color: 0xff6600, metalness: 0.7, roughness: 0.3, emissive: 0xff6600 },
                'RGX': { color: 0x00ffff, metalness: 0.95, roughness: 0.05, emissive: 0x00ffff, emissiveIntensity: 0.6 },
                'Oni': { color: 0xff0000, metalness: 0.8, roughness: 0.2, emissive: 0xff0000 }
            },
            'Operator': {
                'Classic': { color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 },
                'Elderflame': { color: 0xff3300, metalness: 0.9, roughness: 0.1, emissive: 0xff3300, emissiveIntensity: 0.8 },
                'Araxys': { color: 0xff00ff, metalness: 0.98, roughness: 0.02, emissive: 0xff00ff, emissiveIntensity: 0.9 }
            }
        };

        const config = skinConfigs[weaponName]?.[skinName] || { color: 0x808080 };
        return new THREE.MeshStandardMaterial(config);
    }

    /**
     * Fire weapon - 0 RECOIL, 100% ACCURACY WHILE MOVING
     */
    fire(direction, position, callback) {
        if (!this.currentWeapon || this.isReloading) return false;
        if (this.currentWeapon.currentAmmo <= 0) {
            this.startReload();
            return false;
        }

        // 0 RECOIL - apply NO offset
        const fireDirection = direction.clone();
        // NO recoil adjustment needed - perfect accuracy

        this.currentWeapon.currentAmmo--;
        this.ammo.current = this.currentWeapon.currentAmmo;

        if (callback) {
            callback({
                position: position.clone(),
                direction: fireDirection,
                damage: this.currentWeapon.damage,
                weapon: this.currentWeapon.name
            });
        }

        // Visual feedback
        this.createMuzzleFlash();

        return true;
    }

    /**
     * Create muzzle flash effect
     */
    createMuzzleFlash() {
        // Flash effect would be added to scene
        // This is handled by the game engine
    }

    /**
     * Start reload
     */
    startReload() {
        if (this.isReloading) return;
        if (this.currentWeapon.currentAmmo === this.currentWeapon.maxAmmo) return;

        this.isReloading = true;
        this.reloadTime = 0;
        this.maxReloadTime = 2.5;
    }

    /**
     * Update reload progress
     */
    updateReload(deltaTime) {
        if (!this.isReloading) return;

        this.reloadTime += deltaTime;
        const progress = this.reloadTime / this.maxReloadTime;

        if (progress >= 1.0) {
            // Reload complete
            const ammoNeeded = this.currentWeapon.maxAmmo - this.currentWeapon.currentAmmo;
            const ammoTaken = Math.min(ammoNeeded, this.currentWeapon.reserveAmmo);

            this.currentWeapon.currentAmmo += ammoTaken;
            this.currentWeapon.reserveAmmo -= ammoTaken;
            this.ammo.current = this.currentWeapon.currentAmmo;
            this.ammo.reserve = this.currentWeapon.reserveAmmo;

            this.isReloading = false;
        }

        return progress;
    }

    /**
     * Switch weapon
     */
    switchWeapon(weaponName) {
        if (this.weapons[weaponName]) {
            this.currentWeapon = this.weapons[weaponName];
            this.ammo.current = this.currentWeapon.currentAmmo;
            this.ammo.reserve = this.currentWeapon.reserveAmmo;
            this.isReloading = false;
            return true;
        }
        return false;
    }

    /**
     * Change weapon skin
     */
    changeSkin(skin) {
        if (!this.currentWeapon) return false;
        if (this.currentWeapon.skins.includes(skin)) {
            this.currentWeapon.currentSkin = skin;
            // Update material
            const bodyMesh = this.currentWeapon.mesh.children[0];
            if (bodyMesh) {
                bodyMesh.material = this.getSkinMaterial(this.currentWeapon.name, skin);
            }
            return true;
        }
        return false;
    }

    /**
     * Get weapon stats
     */
    getStats() {
        return {
            weapon: this.currentWeapon.name,
            skin: this.currentWeapon.currentSkin,
            damage: this.currentWeapon.damage,
            fireRate: this.currentWeapon.fireRate,
            accuracy: this.currentWeapon.accuracy,
            recoil: this.currentWeapon.recoil,
            ammo: `${this.ammo.current}/${this.ammo.reserve}`,
            isReloading: this.isReloading
        };
    }
}
