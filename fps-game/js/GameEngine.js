/**
 * FPS Game Engine
 * Main game loop and scene management
 */

class GameEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.weaponSystem = null;
        this.auroraGenerator = null;
        
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        // Game state
        this.gameState = 'playing'; // 'menu', 'playing', 'paused', 'gameover'
        this.bullets = [];
        this.targets = [];
        this.particles = [];
        this.weaponView = null;
        this.currentWeaponObject = null;
        this.botStrafeSpeed = GameConfig.player.botStrafeSpeed || 4; // Default strafe speed setting
        
        // Target stats
        this.score = 0;
        this.hits = 0;
        this.totalShots = 0;
        
        // Audio context
        this.audioContext = null;
    }

    /**
     * Initialize the game
     */
    init() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 0, 5000);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            5000
        );

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        // Add camera to scene
        this.scene.add(this.camera);

        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);

        // Initialize game systems
        this.initializeSystems();
        this.setupEventListeners();
        this.createEnvironment();
        this.createCrosshair();
        this.createSettingsUI();
        this.attachWeaponView();

        // Start game loop
        this.animate();
    }

    /**
     * Initialize all game systems
     */
    initializeSystems() {
        // Create player
        this.player = new Player(this.scene, this.camera);
        this.player.sensitivity = GameConfig.player.mouseSensitivity;

        // Create weapon system
        this.weaponSystem = new WeaponSystem();
        this.weaponSystem.initializeWeapons(this.scene);

        // Create aurora sky
        this.auroraGenerator = new AuroraGenerator();
        this.auroraGenerator.createAuroraSky(this.scene);
    }

    /**
     * Create a centered blue glowing plus crosshair above all layers
     */
    createCrosshair() {
        // Only create one blue glowing plus crosshair and place it above all UI layers.
        if (!document.getElementById('crosshair')) {
            const crosshair = document.createElement('div');
            crosshair.id = 'crosshair';
            crosshair.textContent = '+';

            Object.assign(crosshair.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: '9999',
                color: '#82c8ff',
                fontSize: '42px',
                fontWeight: '900',
                lineHeight: '1',
                textAlign: 'center',
                textShadow: '0 0 18px rgba(130, 200, 255, 0.9), 0 0 36px rgba(130, 200, 255, 0.5), 0 0 54px rgba(130, 200, 255, 0.25)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                transition: 'transform 0.1s ease-out'
            });

            document.body.appendChild(crosshair);
        }
    }
    /**
     * Create game environment
     */
    createEnvironment() {
        // Ground plane - sleek dark with neon accents
        const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0e27,
            metalness: 0.1,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add futuristic arena structure
        this.createArena();

        // Spawn shooting targets
        this.spawnTargets();

        // Lighting - high contrast arena lighting
        const ambientLight = new THREE.AmbientLight(0x4488ff, 0.4);
        this.scene.add(ambientLight);

        // Key light with strong shadows
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
        keyLight.position.set(50, 150, 50);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.far = 500;
        this.scene.add(keyLight);

        // Neon accent light
        const neonLight = new THREE.DirectionalLight(0x00ffff, 0.3);
        neonLight.position.set(-50, 80, 0);
        this.scene.add(neonLight);

        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x0a0e27, 80, 200);
    }

    /**
     * Create futuristic training arena
     */
    createArena() {
        // Sleek metal walls
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a2540,
            metalness: 0.7,
            roughness: 0.3
        });

        // Back wall with neon accent
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(200, 100, 5),
            wallMaterial
        );
        backWall.position.set(0, 50, -100);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Neon stripe on back wall
        const neonStripe = new THREE.Mesh(
            new THREE.BoxGeometry(200, 2, 5.5),
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            })
        );
        neonStripe.position.set(0, 25, -99);
        this.scene.add(neonStripe);

        // Side walls
        const sideWallL = new THREE.Mesh(
            new THREE.BoxGeometry(5, 100, 150),
            wallMaterial
        );
        sideWallL.position.set(-100, 50, -30);
        sideWallL.castShadow = true;
        sideWallL.receiveShadow = true;
        this.scene.add(sideWallL);

        const sideWallR = new THREE.Mesh(
            new THREE.BoxGeometry(5, 100, 150),
            wallMaterial
        );
        sideWallR.position.set(100, 50, -30);
        sideWallR.castShadow = true;
        sideWallR.receiveShadow = true;
        this.scene.add(sideWallR);

        // Floating platforms for visual interest
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a3f5f,
            metalness: 0.5,
            roughness: 0.4
        });

        for (let i = 0; i < 6; i++) {
            const platform = new THREE.Mesh(
                new THREE.BoxGeometry(30, 2, 30),
                platformMaterial
            );
            platform.position.set(
                (i % 2) * 70 - 35,
                20 + i * 8,
                -60 + i * 10
            );
            platform.castShadow = true;
            platform.receiveShadow = true;
            this.scene.add(platform);
        }

        // Neon light orbs as visual markers
        const orbGeometry = new THREE.SphereGeometry(3, 16, 16);
        const orbMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2
        });

        const orbPositions = [
            [-40, 15, -20],
            [40, 15, -20],
            [0, 15, -80]
        ];

        orbPositions.forEach(pos => {
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(...pos);
            this.scene.add(orb);
            
            // Add a small point light for each orb
            const orbLight = new THREE.PointLight(0x00ffff, 0.5, 30);
            orbLight.position.set(...pos);
            this.scene.add(orbLight);
        });
    }

    /**
     * Create obstacles and level geometry
     */
    createObstacles() {
        // Create some simple buildings
        const buildingConfigs = [
            { x: 30, z: -30, width: 20, height: 15, depth: 20 },
            { x: -40, z: 50, width: 25, height: 12, depth: 15 },
            { x: 60, z: 20, width: 15, height: 20, depth: 25 },
            { x: -50, z: -60, width: 30, height: 10, depth: 20 }
        ];

        buildingConfigs.forEach(config => {
            const geometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.3, 0.4),
                metalness: 0.2,
                roughness: 0.7
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(config.x, config.height / 2, config.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        });

        // Add some platforms
        for (let i = 0; i < 5; i++) {
            const platform = new THREE.Mesh(
                new THREE.BoxGeometry(15, 1, 15),
                new THREE.MeshStandardMaterial({ color: 0x2a2a4e })
            );
            platform.position.set(
                (Math.random() - 0.5) * 200,
                Math.random() * 30 + 5,
                (Math.random() - 0.5) * 200
            );
            platform.castShadow = true;
            platform.receiveShadow = true;
            this.scene.add(platform);
        }
    }

    /**
     * Spawn shooting targets around the map
     */
    spawnTargets() {
        // Target spawn positions (behind cover like Valorant range)
        const targetPositions = [
            // Near first building - closer for testing
            new THREE.Vector3(5, 1.6, -5),
            new THREE.Vector3(8, 1.6, -8),
            new THREE.Vector3(3, 1.6, -10),

            // Near second building
            new THREE.Vector3(-6, 1.6, 7),
            new THREE.Vector3(-9, 1.6, 9),
            new THREE.Vector3(-4, 1.6, 6),

            // Near third building
            new THREE.Vector3(12, 1.6, 4),
            new THREE.Vector3(15, 1.6, 7),
            new THREE.Vector3(10, 1.6, 8),

            // Near fourth building
            new THREE.Vector3(-8, 1.6, -12),
            new THREE.Vector3(-11, 1.6, -15),
            new THREE.Vector3(-5, 1.6, -10),

            // Scattered targets - closer
            new THREE.Vector3(0, 1.6, 15),
            new THREE.Vector3(15, 1.6, 0),
            new THREE.Vector3(0, 1.6, -15),
            new THREE.Vector3(-15, 1.6, 0),
        ];

        // Spawn different types of targets
        targetPositions.forEach((position, index) => {
            let targetType = 'bot';
            if (index % 3 === 1) targetType = 'head';
            if (index % 3 === 2) targetType = 'body';

            const target = new Target(position, this.scene, targetType, this.botStrafeSpeed);
            this.targets.push(target);

            // Stagger pop-up times
            setTimeout(() => {
                target.popUp();
            }, Math.random() * 3000);
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        
        // Hide loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * Handle mouse down (firing & ADS)
     */
    onMouseDown(e) {
        if (e.button === 0) { // Left click
            this.fire();
            this.player.setADS(true); // Start ADS
        }
    }

    /**
     * Handle mouse up (stop ADS)
     */
    onMouseUp(e) {
        if (e.button === 0) {
            this.player.setADS(false);
        }
    }

    /**
     * Handle keyboard input
     */
    onKeyDown(e) {
        const key = e.key.toLowerCase();
        
        // Weapon switching
        if (key === '1') this.switchWeaponAnimated('vandal');
        if (key === '2') this.switchWeaponAnimated('phantom');
        if (key === '3') this.switchWeaponAnimated('operator');
        
        // Reload
        if (key === 'r') this.weaponSystem.startReload();
        
        // Weapon skin selection
        if (key === 'e') this.cycleWeaponSkin();
    }

    /**
     * Switch weapon with animation
     */
    switchWeaponAnimated(weaponName) {
        if (!this.weaponSystem.switchWeapon(weaponName)) return;

        this.updateWeaponView();
        this.updateHUD();
    }

    /**
     * Attach the current weapon mesh to the camera view
     */
    attachWeaponView() {
        if (!this.weaponSystem || !this.camera) return;
        if (this.currentWeaponObject) {
            this.camera.remove(this.currentWeaponObject);
            this.currentWeaponObject = null;
        }

        const weaponMesh = this.weaponSystem.currentWeapon?.mesh;
        if (!weaponMesh) return;

        weaponMesh.position.set(0.18, -0.22, -0.5);
        weaponMesh.rotation.set(0, Math.PI, 0);
        weaponMesh.scale.set(1, 1, 1);
        this.camera.add(weaponMesh);
        this.currentWeaponObject = weaponMesh;
    }

    /**
     * Update the displayed weapon when switching
     */
    updateWeaponView() {
        this.attachWeaponView();
    }

    /**
     * Fire weapon
     */
    fire() {
        // Get camera direction with minimal weapon sway
        let fireDirection = this.player.getCameraDirection();
        const sway = this.player.getWeaponSway();
        
        // Apply very subtle weapon sway (minimal recoil for competitive feel)
        fireDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), sway.y * 0.02);
        fireDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), sway.x * 0.02);
        
        const fireSuccess = this.weaponSystem.fire(
            fireDirection,
            this.player.getCameraPosition(),
            (bulletData) => {
                this.createBullet(bulletData);
                this.createMuzzleFlash();
            }
        );

        if (fireSuccess) {
            this.totalShots++;
            this.updateHUD();
            this.playFireSound();
        }
    }

    /**
     * Create bullet
     */
    createBullet(data) {
        const bullet = {
            position: data.position.clone(),
            direction: data.direction.clone(),
            speed: 100,
            damage: data.damage,
            maxDistance: 500,
            distanceTraveled: 0,
            weapon: data.weapon,
            lifetime: 5,
            trailParticles: []
        };

        // Create realistic bullet mesh (cylinder)
        const bulletGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
        const bulletMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdd00,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xff9900,
            emissiveIntensity: 0.6
        });
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        // Rotate bullet to face direction
        bulletMesh.position.copy(bullet.position);
        bulletMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            data.direction.clone().normalize()
        );
        
        this.scene.add(bulletMesh);
        bullet.mesh = bulletMesh;

        // Create bullet casing glow
        const casingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12);
        const casingMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc8800,
            metalness: 0.95,
            roughness: 0.05,
            emissive: 0xff6600,
            emissiveIntensity: 0.4
        });
        const casingMesh = new THREE.Mesh(casingGeometry, casingMaterial);
        casingMesh.position.copy(bulletMesh.position);
        casingMesh.quaternion.copy(bulletMesh.quaternion);
        this.scene.add(casingMesh);
        bullet.casingMesh = casingMesh;

        // Create muzzle fire trail
        this.createMuzzleTrail(data.position, data.direction);

        this.bullets.push(bullet);
    }

    /**
     * Create muzzle trail effect
     */
    createMuzzleTrail(position, direction) {
        // Create expanding muzzle smoke/fire cloud
        for (let i = 0; i < 8; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.15 + Math.random() * 0.1, 6, 6),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 1, 0.5),
                    transparent: true,
                    opacity: 0.7
                })
            );

            const spread = (Math.random() - 0.5) * 0.3;
            const upSpread = (Math.random() - 0.5) * 0.3;
            
            particle.position.copy(position).addScaledVector(
                direction,
                -0.5
            ).add(new THREE.Vector3(spread, upSpread, spread));

            this.scene.add(particle);

            // Animate particle
            let life = 0.3;
            const velocity = new THREE.Vector3(
                spread * 3,
                upSpread * 2 + 2,
                spread * 3
            );

            const animate = () => {
                life -= 0.016;
                particle.position.add(velocity.clone().multiplyScalar(0.016));
                particle.scale.multiplyScalar(1.08);
                particle.material.opacity = life / 0.3;

                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    this.scene.remove(particle);
                }
            };
            animate();
        }
    }

    /**
     * Create bullet trail particle
     */
    createBulletTrailParticle(position, direction) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 4, 4),
            new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.6
            })
        );

        particle.position.copy(position);
        this.scene.add(particle);

        // Fade out
        let life = 0.2;
        const animate = () => {
            life -= 0.016;
            particle.scale.multiplyScalar(0.95);
            particle.material.opacity = life / 0.2;
            particle.position.addScaledVector(direction, 0.5);

            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particle);
            }
        };
        animate();
    }

    /**
     * Create muzzle flash effect at camera
     */
    createMuzzleFlash() {
        // Removed the yellow shooting flash effect; keep recoil indicator only.
        const recoilIndicator = document.getElementById('recoil-indicator');
        if (recoilIndicator) {
            recoilIndicator.classList.add('active');
            setTimeout(() => {
                recoilIndicator.classList.remove('active');
            }, 300);
        }
    }

    /**
     * Create hit feedback on target hit
     */
    createHitFeedback() {
        // Crosshair pulse effect
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            crosshair.style.transform = 'translate(-50%, -50%) scale(1.5)';
            setTimeout(() => {
                crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
        }

        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 255, 200, 0.2);
            pointer-events: none;
            z-index: 5;
            animation: hitFlash 0.2s ease-out;
        `;
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.remove();
        }, 200);

        // Play hit sound
        this.playHitSound();
    }

    /**
     * Play hit sound
     */
    playHitSound() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // High pitched beep for hit confirmation
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = 1500;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Update bullets
     */
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Move bullet
            bullet.position.addScaledVector(bullet.direction, bullet.speed * deltaTime);
            bullet.distanceTraveled += bullet.speed * deltaTime;
            bullet.lifetime -= deltaTime;

            // Update mesh
            if (bullet.mesh) {
                bullet.mesh.position.copy(bullet.position);
            }
            
            // Update casing
            if (bullet.casingMesh) {
                bullet.casingMesh.position.copy(bullet.position);
            }

            // Add trail particles
            if (Math.random() > 0.7) {
                this.createBulletTrailParticle(bullet.position, bullet.direction);
            }

            // Check collision with targets
            let hitTarget = false;
            for (const target of this.targets) {
                if (target.isUp && !target.isHit) {
                    const distance = bullet.position.distanceTo(target.mesh.position);
                    if (distance < 2.5) { // Tight hit radius for skill-based gameplay
                        if (target.takeHit(bullet.damage)) {
                            this.hits++;
                            this.score += 10; // Points per hit
                            hitTarget = true;
                            this.createHitFeedback(); // Add visual/audio feedback
                            break;
                        }
                    }
                }
            }

            // Remove bullet if it hit something or is out of range
            if (hitTarget || bullet.distanceTraveled > bullet.maxDistance || bullet.lifetime <= 0) {
                if (bullet.mesh) {
                    this.scene.remove(bullet.mesh);
                }
                if (bullet.casingMesh) {
                    this.scene.remove(bullet.casingMesh);
                }
                this.bullets.splice(i, 1);
            }
        }
    }

    /**
     * Update targets
     */
    updateTargets(deltaTime) {
        this.targets.forEach(target => {
            target.update(deltaTime);
        });
    }

    /**
     * Cycle weapon skin
     */
    cycleWeaponSkin() {
        const weapon = this.weaponSystem.currentWeapon;
        const currentIndex = weapon.skins.indexOf(weapon.currentSkin);
        const nextIndex = (currentIndex + 1) % weapon.skins.length;
        this.weaponSystem.changeSkin(weapon.skins[nextIndex]);
        this.updateHUD();
    }

    /**
     * Play fire sound
     */
    playFireSound() {
        // Create audio context if needed
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create a short beep sound for fire
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Update HUD
     */
    updateHUD() {
        const stats = this.weaponSystem.getStats();

        // Update ammo display only
        document.getElementById('ammo-count').textContent = stats.ammo.split('/')[0];
        document.getElementById('ammo-reserve').textContent = '/ ' + stats.ammo.split('/')[1];
    }

    /**
     * Create settings UI overlay and attach events
     */
    createSettingsUI() {
        const settingsButton = document.getElementById('settings-button');
        const settingsPanel = document.getElementById('settings-panel');
        const closeButton = document.getElementById('settings-close');
        const saveButton = document.getElementById('settings-save');
        const cancelButton = document.getElementById('settings-cancel');
        const strafeInput = document.getElementById('strafe-speed-input');
        const sensitivityInput = document.getElementById('camera-sensitivity-input');

        if (!settingsPanel || !settingsButton || !strafeInput || !sensitivityInput) return;

        const updateValueLabels = () => {
            document.getElementById('strafe-speed-value').textContent = parseFloat(strafeInput.value).toFixed(1);
            document.getElementById('camera-sensitivity-value').textContent = parseFloat(sensitivityInput.value).toFixed(4);
        };

        strafeInput.value = this.botStrafeSpeed;
        sensitivityInput.value = this.player.sensitivity;
        updateValueLabels();

        const openSettings = () => {
            strafeInput.value = this.botStrafeSpeed;
            sensitivityInput.value = this.player.sensitivity;
            updateValueLabels();
            settingsPanel.classList.remove('hidden');
        };

        const closeSettings = () => {
            settingsPanel.classList.add('hidden');
        };

        settingsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            openSettings();
        });

        closeButton.addEventListener('click', closeSettings);
        cancelButton.addEventListener('click', closeSettings);
        settingsPanel.addEventListener('click', (event) => {
            if (event.target === settingsPanel) {
                closeSettings();
            }
        });

        strafeInput.addEventListener('input', updateValueLabels);
        sensitivityInput.addEventListener('input', updateValueLabels);

        saveButton.addEventListener('click', () => {
            this.botStrafeSpeed = parseFloat(strafeInput.value);
            GameConfig.player.botStrafeSpeed = this.botStrafeSpeed;
            this.player.sensitivity = parseFloat(sensitivityInput.value);
            GameConfig.player.mouseSensitivity = this.player.sensitivity;
            this.targets.forEach(target => {
                if (typeof target.strafeSpeed !== 'undefined') {
                    target.strafeSpeed = this.botStrafeSpeed;
                }
            });
            closeSettings();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'p') {
                openSettings();
            }
            if (e.key === 'Escape') {
                closeSettings();
            }
        });
    }

    /**
     * Update FPS counter
     */
    updateFPS() {
        this.frameCount++;
        this.fpsUpdateTime += this.deltaTime;

        if (this.fpsUpdateTime >= 0.25) { // Update every 250ms
            this.fps = Math.round(this.frameCount / this.fpsUpdateTime);
            document.getElementById('fps-counter').textContent = 'FPS: ' + this.fps;
            this.frameCount = 0;
            this.fpsUpdateTime = 0;
        }
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Main game loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        this.deltaTime = Math.min(this.clock.getDelta(), 0.016); // Cap at 60 FPS

        // Update systems
        this.player.update(this.deltaTime);
        this.player.updateArmAnimation(this.deltaTime, this.player.isMoving, this.player.velocity);
        this.weaponSystem.updateReload(this.deltaTime);
        this.auroraGenerator.update(this.deltaTime);
        this.updateBullets(this.deltaTime);
        this.updateTargets(this.deltaTime);

        // Update HUD
        this.updateHUD();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.init();
});
