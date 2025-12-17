/* shader.js - Upgraded with Reality Slider */
const canvas = document.createElement('canvas');
document.body.prepend(canvas);
const gl = canvas.getContext('webgl');

Object.assign(canvas.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    zIndex: '-1',
    pointerEvents: 'none'
});

const vsSource = `
    attribute vec4 position;
    void main() { gl_Position = position; }
`;

// Fragment Shader with Dynamic Colors
const fsSource = `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 colorA; // Main Color
    uniform vec3 colorB; // Secondary Color

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        uv *= 2.0;
        
        // Fluid Math
        for(float i = 1.0; i < 4.0; i++){
            uv.x += 0.6 / i * cos(i * 2.5 * uv.y + time);
            uv.y += 0.6 / i * cos(i * 1.5 * uv.x + time);
        }
        
        // Mix colors based on fluid math
        float intensity = 0.5 + 0.5 * sin(time + uv.x + uv.y);
        vec3 finalColor = mix(colorA, colorB, intensity);
        
        gl_FragColor = vec4(finalColor * 0.3, 1.0); 
    }
`;

// --- BOILERPLATE SETUP ---
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader); return null;
    }
    return shader;
}
const program = gl.createProgram();
gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);
gl.useProgram(program);

// Buffer
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
const posLoc = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// --- UNIFORMS & THEMES ---
const timeLoc = gl.getUniformLocation(program, "time");
const resLoc = gl.getUniformLocation(program, "resolution");
const colorALoc = gl.getUniformLocation(program, "colorA");
const colorBLoc = gl.getUniformLocation(program, "colorB");

// THEMES: [Color1 (R,G,B), Color2 (R,G,B)]
const themes = [
    { a: [0.5, 0.0, 0.5], b: [0.0, 0.0, 0.2] }, // 0: Void (Purple/Black)
    { a: [0.0, 0.8, 0.5], b: [0.0, 0.2, 0.1] }, // 1: Cyber (Green/Dark Teal)
    { a: [1.0, 0.4, 0.0], b: [0.3, 0.0, 0.0] }  // 2: Magma (Orange/Red)
];

// Current State
let currentTheme = themes[0];
let targetTheme = themes[0];

// Handle Slider Input
const slider = document.getElementById('realitySlider');
if (slider) {
    slider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        targetTheme = themes[index];
    });
}

// Linear Interpolation helper
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

function render(time) {
    time *= 0.0005;
    
    // Smoothly transition colors
    // We move 5% of the way to the target every frame (smooth dissolve)
    for(let i=0; i<3; i++) {
        currentTheme.a[i] = lerp(currentTheme.a[i], targetTheme.a[i], 0.05);
        currentTheme.b[i] = lerp(currentTheme.b[i], targetTheme.b[i], 0.05);
    }

    gl.uniform1f(timeLoc, time);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform3fv(colorALoc, currentTheme.a);
    gl.uniform3fv(colorBLoc, currentTheme.b);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);