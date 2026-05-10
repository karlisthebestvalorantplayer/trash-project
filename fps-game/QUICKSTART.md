# 🚀 QUICK START GUIDE

## How to Run the Game

### Option 1: Python Server (Recommended)
```bash
cd "c:\Users\Windows\Documents\trash project\fps-game"
python -m http.server 8000
```
Then open: **http://localhost:8000**

### Option 2: Double-click run.bat
Navigate to the game folder and double-click `run.bat`

### Option 3: PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\run.ps1
```

---

## 🎮 GAME FEATURES IMPLEMENTED

✅ **Zero Recoil** - Perfect accuracy, no spread whatsoever
✅ **100% Accuracy While Moving** - Full accuracy even while sprinting
✅ **Aurora Sky** - Procedurally animated with beautiful color shifts
✅ **Flashy Weapon Skins** - 12+ unique weapon skins with emissive materials
✅ **Multiple Weapons**:
   - Vandal (25 rounds, 39 DMG)
   - Phantom (30 rounds, 35 DMG)
   - Operator (5 rounds, 150 DMG)

---

## 🎮 CONTROLS

| Key | Action |
|-----|--------|
| **W/A/S/D** | Move |
| **Mouse** | Look around |
| **Left Click** | Fire |
| **Space** | Jump |
| **Shift** | Sprint |
| **R** | Reload |
| **1/2/3** | Switch weapons |
| **E** | Change weapon skin |

---

## 🎨 WEAPON SKINS

### Vandal
1. Classic - Dark gray, simple
2. Prime - Magenta glow, futuristic
3. Glitchpop - Green digital effect
4. Ion - Cyan sci-fi design

### Phantom
1. Classic - Dark, military
2. Nightmarket - Orange industrial
3. RGX - Cyan neon
4. Oni - Red demon aesthetic

### Operator
1. Classic - Black tactical
2. Elderflame - Orange fire effect
3. Araxys - Magenta alien tech

---

## 📁 PROJECT STRUCTURE

```
fps-game/
├── index.html           ← Start here
├── run.bat              ← Windows quick start
├── run.ps1              ← PowerShell quick start
├── package.json         ← Dependencies
├── README.md            ← Full documentation
├── css/
│   └── style.css        ← All UI styling
└── js/
    ├── GameEngine.js    ← Main game loop (800 lines)
    ├── Player.js        ← Movement & controls (200 lines)
    ├── WeaponSystem.js  ← Weapons & firing (350 lines)
    └── AuroraGenerator.js ← Sky effects (250 lines)
```

---

## 🔧 CUSTOMIZATION

### Change Aurora Colors
Edit `js/AuroraGenerator.js`:
```javascript
colorA: { value: new THREE.Color(0x00ff88) },  // Change these
colorB: { value: new THREE.Color(0xff00ff) },
colorC: { value: new THREE.Color(0x00aaff) }
```

### Adjust Weapon Damage
Edit `js/WeaponSystem.js` and change `damage` values in weapon configs

### Modify Movement Speed
Edit `js/Player.js`:
```javascript
this.moveSpeed = 7;      // Walk speed
this.sprintSpeed = 14;   // Sprint speed
```

---

## 🎯 TECHNICAL DETAILS

- **Engine**: Three.js (WebGL)
- **Language**: Vanilla JavaScript
- **No build step required**: Just open in browser!
- **Performance**: Targets 60 FPS
- **Physics**: Gravity, jumping, grounded collision
- **Audio**: Web Audio API for gun sounds

---

## 💡 TIPS FOR GAMEPLAY

1. **Master Movement** - Strafe with A/D while aiming to avoid shots
2. **Use Aurora for Cover** - The sky effects can obscure distant enemies
3. **Weapon Choice Matters**:
   - Vandal: Good all-around
   - Phantom: More ammo, faster firing
   - Operator: One-shot kills but slow
4. **Reload Often** - Keep your magazine topped up
5. **Learn the Map** - Buildings provide cover and flanking routes

---

## 🐛 TROUBLESHOOTING

**Game loads but nothing appears?**
- Allow browser access to WebGL
- Try a different browser (Chrome/Firefox)

**Controls not working?**
- Click in the game window to activate mouse lock
- Make sure NumLock is off if using number keys

**Slow/choppy?**
- Check FPS counter in top-right
- Close other browser tabs
- Try lowering screen resolution

---

## 🚀 Ready to Play?

Just run: `python -m http.server 8000` and visit http://localhost:8000

**Enjoy! 🎮✨**
