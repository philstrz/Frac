/*
	Coroutines in Construct
*/

class Coroutine
{	
	static List = {}
	paused = false;
	
	constructor(func, id="empty")
	{
		this.func = func;
		this.main = func;
		
		const string = id;
		let i = 0;
		while (Coroutine.List[id])
		{
			id = string + i++;
		}
		
		//Coroutine.runtime.coroutines.push(this);
		Coroutine.List[id] = this;
		this.id = id;
	}
	
	static Tick()
	{
		for (const key in Coroutine.List)
		{
			Coroutine.List[key].tick();
		}
	}
	
	static Wait(runtime)
	{
		return function*(time) { 
			let t = 0;
			while ( t < time )
			{
				t += runtime.dt;
				yield;
			}
			return;
		};
	}
	
	tick()
	{
		// Iterate
		const next = this.func.next();
		//console.log(next);
		
		if (next.value)
		{
			this.func = next.value;
			this.paused = true;
		}
		
		// Remove when finished
		if (next.done)
		{
			if (this.paused)
			{
				this.func = this.main;
				this.paused = false;
			}
			else
			{
				delete Coroutine.List[this.id];
			}
		}
	}
}

export default Coroutine;