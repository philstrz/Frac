import Globals from "./globals.js";
import Ease from "./utilities/ease.js";
import Coroutine from "./utilities/coroutine.js";

const x = 280 - 25;
const w = 50;
const timeScale = 2;

// TODO: Can this be redone without an existing object?
class Fingers extends globalThis.InstanceType.Fingers
{

	fingers = null;

	constructor()
	{
		super();
	}
	
	next(d)
	{
		new Coroutine(this.out(d), "out");
	}
	
	close()
	{
		new Coroutine(this.out(0), "close");
	}
	
	* out(d)
	{
		let t = 0;
		
		if (this.fingers)
		{
			while (t < 1)
		{
			for (const finger of this.fingers)
			{
				finger.width = Ease.OutCubic(1-t) * w;
			}
			t += this.runtime.dt * timeScale;
			yield;
		}
	
		for (const finger of this.fingers)
		{
			finger.destroy();
		}
		}
		
		if (d > 0) new Coroutine(this.in(d), "in");
		return;
	}
	
	* in(d)
	{
		let y = Globals.paddle.top + Globals.offset.y;
		const h = Globals.paddle.bottom - Globals.paddle.top;
		
		// Create the fingers
		this.fingers = [];
		d = d > 10 ? 1 : d;
		for (let i = 1; i < d; i++)
		{
			y += h / d;
			const finger = this.runtime.objects.Finger.createInstance("Fraction", x, y);
			finger.width = 0;
			this.fingers.push(finger);
		}
		
		let t = 0;
		while (t < 1)
		{
			for (const finger of this.fingers)
			{
				finger.width = Ease.InCubic(t) * w;
			}
			t += this.runtime.dt * timeScale;
			yield;
		}
		
		for (const finger of this.fingers)
		{
			finger.width = w;
		}
		return;
	}
	
}

export default Fingers;