/**
 * Aurora Sky Generator
 * Creates beautiful, procedural aurora borealis effects
 */

class AuroraGenerator {
    constructor() {
        this.skybox = null;
        this.auroraTexture = null;
        this.time = 0;
        this.shaderMaterial = null;
    }

    /**
     * Creates an aurora sky with animated shader
     */
    createAuroraSky(scene) {
        // Create aurora shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorA: { value: new THREE.Color(0x00ff88) },  // Cyan
                colorB: { value: new THREE.Color(0xff00ff) },  // Magenta
                colorC: { value: new THREE.Color(0x00aaff) },  // Blue
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorA;
                uniform vec3 colorB;
                uniform vec3 colorC;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                // Noise function
                float noise(vec3 p) {
                    return sin(p.x * 0.1 + time * 0.5) * 
                           sin(p.y * 0.1) * 
                           sin(p.z * 0.1 + time * 0.3);
                }
                
                // Perlin-like noise
                float perlinNoise(vec3 p) {
                    float n = sin(p.x * 12.9898 + p.y * 78.233 + p.z * 45.164 + time * 2.0) * 43758.5453;
                    return fract(n);
                }
                
                vec3 generateAurora(vec3 pos) {
                    vec3 aurora = vec3(0.0);
                    
                    // Multiple layers of noise for organic effect
                    float wave1 = sin(pos.x * 0.05 + time * 0.3) * 0.5 + 0.5;
                    float wave2 = sin(pos.y * 0.02 - time * 0.2) * 0.5 + 0.5;
                    float wave3 = cos((pos.x + pos.y) * 0.03 + time * 0.1) * 0.5 + 0.5;
                    
                    // Create flowing aurora waves
                    float height = pos.y / 200.0 + 0.5;
                    float intensity = wave1 * wave2 * wave3;
                    intensity *= height * (1.0 - height * 0.5);
                    
                    // Blend colors based on position and noise
                    float mix1 = sin(pos.x * 0.01 + time * 0.5) * 0.5 + 0.5;
                    float mix2 = cos(pos.y * 0.01 - time * 0.3) * 0.5 + 0.5;
                    
                    aurora = mix(colorA, colorB, mix1);
                    aurora = mix(aurora, colorC, mix2);
                    
                    // Add more vibrant colors
                    aurora += vec3(0.0, 1.0, 0.8) * intensity * 0.5;
                    
                    return aurora * intensity;
                }
                
                void main() {
                    vec3 pos = vPosition;
                    
                    // Base dark sky
                    vec3 baseColor = vec3(0.01, 0.02, 0.05);
                    
                    // Add some stars
                    float stars = perlinNoise(pos * 10.0);
                    stars = smoothstep(0.9, 1.0, stars);
                    baseColor += vec3(stars * 0.3);
                    
                    // Generate aurora
                    vec3 auroraColor = generateAurora(pos);
                    
                    // Combine
                    vec3 finalColor = baseColor + auroraColor;
                    
                    // Add subtle glow
                    finalColor += vec3(0.1, 0.3, 0.4) * pow(length(auroraColor), 2.0) * 0.1;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            side: THREE.BackSide,
        });

        this.shaderMaterial = shaderMaterial;

        // Create skybox geometry
        const geometry = new THREE.SphereGeometry(5000, 64, 64);
        const skybox = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(skybox);

        this.skybox = skybox;
        return skybox;
    }

    /**
     * Updates aurora animation
     */
    update(deltaTime) {
        this.time += deltaTime;
        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.time.value = this.time;
        }
    }

    /**
     * Changes aurora colors
     */
    setColors(colorA, colorB, colorC) {
        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.colorA.value = new THREE.Color(colorA);
            this.shaderMaterial.uniforms.colorB.value = new THREE.Color(colorB);
            this.shaderMaterial.uniforms.colorC.value = new THREE.Color(colorC);
        }
    }
}
