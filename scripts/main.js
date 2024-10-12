
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";
import Generator from "./generator.js";
import { params } from "./params.js";
import Coroutine from "./coroutine.js";

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

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	runtime.objects.Ball.setInstanceClass(Ball);
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
	
	// Get object references
	CreatePaddles(runtime)
	//paddle.object = runtime.objects.Paddle.getFirstInstance();
	progress = runtime.objects.ProgressFill.getFirstInstance();
	
	// Create the generator object
	generator = new Generator(runtime);
}

function CreatePaddles(runtime)
{
	let x = params.offset.x + paddle.x;
	const y = params.offset.y + params.paddle.top;
	paddle.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	
	x = params.offset.x + opponent.x;
	opponent.object = runtime.objects.Paddle.createInstance("Pong", x, y, true);
	opponent.object.angleDegrees = 180;
	opponent.y = y;
}

function Tick(runtime)
{
	// Code to run every tick
	MoveOpponent(runtime);
	MovePaddle(runtime);
	AdjustProgress(runtime);
	
	for (const ball of runtime.objects.Ball.instances()) {
		ball.Update();
	};
	
	Coroutine.Tick();
}

function MoveOpponent(runtime)
{
	let y = opponent.y + opponent.dir * runtime.dt * opponent.speed;
	const top = params.offset.y + params.paddle.top;
	const bottom = params.offset.y + params.paddle.bottom;
	
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
	const top = params.offset.y + params.paddle.top;
	const bottom = params.offset.y + params.paddle.bottom;
	
	y = y < top ? top : y;
	y = y > bottom ? bottom : y;
	
	paddle.y = y;
	paddle.object.y = y;
}

export function AdjustProgress(runtime)
{
	progress.height = params.offset.y + params.paddle.bottom - paddle.y;
}

export function Next(runtime)
{
	generator.Next();
}