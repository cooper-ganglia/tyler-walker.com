/* shader.js - WebGL Liquid Background */
const canvas = document.createElement('canvas');
document.body.prepend(canvas);
const gl = canvas.getContext('webgl');

// Force canvas to cover entire viewport behind everything
Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '-1',
    pointerEvents: 'none'
});

const vsSource = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
`;

// The Mathematical Art (Fragment Shader)
const fsSource = `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        uv *= 2.0; // Zoom factor
        
        // Fluid simulation loop
        for(float i = 1.0; i < 4.0; i++){
            uv.x += 0.6 / i * cos(i * 2.5 * uv.y + time);
            uv.y += 0.6 / i * cos(i * 1.5 * uv.x + time);
        }
        
        // Color mixing logic
        vec3 finalColor = 0.5 + 0.5 * sin(time + uv.xyx + vec3(0,2,4));
        
        // Output result (Darkened for background use)
        gl_FragColor = vec4(finalColor * 0.2 + 0.05, 1.0); 
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
]), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const timeLocation = gl.getUniformLocation(program, "time");
const resolutionLocation = gl.getUniformLocation(program, "resolution");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

function render(time) {
    time *= 0.0005; // Animation speed
    
    gl.uniform1f(timeLocation, time);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
