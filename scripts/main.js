
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";
import Generator from "./generator.js";
import Globals from "./globals.js";
import Coroutine from "./utilities/coroutine.js";
import Fingers from "./fingers.js";
import Camera from "./camera.js";

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

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
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

function Tick(runtime)
{
	// Code to run every tick
	MoveOpponent(runtime);
	MovePaddle(runtime);
	AdjustProgress();
	
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
const opponentLevel = 6;
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
		if (Globals.level == opponentLevel)
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

function MovePaddle(runtime)
{
	//let y = runtime.mouse.getMouseY("Pong");
	let y = paddle.y;
	
	let top = Globals.offset.y;
	let bottom = top + runtime.viewportHeight;
	const left = Globals.offset.x;
	const right = left + runtime.viewportWidth;
	
	const mouse = {};
	[mouse.x, mouse.y] = runtime.mouse.getMousePosition("Pong");
	if (mouse.y > top & mouse.y < bottom & mouse.x > left & mouse.x < right)
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

export function AdjustProgress()
{
	progress.height = (Globals.offset.y + Globals.paddle.bottom - paddle.y) * progress.instVars.scale;
}

function next(runtime)
{
	const {n, d} = generator.next();
	
	if (scores.player == Globals.fingersClose)
	{
		fingers.close();
		Globals.fingersClose = -10;
		
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