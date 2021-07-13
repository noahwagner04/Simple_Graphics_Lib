var screenData;
var img;
var buffer;

function preload() {
	return new Promise((resolve, reject) => {
		loadImage("test.png", 600, 400)
			.then(result => {
				img = result;
				return getPixelBuffer(result);
			}).then(result => {
				buffer = result
				resolve();
			});
	});
}

function start() {
	createCanvas(600, 400);
	screenData = getScreenBuffer();
}

function draw() {
	context.fillRect(0, 0, canvas.width, canvas.height);
	if (mouseIsDown("left")) console.log("LEFT IS DOWN");
	if (mouseIsDown("middle")) console.log("MIDDLE IS DOWN");
	if (keyIsDown("a")) console.log("A IS DOWN");
	if (keyIsDown("s")) console.log("S IS DOWN");
	if (keyIsDown("d")) console.log("D IS DOWN");
	for (let i = 0; i < screenData.length; i += 4) {
		let x = i / 4 % canvas.width;
		let y = i / 4 / canvas.width;
		screenData[i + 0] = x; // R value
		screenData[i + 1] = y; // G value
		screenData[i + 2] = 100; // B value
		screenData[i + 3] = 255; // A value
	}
	setScreenBuffer(screenData);
}

function mousePressed(e) {
	if (e.button === mouseTypes.left) console.log("LEFT IS PRESSED");
	if (e.button === mouseTypes.middle) console.log("MIDDLE IS PRESSED");
}

function mouseReleased(e) {
	if (e.button === mouseTypes.left) console.log("LEFT IS RELEASED");
	if (e.button === mouseTypes.middle) console.log("MIDDLE IS RELEASED");
}

function keyPressed(e) {
	if (e.key === "a") console.log("A IS PRESSED")
}

function keyReleased(e) {
	if (e.key === "a") {
		console.log("A IS RELEASED");
		aPressed = false;
	}
}

function mouseWheel(e) {

}