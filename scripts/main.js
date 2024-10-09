
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
import Ball from "./ball.js";

const params = {
	offset: 
	{
		x: 160,
		y: 100,
	},
	paddle: 
	{
		x: 40,
		bottom: 180,
		top: 20,
	},
	ball:
	{
		left: 48,
		right: 320 - 48,
		top: 8,
		bottom: 200 - 8,
	},
};

const paddle = 
{
	x: 40,
	y: 0,
	object: null,
};

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
	
	paddle.object = runtime.objects.Paddle.getFirstInstance();
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
