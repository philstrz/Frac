
class Ball extends globalThis.InstanceType.Ball
{
	constructor()
	{
		super();
	}
	
	Update()
	{
		
	}
	
	// Immediately after ball is created, set its initial direction
	Set(angle)
	{
		this.angle = angle;
	}
}

export default Ball;
