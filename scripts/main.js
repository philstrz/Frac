
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";
import Generator from "./generator.js";
import Globals from "./globals.js";
import Coroutine from "./utilities/coroutine.js";
import Fingers from "./fingers.js";
import Camera from "./camera.js";
import AudioManager from "./utilities/audioManager.js";
import AudioPlayer from "./utilities/audioPlayer.js";

export const paddle = 
{
	x: 40,
	y: 0,
	object: null,
};
export const opponent = 
{
	x: 280,
	y: 0,
	object: null,
	dir: 1,
	speed: 50,
	scale: 0,
}

let generator = null;
let progress = null;
let fingers = null;
let camera = null;

export const scores = 
{
	player: 0,
	opponent: 0,
}

let audioManager = null;

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	audioManager = new AudioManager(runtime);
	AudioPlayer.Init(audioManager);
	AudioPlayer.LoadSounds([
		"explode.webm",
		"opponent_boop.webm",
		"player_boop.webm",
		"wall_boop.webm",
	]);
	
	runtime.objects.Ball.setInstanceClass(Ball);
	runtime.objects.Fingers.setInstanceClass(Fingers);
	runtime.objects.Camera.setInstanceClass(Camera);
	
	//runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	for (const layout of runtime.getAllLayouts())
	{
		if (layout.name == "Layout") layout.addEventListener("beforelayoutstart", () => OnBeforeGameStart(runtime))
	}
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
}

async function OnBeforeGameStart(runtime)
{
	runtime.addEventListener("tick", () => Tick(runtime));
	
	Coroutine.Init(runtime);
	// Create the generator object
	generator = new Generator(runtime);
	
	CreatePaddles(runtime)
	progress = runtime.objects.ProgressFill.getFirstInstance();
	fingers = runtime.objects.Fingers.getFirstInstance();
	camera = runtime.objects.Camera.getFirstInstance();
	
	//runtime.addEventListener("pointerdown", e => pointerDown(e));
	window.addEventListener("focus", () => {pause(runtime, false)});
	window.addEventListener("blur", () => {pause(runtime, true)});
}

function CreatePaddles(runtime)
{
	let x = Globals.offset.x + paddle.x;
	let y = Globals.offset.y + (Globals.paddle.top + Globals.paddle.bottom) / 2;
	paddle.x = x;
	paddle.y = y;
	paddle.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	
	x = Globals.offset.x + opponent.x;
	y -= 200;
	opponent.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	opponent.object.angleDegrees = 180;
	opponent.y = y;
	opponent.x = x;
	opponent.object.setSize(0, 0);
}

// Keep track of time once level starts
const rate = 4;
let time = 3;

let paused = false;
export function pause(runtime, yes=!paused)
{
	paused = yes;
	runtime.timeScale = paused ? 0 : 1;
}


function Tick(runtime)
{
	

	// Code to run every tick
	
	
	if (paused) return;
	
	MovePaddle(runtime);
	MoveOpponent(runtime);
	AdjustProgress(runtime);
	
	for (const ball of runtime.objects.Ball.instances()) {
		ball.Update();
	};
	
	camera.tick();
	
	// Countdown to launch balls
	time += runtime.dt;
	if (time >= rate)
	{
		time = 0;
		next(runtime);
	}
}

let opponentActive = false;
function MoveOpponent(runtime)
{

	if (opponentActive)
	{
		if (opponent.scale <= 0)
		{
			opponent.scale = 1;
			opponent.object.behaviors.Tween.startTween("size", [8,40], 0.5, "out-cubic");
		}
		
		let y = opponent.y + opponent.dir * runtime.dt * opponent.speed;
		const top = Globals.offset.y + Globals.paddle.top;
		const bottom = Globals.offset.y + Globals.paddle.bottom;

		if (y < top)
		{
			const delta = top - y;
			y = top + delta;
			opponent.dir = 1;
		}
		if (y > bottom)
		{
			const delta = y - bottom;
			y = bottom - delta;
			opponent.dir = -1;
		}
		opponent.y = y;
		opponent.object.y = y;
	}
	else
	{
		if (Globals.level == Globals.tutorial)
		{
			const y = opponent.y + opponent.dir * runtime.dt * opponent.speed;
			const top = Globals.offset.y + Globals.paddle.top;

			opponent.y = y;
			opponent.object.y = y;

			if ( y > top)
			{
				opponentActive = true;
			}
		}
	}
}

const touchInput = 
{
	down: false,
	x: 0,
	y: 0,
}
export function touch(x, y)
{
	touchInput.down = true;
	touchInput.x = x;
	touchInput.y = y;
}

/*
function pointerDown(event)
{
	console.log(event);
	//console.log(event.clientX, event.clientY);
}
*/

function MovePaddle(runtime)
{
	//let y = runtime.mouse.getMouseY("Pong");
	let y = paddle.y;
	//let y = Math.random() * 400;
	
	let top = Globals.offset.y;
	let bottom = top + runtime.viewportHeight;
	const left = Globals.offset.x;
	const right = left + runtime.viewportWidth;
	
	const mouse = {};
	if (touchInput.down)
	{
		[mouse.x, mouse.y] = [touchInput.x, touchInput.y];
		touchInput.down = false;
	}
	else
	{
		[mouse.x, mouse.y] = runtime.mouse.getMousePosition("Pong");
	}
	
	//if (mouse.y > top & mouse.y < bottom & mouse.x > left & mouse.x < right)
	if (mouse.y > top & mouse.y < bottom)
	{
		y = mouse.y;
	}
	
	top = Globals.offset.y + Globals.paddle.top;
	bottom = Globals.offset.y + Globals.paddle.bottom;
	
	y = y < top ? top : y;
	y = y > bottom ? bottom : y;
	
	paddle.y = y;
	paddle.object.y = y;
}

function AdjustProgress(runtime)
{
	/*
	let y = paddle.y;
	let min = 0;
	for (const box of runtime.objects.BouncyBox.getAllInstances())
	{
		min = box.y > min ? box.y : min;
	}
	console.log(min, y);
	
	
	if ( y > min ) console.log(y, min);

	y = y > min ? min : y;
	progress.height = (Globals.offset.y + Globals.paddle.bottom - y) * progress.instVars.scale;
	*/
	progress.height = (Globals.offset.y + Globals.paddle.bottom - paddle.y) * progress.instVars.scale;
}

function next(runtime)
{
	const {n, d} = generator.next();
	//console.log(scores.player, scores.opponent);
	
	if (scores.player == Globals.fingersClose)
	{
		fingers.close();
		Globals.fingersClose = -10;
		
		scores.player = 0;
		scores.opponent = 0;
		
		const scoreKeepers = runtime.objects.Score.getAllInstances();
		scoreKeepers[0].text = "0";
		scoreKeepers[1].text = "0";
		
		for (const board of runtime.objects.ScoreBoard.getAllInstances())
		{
			board.behaviors.Tween.startTween("size", [16,16], 0.5, "out-cubic");
		}
	}
	else if (scores.player < Globals.fingersClose)
	{
		fingers.next(d);
	}
	
}