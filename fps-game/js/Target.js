/**
 * Shooting Target Class
 * Valorant-style range targets that pop up and down
 */

class Target {
    constructor(position, scene, targetType = 'bot', strafeSpeed = 8) {
        this.position = position.clone();
        this.basePosition = position.clone(); // Store base position for strafing
        this.scene = scene;
        this.targetType = targetType; // 'bot', 'head', 'body'
        this.isUp = false;
        this.isHit = false;
        this.health = 100;
        this.respawnTime = 1500; // Fast respawn for competitive feel
        this.popUpTime = 0;
        this.hitTime = 0;
        
        // Strafing behavior
        this.strafeSpeed = strafeSpeed; // Units per second
        this.strafeDirection = 1; // 1 or -1
        this.strafeDistance = 4; // How far to strafe left/right
        this.strafeTimeElapsed = 0;

        // Create target mesh based on type
        this.createMesh();

        // Start in down position
        this.setDownPosition();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Humanoid materials
        const clothingMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222, // Tactical dark suit
            metalness: 0.1,
            roughness: 0.9
        });
        
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xd2b48c, // Human skin tone
            roughness: 1.0
        });

        const armorMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4444, // Target red armor plates
            metalness: 0.4,
            roughness: 0.5
        });

        // Construct the humanoid figure
        if (this.targetType === 'bot' || this.targetType === 'body') {
            // Torso
            const torso = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.7, 0.25),
                clothingMaterial
            );
            torso.position.y = 0.35;
            this.mesh.add(torso);

            // Tactical Chest Plate
            const vest = new THREE.Mesh(
                new THREE.BoxGeometry(0.52, 0.45, 0.3),
                armorMaterial
            );
            vest.position.set(0, 0.4, 0.02);
            this.mesh.add(vest);

            // Arms
            const armGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
            const leftArm = new THREE.Mesh(armGeom, clothingMaterial);
            leftArm.position.set(-0.35, 0.4, 0);
            leftArm.rotation.z = 0.2;
            this.mesh.add(leftArm);

            const rightArm = new THREE.Mesh(armGeom, clothingMaterial);
            rightArm.position.set(0.35, 0.4, 0);
            rightArm.rotation.z = -0.2;
            this.mesh.add(rightArm);

            // Legs
            const legGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
            const leftLeg = new THREE.Mesh(legGeom, clothingMaterial);
            leftLeg.position.set(-0.15, -0.4, 0);
            this.mesh.add(leftLeg);

            const rightLeg = new THREE.Mesh(legGeom, clothingMaterial);
            rightLeg.position.set(0.15, -0.4, 0);
            this.mesh.add(rightLeg);
        }

        if (this.targetType === 'bot' || this.targetType === 'head') {
            // Head
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 16, 16),
                skinMaterial
            );
            head.position.y = 0.85;
            this.mesh.add(head);

            if (this.targetType === 'bot') {
                // Glowing Tactical Visor
                const visor = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.06, 0.1),
                    new THREE.MeshBasicMaterial({ color: 0x00ffff })
                );
                visor.position.set(0, 0.88, 0.15);
                this.mesh.add(visor);
            }
        }

        // Enable shadows for all humanoid parts
        this.mesh.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Add hit indicator (glow when hit)
        this.hitIndicator = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 16, 16),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0
            })
        );
        this.hitIndicator.position.copy(this.position);
        this.scene.add(this.hitIndicator);
    }

    setDownPosition() {
        // Target is below ground/hidden
        this.mesh.position.y = this.position.y - 2;
        this.isUp = false;
        this.isHit = false;
        this.health = 100;
        this.hitIndicator.material.opacity = 0;
    }

    popUp() {
        if (this.isUp || this.isHit) return;

        this.isUp = true;
        this.popUpTime = Date.now();

        // Animate popping up
        const startY = this.mesh.position.y;
        const targetY = this.position.y;
        const duration = 200; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out animation
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            this.mesh.position.y = startY + (targetY - startY) * easeProgress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    takeHit(damage = 50) {
        if (!this.isUp || this.isHit) return false;

        this.isHit = true;
        this.hitTime = Date.now();

        // Show hit indicator
        this.hitIndicator.material.opacity = 0.8;
        this.hitIndicator.position.copy(this.mesh.position);

        // Animate falling down
        const startY = this.mesh.position.y;
        const targetY = this.position.y - 2;
        const duration = 300; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease in animation
            const easeProgress = Math.pow(progress, 2);
            this.mesh.position.y = startY + (targetY - startY) * easeProgress;

            // Fade hit indicator
            this.hitIndicator.material.opacity = 0.8 * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Schedule respawn
                setTimeout(() => {
                    this.respawn();
                }, this.respawnTime);
            }
        };
        animate();

        return true; // Hit successful
    }

    respawn() {
        this.setDownPosition();
        this.strafeTimeElapsed = 0;
        // Will pop up again when triggered
    }

    update(deltaTime) {
        // Auto-pop up after some time if not hit
        if (!this.isUp && !this.isHit && Date.now() - this.popUpTime > 2000) {
            this.popUp();
        }

        // Apply strafing movement while target is up
        if (this.isUp && !this.isHit) {
            this.strafeTimeElapsed += deltaTime;
            
            // Strafe left and right
            const strafeOffset = Math.sin(this.strafeTimeElapsed * this.strafeSpeed) * this.strafeDistance;
            this.position.x = this.basePosition.x + strafeOffset;
            this.mesh.position.copy(this.position);
            this.hitIndicator.position.copy(this.position);
        }

        // Fade hit indicator over time
        if (this.hitIndicator.material.opacity > 0) {
            this.hitIndicator.material.opacity -= deltaTime * 2;
        }
    }

    dispose() {
        if (this.mesh) {
            this.mesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            this.scene.remove(this.mesh);
        }
        if (this.hitIndicator) {
            this.scene.remove(this.hitIndicator);
            this.hitIndicator.geometry.dispose();
            this.hitIndicator.material.dispose();
        }
    }
}