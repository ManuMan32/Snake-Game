"use strict";

// ---- Variables ----

const game = document.getElementById("game");
const player = document.getElementById("player");
const titleScreen = document.getElementById("title-screen");
const credits = document.getElementById("credits");

let gameWidth = 480;
let gameHorCells = 16;
let mediaQuery = window.matchMedia("(max-width: 700px)");
	if (mediaQuery.matches) { gameWidth = 300; gameHorCells = 10; } //Reduce mobile game proportions
let gameHeight = 480;
let gameVerCells = 16;

let x = 0; //Position X of the player
let y = 0; //Position Y of the player
let xApple, yApple;
let apples = -1;
let direction = "Right";
let nowDirection;
let positionQueue = []; //Queue of positions

let snakeInterval = null;
function createInterval() {
	snakeInterval = setInterval(()=>{
		movePlayer();
		//Checks the collision with an apple
		if (x == xApple && y == yApple) {
			//Deletes the apple
			const apple = document.querySelector(".apple");
			apple.remove();
			//Creates a new part for the snake
			apples++;
			const part = document.createElement("div");
			part.classList.add("part");
			part.id = "part"+apples;
			part.style.left = x+"px";
			part.style.top = y+"px";
			game.appendChild(part);
			//Creates another apple
			createApple();
		}
	},150);
}

// ---- Controls ----

// DESKTOP
	document.addEventListener("keydown",e => {
		if (snakeInterval && e.key.startsWith("Arrow")) {
			const newDirection = e.key.slice(5);
			if ((newDirection == "Right" && nowDirection != "Left") ||
				(newDirection == "Left" && nowDirection != "Right") ||
				(newDirection == "Up" && nowDirection != "Down") ||
				(newDirection == "Down" && nowDirection != "Up")) {
				direction = newDirection;
			}
		}
	});

// MOBILE
	const upButton = document.getElementById("up-button");
	const leftButton = document.getElementById("left-button");
	const downButton = document.getElementById("down-button");
	const rightButton = document.getElementById("right-button");
	upButton.addEventListener("touchstart",()=>{ if (nowDirection != "Down") direction = "Up" });
	leftButton.addEventListener("touchstart",()=>{ if (nowDirection != "Right") direction = "Left" });
	downButton.addEventListener("touchstart",()=>{ if (nowDirection != "Up") direction = "Down" });
	rightButton.addEventListener("touchstart",()=>{ if (nowDirection != "Left") direction = "Right" });

// ---- Event Listeners ----

const playButton = document.getElementById("play-button");
playButton.addEventListener("click",animateTitle);

// ---- Functions ----

	//Checks if a point ([xCheck,yCheck]) exists in the queue
function checkQueuePosition(xCheck,yCheck) {
	const mappedQueue = positionQueue.map(el => el[0].toString() + el[1].toString());
	return (mappedQueue.includes(xCheck.toString()+yCheck.toString()));
}

	//Moves the player
function movePlayer() {
	positionQueue.unshift([x,y]); //Adds the actual position to the queue
	if (positionQueue.length > (apples+2)) positionQueue.splice((apples+2),1); //Limit of the queue
	switch (direction) {
		case "Left": x -= 30; break;
		case "Right": x += 30; break;
		case "Up": y -= 30; break;
		case "Down": y += 30; break;
	}
	nowDirection = direction;
	if (x < 0 || y < 0 || x > (gameWidth - 30) || y > (gameHeight - 30) || checkQueuePosition(x,y)) killPlayer();
	else animatePlayer();
}

	//Animates the player (After it moves)
function animatePlayer() {
	player.style.left = x+"px";
	player.style.top = y+"px";
	for (let i in positionQueue) {
		//Moves the other parts following the queue of positions
		const part = document.getElementById("part"+i);
		if (part) {
			part.style.left = positionQueue[i][0]+"px";
			part.style.top = positionQueue[i][1]+"px";
		}
	}
	const eye1 = document.querySelector(".eye1");
	const eye2 = document.querySelector(".eye2");
	if (direction == "Left" || direction == "Right") {
		eye1.style.left = "15px";
		eye1.style.top = "5px";
		eye2.style.left = "15px";
		eye2.style.top = "20px";
	} else {
		eye1.style.left = "5px";
		eye1.style.top = "10px";
		eye2.style.left = "20px";
		eye2.style.top = "10px";
	}
}

	//Kills the player (Shows Game Over screen)
