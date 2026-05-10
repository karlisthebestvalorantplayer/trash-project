# 🔫 Valorant-Style FPS Web Game

A blazing fast, aesthetic browser-based FPS game with zero recoil, 100% accuracy while moving, beautiful aurora skies, and flashy weapon skins!

## 🎮 Features

### Game Mechanics
- **0 Recoil** - Perfect accuracy with no recoil spread
- **100% Accuracy While Moving** - Maintain full accuracy even while sprinting
- **Fast-Paced Gameplay** - Responsive controls and fluid movement
- **Multiple Weapons** - Vandal, Phantom, and Operator (sniper)
- **Weapon Skins** - Multiple flashy skins per weapon with unique visual effects:
  - **Vandal**: Classic, Prime (Magenta), Glitchpop (Green), Ion (Cyan)
  - **Phantom**: Classic, Nightmarket (Orange), RGX (Cyan), Oni (Red)
  - **Operator**: Classic, Elderflame (Orange), Araxys (Magenta)

### Visual Effects
- **Aurora Sky** - Procedurally generated, animated aurora borealis with mesmerizing color shifts
- **Glowing Weapon Skins** - Emissive materials with dynamic lighting
- **Muzzle Flash Effects** - Visual feedback on every shot
- **Dynamic Lighting** - Real-time shadows and ambient lighting

### HUD Elements
- Ammo counter with magazine/reserve display
- Weapon name and damage stats
- Health bar with gradient coloring
- Real-time FPS counter
- Recoil indicator (for visual feedback)
- Green crosshair with glow effects

## 🎮 How to Play

### Running the Game
1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended)
2. Click anywhere to activate mouse lock
3. Start playing!

### Controls
- **WASD** - Move forward/backward/strafe left/right
- **Mouse** - Look around (mouse lock enabled on click)
- **Space** - Jump
- **Shift** - Sprint
- **Mouse Click (Left)** - Fire weapon
- **R** - Reload
- **1** - Switch to Vandal
- **2** - Switch to Phantom  
- **3** - Switch to Operator (Sniper)
- **E** - Cycle weapon skins

## 🛠️ Game Mechanics

### Weapon Stats

#### Vandal (Assault Rifle)
- Damage: 39
- Magazine: 25 rounds
- Accuracy: 100% (even while moving)
- Recoil: 0
- Fire Rate: 0.1s between shots

#### Phantom (Assault Rifle)
- Damage: 35
- Magazine: 30 rounds
- Accuracy: 100%
- Recoil: 0
- Fire Rate: 0.08s between shots

#### Operator (Sniper)
- Damage: 150
- Magazine: 5 rounds
- Accuracy: 100%
- Recoil: 0
- Fire Rate: 0.6s between shots

### Movement System
- **Sprint Speed**: 14 units/second
- **Walk Speed**: 7 units/second
- **Jump Height**: Dynamic with gravity
- **Ground-based gameplay**: Movement stays grounded for tactical gameplay

## 🎨 Customization

### Change Aurora Colors
Edit `js/AuroraGenerator.js` and modify the color uniforms:
```javascript
colorA: { value: new THREE.Color(0x00ff88) },  // Cyan
colorB: { value: new THREE.Color(0xff00ff) },  // Magenta
colorC: { value: new THREE.Color(0x00aaff) },  // Blue
```

### Adjust Weapon Damage
Edit `js/WeaponSystem.js` and change the `damage` property:
```javascript
this.weapons.vandal = {
    damage: 39,  // Change this value
    // ...
}
```

### Modify Player Speed
Edit `js/Player.js`:
```javascript
this.moveSpeed = 7;      // Walk speed
this.sprintSpeed = 14;   // Sprint speed
```

## 🔧 Technical Stack

- **Three.js** - 3D rendering engine
- **WebGL** - Hardware-accelerated graphics
- **Web Audio API** - Sound effects
- **Vanilla JavaScript** - No dependencies beyond Three.js

## 📁 Project Structure

```
fps-game/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling
├── js/
│   ├── GameEngine.js      # Main game loop
│   ├── Player.js          # Player movement & controls
│   ├── WeaponSystem.js    # Weapons & firing
│   └── AuroraGenerator.js # Sky effects
├── assets/
│   ├── textures/          # Texture files (future)
│   └── sounds/            # Audio files (future)
└── README.md              # This file
```

## 🚀 Performance Tips

- Game targets 60 FPS on modern hardware
- Uses high-performance WebGL context
- Optimized shadow mapping
- Efficient particle and bullet systems

## 🎯 Future Features

- Multiplayer support (WebSocket)
- AI enemies
- More weapon skins
- Map variations
- Sound effects pack
- Weapon attachments (scopes, silencers)
- Ability system (Valorant-style abilities)
- Trading post for cosmetics

## 📝 Notes

This game emphasizes:
- **Competitive fairness**: 0 recoil ensures skill-based gameplay
- **Movement rewards**: 100% accuracy while moving encourages aggressive play
- **Visual appeal**: Aurora skies and glowing skins create an aesthetic atmosphere
- **Responsiveness**: Direct firing with no input lag

## 🎓 Learning Resources

This project demonstrates:
- Three.js scene setup and rendering
- Shader programming (aurora effects)
- Player input handling (keyboard + mouse)
- Game state management
- UI integration with WebGL
- Audio context usage

## 📜 License

Feel free to modify and extend this game for your own projects!

---

**Enjoy the game! 🎮✨**
