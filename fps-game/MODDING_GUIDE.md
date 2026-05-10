# 🛠️ ADVANCED MODDING GUIDE

This guide shows you how to extend and customize your FPS game with advanced features!

---

## 🤖 Adding Enemy AI

### Step 1: Create Enemy Class

Create `js/Enemy.js`:

```javascript
class Enemy {
    constructor(position, scene) {
        this.position = position;
        this.scene = scene;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 5;
        this.viewDistance = 50;
        this.isAlive = true;

        // Create enemy mesh
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xff3333 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }

    update(deltaTime, playerPosition) {
        if (!this.isAlive) return;

        const direction = playerPosition.clone().sub(this.position);
        const distance = direction.length();

        if (distance < this.viewDistance) {
            // Move toward player
            direction.normalize();
            this.position.addScaledVector(direction, this.speed * deltaTime);
            this.mesh.position.copy(this.position);
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
            this.scene.remove(this.mesh);
        }
    }
}
```

### Step 2: Add to GameEngine.js

```javascript
// In initializeSystems()
this.enemies = [];
this.spawnEnemy(new THREE.Vector3(50, 1.6, 0));

// Add method
spawnEnemy(position) {
    const enemy = new Enemy(position, this.scene);
    this.enemies.push(enemy);
}

// In animate() 
this.enemies.forEach(enemy => {
    enemy.update(this.deltaTime, this.player.getCameraPosition());
});
```

---

## 🌐 Adding Multiplayer (WebSocket)

### Step 1: Create Server (Node.js)

`server.js`:
```javascript
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const players = new Map();

wss.on('connection', (ws) => {
    const playerId = Date.now().toString();
    players.set(playerId, { ws, position: {}, rotation: {} });

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        
        // Broadcast player position
        if (message.type === 'move') {
            players.get(playerId).position = message.position;
            
            // Send to other players
            wss.clients.forEach(client => {
                if (client !== ws) {
                    client.send(JSON.stringify({
                        type: 'playerMove',
                        playerId,
                        position: message.position
                    }));
                }
            });
        }
    });

    ws.on('close', () => players.delete(playerId));
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

### Step 2: Client Connection

```javascript
// In GameEngine.js
connectMultiplayer() {
    this.socket = new WebSocket('ws://localhost:3000');
    
    this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'playerMove') {
            this.updateRemotePlayer(message.playerId, message.position);
        }
    };
}

updateRemotePlayer(id, position) {
    // Create/update remote player mesh
}

// Send updates
setInterval(() => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
            type: 'move',
            position: this.player.position,
            rotation: this.camera.rotation
        }));
    }
}, 100);
```

---

## 💥 Adding Particle Effects

### Create ParticleSystem.js

```javascript
class Particle {
    constructor(position, velocity, life, color, scene) {
        this.position = position;
        this.velocity = velocity;
        this.life = life;
        this.maxLife = life;
        
        const geometry = new THREE.SphereGeometry(0.05, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }

    update(deltaTime) {
        this.life -= deltaTime;
        this.position.addScaledVector(this.velocity, deltaTime);
        this.mesh.position.copy(this.position);
        
        // Fade out
        this.mesh.material.opacity = this.life / this.maxLife;
    }
}

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    emit(position, count = 10, color = 0xffaa00) {
        for (let i = 0; i < count; i++) {
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            const particle = new Particle(position, velocity, 1.0, color, this.scene);
            this.particles.push(particle);
        }
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].life <= 0) {
                this.scene.remove(this.particles[i].mesh);
                this.particles.splice(i, 1);
            }
        }
    }
}
```

---

## 🎯 Adding Damage Zones

### Create Hazard System

```javascript
class Hazard {
    constructor(position, radius, damage, scene) {
        this.position = position;
        this.radius = radius;
        this.damage = damage;
        
        const geometry = new THREE.SphereGeometry(radius, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff3333,
            transparent: true,
            opacity: 0.3
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }

    isPlayerInside(playerPos) {
        return this.position.distanceTo(playerPos) < this.radius;
    }
}
```

---

## 🎪 Adding Map Variations

### Create MapManager.js

```javascript
class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMap = 'default';
        this.mapData = {
            'default': { buildings: 4, platforms: 5, enemies: 3 },
            'urban': { buildings: 8, platforms: 10, enemies: 5 },
            'ruins': { buildings: 12, platforms: 3, enemies: 8 }
        };
    }

    loadMap(mapName) {
        const config = this.mapData[mapName];
        this.generateLevel(config);
        this.currentMap = mapName;
    }

    generateLevel(config) {
        // Generate buildings, platforms, enemies based on config
    }
}
```

---

## 🎨 Adding Custom Shaders

### Create Advanced Aurora

```javascript
// In AuroraGenerator.js
createAdvancedAurora() {
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            speed: { value: 0.5 },
            intensity: { value: 1.0 }
        },
        vertexShader: `
            // Your vertex shader code
        `,
        fragmentShader: `
            // Advanced fragment shader for aurora
        `
    });
}
```

---

## 🔊 Adding 3D Audio

### Spatial Audio Setup

```javascript
class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
    }

    createSpatialSound(position, soundFile) {
        const sound = new THREE.PositionalAudio(this.listener);
        this.audioLoader.load(soundFile, (audioBuffer) => {
            sound.setBuffer(audioBuffer);
            sound.play();
        });
        const object = new THREE.Object3D();
        object.position.copy(position);
        object.add(sound);
        return object;
    }
}
```

---

## ✅ Optimization Tips

### Performance Improvements

1. **Use Object Pooling** - Reuse bullets/particles instead of creating new ones
2. **Level of Detail (LOD)** - Reduce enemy complexity at distance
3. **Frustum Culling** - Only render visible objects
4. **Batch Geometries** - Combine static meshes

```javascript
// Example: Object pooling for bullets
class BulletPool {
    constructor(size = 100) {
        this.pool = [];
        for (let i = 0; i < size; i++) {
            this.pool.push(this.createBullet());
        }
    }

    get() {
        return this.pool.length ? this.pool.pop() : this.createBullet();
    }

    return(bullet) {
        bullet.reset();
        this.pool.push(bullet);
    }

    createBullet() {
        return new Bullet();
    }
}
```

---

## 📚 Resources

- **Three.js Docs**: https://threejs.org/docs/
- **WebGL Guide**: https://webgl2fundamentals.org/
- **Game Dev**: https://www.gamedev.net/

---

**Happy modding! 🚀**
