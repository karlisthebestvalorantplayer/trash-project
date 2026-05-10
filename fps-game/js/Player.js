/**
 * Player Class
 * Handles player movement, camera, and input
 */

class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.position = new THREE.Vector3(0, 1.6, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, -1);
        
        // Movement
        this.moveSpeed = 7; // Fast FPS movement
        this.sprintSpeed = 14;
        this.isSprinting = false;
        this.isMoving = false;
        
        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.armor = 0;
        this.maxArmor = 100;
        
        // Input state
        this.keys = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            'shift': false,
            ' ': false
        };
        
        // Camera rotation
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.pitch = 0;
        this.yaw = 0;
        this.sensitivity = 0.003;
        
        // First-person weapon sway
        this.weaponSway = new THREE.Vector3(0, 0, 0);
        this.weaponSwayIntensity = 0.02;
        this.isADS = false; // Aim down sights
        
        // Physics
        this.isGrounded = true;
        this.gravity = 20;
        this.jumpForce = 8;
        
        this.playerGroup = new THREE.Group();
        // Create player arms
        this.arms = null;
        
        this.setupInputListeners();
        this.setupMouseLock();
    }

    /**
     * Get arms group for weapon positioning
     */
    getArmsGroup() {
        return this.arms;
    }

    /**
     * Apply arm animation for movement bob
     */
    updateArmAnimation(deltaTime, isMoving, velocity) {
        // Arm bobbing when moving
        const bobAmount = isMoving ? 0.1 : 0.02;
        const bobSpeed = isMoving ? 6 : 2;
        
        const bobOffset = Math.sin(Date.now() * 0.001 * bobSpeed) * bobAmount;
    }

    /**
     * Setup keyboard input listeners
     */
    setupInputListeners() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = true;
            }
            if (key === 'shift') this.keys['shift'] = true;
            if (key === ' ') this.keys[' '] = true;
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = false;
            }
            if (key === 'shift') this.keys['shift'] = false;
            if (key === ' ') this.keys[' '] = false;
        });
    }

    /**
     * Setup mouse lock and look
     */
    setupMouseLock() {
        document.addEventListener('click', () => {
            // Only request pointer lock if not already locked
            if (document.pointerLockElement !== document.body) {
                document.body.requestPointerLock = document.body.requestPointerLock || 
                                                  document.body.mozRequestPointerLock;
                
                // Request pointer lock with error handling
                if (document.body.requestPointerLock) {
                    document.body.requestPointerLock().catch(err => {
                        console.warn('Pointer lock request failed:', err);
                    });
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                this.yaw -= e.movementX * this.sensitivity;
                this.pitch -= e.movementY * this.sensitivity;

                // Clamp pitch to prevent flipping
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            }
        });

        // Handle pointer lock exit
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === null) {
                console.log('Pointer lock released');
            }
        });
    }

    /**
     * Update player movement
     */
    updateMovement(deltaTime) {
        const moveDirection = new THREE.Vector3();
        let moving = false;

        // Calculate movement direction based on input
        if (this.keys['w']) {
            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();
            moveDirection.add(forward);
            moving = true;
        }
        if (this.keys['s']) {
            const backward = new THREE.Vector3();
            this.camera.getWorldDirection(backward);
            backward.y = 0;
            backward.normalize();
            moveDirection.sub(backward);
            moving = true;
        }
        if (this.keys['a']) {
            const left = new THREE.Vector3();
            this.camera.getWorldDirection(left);
            left.y = 0;
            left.normalize();
            const right = left.clone().cross(new THREE.Vector3(0, 1, 0));
            moveDirection.sub(right);
            moving = true;
        }
        if (this.keys['d']) {
            const right = new THREE.Vector3();
            this.camera.getWorldDirection(right);
            right.y = 0;
            right.normalize();
            const left = right.clone().cross(new THREE.Vector3(0, 1, 0));
            moveDirection.sub(left);
            moving = true;
        }

        // Normalize movement direction
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
        }

        this.isMoving = moving;

        // Apply sprint
        this.isSprinting = this.keys['shift'] && moving;
        const currentSpeed = this.isSprinting ? this.sprintSpeed : this.moveSpeed;

        // Apply movement
        this.velocity.x = moveDirection.x * currentSpeed;
        this.velocity.z = moveDirection.z * currentSpeed;

        // Apply gravity
        if (!this.isGrounded) {
            this.velocity.y -= this.gravity * deltaTime;
        }

        // Jump
        if (this.keys[' '] && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            this.keys[' '] = false; // Prevent multiple jumps
        }

        // Simple ground collision (y = 0)
        if (this.position.y + this.velocity.y * deltaTime <= 1.6) {
            this.position.y = 1.6;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // First-person camera - eye level
        this.camera.position.copy(this.position);
        this.camera.position.y = 1.7; // Eye height
        
        // Apply camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }

    /**
     * Take damage
     */
    takeDamage(damage) {
        const damageToHealth = Math.max(0, damage - (this.armor * 0.75));
        this.health = Math.max(0, this.health - damageToHealth);
        return this.health;
    }

    /**
     * Heal player
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health;
    }

    /**
     * Add armor
     */
    addArmor(amount) {
        this.armor = Math.min(this.maxArmor, this.armor + amount);
        return this.armor;
    }

    /**
     * Get camera direction
     */
    getCameraDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
        return direction;
    }

    /**
     * Set ADS state (Aim Down Sights)
     */
    setADS(isAiming) {
        this.isADS = isAiming;
    }

    /**
     * Get weapon sway offset
     */
    getWeaponSway() {
        // Create subtle swaying motion
        const time = Date.now() * 0.001;
        this.weaponSway.x = Math.sin(time * 1.5) * this.weaponSwayIntensity * (this.isADS ? 0.3 : 1);
        this.weaponSway.y = Math.cos(time * 2) * this.weaponSwayIntensity * (this.isADS ? 0.3 : 1);
        return this.weaponSway;
    }

    /**
     * Get camera position
     */
    getCameraPosition() {
        return this.camera.position.clone();
    }

    /**
     * Get player stats
     */
    getStats() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            armor: this.armor,
            position: this.position.clone(),
            velocity: this.velocity.clone(),
            isMoving: this.isMoving,
            isSprinting: this.isSprinting,
            isGrounded: this.isGrounded
        };
    }

    /**
     * Update player each frame
     */
    update(deltaTime) {
        this.updateMovement(deltaTime);
    }
}
