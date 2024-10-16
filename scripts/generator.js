import Globals from "./globals.js";
import Ease from "./utilities/ease.js";
import Coroutine from "./utilities/coroutine.js"

let fraction = null;
let numerator = null;
let denominator = null;

const fractionWidth = 60;
const fractionHeight = 8;

// Largest possible denominator
const min = 2;
//let max = 2;
// Previous fraction
let v = 0;

// How fast to fade in/out
const timeScale = 2;

// Store runtime
let runtime = null;

class Generator
{

	constructor(rt) 
	{
		// Store runtime
		runtime = rt;
		
		// Get launch position from BallLauncher object
		const launcher = runtime.objects.BallLauncher.getFirstInstance();
		this.x = launcher.x;
		this.y = launcher.y;
		
		fraction = runtime.objects.Fraction.getFirstInstance();
		fraction.width = 0;
		fraction.height = 0;
		
		numerator = fraction.getChildAt(0);
		denominator = fraction.getChildAt(1);
	}
	
	Next()
	{		
		// Get a random denominator
		const u = Math.random();
		const d = Math.floor( min + Math.sqrt(u) * (Globals.level - min + 1) );
		
		// Increment denominator
		if (d == Globals.level) Globals.level++;
	
		const n = this.GetNumerator(d);
		
		new Coroutine(this.FadeOut(n, d), "FadeOut");
		
		return {
			n: n,
			d: d,
		}
	}
	
	Launch()
	{
		const ball = runtime.objects.Ball.createInstance("Pong", this.x, this.y, true);
		ball.Set(v);
	}
	
	GetNumerator(d)
	{
		const u = Math.random();
		
		let y = (d  - 2) * u + 0.5;
		v *= d;
		if ( y >= v - 0.5)
		{
			y = (d - 2) * u + 1.5;
		}
		
		let n = Math.round(y);
		n = n >= d ? d - 1 : n;
		
		v = n / d;
		return n;
	}
	
	* FadeOut(n, d)
	{
		let t = fraction.width / fractionWidth;
		while (t > 0)
		{
			fraction.width = Ease.InCubic(t) * fractionWidth;
			fraction.height = Ease.InCubic(t) * fractionHeight;
			t -= runtime.dt * timeScale;
			yield;
		}
		fraction.width = 0;
		fraction.height = 0;
		
		numerator.text = String(n);
		denominator.text = String(d);
		
		new Coroutine(this.FadeIn(), "FadeIn");
		return;
	}
	
	* FadeIn()
	{
		let t = 0;
		while (t < 1)
		{
			fraction.width = Ease.InCubic(t) * fractionWidth;
			fraction.height = Ease.InCubic(t) * fractionHeight;
			t += runtime.dt * timeScale;
			yield;
		}
		fraction.width = fractionWidth;
		fraction.height = fractionHeight;
		yield Coroutine.Wait(2);
		
		this.Launch();
		return;
	}
}

export default Generator;