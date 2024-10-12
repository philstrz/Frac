import {params} from "./params.js";
import Utilities from "./utilities.js";
import Coroutine from "./coroutine.js";

class Generator
{

	fractionWidth = 60;

	constructor(runtime) 
	{
		// Store runtime
		this.runtime = runtime;
		
		// Get launch position from BallLauncher object
		const launcher = runtime.objects.BallLauncher.getFirstInstance();
		this.x = launcher.x;
		this.y = launcher.y;
		
		this.fraction = runtime.objects.Fraction.createInstance("Fraction", params.offset.x + 198, params.offset.y + 100, true);
		this.fraction.width = 0;
	}
	
	Next()
	{
		const ball = this.runtime.objects.Ball.createInstance("Pong", this.x, this.y, true);
		ball.Set(135);
		
		new Coroutine(this.FadeIn(), "FadeIn");
	}
	
	* FadeIn()
	{
		let t = 0;
		while (t < 1)
		{
			t += this.runtime.dt * 2;
			this.fraction.width = Utilities.EaseInCubic(t) * this.fractionWidth;
			yield;
		}
		yield;
		return;
	}
}

export default Generator;