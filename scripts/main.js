
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";
import Generator from "./generator.js";
import { params } from "./params.js";

export const paddle = 
{
	x: 40,
	y: 0,
	object: null,
};

let generator = null;

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
	paddle.object = runtime.objects.Paddle.getFirstInstance();
	
	// Create the generator object
	generator = new Generator(runtime);
}

function Tick(runtime)
{
	// Code to run every tick
	MovePaddle(runtime);
	
	for (const ball of runtime.objects.Ball.instances()) {
		ball.Update();
	};
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

export function Next(runtime)
{
	generator.Next();
}