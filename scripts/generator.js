

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
	}
	
	Next()
	{
		const ball = this.runtime.objects.Ball.createInstance("Pong", this.x, this.y);
		ball.Set(135);
	}
}

export default Generator;