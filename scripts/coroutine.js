/*
	Coroutines in Construct
*/

class Coroutine
{	
	static runtime = null;
	
	static SetRuntime(runtime)
	{
		Coroutine.runtime = runtime;
		if (!runtime.coroutines)
		{
			//runtime.coroutines = [];
			runtime.coroutines = {};
		}
	}
	
	constructor(func, id="empty")
	{
		this.func = func;
		
		const string = id;
		let i = 0;
		while (Coroutine.runtime.coroutines[id])
		{
			id = string + i++;
		}
		
		//Coroutine.runtime.coroutines.push(this);
		Coroutine.runtime.coroutines[id] = this;
		this.id = id;
		console.log(this.id);
	}
	
	tick()
	{
		// Iterate
		const next = this.func.next();
		
		// Remove when finished
		if (next.done)
		{
			delete Coroutine.runtime.coroutines[this.id];
		}
	}
}

export default Coroutine;