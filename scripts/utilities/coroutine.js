/*
	Coroutines
*/

// Coroutines need to be initialized with runtime
let runtime = null;
function SetRuntime(rt)
{
	runtime = rt;
}

export default class Coroutine
{
	// Static used for most Coroutine logic
	static List = {}
	
	// 
	static Init(runtime)
	{
		// 
		SetRuntime(runtime);
		//
		runtime.addEventListener("tick", () => Coroutine.Tick());
	}
	
	static Tick()
	{
		for (const key in Coroutine.List)
		{
			Coroutine.List[key].tick();
		}
	}
	
	// Coroutine.Wait returns a new iterator function that's run in place of the waiting coroutine via "yield Coroutine.Wait(timeInSeconds)"
	static Wait(time)
	{
		return function*() {
			let t = 0;
			while ( t < time )
			{
				t += runtime.dt;
				yield;
			}
			return;
		}
	}
	
	// Instance of Coroutine
	constructor(func, id="empty")
	{
		this.func = func;
		this.main = func;
		this.paused = false;
		
		// Give the coroutine a unique id
		const string = id;
		let i = 0;
		while (Coroutine.List[id])
		{
			id = string + i++;
		}
		
		// Add to coroutines list
		Coroutine.List[id] = this;
		this.id = id;
	}
	
	// Iterate the current coroutine
	tick()
	{
		// Step
		const next = this.func.next();
		
		// If next returned a Wait coroutine, sub that in
		if (next.value)
		{
			this.func = next.value();
			this.paused = true;
		}
		
		// Remove when finished or switch back to main
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