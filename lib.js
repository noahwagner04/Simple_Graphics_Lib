// create some screen data object 
var canvas;
var context;
var screenBuffer;

function createCanvas(w, h) {
	canvas = document.createElement("canvas");
	canvas.id = "myCanvas";
	canvas.width = w;
	canvas.height = h;
	context = canvas.getContext("2d");
	canvas.onmousemove = mouseMoveCanvas;
	screenBuffer = new ImageData(canvas.width, canvas.height);
	document.body.appendChild(canvas);
}

function getScreenBuffer() {
	if (!canvas) return;
	return context.getImageData(0, 0, canvas.width, canvas.height).data;
}

function setScreenBuffer(buffer, x = 0, y = 0, dx = 0, dy = 0, dw, dh) {
	if (!canvas) return;
	let newImageData = new ImageData(buffer, canvas.width);
	dw = dw || canvas.width;
	dh = dh || canvas.height;
	context.putImageData(newImageData, x, y, dx, dy, dw, dh);
}

// relies on the provided image to be fully loaded (should run in a .then statment after loadImage func)
function getPixelBuffer(image) {
	let tempCanvas = document.createElement("canvas");
	let ctx = tempCanvas.getContext("2d");

	tempCanvas.width = image.width;
	tempCanvas.height = image.height;

	ctx.drawImage(image, 0, 0, image.width, image.height)
	return ctx.getImageData(0, 0, image.width, image.height).data;
}

// user manually assigns the resolve with their variable of choosing in a .then() statment (also a good place to but getPixelBuffer func)
function loadImage(path, width, height) {
	return new Promise((resolve, reject) => {
		let image;
		image = new Image();
		if (width) image.width = width;
		if (height) image.height = height;

		image.onload = function() {
			resolve(image);
		}

		image.onerror = function(e) {
			reject(`${e.type}: Loading Image`);
		}
		image.src = path;
	});
}

var FPS = 0;
var frameDelay = 0;
var lastFrameTime = 0;
// create some event object / keyboard / mouse object
var downKeys = {};

var mouseIsPressed = false;
var numToMouse = {
	0: "left",
	1: "middle",
	2: "right",
	3: "extra1",
	4: "extra2"
};

var mouseTypes = {
	left: 0,
	middle: 1,
	right: 2,
	extra1: 3,
	extra2: 4
};

var downMouse = {};

var mouseInCanvas = false;

var mouseX = 0;
var mouseY = 0;

var mouseCanvasX = 0;
var mouseCanvasY = 0;

// function mouseInCanvas() {
// 	if(!canvas) return;
// 	let rect = canvas.getBoundingClientRect();
// 	if(mouseX > rect.left && mouseX < rect.right && mouseY > rect.top && mouseY < rect.bottom) return true;
// 	return false;
// }

function mouseMoveWindow(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
	if (canvas && e.target === canvas) mouseInCanvas = true;
	else mouseInCanvas = false;
}

function mouseMoveCanvas(e) {
	mouseCanvasX = e.offsetX;
	mouseCanvasY = e.offsetY;
}

function mouseDown(e) {
	let userPressed = window.mousePressed;
	if (!downMouse[numToMouse[e.button]] && typeof userPressed === "function") userPressed(e);
	downMouse[numToMouse[e.button]] = true;
	mouseIsPressed = true;
}

function mouseUp(e) {
	let userReleased = window.mouseReleased;
	if (typeof mouseReleased === "function") mouseReleased(e);
	delete downMouse[numToMouse[e.button]];
	mouseIsPressed = false;
}

function mouseIsDown(str) {
	let keys = Object.keys(downMouse);
	if (keys === undefined) return;
	return keys.includes(str);
}

function keyDown(e) {
	let userPressed = window.keyPressed;
	if (!downKeys[e.key] && typeof userPressed === "function") userPressed(e);
	downKeys[e.key] = true;
}

function keyUp(e) {
	delete downKeys[e.key];
	let keyReleased = window.keyReleased;
	if (typeof keyReleased === "function") keyReleased(e);
}

window.onkeydown = keyDown;
window.onkeyup = keyUp;
window.onmousedown = mouseDown;
window.onmouseup = mouseUp;
window.onmousemove = mouseMoveWindow;
window.onwheel = window.mouseWheel;

async function _update() {
	let now = performance.now();
	FPS = 1000.0 / (now - lastFrameTime);
	lastFrameTime = now;
	if (frameDelay > 0) {
		await new Promise(r => setTimeout(r, frameDelay * 1000));
	}
	if (canvas) context.clearRect(0, 0, canvas.width, canvas.height);
	let userDraw = window.draw;
	if (typeof userDraw === "function") userDraw();
	window.requestAnimationFrame(_update);
}

function _run() {
	let isPreload = typeof window.preload === "function" ? true : false;
	let isStart = typeof window.start === "function" ? true : false;
	let p;
	if(isPreload) {
		p = window.preload();
		if(!(p instanceof Promise)) {
			console.log("preload function must return a Promise");
			return;
		}
	}
	if (isPreload && isStart) {
		p.then((result) => window.start(result)).then(_update);
	} else if (isPreload && !isStart) {
		p.then((result) => window._update(result));
	} else if (!isPreload && isStart) {
		window.start();
		window._update();
	}
}

if (document.readyState === "complete") {
	_run();
} else {
	window.onload = function() {
		_run();
	}
}

function keyIsDown(key) {
	let keys = Object.keys(downKeys);
	if (keys === undefined) return;
	return keys.includes(key);
}