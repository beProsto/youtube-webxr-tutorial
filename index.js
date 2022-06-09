const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl2");

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
};

const globals = {};

function onStart() {
	globals.vertices = new Float32Array([
		-0.5, -0.5,
		-0.5, 0.5,
		0.5, -0.5,

		0.5, -0.5,
		0.5, 0.5,
		-0.5, 0.5,
	]);

	globals.vertexArray = gl.createVertexArray();
	gl.bindVertexArray(globals.vertexArray);

	globals.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, globals.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, globals.vertices, gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

	globals.vertexShaderCode = `#version 100
		precision highp float;

		attribute vec2 position;

		uniform mat4 matrix;

		void main() {
			gl_Position = matrix * vec4(position, 0.0, 1.0);
		}
	`;
	globals.fragmentShaderCode = `#version 100
		precision mediump float;

		void main() {
			gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
		}
	`;

	globals.vertShader = gl.createShader(gl.VERTEX_SHADER);
	globals.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(globals.vertShader, globals.vertexShaderCode);
	gl.shaderSource(globals.fragShader, globals.fragmentShaderCode);
	gl.compileShader(globals.vertShader);
	gl.compileShader(globals.fragShader);

	globals.shaderProgram = gl.createProgram();
	gl.attachShader(globals.shaderProgram, globals.vertShader);
	gl.attachShader(globals.shaderProgram, globals.fragShader);
	gl.linkProgram(globals.shaderProgram);
	gl.useProgram(globals.shaderProgram);
}

function onUpdate(time) {
	gl.clearColor(Math.sin(time/1000)/2+0.5, 0.4, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const matrix = new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);

	gl.uniformMatrix4fv(gl.getUniformLocation(globals.shaderProgram, "matrix"), gl.FALSE, matrix);

	gl.bindVertexArray(globals.vertexArray);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	window.requestAnimationFrame(onUpdate);
}


window.onresize();
onStart();
window.requestAnimationFrame(onUpdate);