function killPlayer() {
	const parts = document.querySelectorAll(".part");
	parts.forEach(i=>{
		if (typeof i == "object") i.style.backgroundColor = "#f00";
	});
	player.style.backgroundColor = "#f00";
	clearInterval(snakeInterval);

	//Creates the Game Over screen
	const gameOver = document.createElement("div");
	gameOver.id = "game-over";
	gameOver.innerText = "Game Over";
	const tryAgain = document.createElement("div");
	tryAgain.id = "try-again";
	tryAgain.innerText = "Try Again";
	tryAgain.addEventListener("click",tryAgainFunc)
	function tryAgainFunc() {
		const parts = document.querySelectorAll(".part");
		parts.forEach(i=>i.remove());
		player.style.left = "0";
		player.style.top = "0";
		x = 0;
		y = 0;
		apples = -1;
		positionQueue = [];
		player.style.backgroundColor = "#fff";
		direction = "Right";
		const apple = document.querySelector(".apple");
		apple.remove();
		createApple();
		tryAgain.style.opacity = "0";
		gameOver.style.opacity = "0";
		setTimeout(()=>{
			createInterval();
			gameOver.remove();
			tryAgain.remove();
		},1000);
		this.removeEventListener("click",tryAgainFunc);
	}
	game.appendChild(gameOver);
	game.appendChild(tryAgain);
	setTimeout(()=>{
		gameOver.style.opacity = "1";
		tryAgain.style.opacity = "1";
	},100);	
}

	//Creates an apple in a random position
function createApple() {
	xApple = Math.floor(Math.random()*gameHorCells)*30;
	yApple = Math.floor(Math.random()*gameVerCells)*30;
	//Loop that finds an unique position for the apple
	while(true) {
		if (checkQueuePosition(xApple,yApple)) {
			xApple = Math.floor(Math.random()*gameHorCells)*30;
			yApple = Math.floor(Math.random()*gameVerCells)*30;
		} else break;
	}
	const apple = document.createElement("div");
	apple.classList.add("apple");
	apple.style.left = xApple+"px";
	apple.style.top = yApple+"px";
	game.appendChild(apple);
}
createApple();

// ---- Game Title Functions ----

	//Variables
const s = document.getElementById("letterS");
const n = document.getElementById("letterN");
const a = document.getElementById("letterA");
const k = document.getElementById("letterK");
const e = document.getElementById("letterE");

	//Function that creates all nodes of the Title Screen
function createTitle() {
	let counter = 0;
	let sValues, nValues, aValues, kValues, eValues;

	//Arrays that determine how the letters of the title should be built
	if (mediaQuery.matches) {
		sValues = [[30,0,15],[15,0,15],[0,0,15],[0,15,15],[0,30,15],
			[15,30,15],[30,30,15],[30,45,15],[30,60,15],[15,60,15],[0,60,15]];
		nValues = [[0,0,75],[15,15,30],[30,30,30],[45,0,75]];
		aValues = [[0,0,75],[15,0,15],[15,30,15],[30,0,75]];
		kValues = [[0,0,75],[15,30,15],[30,15,15],[45,0,15],[30,45,15],[45,60,15]];
		eValues = [[0,0,75],[15,0,15],[30,0,15],[15,30,15],[30,30,15],[15,60,15],[30,60,15]];
		s.style.width = "45px";
		a.style.width = "45px";
		e.style.width = "45px";
	} else {
		sValues = [[60,0,30],[30,0,30],[0,0,30],[0,30,30],[0,60,30],
			[30,60,30],[60,60,30],[60,90,30],[60,120,30],[30,120,30],[0,120,30]];
		nValues = [[0,0,150],[30,30,60],[60,60,60],[90,0,150]];
		aValues = [[0,0,150],[30,0,30],[30,60,30],[60,0,150]];
		kValues = [[0,0,150],[30,60,30],[60,30,30],[90,0,30],[60,90,30],[90,120,30]];
		eValues = [[0,0,150],[30,0,30],[60,0,30],[30,60,30],[60,60,30],[30,120,30],[60,120,30]];
		s.style.width = "90px";
		a.style.width = "90px";
		e.style.width = "90px";
	}

	//Creates the nodes
	sValues.forEach(arr=>createPart(s,arr,"s")); counter = 0;
	nValues.forEach(arr=>createPart(n,arr,"n")); counter = 0;
	aValues.forEach(arr=>createPart(a,arr,"a")); counter = 0;
	kValues.forEach(arr=>createPart(k,arr,"k")); counter = 0;
	eValues.forEach(arr=>createPart(e,arr,"e"));
	function createPart(letter,arr,letstring) {
		counter++;
		const part = document.createElement("div");
		part.id = letstring+counter;
		part.classList.add("letter-part");
		part.style.left = arr[0]+"px";
		part.style.top = arr[1]+"px";
		part.style.height = arr[2]+"px";
		letter.appendChild(part);
	}
	const eye1 = document.createElement("div");
	const eye2 = document.createElement("div");
	eye1.classList.add("eye1","eye");
	eye2.classList.add("eye2","eye");
	s.children[0].appendChild(eye1);
	s.children[0].appendChild(eye2);
}

	//Animates the title (When you touch the play button)
