
function Shake(magnitude, time)
{
	this.magnitude = magnitude;
	this.time = time;
	this.slope = -magnitude / time;
}

function Boop(x, y, time)
{
	
	this.ax = -x / (time * time);
	this.ay = -y / (time * time);
	this.time = time;
	this.t = 0;
	
	this.x = function()
	{
		return this.ax * (this.t - this.time) * (this.t - this.time);
	}
	this.y = function()
	{
		return this.ay * (this.t - this.time) * (this.t - this.time);
	}
}

const max = 10;

export default class Camera extends globalThis.InstanceType.Camera
{
	shakes = [];
	boops = [];

	constructor()
	{
		super();
		this.anchor = {x: this.x, y: this.y};
	}
	
	shake(magnitude=1, time=1)
	{
		this.shakes.push(new Shake(magnitude, time))
	}
	
	boop(x=0, y=0, time=1)
	{
		this.boops.push(new Boop(x, y, time));
	}
	
	tick()
	{
		// Add shaking
		let magnitude = 0;
		for (let i = 0; i < this.shakes.length; i++)
		{
			magnitude += this.shakes[i].magnitude;
			
			this.shakes[i].magnitude += this.shakes[i].slope * this.runtime.dt;
			if (this.shakes[i].magnitude <= 0)
			{
				this.shakes.splice(i--, 1);
			}
		}
		
		// Add booping (sudden shift in one direction, gradual back)
		let boop = {x: 0, y: 0};
		for (let i = 0; i <  this.boops.length; i++)
		{
			boop.x += this.boops[i].x();
			boop.y += this.boops[i].y();
			
			this.boops[i].t += this.runtime.dt;
			if (this.boops[i].t >= this.boops[i].time)
			{
				this.boops.splice(i--, 1);
			}
		}
		
		magnitude = magnitude > max ? max : magnitude;
		this.x = this.anchor.x + Math.random() * magnitude + boop.x;
		this.y = this.anchor.y + Math.random() * magnitude + boop.y;
	}
}