/*
	Coroutines in Construct
*/

class Coroutine
{	
	static List = {}
	
	constructor(func, id="empty")
	{
		this.func = func;
		
		const string = id;
		let i = 0;
		while (Coroutine.List[id])
		{
			id = string + i++;
		}
		
		//Coroutine.runtime.coroutines.push(this);
		Coroutine.List[id] = this;
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
			delete Coroutine.List[this.id];
		}
	}
}

export default Coroutine;