function animateTitle() {
	this.removeEventListener("click",animateTitle);
	this.style.opacity = "0";
	credits.style.opacity = "0";

	//Reduce the size of the largest nodes
	const collectionIds = ["n1","n2","n3","n4","a1","a4","k1","e1"]; //Largest nodes
	collectionIds.forEach(id=>{
		const element = document.getElementById(id);
		element.style.height = "30px";
	});

	//Array and variables that determine the position of the fake "S" Snake
	let sX, movement, sPosQueue;
	if (mediaQuery.matches) {
		sX = 30;
		movement = 15;
		sPosQueue = [[30,0],[15,0],[0,0],[0,15],[0,30],[15,30],[30,30],[30,45],[30,60],[15,60],[0,60]];
	} else {
		sX = 60;
		movement = 30;
		sPosQueue = [[60,0],[30,0],[0,0],[0,30],[0,60],[30,60],[60,60],[60,90],[60,120],[30,120],[0,120]];
	}

	//Moves the fake "S" Snake
	setInterval(moveFakeSnake,200);
	function moveFakeSnake() {
		sX += movement;
		sPosQueue.unshift([sX,0]);
		if (sPosQueue.length > 11) sPosQueue.splice(11,1);
		for (let i in sPosQueue) {
			const part = document.getElementById("s"+(parseInt(i)+1));
			if (part) { part.style.left = sPosQueue[i][0]+"px"; part.style.top = sPosQueue[i][1]+"px"; }
		}
	}
	const appleSpecial = document.getElementById("k5");

	//Moves all nodes of the letters (Except the fake apple)
	setTimeout(()=>{
		for (let i in n.children) if (typeof n.children[i] == "object") { n.children[i].style.top = "120px"; n.children[i].style.opacity = "0"; }
		for (let i in a.children) if (typeof a.children[i] == "object") { a.children[i].style.top = "120px"; a.children[i].style.opacity = "0"; }
		for (let i in k.children) if (typeof k.children[i] == "object") { k.children[i].style.top = "120px"; k.children[i].style.opacity = "0"; }
		for (let i in e.children) if (typeof e.children[i] == "object") { e.children[i].style.top = "120px"; e.children[i].style.opacity = "0"; }
		appleSpecial.style.top = "0";
		appleSpecial.style.opacity = "1";
	},50);
	//Changes opacity of the fake Snake and the fake apple
	setTimeout(()=>{
		for (let i in s.children) if (typeof s.children[i] == "object") s.children[i].style.opacity = "0";
		appleSpecial.style.opacity = "0";
	},2500);
	//Makes the title disappear
	setTimeout(()=>titleScreen.style.opacity = "0",3000);
	//Removes the title node and starts the game
	setTimeout(()=>{ titleScreen.remove(); createInterval(); },3500);
}

createTitle();

// ---- Resize Actions ----

window.addEventListener("resize",()=>{
	mediaQuery = window.matchMedia("(max-width: 700px)");
	const s10 = document.getElementById("s10");
	const s11 = document.getElementById("s11");
	const letters = document.querySelectorAll(".letter");
	const title = document.getElementById("title-screen");
	if (mediaQuery.matches && gameWidth == 480) { //Desktop to Mobile
		gameWidth = 300;
		gameHorCells = 10;
		letters.forEach(l => {
			for (let child in l.children) {
				if (typeof l.children[0] == "object") l.children[0].remove();
			}
		});
		if (s10) s10.remove();
		if (s11) s11.remove();
		if (title) createTitle();
	}
	else if (!(mediaQuery.matches) && gameWidth == 300) { //Movile to desktop
		gameWidth = 480;
		gameHorCells = 16;
		letters.forEach(l => {
			for (let child in l.children) {
				if (typeof l.children[0] == "object") l.children[0].remove();
			}
		});
		if (s10) s10.remove();
		if (s11) s11.remove();
		if (title) createTitle();
	}
})