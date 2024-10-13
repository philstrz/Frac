import {params} from "./params.js";
import Utilities from "./utilities.js";
import Coroutine from "./coroutine.js";

let fraction = null;
let numerator = null;
let denominator = null;
const fractionWidth = 60;

class Generator
{

	constructor(runtime) 
	{
		// Store runtime
		this.runtime = runtime;
		
		// Get launch position from BallLauncher object
		const launcher = runtime.objects.BallLauncher.getFirstInstance();
		this.x = launcher.x;
		this.y = launcher.y;
		
		fraction = runtime.objects.Fraction.getFirstInstance();
		fraction.width = 0;
		
		numerator = fraction.getChildAt(0);
		denominator = fraction.getChildAt(1);
	}
	
	Next()
	{
		const ball = this.runtime.objects.Ball.createInstance("Pong", this.x, this.y, true);
		ball.Set(0.5);
		
		numerator.text = "1";
		denominator.text = "2";
		
		new Coroutine(this.FadeIn(), "FadeIn");
	}
	
	* FadeIn()
	{
		let t = 0;
		while (t < 1)
		{
			t += this.runtime.dt * 2;
			fraction.width = Utilities.EaseInCubic(t) * fractionWidth;
			yield;
		}
		yield;
		return;
	}
}

export default Generator;