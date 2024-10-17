import Globals from "./globals.js";
import { paddle, opponent } from "./main.js";


//let theta = 0;
const initial = 500;
const final = 200;

class Ball extends globalThis.InstanceType.Ball
{
	speed = initial;
	theta = 0;

	constructor()
	{
		super();
	}
	
	Update()
	{
		const theta = this.theta * Math.PI / 180;
		this.x += Math.cos(theta) * this.runtime.dt * this.speed;
		this.y += Math.sin(theta) * this.runtime.dt * this.speed;
		
		this.CheckBounds();
		this.CheckLeft();
		this.CheckRight();
		
		if (this.speed == initial)
		{
			this.drawTrail();
		}
	}
	
	drawTrail()
	{
		this.runtime.objects.BallTrail.createInstance("Pong", this.x, this.y);
	}
	
	// Immediately after ball is created, set its initial direction
	Set(fraction)
	{	
		// ball position minus the point where it should hit the paddle
		const x = (Globals.ball.left + Globals.offset.x) - this.x;
		const y = (fraction * ( Globals.paddle.top -Globals.paddle.bottom ) + Globals.paddle.bottom + Globals.offset.y) - this.y;
		// convert to angle, in degrees
		this.theta = Math.atan2(y, x) * 180 / Math.PI;
	}
	
	// Check if the ball is at the top or bottom of the game
	CheckBounds()
	{
		const top = Globals.offset.y + Globals.ball.top;
		const bottom = Globals.offset.y + Globals.ball.bottom;
		
		if (this.y < top)
		{
			const delta = top - this.y;
			this.y = top + delta;
			
			this.theta = - this.theta
		}
		if (this.y > bottom)
		{
			const delta = this.y - bottom;
			this.y = bottom - delta;
			
			this.theta = - this.theta;
		}
	}
	
	// Check if the ball has reached the paddle and if the paddle is there
	CheckLeft()
	{
		const left = Globals.offset.x + Globals.ball.left;
		
		if (this.x < left)
		{
			if (this.y >= paddle.y - Globals.paddle.reach && this.y <= paddle.y + Globals.paddle.reach)
			{
				const delta = left - this.x;
				this.x = left + delta;
				
				//console.log(this.theta);
				//this.theta = 180 - this.theta;
				this.theta = 2 * ( this.y - paddle.y );
				
				// Reduce speed after first hit
				this.speed = final;
			}
			else
			{
				this.explode();
			}
		}
	}
	
	
	// Check the right side, if there's a paddle there
	CheckRight()
	{
		const right = Globals.offset.x + Globals.ball.right;
		
		if (this.x > right)
		{
			if (this.y >= opponent.y - Globals.paddle.reach && this.y <= opponent.y + Globals.paddle.reach)
			{
				const delta = this.x - right;
				this.x = right - delta;

				this.theta = 180 - this.theta;
			}
			else
			{
				this.explode();
			}
			
		}
	}
	
	// Leave an explosion particle effect and destroy the ball
	explode()
	{
		const explode = this.runtime.objects.Explode.createInstance("Pong", this.x, this.y, true);
		this.destroy()
	}
	
}

export default Ball;
