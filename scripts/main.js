
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";
import Generator from "./generator.js";
import Globals from "./globals.js";
import Coroutine from "./utilities/coroutine.js";
import Fingers from "./fingers.js";

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
}

let generator = null;
let progress = null;
let fingers = null;

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	runtime.objects.Ball.setInstanceClass(Ball);
	runtime.objects.Fingers.setInstanceClass(Fingers);
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
	Coroutine.Init(runtime);
	
	// Get object references
	CreatePaddles(runtime)
	progress = runtime.objects.ProgressFill.getFirstInstance();
	fingers = runtime.objects.Fingers.getFirstInstance();
	
	// Create the generator object
	generator = new Generator(runtime);
}

function CreatePaddles(runtime)
{
	let x = Globals.offset.x + paddle.x;
	const y = Globals.offset.y + Globals.paddle.top;
	paddle.x = x;
	paddle.y = y;
	paddle.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	
	x = Globals.offset.x + opponent.x;
	opponent.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	opponent.object.angleDegrees = 180;
	opponent.y = y;
	opponent.x = x;
}

function Tick(runtime)
{
	// Code to run every tick
	MoveOpponent(runtime);
	MovePaddle(runtime);
	AdjustProgress();
	
	for (const ball of runtime.objects.Ball.instances()) {
		ball.Update();
	};
}

function MoveOpponent(runtime)
{
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

function MovePaddle(runtime)
{
	let y = runtime.mouse.getMouseY("Pong");
	const top = Globals.offset.y + Globals.paddle.top;
	const bottom = Globals.offset.y + Globals.paddle.bottom;
	
	y = y < top ? top : y;
	y = y > bottom ? bottom : y;
	
	paddle.y = y;
	paddle.object.y = y;
}

export function AdjustProgress()
{
	progress.height = Globals.offset.y + Globals.paddle.bottom - paddle.y;
}

export function Next(runtime)
{
	const {n, d} = generator.Next();
	
	if (Globals.level == Globals.fingersClose)
	{
		fingers.close();
	}
	else if (Globals.level < Globals.fingersClose)
	{
		fingers.next(d);
	}
	
}